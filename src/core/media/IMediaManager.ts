import { IMediaEngineProcessor } from '@waha/core/media/IMediaEngineProcessor';

/**
 * General interface for MediaManager - one that handles the logic
 * and manipulates MediaStorage and MediaEngineProcessor
 */
interface IMediaManager {
  processMedia<Message>(
    processor: IMediaEngineProcessor<Message>,
    message: Message,
    session: string,
  ): Promise<Message>;
}

export { IMediaManager };
