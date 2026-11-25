import { ApiProperty } from '@nestjs/swagger';
import { ChatRequest } from '@waha/structures/chatting.dto';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export enum PixKeyType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  EVP = 'EVP',
}

function toUpperCase({ value }) {
  if (typeof value !== 'string') {
    return value;
  }
  return value.trim().toUpperCase();
}

export class SendPixRequest extends ChatRequest {
  @ChatIdProperty()
  @IsString()
  chatId: string;

  @ApiProperty({
    description: 'Merchant (receiver) name shown on the PIX message',
    example: 'My Store',
  })
  @IsString()
  @IsNotEmpty()
  merchantName: string;

  @ApiProperty({
    description: 'Static PIX key the recipient can copy',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'PIX key type',
    enum: PixKeyType,
    example: PixKeyType.CPF,
  })
  @Transform(toUpperCase)
  @IsEnum(PixKeyType)
  keyType: PixKeyType;

  @ApiProperty({
    description: 'ISO 4217 currency code',
    example: 'BRL',
    default: 'BRL',
    required: false,
  })
  @Transform(toUpperCase)
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currency?: string;

  @ApiProperty({
    description:
      'Payment reference ID, generated (11 uppercase letters and digits) if not provided',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiProperty({
    description:
      'The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsString()
  reply_to?: string;
}
