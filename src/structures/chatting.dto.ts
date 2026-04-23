import {
  ApiExtraModels,
  ApiHideProperty,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { IsFileType } from '@waha/nestjs/validation/IsFileType';
import { GetChatMessagesQuery } from '@waha/structures/chats.dto';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import {
  SessionBaseRequest,
  SessionQuery,
  WHATSAPP_DEFAULT_SESSION_NAME,
} from './base.dto';
import {
  BinaryFile,
  FileContent,
  FileType,
  FileURL,
  RemoteFile,
  VideoBinaryFile,
  VideoRemoteFile,
  VoiceBinaryFile,
  VoiceRemoteFile,
} from './files.dto';
import {
  ChatIdProperty,
  ConvertApiProperty,
  ReplyToProperty,
} from './properties.dto';

/**
 * Queries
 */
export class CheckNumberStatusQuery extends SessionQuery {
  @ApiProperty({
    description: 'The phone number to check',
    example: '1213213213',
  })
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

export class GetMessageQuery extends GetChatMessagesQuery {
  @IsNotEmpty()
  @IsString()
  session: string = WHATSAPP_DEFAULT_SESSION_NAME;

  @ChatIdProperty()
  @IsString()
  chatId: string;
}

export class GetPresenceQuery extends ChatQuery {}

/**
 * Requests
 */
export class ChatRequest extends SessionBaseRequest {
  @ChatIdProperty()
  @IsString()
  chatId: string;
}

export class SendSeenRequest extends ChatRequest {
  @ApiProperty({
    example: null,
    deprecated: true,
    required: false,
  })
  messageId?: string;

  @ApiProperty({
    example: ['false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA'],
    required: false,
  })
  messageIds?: string[];

  @ApiProperty({
    example: '11111111111@c.us',
    required: false,
    default: null,
    description:
      'NOWEB engine only - the ID of the user that sent the message (undefined for individual chats)',
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

  @ReplyToProperty()
  reply_to?: string;
}

export class MessageTextRequest extends ChatRequest {
  text: string = 'Hi there!';

  @ApiHideProperty()
  mentions?: string[];

  @ReplyToProperty()
  reply_to?: string;

  linkPreview?: boolean = true;
  linkPreviewHighQuality?: boolean = false;
}

@ApiExtraModels(FileURL, FileContent)
export class LinkPreviewData {
  @IsNotEmpty()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_tld: false,
  })
  url: string = 'https://github.com/';

  @IsString()
  title: string = 'Your Title';

  @IsString()
  description: string = 'Check this out, amazing!';

  @IsOptional()
  @ValidateNested()
  @Transform(
    ({ value }) => {
      if (value?.url) {
        return plainToInstance(FileURL, value);
      }
      if (value?.data) {
        return plainToInstance(FileContent, value);
      }
      return value;
    },
    { toClassOnly: true },
  )
  @IsFileType({ message: 'Image must contain either "data" or "url".' })
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(FileURL) },
      { $ref: getSchemaPath(FileContent) },
    ],
    example: {
      url:
        process.env.WHATSAPP_SWAGGER_JPG_EXAMPLE_URL ||
        'https://picsum.photos/1024',
      // 'https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg',
    },
  })
  image?: FileType;
}

export class MessageLinkCustomPreviewRequest extends ChatRequest {
  @IsString()
  @ApiProperty({
    description:
      'The text to send. MUST include the URL provided in preview.url',
  })
  text: string = 'Check this out! https://github.com/';

  @IsBoolean()
  @IsOptional()
  linkPreviewHighQuality?: boolean = true;

  @ValidateNested()
  @Type(() => LinkPreviewData)
  preview: LinkPreviewData;

  @ReplyToProperty()
  @IsString()
  @IsOptional()
  reply_to?: string;
}

export class EditMessageRequest {
  text: string = 'Hello, world!';

  @ApiHideProperty()
  mentions?: string[];

  linkPreview?: boolean = true;
  linkPreviewHighQuality?: boolean = false;
}

export class MessageReplyRequest extends MessageTextRequest {
  text: string = 'Reply text';
}

export class MessageLocationRequest extends ChatRequest {
  @ApiProperty({
    example: 38.8937255,
  })
  latitude: number;

  @ApiProperty({
    example: -77.0969763,
  })
  longitude: number;

  @ApiProperty({
    example: 'Our office',
  })
  title: string;

  @ReplyToProperty()
  reply_to?: string;
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
  caption?: string;

  @ApiHideProperty()
  mentions?: string[];

  @ReplyToProperty()
  reply_to?: string;
}

export class MessageFileRequest extends FileRequest {
  caption?: string;

  @ApiHideProperty()
  mentions?: string[];

  @ReplyToProperty()
  reply_to?: string;
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

  @ReplyToProperty()
  reply_to?: string;

  @ConvertApiProperty()
  convert: boolean;
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

  caption?: string = 'Just watch at this!';

  @ApiHideProperty()
  mentions?: string[];

  @ApiProperty({
    description:
      'The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
    example: null,
  })
  reply_to?: string;

  @ApiProperty({
    description: 'Send as video note (aka instant or round video).',
    example: false,
  })
  asNote?: boolean;

  @ConvertApiProperty()
  convert: boolean;
}

export class MessageLinkPreviewRequest extends ChatRequest {
  url: string;
  title: string;
}

export class MessageForwardRequest extends ChatRequest {
  @ApiProperty({
    example: 'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
  })
  messageId: string;
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

  @ApiProperty({
    description:
      'The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
    example: null,
  })
  reply_to?: string;
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
  participant?: string;
}

export class MessageButtonReply extends ChatRequest {
  @ReplyToProperty()
  @IsString()
  @IsNotEmpty()
  replyTo?: string;

  @IsString()
  @IsNotEmpty()
  selectedDisplayText: string;

  @IsString()
  @IsNotEmpty()
  selectedButtonID: string;
}

export class NewMessageIDResponse {
  @ApiProperty({
    description: 'Pre-generated message id',
    example: 'BBBBBBBBBBBBBBBBB',
    required: true,
  })
  id: string;
}

export class MessagePollVoteRequest extends ChatRequest {
  @ApiProperty({
    description:
      'The ID of the poll message. Format: {fromMe}_{chatID}_{messageId}[_{participant}] or just ID for GOWS',
    example: 'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  pollMessageId: string;

  @ApiProperty({
    description:
      'Only for Channels - server message id (if known); if omitted, API may look it up in the storage',
    required: false,
    example: null,
  })
  @IsOptional()
  @IsNumber()
  pollServerId?: number;

  @ApiProperty({
    description: 'Poll options you are voting for',
    example: 'Awesome!',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  votes: string[];
}
