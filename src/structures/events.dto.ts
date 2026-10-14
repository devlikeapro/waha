import { ApiProperty } from '@nestjs/swagger';
import { MessageDestination } from '@waha/structures/chatting.dto';
import { WAMessageBase } from '@waha/structures/responses.dto';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ChatIdProperty, ReplyToProperty } from './properties.dto';

export class EventLocation {
  @ApiProperty({
    description: 'Name of the location',
    example: 'Luxe Nail Studio 💅',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  //
  // Doesn't work right now
  //
  // @ApiProperty({
  //   description: 'Latitude of the location',
  //   example: 38.8937255,
  // })
  // @IsNumber()
  // @IsOptional()
  // degreesLatitude?: number;
  //
  // @ApiProperty({
  //   description: 'Longitude of the location',
  //   example: -77.0969763,
  // })
  // @IsNumber()
  // @IsOptional()
  // degreesLongitude?: number;
}

export class EventMessage {
  @ApiProperty({
    description: 'Name of the event',
    example: "John's Nail Appointment 💅",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the event',
    example:
      "It's time for your nail care session! 🌟\\n\\nYou'll be getting a *classic gel manicure* – clean, polished, and long-lasting. 💖\\n\\n📍 *Location:* Luxe Nail Studio\\nWe're on the *2nd floor of the Plaza Mall*, next to the flower shop. Look for the *pink neon sign*!\\n\\nFeel free to arrive *5–10 mins early* so we can get started on time 😊",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Start time of the event (Unix timestamp in seconds)',
    example: 2063137000,
  })
  @IsNumber()
  @IsNotEmpty()
  startTime: number;

  @ApiProperty({
    description: 'End time of the event (Unix timestamp in seconds)',
    example: null,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  endTime?: number;

  @ApiProperty({
    description: 'Location of the event',
    required: false,
    type: EventLocation,
  })
  @ValidateNested()
  @Type(() => EventLocation)
  @IsOptional()
  location?: EventLocation;

  @ApiProperty({
    description: 'Whether extra guests are allowed',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  extraGuestsAllowed?: boolean;
}

export class EventMessageRequest {
  @ChatIdProperty()
  chatId: string;

  @ValidateNested()
  @Type(() => EventMessage)
  @IsNotEmpty()
  event: EventMessage;

  @ReplyToProperty()
  reply_to?: string;
}

export class EventCancelRequest {
  @ApiProperty({
    description: 'ID of the event message to cancel',
    example: 'true_12345678901@c.us_ABCDEFGHIJKLMNOPQRST',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export enum EventResponseType {
  UNKNOWN = 'UNKNOWN',
  GOING = 'GOING',
  NOT_GOING = 'NOT_GOING',
  MAYBE = 'MAYBE',
}

export class EventResponse {
  response: EventResponseType;
  timestampMs: number;
  extraGuestCount: number;
}

export class EventResponsePayload extends WAMessageBase {
  eventCreationKey: MessageDestination;
  eventResponse?: EventResponse;

  /** Returns a message in a raw format */
  @ApiProperty({
    description:
      'Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend.',
  })
  _data?: any;
}
