import type {
  AuthenticationCreds,
  AuthenticationState,
} from '@adiwajshing/baileys';
import { mkdir, readFile, stat, unlink } from 'fs/promises';
import { join } from 'path';
import esm from '@waha/vendor/esm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const writeFileAtomic = require('write-file-atomic');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncLock = require('async-lock');

// We need to lock files due to the fact that we are using async functions to read and write files
// https://github.com/WhiskeySockets/Baileys/issues/794
// https://github.com/nodejs/node/issues/26338
// Default pending is 1000, set it to infinity
// https://github.com/rogierschouten/async-lock/issues/63
const fileLock = new AsyncLock({
  timeout: 5_000,
  maxPending: Infinity,
  maxExecutionTime: 30_000,
});

/**
 * stores the full authentication state in a single folder.
 * Far more efficient than singlefileauthstate
 *
 * Again, I wouldn't endorse this for any production level use other than perhaps a bot.
 * Would recommend writing an auth state for use with a proper SQL or No-SQL DB
 * */
export const useMultiFileAuthState = async (
  folder: string,
): Promise<{
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
  close: () => Promise<void>;
}> => {
  const writeData = (data: any, file: string) => {
    const filePath = join(folder, fixFileName(file));
    return fileLock.acquire(filePath, () =>
      writeFileAtomic(
        join(filePath),
        JSON.stringify(data, esm.b.BufferJSON.replacer),
      ),
    );
  };

  const readData = async (file: string) => {
    try {
      const filePath = join(folder, fixFileName(file));
      const data = await fileLock.acquire(filePath, () =>
        readFile(filePath, { encoding: 'utf-8' }),
      );
      return JSON.parse(data, esm.b.BufferJSON.reviver);
    } catch (error) {
      return null;
    }
  };

  const removeData = async (file: string) => {
    try {
      const filePath = join(folder, fixFileName(file));
      await fileLock.acquire(filePath, () => unlink(filePath));
    } catch {}
  };

  const folderInfo = await stat(folder).catch(() => {
    return null;
  });
  if (folderInfo) {
    if (!folderInfo.isDirectory()) {
      throw new Error(
        `found something that is not a directory at ${folder}, either delete it or specify a different location`,
      );
    }
  } else {
    await mkdir(folder, { recursive: true });
  }

  const fixFileName = (file?: string) =>
    file?.replace(/\//g, '__')?.replace(/:/g, '-') || '';

  const creds: AuthenticationCreds =
    (await readData('creds.json')) || esm.b.initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}.json`);
              if (type === 'app-state-sync-key' && value) {
                value =
                  esm.b.proto.Message.AppStateSyncKeyData.fromObject(value);
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
              const file = `${category}-${id}.json`;
              tasks.push(value ? writeData(value, file) : removeData(file));
            }
          }

          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => {
      return writeData(creds, 'creds.json');
    },
    close: async () => {
      return;
    },
  };
};
