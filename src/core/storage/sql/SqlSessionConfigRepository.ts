import { SessionConfig } from '@waha/structures/sessions.dto';
import { ISessionConfigRepository } from '../ISessionConfigRepository';
import { SqlKVRepository } from './SqlKVRepository';
import { SQLSessionConfigSchema, SQLSessionConfigMigrations } from './schemas';

export class SqlSessionConfigRepository
    extends SqlKVRepository<{ id: string; data: SessionConfig }>
    implements ISessionConfigRepository {
    get schema() {
        return SQLSessionConfigSchema;
    }

    get migrations() {
        return SQLSessionConfigMigrations;
    }

    async saveConfig(sessionName: string, config: SessionConfig): Promise<void> {
        await this.upsertOne({ id: sessionName, data: config });
    }

    async getConfig(sessionName: string): Promise<SessionConfig | null> {
        const record = await this.getById(sessionName);
        return record?.data || null;
    }

    async getConfigBySessions(
        sessionNames: string[],
    ): Promise<Map<string, SessionConfig | null>> {
        const uniqueNames = Array.from(new Set(sessionNames));
        const result = new Map<string, SessionConfig | null>();
        if (uniqueNames.length === 0) {
            return result;
        }
        const entities = await this.getEntitiesByIds(uniqueNames);
        for (const [id, record] of entities.entries()) {
            result.set(id, record?.data || null);
        }
        return result;
    }

    async exists(sessionName: string): Promise<boolean> {
        const record = await this.getById(sessionName);
        return record !== null;
    }

    async deleteConfig(sessionName: string): Promise<void> {
        await this.deleteById(sessionName);
    }

    async getAllConfigs(): Promise<string[]> {
        const all = await this.getAll();
        return all.map((record) => record.id);
    }
}
