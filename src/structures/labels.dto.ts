import { UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import { IsHexColor, IsNumber, IsOptional, IsString } from 'class-validator';

const Colors = [
  '#ff9485',
  '#64c4ff',
  '#ffd429',
  '#dfaef0',
  '#99b6c1',
  '#55ccb3',
  '#ff9dff',
  '#d3a91d',
  '#6d7cce',
  '#d7e752',
  '#00d0e2',
  '#ffc5c7',
  '#93ceac',
  '#f74848',
  '#00a0f2',
  '#83e422',
  '#ffaf04',
  '#b5ebff',
  '#9ba6ff',
  '#9368cf',
];

export class LabelBody {
  @ApiProperty({
    example: 'Lead',
    description: 'Label name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '#ff9485',
    description: 'Color in hex',
  })
  @IsHexColor()
  @IsOptional()
  colorHex?: string;

  @ApiProperty({
    example: null,
    description: 'Color number, not hex',
  })
  @IsNumber()
  @IsOptional()
  color?: number;

  toDTO(): LabelDTO {
    if (this.color != null && this.colorHex != null) {
      throw new UnprocessableEntityException(
        "Use either 'color' or 'colorHex'",
      );
    }

    if (this.color == null && this.colorHex == null) {
      throw new UnprocessableEntityException(
        "'color' or 'colorHex' is required",
      );
    }

    if (this.colorHex) {
      const color = Colors.indexOf(this.colorHex);
      if (color == -1) {
        throw new UnprocessableEntityException(
          "Invalid 'colorHex'. Possible values: " + Colors.join(', '),
        );
      }
      this.color = color;
    }

    return {
      name: this.name,
      color: this.color,
    };
  }
}

export class LabelDTO {
  name: string;
  color: number;
}

export class Label {
  @ApiProperty({
    example: '1',
    description: 'Label ID',
  })
  id: string;

  @ApiProperty({
    example: 'Lead',
    description: 'Label name',
  })
  name: string;

  @ApiProperty({
    example: 0,
    description: 'Color number, not hex',
  })
  color: number;

  @ApiProperty({
    example: '#ff9485',
    description: 'Color in hex',
  })
  colorHex: string;

  @ApiProperty({
    example: 5,
    required: false,
    description:
      'WhatsApp list type. User labels: 5 CUSTOM, 4 PREDEFINED, 16 LEAD. ' +
      'Built-in lists: 1 UNREAD, 2 GROUPS, 3 FAVORITES and others.',
  })
  type?: number;

  @ApiProperty({
    example: true,
    required: false,
    description: 'false for lists the user turned off',
  })
  isActive?: boolean;

  static toHex(color: number) {
    if (color >= Colors.length) {
      return '#000000';
    }
    return Colors[color];
  }
}

export class LabelID {
  @ApiProperty({
    example: '1',
    description: 'Label ID',
  })
  id: string;
}

export class SetLabelsRequest {
  labels: LabelID[];
}

export class LabelChatAssociation {
  @ApiProperty({
    example: '1',
    description: 'Label ID',
  })
  labelId: string;

  label: Label | null;

  @ChatIdProperty({
    description: 'Chat ID',
  })
  chatId: string;
}
