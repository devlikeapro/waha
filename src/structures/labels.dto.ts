import { ApiProperty } from '@nestjs/swagger';
import { ChatIdProperty } from '@waha/structures/properties.dto';

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
    description: 'Internal color number, not hex',
  })
  color: number;

  @ApiProperty({
    example: '#ff9485',
    description: 'Color in hex',
  })
  colorHex: string;

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
