import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

function ChatIdProperty(options: ApiPropertyOptions | null = null) {
  options = options || {};
  if (!options.example) {
    options.example = '11111111111@c.us';
  }
  return ApiProperty(options);
}

function MessageIdProperty() {
  return ApiProperty({
    description: 'Message ID',
    example: 'false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
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
      'The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA',
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

function BroadcastListParticipantsProperty() {
  return ApiProperty({
    description:
      'Recipients of a broadcast list (chatId like "<id>@broadcast", not "status@broadcast"), ' +
      'as phone numbers or LIDs. The list must have been created on the phone. ' +
      'WhatsApp does not let a linked device read who is on it, so the recipients have to be ' +
      'provided here - the message event of anything the phone sends to the list carries them ' +
      '(_data.Info.BroadcastRecipients). The message is sent once to the list and WhatsApp fans ' +
      'it out to each recipient, the same as sending from the phone - it is NOT sent as ' +
      'separate messages - and the phone records it in the list. Phone numbers are mapped to ' +
      'their LID and the account itself is left out. Only supported by the GOWS engine.',
    example: null,
    required: false,
  });
}

export {
  BroadcastListParticipantsProperty,
  ChatIdProperty,
  GeneratedMessageIdProperty,
  MentionsProperty,
  MessageIdOnlyProperty,
  MessageIdProperty,
  ReplyToProperty,
};
