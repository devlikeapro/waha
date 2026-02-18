import { ISessionAuthRepository } from '@waha/core/storage/ISessionAuthRepository';
import { PostgresStore } from '@waha/core/storage/PostgresStore';

export class PostgresSessionAuthRepository extends ISessionAuthRepository {
    constructor(private store: PostgresStore) {
        super();
    }

    async init(sessionName?: string) {
        await this.store.init(sessionName);
    }

    async clean(sessionName: string) {
        const knex = this.store.getWAHADatabase();
        await knex('waha_auth').where('session_id', sessionName).del();
    }
}
