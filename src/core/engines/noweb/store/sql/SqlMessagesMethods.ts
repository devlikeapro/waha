import { ALL_JID } from '@waha/core/engines/noweb/session.noweb.core';
import { SqlKVRepository } from '@waha/core/storage/sql/SqlKVRepository';
import { AckToStatus } from '@waha/core/utils/acks';
import { isLidUser } from '@waha/core/utils/jids';
import { GetChatMessagesFilter } from '@waha/structures/chats.dto';
import { PaginationParams } from '@waha/structures/pagination.dto';
import { Knex } from 'knex';
import { INowebLidPNRepository } from '../INowebLidPNRepository';

export class SqlMessagesMethods {
  constructor(
    private repository: SqlKVRepository<any>,
    private lidRepository?: INowebLidPNRepository,
  ) {}

  upsert(messages: any[]): Promise<void> {
    return this.repository.upsertMany(messages);
  }

  async getAllByJid(
    jid: string,
    filter: GetChatMessagesFilter,
    pagination: PaginationParams,
    merge: boolean = true,
  ): Promise<any[]> {
    if (jid === ALL_JID) {
      const query = this.applyFilters(this.repository.select(), filter);
      return this.repository.all(this.repository.pagination(query, pagination));
    }
    let jids = [jid];
    if (merge) {
      jids = await this.resolveMergedJids(jid);
    }
    const query =
      jids.length === 1
        ? this.selectByJid(jids[0], filter)
        : this.selectByJids(jids, filter, pagination);
    return this.repository.all(this.repository.pagination(query, pagination));
  }

  /**
   * Messages of a single jid, so the (jid, messageTimestamp) index serves
   * both the filter and the ORDER BY ... LIMIT.
   */
  private selectByJid(
    jid: string,
    filter: GetChatMessagesFilter,
  ): Knex.QueryBuilder {
    const query = this.repository
      .select()
      .where(`${this.repository.table}.jid`, jid);
    return this.applyFilters(query, filter);
  }

  /**
   * Messages of several jids (PN and its LIDs) as UNION ALL of per-jid
   * queries. A single "jid = ? OR jid IN (...)" query can't use the
   * (jid, messageTimestamp) index for ordering, so Postgres walks the global
   * timestamp index and filters every row. Each branch here is an index range
   * read capped at offset + limit rows; the outer query (aliased back to the
   * table name) sorts and paginates.
   */
  private selectByJids(
    jids: string[],
    filter: GetChatMessagesFilter,
    pagination: PaginationParams,
  ): Knex.QueryBuilder {
    const knex = this.repository.getKnex();
    const tableName = this.repository.table;
    const branchPagination = this.branchPagination(pagination);
    // Wrapped in "select * from (...)" because sqlite3 rejects ORDER BY / LIMIT
    // directly inside UNION members.
    const branches = jids.map((jid, index) => {
      let branch = this.selectByJid(jid, filter);
      if (branchPagination) {
        branch = this.repository.pagination(branch, branchPagination);
      }
      return knex.select('*').from(branch.as(`branch_${index}`));
    });
    const union = branches[0].unionAll(branches.slice(1));
    return knex.select(`${tableName}.*`).from(union.as(tableName));
  }

  /**
   * Per-branch pagination: same sort, first (offset + limit) rows, no offset.
   * Returns null when branches can't be capped (no sort or no limit).
   */
  private branchPagination(
    pagination: PaginationParams,
  ): PaginationParams | null {
    if (!pagination?.sortBy || pagination.limit == null) {
      return null;
    }
    return {
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      limit: (pagination.offset || 0) + pagination.limit,
    };
  }

  private applyFilters(
    query: Knex.QueryBuilder,
    filter: GetChatMessagesFilter,
  ): Knex.QueryBuilder {
    if (filter['filter.timestamp.lte'] != null) {
      query = query.where(
        'messageTimestamp',
        '<=',
        filter['filter.timestamp.lte'],
      );
    }
    if (filter['filter.timestamp.gte'] != null) {
      query = query.where(
        'messageTimestamp',
        '>=',
        filter['filter.timestamp.gte'],
      );
    }
    const dataColumn = `${this.repository.table}.data`;
    if (filter['filter.fromMe'] != null) {
      // filter by data json inside
      const [sql, value] = this.repository.filterJson(
        dataColumn,
        'key.fromMe',
        filter['filter.fromMe'],
      );
      query = query.whereRaw(sql, [value]);
    }
    if (filter['filter.ack'] != null) {
      const status = AckToStatus(filter['filter.ack']);
      const [sql, value] = this.repository.filterJson(
        dataColumn,
        'status',
        status,
      );
      query = query.whereRaw(sql, [value]);
    }
    return query;
  }

  async getByJidById(
    jid: string,
    id: string,
    merge: boolean = true,
  ): Promise<any> {
    if (jid === ALL_JID) {
      return this.repository.getBy({ id: id });
    }
    const tableName = this.repository.table;
    const baseQuery = this.repository.select().where(`${tableName}.id`, id);
    let query;
    if (merge) {
      const jids = await this.resolveMergedJids(jid);
      query = baseQuery.whereIn(`${tableName}.jid`, jids);
    } else {
      query = baseQuery.andWhere(`${tableName}.jid`, jid);
    }
    const rows = await query.limit(1);
    if (!rows.length) {
      return null;
    }
    return this.repository.parse(rows[0]);
  }

  async updateByJidAndId(
    jid: string,
    id: string,
    update: any,
  ): Promise<boolean> {
    const entity = await this.getByJidById(jid, id);
    if (!entity) {
      return false;
    }
    Object.assign(entity, update);
    await this.repository.upsertOne(entity);
  }

  async deleteByJidByIds(jid: string, ids: string[]): Promise<void> {
    const query = `DELETE
                   FROM "${this.repository.table}"
                   WHERE jid = ?
                     AND id IN (${ids.map(() => '?').join(', ')})`;
    await this.repository.raw(query, [jid, ...ids]);
  }

  deleteAllByJid(jid: string): Promise<void> {
    return this.repository.deleteBy({ jid: jid });
  }

  /**
   * The chat's PN jid and every LID mapped to it, resolved up front
   * (lid_map_pn_index) so message queries can filter on plain jid values.
   */
  private async resolveMergedJids(jid: string): Promise<string[]> {
    const pnJid = await this.resolvePnJid(jid);
    const rows = await this.repository
      .getKnex()
      .select('id')
      .from('lid_map')
      .where('pn', pnJid);
    const lids = rows.map((row) => row.id).filter((lid) => lid !== pnJid);
    return [pnJid, ...lids];
  }

  private async resolvePnJid(jid: string): Promise<string> {
    if (!isLidUser(jid)) {
      return jid;
    }
    if (this.lidRepository) {
      const mapped = await this.lidRepository.findPNByLid(jid);
      if (mapped) {
        return mapped;
      }
    }
    const row = await this.repository
      .getKnex()
      .select('pn')
      .from('lid_map')
      .where('id', jid)
      .first();
    return row?.pn || jid;
  }
}
