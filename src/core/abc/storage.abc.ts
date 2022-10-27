export abstract class MediaStorage {
    abstract save(messageId: string, mimetype: string, buffer: Buffer): Promise<string>
}
