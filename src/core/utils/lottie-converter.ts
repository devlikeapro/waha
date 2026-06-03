import { createCanvas, Canvas } from '@napi-rs/canvas';
import { DotLottie } from '@lottiefiles/dotlottie-web';
// sharp, adm-zip and node-webpmux are CJS modules whose module.exports is the
// callable/constructor itself — static default imports resolve to undefined at
// runtime because there is no .default property. require() is the correct interop.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharp = require('sharp');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AdmZip = require('adm-zip');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Image: WebpImage } = require('node-webpmux');

// DotLottie._draw() guards canvas rendering behind:
//   canvas instanceof HTMLCanvasElement || canvas instanceof OffscreenCanvas
// Both are undefined in Node.js, so the guard fails and _draw() returns without
// calling putImageData – producing a fully black canvas. Registering the
// @napi-rs/canvas Canvas constructor as HTMLCanvasElement makes the instanceof
// check pass so DotLottie acquires the 2D context and paints frames normally.
//
// ImageData must NOT be registered globally. When it is, DotLottie uses:
//   new ImageData(Uint8ClampedArray_view_into_WASM_memory, w, h)
// @napi-rs/canvas copies the bytes once at construction and never re-reads the
// WASM buffer, so every frame produces the same cached pixels. Without a global
// ImageData, DotLottie falls back to:
//   ctx.createImageData(w, h) + imageData.data.set(currentPixelBuffer)
// which copies fresh pixel data from the WASM buffer on every frame.
const globalAny = global as Record<string, unknown>;
if (!globalAny['HTMLCanvasElement']) {
  globalAny['HTMLCanvasElement'] = Canvas;
}

export class LottieConvertError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'LottieConvertError';
    if (options?.cause !== undefined) {
      (this as any).cause = options.cause;
    }
  }
}

const STICKER_SIZE = 256;
const envDelayMs = parseInt(
  process.env['WAHA_LOTTIE_DEFAULT_DELAY_MS'] ?? '',
  10,
);
const DEFAULT_DELAY_MS = envDelayMs > 0 ? envDelayMs : 100;

function isZipBuffer(buffer: Buffer): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  );
}

function extractAnimationJson(zipBuffer: Buffer): string | null {
  const zip = new AdmZip(zipBuffer);
  const entry =
    zip.getEntry('animation/animation.json') ??
    zip.getEntries().find((e) => e.entryName.endsWith('.json'));
  if (!entry) {
    return null;
  }
  return zip.readAsText(entry);
}

export async function convertLottieZipToWebp(
  zipBuffer: Buffer,
): Promise<Buffer> {
  if (!isZipBuffer(zipBuffer)) {
    throw new LottieConvertError('Lottie buffer is not a valid ZIP');
  }

  let animationJson: string | null;
  try {
    animationJson = extractAnimationJson(zipBuffer);
  } catch (err) {
    throw new LottieConvertError(`Failed to unzip Lottie file: ${err}`, {
      cause: err,
    });
  }

  if (!animationJson) {
    throw new LottieConvertError('Lottie ZIP has no animation.json entry');
  }

  let animationData: Record<string, unknown>;
  try {
    animationData = JSON.parse(animationJson);
  } catch (err) {
    throw new LottieConvertError(
      `Lottie animation.json is not valid JSON: ${err}`,
      {
        cause: err,
      },
    );
  }

  return renderLottieToWebp(animationData);
}

