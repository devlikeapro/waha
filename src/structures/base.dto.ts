import { IsNotEmpty } from 'class-validator';

export const WHATSAPP_DEFAULT_SESSION_NAME = 'default';

/**
 * Queries
 */
export class SessionQuery {
  @IsNotEmpty()
  session: string = WHATSAPP_DEFAULT_SESSION_NAME;
}

/**
 * Requests
 */

export class SessionBaseRequest {
  session: string = WHATSAPP_DEFAULT_SESSION_NAME;
}
