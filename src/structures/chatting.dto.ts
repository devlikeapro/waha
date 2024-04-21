import {
  ApiExtraModels,
  ApiHideProperty,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { SessionBaseRequest, SessionQuery } from './base.dto';
import {
  BinaryFile,
  RemoteFile,
  VideoBinaryFile,
  VideoRemoteFile,
  VoiceBinaryFile,
  VoiceRemoteFile,
} from './files.dto';
import { ChatIdProperty } from './properties.dto';

/**
 * Queries
 */
export class CheckNumberStatusQuery extends SessionQuery {
  @IsString()
  phone: string;
}

export class MessageTextQuery extends SessionQuery {
  @IsString()
  phone: string;

  @IsString()
  text: string;
}

export class ChatQuery extends SessionQuery {
  @ChatIdProperty()
  chatId: string;
}

export class GetMessageQuery extends ChatQuery {
  @IsNumber()
  limit: number;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Download media for messages',
  })
  downloadMedia: true;
}

export class GetPresenceQuery extends ChatQuery {}

/**
 * Requests
 */
export class ChatRequest extends SessionBaseRequest {
  @ChatIdProperty()
  chatId: string;
}

export class SendSeenRequest extends ChatRequest {
  @ApiProperty({
    example: 'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
    required: false,
    description:
      "NOWEB engine only - it's important to mark ALL messages as seen",
  })
  messageId?: string;

  @ApiProperty({
    example: '11111111111@c.us',
    required: false,
    description:
      'NOWEB engine only - the ID of the user that sent the  message (undefined for individual chats)',
  })
  participant?: string;
}

export class MessageRequest extends SessionBaseRequest {
  @ApiProperty({
    example: 'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
  })
  messageId: string;
}

export class VCardContact {
  @ApiProperty({
    example:
      'BEGIN:VCARD\nVERSION:3.0\nFN:Jane Doe\nORG:Company Name;\nTEL;type=CELL;type=VOICE;waid=911111111111:+91 11111 11111\nEND:VCARD',
    description: 'The vcard string',
  })
  vcard: string;
}

export class Contact {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the contact',
  })
  fullName: string;

  @ApiProperty({
    example: 'Company Name',
    description: 'The organization of the contact',
    required: false,
  })
  organization: string;

  @ApiProperty({
    example: '+91 11111 11111',
    description: 'The phone number of the contact',
  })
  phoneNumber: string;

  @ApiProperty({
    example: '911111111111',
    description: 'The whatsapp id of the contact. DO NOT add + or @c.us',
    required: false,
  })
  whatsappId: string;

  vcard: string = null;
}

@ApiExtraModels(Contact, VCardContact)
export class MessageContactVcardRequest extends ChatRequest {
  @ApiProperty({
    type: 'array',
    oneOf: [
      {
        $ref: getSchemaPath(VCardContact),
      },
      {
        $ref: getSchemaPath(Contact),
      },
    ],
  })
  contacts: (VCardContact | Contact)[];
}

export class MessageTextRequest extends ChatRequest {
  text = 'Hi there!';
  @ApiHideProperty()
  mentions?: string[];
}

export class EditMessageRequest {
  text = 'Hello, world!';

  @ApiHideProperty()
  mentions?: string[];
}

export class MessageReplyRequest extends MessageTextRequest {
  text = 'Reply text';
  @ApiProperty({
    example: 'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
  })
  reply_to: string;
}

export class MessageLocationRequest extends ChatRequest {
  latitude: number;
  longitude: number;
  title: string;
}

@ApiExtraModels(BinaryFile, RemoteFile)
class FileRequest extends ChatRequest {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(RemoteFile) },
      { $ref: getSchemaPath(BinaryFile) },
    ],
  })
  file: BinaryFile | RemoteFile;
}

export class MessageImageRequest extends FileRequest {
  caption: string;
}

export class MessageFileRequest extends FileRequest {
  caption: string;
}

@ApiExtraModels(VoiceBinaryFile, VoiceRemoteFile)
export class MessageVoiceRequest extends ChatRequest {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(VoiceRemoteFile) },
      { $ref: getSchemaPath(VoiceBinaryFile) },
    ],
  })
  file: VoiceBinaryFile | VoiceRemoteFile;
}

@ApiExtraModels(VideoRemoteFile, VideoBinaryFile)
export class MessageVideoRequest extends ChatRequest {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(VideoRemoteFile) },
      { $ref: getSchemaPath(VideoBinaryFile) },
    ],
  })
  file: VideoRemoteFile | VideoBinaryFile;

  caption: string = 'Just watch at this!';
}

export class MessageLinkPreviewRequest extends ChatRequest {
  url: string;
  title: string;
}

export class MessageReactionRequest extends MessageRequest {
  @ApiProperty({
    description:
      'Emoji to react with. Send an empty string to remove the reaction',
    example: '👍',
  })
  reaction: string;
}

export class MessageStarRequest extends MessageRequest {
  @ChatIdProperty()
  chatId: string;

  star: boolean;
}

export class WANumberExistResult {
  numberExists: boolean;
  @ApiProperty({
    example:
      'Chat id for the phone number. Undefined if the number does not exist',
  })
  chatId?: string;
}

export class MessagePoll {
  @ApiProperty({
    example: 'How are you?',
  })
  name: string;

  @ApiProperty({
    example: ['Awesome!', 'Good!', 'Not bad!'],
  })
  options: string[];

  multipleAnswers = false;
}

export class MessagePollRequest extends ChatRequest {
  poll: MessagePoll;
}

export class MessageDestination {
  @ApiProperty({
    description: 'Message ID',
    example: 'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
  })
  id: string;

  to: string;
  from: string;
  fromMe: boolean;
}
