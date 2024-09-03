import { ChatIdProperty } from '@waha/structures/properties.dto';
import { IsString } from 'class-validator';

import { SessionBaseRequest, SessionQuery } from './base.dto';

/**
 * Queries
 */

export class ContactQuery extends SessionQuery {
  @ChatIdProperty()
  @IsString()
  contactId: string;
}

/**
 * Requests
 */

export class ContactRequest extends SessionBaseRequest {
  @ChatIdProperty()
  @IsString()
  contactId: string;
}
