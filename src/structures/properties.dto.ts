import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

function ChatIdProperty(options: ApiPropertyOptions | null = null) {
  options = options || {};
  if (!options.example) {
    options.example = '111111111111111@lid';
  }
  return ApiProperty(options);
}

function MessageIdProperty() {
  return ApiProperty({
    description: 'Message ID',
    example: 'false_111111111111111@lid_AAAAAAAAAAAAAAAAAAAA',
  });
}

function MessageIdOnlyProperty() {
  return ApiProperty({
    description: 'Message ID',
    example: 'AAAAAAAAAAAAAAAAAAAA',
  });
}

function ReplyToProperty() {
  return ApiProperty({
    description:
      'The ID of the message to reply to - false_111111111111111@lid_AAAAAAAAAAAAAAAAAAAA',
    example: null,
  });
}

function MentionsProperty() {
  return ApiProperty({
    description:
      'Chat IDs to mention in the message. Use ["all"] to mention all participants in a group.',
    example: null,
    required: false,
  });
}

function GeneratedMessageIdProperty() {
  return ApiProperty({
    description: 'Pre-generated message id',
    example: 'BBBBBBBBBBBBBBBBB',
    default: null,
    required: false,
  });
}

export function ConvertApiProperty() {
  return ApiProperty({
    description:
      'Convert the input file to the required format using ffmpeg before sending',
    example: true,
  });
}

export {
  ChatIdProperty,
  GeneratedMessageIdProperty,
  MentionsProperty,
  MessageIdOnlyProperty,
  MessageIdProperty,
  ReplyToProperty,
};
