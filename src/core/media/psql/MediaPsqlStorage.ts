import {
  getMetadata,
  IMediaStorage,
  MediaData,
  MediaStorageData,
} from '@waha/core/media/IMediaStorage';
import { PsqlFileRepository } from '@waha/core/storage/psql/PsqlFileRepository';
import Knex from 'knex';
import { Logger } from 'pino';

class MediaFileRepository extends PsqlFileRepository {
  get tableName() {
    return 'media';
  }
}

export class MediaPsqlStorage implements IMediaStorage {
  repository: MediaFileRepository;

  constructor(
    private knex: Knex.Knex,
    private baseUrl: string,
    private logger: Logger,
  ) {
    this.repository = new MediaFileRepository(knex, logger);
  }

  async init(): Promise<void> {
    await this.repository.init();
  }

  private getFilepath(data: MediaData) {
    return `${data.message.id}.${data.file.extension}`;
  }

  async save(buffer: Buffer, data: MediaData): Promise<boolean> {
    const filepath = this.getFilepath(data);
    const metadata = getMetadata(data);
    await this.repository.save(filepath, buffer, metadata);
    return true;
  }

  async exists(data: MediaData): Promise<boolean> {
    const filepath = this.getFilepath(data);
    return await this.repository.exists(filepath);
  }

  async fetch(filepath: string) {
    return await this.repository.fetch(filepath);
  }

  async remove(filepath: string) {
    return await this.repository.delete(filepath);
  }

  async getStorageData(data: MediaData): Promise<MediaStorageData> {
    const filepath = this.getFilepath(data);
    const url = `${this.baseUrl}${data.session}/${filepath}`;
    return { url: url };
  }

  async removeMessagesMedia(
    session: string,
    messageIds: string[],
  ): Promise<number> {
    // The table belongs to the session, the files are "{messageId}.{extension}"
    const deleted = await this.repository.deleteByNames(messageIds);
    return deleted.length;
  }

  async purge(): Promise<void> {
    this.logger.debug('Purging S3 bucket is not supported');
  }

  async close() {
    await this.knex.destroy();
  }
}
