import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ChatRequest } from '@waha/structures/chatting.dto';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Row {
  @ApiProperty({ example: 'Option 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Description of option 1', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'option1' })
  @IsString()
  @IsNotEmpty()
  rowId: string;
}

class Section {
  @ApiProperty({ example: 'Menu' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested({ each: true })
  @Type(() => Row)
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    example: [
      { title: 'Option 1', rowId: 'option1', description: 'First option' },
      { title: 'Option 2', rowId: 'option2', description: 'Second option' },
    ],
  })
  rows: Row[];
}

export class SendListMessage {
  @ApiProperty({ example: 'Example List' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Choose one of the options', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Footer note', required: false })
  @IsOptional()
  @IsString()
  footer?: string;

  @ApiProperty({ example: 'Select' })
  @IsString()
  @IsNotEmpty()
  button: string;

  @ValidateNested({ each: true })
  @Type(() => Section)
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    example: [
      {
        title: 'Section 1',
        rows: [
          { title: 'Option 1', rowId: 'option1', description: 'Description 1' },
          { title: 'Option 2', rowId: 'option2', description: 'Description 2' },
        ],
      },
    ],
  })
  sections: Section[];
}

@ApiExtraModels(SendListMessage)
export class SendListRequest extends ChatRequest {
  @ChatIdProperty()
  @IsString()
  chatId: string;

  @ValidateNested()
  @Type(() => SendListMessage)
  @ApiProperty({
    type: SendListMessage,
    example: {
      title: 'Simple Menu',
      description: 'Please choose an option',
      footer: 'Thank you!',
      button: 'Choose',
      sections: [
        {
          title: 'Main',
          rows: [
            {
              title: 'Option 1',
              rowId: 'option1',
              description: null,
            },
            {
              title: 'Option 2',
              rowId: 'option2',
              description: null,
            },
            {
              title: 'Option 3',
              rowId: 'option3',
              description: null,
            },
          ],
        },
      ],
    },
  })
  message: SendListMessage;

  @ApiProperty({
    description:
      'The ID of the message to reply to - false_111111111111111@lid_AAAAAAAAAAAAAAAAAAAA',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsString()
  reply_to?: string;
}

export { Row, Section };
