import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { WHATSAPP_DEFAULT_SESSION_NAME } from '@waha/structures/base.dto';
import { ChatRequest } from '@waha/structures/chatting.dto';
import { BinaryFile, RemoteFile } from '@waha/structures/files.dto';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export enum ButtonType {
  REPLY = 'reply',
  URL = 'url',
  CALL = 'call',
  COPY = 'copy',
}

/**
 * buttons:
 *    - type: reply|url|call|copy
 *      text: Display Text
 *      url: only for url (required)
 *      phone_number: only for call (required)
 */
export class Button {
  @IsEnum(ButtonType)
  type: ButtonType = ButtonType.REPLY;

  @ApiProperty({
    example: 'Button Text',
  })
  @IsString()
  text: string;

  @ApiProperty({
    example: '321321',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: 'https://example.com',
  })
  @ValidateIf((o) => o.type === ButtonType.URL)
  @IsNotEmpty()
  url?: string;

  @ApiProperty({
    example: '+1234567890',
  })
  @ValidateIf((o) => o.type === ButtonType.CALL)
  @IsNotEmpty()
  phoneNumber?: string;

  @ApiProperty({
    example: '4321',
  })
  @ValidateIf((o) => o.type === ButtonType.COPY)
  @IsNotEmpty()
  copyCode?: string;
}

@ApiExtraModels(RemoteFile, BinaryFile)
export class SendButtonsRequest {
  @IsString()
  session: string = WHATSAPP_DEFAULT_SESSION_NAME;

  @ChatIdProperty()
  @IsString()
  chatId: string;

  @ApiProperty({
    example: 'How are you?',
  })
  @IsOptional()
  header: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(RemoteFile) },
      { $ref: getSchemaPath(BinaryFile) },
    ],
  })
  @IsOptional()
  headerImage?: RemoteFile | BinaryFile;

  @ApiProperty({
    example: 'Tell us how are you please 🙏',
  })
  @IsOptional()
  body: string;

  @ApiProperty({
    example: 'If you have any questions, please send it in the chat',
  })
  @IsOptional()
  footer: string;

  @ValidateNested({ each: true })
  @Type(() => Button)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ApiProperty({
    example: [
      {
        type: 'reply',
        text: 'I am good!',
      },
      {
        type: 'call',
        text: 'Call us',
        phoneNumber: '+1234567890',
      },
      {
        type: 'copy',
        text: 'Copy code',
        copyCode: '4321',
      },
      {
        type: 'url',
        text: 'How did you do that?',
        url: 'https://waha.devlike.pro',
      },
    ],
  })
  buttons: Button[];
}
