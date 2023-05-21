export abstract class MediaStorage {
  abstract save(
    messageId: string,
    mimetype: string,
    buffer: Buffer,
  ): Promise<string>;
}

export abstract class LocalSessionStorage {
  public sessionsFolder: string;

  protected constructor(public engine: string) {
    this.engine = engine;
  }

  abstract init();

  abstract getFolderPath(sessionName: string): string;

  abstract clean(sessionName: string);

  abstract getAll(): string[];
}
