import type {
    AuthenticationCreds,
    AuthenticationState,
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

    const readData = async (key: string) => {
        try {
            const row = await knex(table)
                .select('value')
                .where({ session_id: sessionName, key })
                .first();
            if (row) {
                // Knex with pg driver auto-parses JSON/JSONB columns
                return row.value;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const writeData = async (data: any, key: string) => {
        // Upsert
        await knex(table)
            .insert({
                session_id: sessionName,
                key: key,
                value: data,
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
                    const data = {};
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
        saveCreds: () => {
            return writeData(creds, 'creds');
        },
        close: async () => {
            // Nothing to close here, connection is managed externally
        },
    };
};
