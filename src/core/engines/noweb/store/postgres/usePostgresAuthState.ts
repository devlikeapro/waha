import {
    AuthenticationCreds,
    AuthenticationState,
    BufferJSON,
} from '@adiwajshing/baileys';
import esm from '@waha/vendor/esm';
import { Knex } from 'knex';

export const usePostgresAuthState = async (
    knex: Knex,
    sessionName: string,
): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
    close: () => Promise<void>;
}> => {
    const table = 'waha_auth';

    /**
     * Custom JSON reviver that handles Buffers stored in two different formats:
     *  - New format (correct): { type: 'Buffer', data: '<base64 string>' }
     *  - Old/broken format:    { type: 'Buffer', data: [0, 1, 2, ...] }
     * The old format was produced before BufferJSON.replacer was used on write.
     */
    const bufferReviver = (_key: string, value: any) => {
        if (
            typeof value === 'object' &&
            value !== null &&
            value.type === 'Buffer' &&
            value.data != null
        ) {
            if (typeof value.data === 'string') {
                // New format: base64-encoded string
                return Buffer.from(value.data, 'base64');
            }
            if (Array.isArray(value.data)) {
                // Old (broken) format: raw byte array
                return Buffer.from(value.data);
            }
        }
        return value;
    };

    const readData = async (key: string) => {
        try {
            const row = await knex(table)
                .select('value')
                .where({ session_id: sessionName, key })
                .first();
            if (!row) return null;
            // row.value is auto-parsed by the pg driver from JSONB.
            // Re-stringify so we get a plain JSON string, then parse with our
            // custom reviver that handles both Buffer encoding formats.
            return JSON.parse(JSON.stringify(row.value), bufferReviver);
        } catch {
            return null;
        }
    };


    const writeData = async (data: any, key: string) => {
        // Serialize with BufferJSON.replacer so Buffers are encoded as
        // { type: 'Buffer', data: '<base64>' } strings rather than raw byte arrays.
        // Storing as a JSON string cast to ::jsonb keeps Postgres happy while
        // preserving the base64 encoding that BufferJSON.reviver expects.
        const json = JSON.stringify(data, BufferJSON.replacer);
        await knex(table)
            .insert({
                session_id: sessionName,
                key,
                value: knex.raw('?::jsonb', [json]),
            })
            .onConflict(['session_id', 'key'])
            .merge();
    };

    const removeData = async (key: string) => {
        await knex(table).where({ session_id: sessionName, key }).del();
    };

    // creds.json is stored with key 'creds'
    const creds: AuthenticationCreds =
        (await readData('creds')) || esm.b.initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data: Record<string, any> = {};
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`);
                            if (type === 'app-state-sync-key' && value) {
                                value = esm.b.proto.Message.AppStateSyncKeyData.fromObject(value);
                            }
                            data[id] = value;
                        }),
                    );
                    return data;
                },
                set: async (data) => {
                    const tasks: Promise<void>[] = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            tasks.push(value ? writeData(value, key) : removeData(key));
                        }
                    }
                    await Promise.all(tasks);
                },
            },
        },
        saveCreds: () => writeData(creds, 'creds'),
        close: async () => {
            // Connection is managed externally
        },
    };
};
