import * as grpc from '@grpc/grpc-js';
import { messages } from '@waha/core/engines/gows/grpc/gows';
import { EnginePayload } from '@waha/structures/webhooks.dto';
import { sleep } from '@waha/utils/promiseTimeout';
import { Logger } from 'pino';
import { Observable } from 'rxjs';
import { rand } from '@waha/core/auth/config';

/**
 * Observable that listens to a gRPC stream and emits EnginePayload objects.
 * Pass a factory function that returns a client and a stream.
 */
export class GowsEventStreamObservable extends Observable<EnginePayload> {
  _client: grpc.Client;
  CLIENT_CLOSE_TIMEOUT = 1_000;

  constructor(
    logger: Logger,
    factory: () => {
      client: grpc.Client;
      stream: grpc.ClientReadableStream<messages.EventJson>;
    },
  ) {
    super((subscriber) => {
      logger.debug('Creating grpc client and stream...');
      logger.setBindings({ id: rand() });
      const { client, stream } = factory();
      this._client = client;

      let closed = false;
      const cleanup = async (reason: string) => {
        if (closed) {
          return;
        }
        closed = true;

        logger.debug({ reason }, 'Cancelling gRPC stream...');
        try {
          stream.cancel();
        } catch (err) {
          logger.warn({ err }, 'Failed to cancel gRPC stream');
        }

        logger.debug({ reason }, 'Closing gRPC client...');
        try {
          client.close();
        } catch (err) {
          logger.warn({ err }, 'Failed to close gRPC client');
        }

        await sleep(this.CLIENT_CLOSE_TIMEOUT);
      };

      stream.on('data', (raw) => {
        const obj = raw.toObject();
        obj.data = JSON.parse(obj.data);
        subscriber?.next(obj);
      });

      stream.on('end', (...args) => {
        logger.debug('Stream ended', args);
        subscriber?.complete();
        subscriber = null;
        void cleanup('end');
      });

      stream.on('error', async (err: any) => {
        const CLIENT_CANCELLED_CODE = grpc.status.CANCELLED;
        if (err.code === CLIENT_CANCELLED_CODE) {
          logger.debug('Stream cancelled by client');
          await cleanup('cancelled');
          return;
        }
        logger.error(err, 'Stream error');
        await cleanup('error');
        // Give some time to node event loop to process the error
        await sleep(100);
        subscriber?.error(err);
        subscriber = null;
      });

      return async () => {
        await cleanup('teardown');
      };
    });
  }

  get client(): Omit<grpc.Client, 'close'> {
    return this._client;
  }
}
