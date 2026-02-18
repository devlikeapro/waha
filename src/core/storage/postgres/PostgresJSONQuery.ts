import { IJsonQuery } from '@waha/core/storage/sql/IJsonQuery';

export class PostgresJSONQuery implements IJsonQuery {
    filter(field: string, key: string, value: any): [string, string] {
        const parts = key.split('.');
        let query = field;
        for (let i = 0; i < parts.length - 1; i++) {
            query += `->'${parts[i]}'`;
        }
        const last = parts[parts.length - 1];
        query += `->>'${last}'`;
        return [`${query} = ?`, `${value}`];
    }

    sortBy(field: string, sortBy: string, direction: string): string {
        const parts = sortBy.split('.');
        let query = field;
        for (let i = 0; i < parts.length - 1; i++) {
            query += `->'${parts[i]}'`;
        }
        const last = parts[parts.length - 1];
        query += `->>'${last}'`;
        return `${query} ${direction}`;
    }
}
