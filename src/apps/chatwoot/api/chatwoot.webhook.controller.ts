import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IsCommandsChat } from '@waha/apps/chatwoot/client/ids';
import { EventName, MessageType } from '@waha/apps/chatwoot/client/types';
import { InboxData } from '@waha/apps/chatwoot/consumers/types';
import { ChatWootQueueService } from '@waha/apps/chatwoot/services/ChatWootQueueService';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { AppRepository } from '@waha/apps/app_sdk/storage/AppRepository';
import { CommandPrefix } from '@waha/apps/chatwoot/cli';

@Controller('webhooks/chatwoot/')
export class ChatwootWebhookController {
  constructor(
    private readonly chatWootQueueService: ChatWootQueueService,
    private readonly manager: SessionManager,
  ) {}

  @Post(':session/:id')
  @ApiOperation({
    summary: 'Chatwoot Webhook',
    description: 'Chatwoot Webhook',
  })
  async webhook(
    @Param('session') session: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    if (!body || !body?.event) {
      return { success: true };
    }

    // Ignore all incoming messages
    if (body.message_type == MessageType.INCOMING) {
      return { success: true };
    }

    const isCommandsChat = IsCommandsChat(body);
    // Ignore private notes (most of them)
    const deleted = body?.content_attributes?.deleted;
    if (body.private) {
      // Ignore any private note in commands chats
      if (isCommandsChat) {
        return { success: true };
      }
      // keep "deleted" notes
      // So Agent can delete "Sent From API/WhatsApp" messages in ChatWoot
      if (!deleted) {
        return { success: true };
      }
    }

    const data: InboxData = {
      session: session,
      app: id,
      body: body,
    };

    // Skip if app is disabled or does not exist
    const knex = this.manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const app = await repo.findEnabledAppById(id);
    if (!app || app.session !== session) {
      throw new NotFoundException(`App '${id}' not found`);
    }

    // Check if it's a command message (sent to the special inbox contact)
    // Check if it's a deleted message
    if (deleted && !isCommandsChat) {
      await this.chatWootQueueService.addMessageDeletedJob(data);
      return { success: true };
    }

    // Route to specific queues based on an event type
    switch (body.event) {
      case EventName.MESSAGE_CREATED:
        if (isCommandsChat || body.content?.startsWith(CommandPrefix)) {
          await this.chatWootQueueService.addCommandsJob(body.event, data);
        } else {
          await this.chatWootQueueService.addMessageCreatedJob(data);
        }
        return { success: true };
      case EventName.MESSAGE_UPDATED:
        // We handle only "retries" on message_update
        // This is the attribute ChatWoot send
        // There's NO other way to identify "status: read" updates right now
        // There's no "body.status" in message_updated webhook :(
        const isRetryNull = body.content_attributes?.external_error === null;
        const isRetrySomething = Boolean(
          body.content_attributes?.external_error,
        );
        const isRetry = isRetryNull || isRetrySomething;
        if (!isRetry) {
          return { success: true };
        }

        if (isCommandsChat || body.content?.startsWith(CommandPrefix)) {
          await this.chatWootQueueService.addCommandsJob(body.event, data);
        } else {
          await this.chatWootQueueService.addMessageUpdatedJob(data);
        }
        return { success: true };
      default:
        // Ignore other events
        await this.chatWootQueueService.addJobToQueue(body.event, data);
        return { success: true };
    }
  }
}
