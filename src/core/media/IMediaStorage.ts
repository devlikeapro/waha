/**
 * Handles saving data to the physical storage
 */
abstract class IMediaStorage {
  abstract save(
    messageId: string,
    mimetype: string,
    buffer: Buffer,
  ): Promise<string>;
}

export { IMediaStorage };