function renderLottieToWebp(
  animationData: Record<string, unknown>,
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    let settled = false;

    function finish(result: Buffer) {
      if (settled) return;
      settled = true;
      resolve(result);
    }

    function fail(reason: unknown) {
      if (settled) return;
      settled = true;
      reject(
        reason instanceof LottieConvertError
          ? reason
          : new LottieConvertError(String(reason), { cause: reason }),
      );
    }

    let canvas: Canvas;
    let dotLottie: DotLottie;

    try {
      canvas = createCanvas(STICKER_SIZE, STICKER_SIZE);
    } catch (err) {
      return fail(err);
    }

    // DotLottie dispatches 'load' via setTimeout. Instead of relying on the
    // setImmediate-based animation loop (timing-dependent, unreliable for
    // frame capture), we drive frames manually with setFrame(i) after load.
    // setFrame() renders synchronously: set_frame → render → putImageData.
    try {
      dotLottie = new DotLottie({
        loop: false,
        useFrameInterpolation: false,
        autoplay: false,
        canvas: canvas as unknown as HTMLCanvasElement,
        data: animationData,
        renderConfig: {
          autoResize: false,
          devicePixelRatio: 1,
          freezeOnOffscreen: false,
        },
      });
    } catch (err) {
      return fail(err);
    }

    function onLoad() {
      if (settled) return;

      const totalFrames = dotLottie.totalFrames;
      const duration = dotLottie.duration;
      let delayMs: number;
      let framePixels: Buffer[];

      try {
        if (totalFrames <= 0) {
          throw new Error(
            `Animation has no frames (totalFrames=${totalFrames})`,
          );
        }

        let rawDelayMs = DEFAULT_DELAY_MS;
        if (duration > 0 && isFinite(duration)) {
          const fps = totalFrames / duration;
          const computed = Math.round(1000 / fps);
          if (computed > 0 && isFinite(computed)) {
            rawDelayMs = computed;
          }
        }
        // WebP delay is in milliseconds. Clamp to at least 30ms to stay above
        // the ~20ms threshold where some players impose their own minimum.
        // When clamping, subsample frames proportionally so total duration is
        // preserved — e.g. a 60fps animation must not play 1.8× too slowly
        // because all 180 frames are kept at 30ms each.
        delayMs = Math.max(30, rawDelayMs);
        const frameStep = delayMs / rawDelayMs;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('canvas.getContext("2d") returned null');
        }

        // Collect raw RGBA pixels. When frameStep > 1 we subsample frames to
        // keep playback speed correct despite the minimum-delay clamp.
        // Pass the float position to setFrame so the renderer interpolates
        // smoothly along the animation curve rather than snapping to the
        // nearest integer frame (which causes uneven motion).
        framePixels = [];
        for (let t = 0; t < totalFrames; t += frameStep) {
          // setFrame(0) is a no-op (already rendered after load), so skip it.
          if (t > 0) {
            dotLottie.setFrame(t);
          }
          framePixels.push(
            Buffer.from(
              ctx.getImageData(0, 0, STICKER_SIZE, STICKER_SIZE).data,
            ),
          );
        }
      } catch (err) {
        dotLottie.destroy();
        fail(err);
        return;
      }

      dotLottie.destroy();

      // Encode each RGBA frame as a single-frame WebP, then assemble into an
      // animated WebP via node-webpmux. This preserves full alpha transparency
      // and avoids GIF's 256-colour palette limitation.
      if (framePixels.length === 1) {
        sharp(framePixels[0], {
          raw: { width: STICKER_SIZE, height: STICKER_SIZE, channels: 4 },
        })
          .webp({ quality: 80, effort: 3 })
          .toBuffer()
          .then(finish)
          .catch(fail);
        return;
      }

      Promise.all(
        framePixels.map((px) =>
          sharp(px, {
            raw: { width: STICKER_SIZE, height: STICKER_SIZE, channels: 4 },
          })
            .webp({ quality: 80, effort: 3 })
            .toBuffer(),
        ),
      )
        .then((webpFrames) =>
          Promise.all(
            webpFrames.map((buf) =>
              WebpImage.generateFrame({
                buffer: buf,
                delay: delayMs,
                x: 0,
                y: 0,
                blend: false,
                dispose: true,
              }),
            ),
          ),
        )
        .then((frames) =>
          WebpImage.save(null, {
            width: STICKER_SIZE,
            height: STICKER_SIZE,
            bgColor: [0, 0, 0, 0],
            loops: 0,
            frames: frames,
          }),
        )
        .then(finish)
        .catch(fail);
    }

    function onLoadError(payload: any) {
      if (settled) return;
      dotLottie.destroy();
      fail(
        new LottieConvertError(
          `DotLottie failed to load animation: ${
            payload?.error ?? 'unknown error'
          }`,
          { cause: payload?.error },
        ),
      );
    }

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('loadError', onLoadError);
  });
}
