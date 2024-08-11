import { Injectable, PipeTransform } from '@nestjs/common';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';

/**
 * Get session name and return Whatsapp session back (if exists)
 * use it as
 @Param('session', SessionPipe) session: WhatsappSession,
 */
@Injectable()
export class SessionPipe implements PipeTransform<WhatsappSession> {
  constructor(private manager: SessionManager) {}

  async transform(value: any) {
    return this.manager.getSession(value);
  }
}
