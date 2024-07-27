import { ApiProperty } from '@nestjs/swagger';

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
