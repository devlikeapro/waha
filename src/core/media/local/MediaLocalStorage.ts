import { IMediaStorage, MediaData } from '@waha/core/media/IMediaStorage';
import { SECOND } from '@waha/structures/enums.dto';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { Logger } from 'pino';
import fs = require('fs');
import { fileExists } from '@waha/utils/files';
import { setLongTimeout } from '@waha/utils/promiseTimeout';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const writeFileAtomic = require('write-file-atomic');

/**
 * Save files locally using the filesystem
 */
export class MediaLocalStorage implements IMediaStorage {
  private readonly lifetimeMs: number;

  constructor(
    protected log: Logger,
    private filesFolder: string,
    private baseUrl: string,
    lifetimeSeconds: number,
  ) {
    this.lifetimeMs = lifetimeSeconds * SECOND;
    if (this.lifetimeMs === 0) {
      this.log.info('Files lifetime is 0, files will not be removed');
    }
  }

  async init() {
    return;
  }

  async exists(data: MediaData): Promise<boolean> {
    const filepath = this.getFullPath(data);
    return await fileExists(filepath);
  }

  public async save(buffer: Buffer, data: MediaData): Promise<boolean> {
    const filepath = this.getFullPath(data);
    const folder = path.dirname(filepath);
    await fsp.mkdir(folder, { recursive: true });
    await writeFileAtomic(filepath, buffer);
    this.postponeRemoval(filepath);
    return true;
  }

  public async getStorageData(data: MediaData) {
    const filename = this.getKey(data);
    const url = this.baseUrl + filename;
    return { url };
  }

  async purge() {
    if (this.lifetimeMs === 0) {
      this.log.info('No need to purge files with lifetime 0');
      return;
    }

    if (!fs.existsSync(this.filesFolder)) {
      fs.mkdirSync(this.filesFolder);
      this.log.info(`Directory '${this.filesFolder}' created from scratch`);
      return;
    }

    const now = Date.now();
    const entries = await fsp.readdir(this.filesFolder, { recursive: true });
    for (const entry of entries) {
      try {
        const filepath = path.join(this.filesFolder, entry as string);
        const stat = await fsp.stat(filepath);
        if (!stat.isFile()) {
          continue;
        }
        // Schedule removal:
        // - expired files get a random jitter to spread deletions out,
        // - non-expired files are scheduled for the time they have left.
        const age = now - stat.mtimeMs;
        const expired = age >= this.lifetimeMs;
        const left = this.lifetimeMs - age;
        const jitter = Math.random() * 10 * SECOND;
        const remaining = expired ? jitter : left;
        this.postponeRemoval(filepath, remaining);
      } catch (err) {
        this.log.warn(`Failed to schedule removal for file ${entry}`, err);
      }
    }
  }

  private getKey(data: MediaData) {
    return `${data.session}/${data.message.id}.${data.file.extension}`;
  }

  private getFullPath(data: MediaData) {
    const filepath = this.getKey(data);
    return path.resolve(`${this.filesFolder}/${filepath}`);
  }

  private postponeRemoval(filepath: string, delayMs: number | null = null) {
    if (this.lifetimeMs === 0) {
      return;
    }
    const delay = delayMs ?? this.lifetimeMs;
    setLongTimeout(
      () =>
        fs.unlink(filepath, () => {
          this.log.debug(`File ${filepath} was removed`);
        }),
      delay,
    );
  }

  async close() {
    return;
  }
}
