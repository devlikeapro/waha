import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { ContactConversationService } from '@waha/apps/chatwoot/client/ContactConversationService';
import { AttachmentFromBuffer } from '@waha/apps/chatwoot/client/messages';
import { MessageType } from '@waha/apps/chatwoot/client/types';
import { ChatWootInboxMessageConsumer } from '@waha/apps/chatwoot/consumers/inbox/base';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { Locale, TKey } from '@waha/apps/chatwoot/locale';
import { WAHASelf } from '@waha/apps/chatwoot/session/WAHASelf';
import { SessionStatusEmoji } from '@waha/apps/chatwoot/SessionStatusEmoji';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

@Processor(QueueName.INBOX_COMMANDS, { concurrency: JOB_CONCURRENCY })
export class ChatWootInboxCommandsConsumer extends ChatWootInboxMessageConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'ChatWootInboxCommandsConsumer');
  }

  ErrorHeaderKey(): TKey | null {
    return null;
  }

  protected async Process(container: DIContainer, body, job: Job) {
    const handler = new SessionCommandHandler(
      container.Logger(),
      container.ContactConversationService(),
      job.data.session,
      container.Locale(),
      container.WAHASelf(),
    );
    return await handler.handle(body);
  }
}

enum Command {
  STATUS = 'status',
  RESTART = 'restart',
  START = 'start',
  STOP = 'stop',
  LOGOUT = 'logout',
  QR = 'qr',
  SCREENSHOT = 'screenshot',
  HELP = 'help',
  SERVER_STATUS = 'server status',
  SERVER_REBOOT = 'server reboot',
  SERVER_REBOOT_FORCE = 'server reboot force',
}

const CommandMap: Record<string, Command> = {
  // Status
  [Command.STATUS]: Command.STATUS,
  ['1']: Command.STATUS,
  // Restart
  [Command.RESTART]: Command.RESTART,
  ['2']: Command.RESTART,
  // Start
  [Command.START]: Command.START,
  ['3']: Command.START,
  // Stop
  [Command.STOP]: Command.STOP,
  ['4']: Command.STOP,
  // Logout
  [Command.LOGOUT]: Command.LOGOUT,
  ['5']: Command.LOGOUT,
  // QR
  [Command.QR]: Command.QR,
  ['6']: Command.QR,
  // Screenshot
  [Command.SCREENSHOT]: Command.SCREENSHOT,
  ['7']: Command.SCREENSHOT,
  // Help
  [Command.HELP]: Command.HELP,
  ['8']: Command.HELP,
  // Server commands
  [Command.SERVER_STATUS]: Command.SERVER_STATUS,
  [Command.SERVER_REBOOT]: Command.SERVER_REBOOT,
  [Command.SERVER_REBOOT_FORCE]: Command.SERVER_REBOOT_FORCE,
};

class CommandIsNotImplementedError extends Error {
  constructor(private command: string) {
    super(`Command is not implemented`);
  }
}

class SessionCommandHandler {
  constructor(
    private logger: ILogger,
    private repo: ContactConversationService,
    private session: string,
    private l: Locale,
    private waha: WAHASelf,
  ) {}

  async handle(message: any) {
    const cmd = message.content?.toLowerCase();
    const command = this.findCommand(cmd) || Command.HELP;
    this.logger.info(
      `Executing command ${command} for session ${this.session}`,
    );

    switch (command) {
      case Command.RESTART:
        await this.waha.restart(this.session);
        break;
      case Command.START:
        await this.waha.restart(this.session);
        break;
      case Command.LOGOUT:
        this.logger.info(`Logging out session ${this.session}`);
        await this.waha.logout(this.session);
        const conversation = await this.repo.InboxNotifications();
        const text = this.l.key(TKey.APP_LOGOUT_SUCCESS).render();
        await conversation.incoming(text);
        break;
      case Command.STOP:
        this.logger.info(`Stopping session ${this.session}`);
        await this.waha.stop(this.session);
        break;
      case Command.STATUS: {
        this.logger.info(`Getting status for session ${this.session}`);
        const session = await this.waha.get(this.session);
        const conversation = await this.repo.InboxNotifications();
        const emoji = SessionStatusEmoji(session.status);
        const text = this.l.key(TKey.APP_SESSION_CURRENT_STATUS).render({
          emoji: emoji,
          session: session.name,
          status: session.status,
          name: session.me?.pushName || 'Unknown',
          id: session.me?.id || 'No phone number',
        });
        await conversation.incoming(text);
        break;
      }
      case Command.SERVER_STATUS: {
        this.logger.info('Getting server version and status');
        const version = await this.waha.serverVersion();
        const status = await this.waha.serverStatus();
        const conversation = await this.repo.InboxNotifications();
        const text = this.l.key(TKey.APP_SERVER_VERSION_AND_STATUS).render({
          version: JSON.stringify(version, null, 2),
          status: JSON.stringify(status, null, 2),
        });
        await conversation.incoming(text);
        break;
      }
      case Command.SERVER_REBOOT: {
        this.logger.info('Rebooting server (graceful)');
        const conversation = await this.repo.InboxNotifications();
        const text = this.l.key(TKey.APP_SERVER_REBOOT).render();
        await conversation.incoming(text);
        await this.waha.serverReboot(false);
        break;
      }
      case Command.SERVER_REBOOT_FORCE: {
        this.logger.info('Rebooting server (force)');
        const conversation = await this.repo.InboxNotifications();
        const text = this.l.key(TKey.APP_SERVER_REBOOT_FORCE).render();
        await conversation.incoming(text);
        await this.waha.serverReboot(true);
        break;
      }
      case Command.QR: {
        const conversation = await this.repo.InboxNotifications();
        const content = await this.waha.qr(this.session);
        const message = AttachmentFromBuffer(content, 'qr.jpg');
        message.message_type = MessageType.INCOMING;
        await conversation.send(message);
        break;
      }
      case Command.SCREENSHOT: {
        this.logger.info(`Getting screenshot for session ${this.session}`);
        const conversation = await this.repo.InboxNotifications();
        const content = await this.waha.screenshot(this.session);
        const message = AttachmentFromBuffer(content, 'screenshot.jpg');
        message.message_type = MessageType.INCOMING;
        await conversation.send(message);
        break;
      }
      case Command.HELP: {
        const conversation = await this.repo.InboxNotifications();
        const text = this.l.key(TKey.APP_COMMANDS_LIST).render();
        await conversation.incoming(text);
        break;
      }
      default:
        throw new CommandIsNotImplementedError(cmd);
    }
  }

  findCommand(text: string): Command {
    // Remove empty from end
    text = text.trim();
    // Remove empty from start
    text = text.trimStart();
    // Remove empty from end
    text = text.trimEnd();
    return CommandMap[text] || null;
  }
}
