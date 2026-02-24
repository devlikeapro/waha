import { PostgresStore } from '../PostgresStore';
import { SqlSessionConfigRepository } from '../sql/SqlSessionConfigRepository';

export class PostgresSessionConfigRepository extends SqlSessionConfigRepository {
    constructor(private store: PostgresStore) {
        super(store.getWAHADatabase());
    }

    async init(): Promise<void> {
        await super.init();
    }
}
