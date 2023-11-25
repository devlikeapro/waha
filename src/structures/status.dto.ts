import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import {
  BinaryFile,
  RemoteFile,
  VoiceBinaryFile,
  VoiceRemoteFile,
} from './files.dto';

export const BROADCAST_ID = 'status@broadcast';

class StatusRequest {
  @ApiProperty({
    description:
      'it is always necessary to inform the list of contacts that will have access to the posted status',
    example: ['55xxxxxxxxxxx@c.us'],
  })
  contacts = ['55xxxxxxxxxxx@c.us'];
}

export class TextStatus extends StatusRequest {
  text = 'Have a look! https://waha.devlike.pro/';
  backgroundColor = '#38b42f';
  font = 1;
}

@ApiExtraModels(BinaryFile, RemoteFile)
export class ImageStatus extends StatusRequest {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BinaryFile) },
      { $ref: getSchemaPath(RemoteFile) },
    ],
  })
  file: BinaryFile | RemoteFile;

  caption: string;
}

@ApiExtraModels(VoiceBinaryFile, VoiceRemoteFile)
export class VoiceStatus extends StatusRequest {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(VoiceBinaryFile) },
      { $ref: getSchemaPath(VoiceRemoteFile) },
    ],
  })
  file: VoiceBinaryFile | VoiceRemoteFile;

  backgroundColor = '#38b42f';
}

@ApiExtraModels(BinaryFile, RemoteFile)
export class VideoStatus extends StatusRequest {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BinaryFile) },
      { $ref: getSchemaPath(RemoteFile) },
    ],
  })
  file: BinaryFile | RemoteFile;

  caption: string;
}
