import { ApiParam } from '@nestjs/swagger';

export const ChatIdApiParam = ApiParam({
  name: 'chatId',
  required: true,
  type: 'string',
  description: 'Chat ID',
  example: '111111111111111@lid',
});

export const GroupIdApiParam = ApiParam({
  name: 'id',
  required: true,
  type: 'string',
  description: 'Group ID',
  example: '123123123@g.us',
});
