import { Injectable, PipeTransform } from '@nestjs/common';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { WAHASessionStatus } from '@waha/structures/enums.dto';

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

@Injectable()
class StatusSessionPipe implements PipeTransform<WhatsappSession> {
  STATUSES: WAHASessionStatus[];

  constructor(private manager: SessionManager) {}

  async transform(value: any) {
    return this.manager.waitUntilStatus(value, this.STATUSES);
  }
}

@Injectable()
export class WorkingSessionPipe extends StatusSessionPipe {
  STATUSES = [WAHASessionStatus.WORKING];
}

@Injectable()
export class QRCodeSessionPipe extends StatusSessionPipe {
  STATUSES = [WAHASessionStatus.SCAN_QR_CODE];
}
