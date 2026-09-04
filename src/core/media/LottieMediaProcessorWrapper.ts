import {
  IMediaEngineProcessor,
  MediaContent,
} from '@waha/core/media/IMediaEngineProcessor';
import { convertLottieZipToWebp } from '@waha/core/utils/lottie-converter';

const LOTTIE_MIMETYPE = 'application/was';

/**
 * Wraps any engine media processor to transparently convert Lottie stickers
 * (mimetype `application/was`, delivered as a ZIP archive) into animated WebP.
 * The inner processor downloads the raw ZIP; this wrapper converts it before
 * the result reaches the media storage layer, so callers see `image/webp`.
 * If the conversion fails, the original ZIP is kept as `application/was`.
 */
export class LottieMediaProcessorWrapper implements IMediaEngineProcessor<any> {
  constructor(
    private inner: IMediaEngineProcessor<any>,
    private logger: any,
  ) {}

  hasMedia(msg: any): boolean {
    return this.inner.hasMedia(msg);
  }

  getChatId(msg: any): string {
    return this.inner.getChatId(msg);
  }

  getMessageId(msg: any): string {
    return this.inner.getMessageId(msg);
  }

  getMimetype(msg: any): string {
    const mime = this.inner.getMimetype(msg);
    return mime === LOTTIE_MIMETYPE ? 'image/webp' : mime;
  }

  getFilename(msg: any): string | null {
    if (this.inner.getMimetype(msg) !== LOTTIE_MIMETYPE) {
      return this.inner.getFilename(msg);
    }
    return `${this.inner.getMessageId(msg)}.webp`;
  }

  async getMediaContent(msg: any): Promise<MediaContent | null> {
    const content = await this.inner.getMediaContent(msg);
    if (!content?.buffer?.length) {
      return null;
    }
    if (this.inner.getMimetype(msg) !== LOTTIE_MIMETYPE) {
      return content;
    }

    const buffer = content.buffer;
    const id = this.inner.getMessageId(msg);
    this.logger.info(
      `Converting Lottie sticker '${id}' to WebP (input ${buffer.length} bytes)...`,
    );
    try {
      const webp = await convertLottieZipToWebp(buffer);
      this.logger.info(
        `Lottie sticker '${id}' converted to WebP (${webp.byteLength} bytes)`,
      );
      return { buffer: webp };
    } catch (err) {
      this.logger.error(
        { err: err },
        `Lottie conversion failed for '${id}', saving the original archive instead`,
      );
      return {
        buffer: buffer,
        mimetype: LOTTIE_MIMETYPE,
        filename: `${id}.zip`,
      };
    }
  }
}
