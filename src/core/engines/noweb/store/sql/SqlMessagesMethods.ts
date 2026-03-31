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
    let query = this.repository.select();
    const tableName = this.repository.table;
    if (jid !== ALL_JID) {
      if (merge) {
        const pnJid = await this.resolvePnJid(jid);
        query = this.applyPnJidFilter(query, pnJid);
      } else {
        query = query.where(`${tableName}.jid`, jid);
      }
    }
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
    query = this.repository.pagination(query, pagination);
    return this.repository.all(query);
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
      const pnJid = await this.resolvePnJid(jid);
      query = this.applyPnJidFilter(baseQuery, pnJid);
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

  private applyPnJidFilter(
    query: Knex.QueryBuilder,
    pnJid: string,
  ): Knex.QueryBuilder {
    const tableName = this.repository.table;
    const knex = this.repository.getKnex();
    // Use OR conditions on the raw jid column so the (jid, messageTimestamp) index
    // can be used for both branches instead of a per-row CASE expression.
    return query.where((builder) => {
      builder
        .where(`${tableName}.jid`, pnJid)
        .orWhereIn(
          `${tableName}.jid`,
          knex.select('id').from('lid_map').where('pn', pnJid),
        );
    });
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
