import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import {
  ChatRequest,
  CheckNumberStatusQuery,
  GetMessageQuery,
  MessageContactVcardRequest,
  MessageFileRequest,
  MessageForwardRequest,
  MessageImageRequest,
  MessageLinkPreviewRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessageReactionRequest,
  MessageReplyRequest,
  MessageStarRequest,
  MessageTextQuery,
  MessageTextRequest,
  MessageVideoRequest,
  MessageVoiceRequest,
  SendSeenRequest,
  WANumberExistResult,
} from '../structures/chatting.dto';
import { WAMessage } from '../structures/responses.dto';

@ApiSecurity('api_key')
@Controller('api')
@ApiTags('📤 Chatting')
export class ChattingController {
  constructor(private manager: SessionManager) {}

  @Post('/sendText')
  @ApiOperation({ summary: 'Send a text message' })
  async sendText(@Body() request: MessageTextRequest): Promise<WAMessage> {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendText(request);
  }

  @Post('/sendImage')
  @ApiOperation({
    summary: 'Send an image',
    description:
      'Either from an URL or base64 data - look at the request schemas for details.',
  })
  async sendImage(@Body() request: MessageImageRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendImage(request);
  }

  @Post('/sendFile')
  @ApiOperation({
    summary: 'Send a file',
    description:
      'Either from an URL or base64 data - look at the request schemas for details.',
  })
  async sendFile(@Body() request: MessageFileRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendFile(request);
  }

  @Post('/sendVoice')
  @ApiOperation({
    summary: 'Send an voice message',
    description:
      'Either from an URL or base64 data - look at the request schemas for details.',
  })
  async sendVoice(@Body() request: MessageVoiceRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendVoice(request);
  }

  @Post('/sendVideo')
  @ApiOperation({
    summary: 'Send a video',
    description:
      'Either from an URL or base64 data - look at the request schemas for details.',
  })
  async sendVideo(@Body() request: MessageVideoRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendVideo(request);
  }

  @Post('/forwardMessage')
  async forwardMessage(
    @Body() request: MessageForwardRequest,
  ): Promise<WAMessage> {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return await whatsapp.forwardMessage(request);
  }

  @Post('/sendSeen')
  async sendSeen(@Body() chat: SendSeenRequest) {
    const whatsapp = await this.manager.getWorkingSession(chat.session);
    return whatsapp.sendSeen(chat);
  }

  @Post('/startTyping')
  async startTyping(@Body() chat: ChatRequest) {
    // It's infinitive action
    const whatsapp = await this.manager.getWorkingSession(chat.session);
    await whatsapp.startTyping(chat);
    return { result: true };
  }

  @Post('/stopTyping')
  async stopTyping(@Body() chat: ChatRequest) {
    const whatsapp = await this.manager.getWorkingSession(chat.session);
    await whatsapp.stopTyping(chat);
    return { result: true };
  }

  @Put('/reaction')
  @ApiOperation({ summary: 'React to a message with an emoji' })
  async setReaction(@Body() request: MessageReactionRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.setReaction(request);
  }

  @Put('/star')
  @ApiOperation({ summary: 'Star or unstar a message' })
  async setStar(@Body() request: MessageStarRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    await whatsapp.setStar(request);
    return;
  }

  @Post('/sendPoll')
  @ApiOperation({
    summary: 'Send a poll with options',
    description: 'You can use it as buttons or list replacement',
  })
  async sendPoll(@Body() request: MessagePollRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendPoll(request);
  }

  @Post('/sendLocation')
  async sendLocation(@Body() request: MessageLocationRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendLocation(request);
  }

  @Post('/sendLinkPreview')
  async sendLinkPreview(@Body() request: MessageLinkPreviewRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendLinkPreview(request);
  }

  @Get('/messages')
  @ApiOperation({ summary: 'Get messages in a chat' })
  async getMessages(@Query() query: GetMessageQuery) {
    const whatsapp = await this.manager.getWorkingSession(query.session);
    return whatsapp.getMessages(query);
  }

  @Get('/sendText')
  @ApiOperation({ summary: 'Send a text message', deprecated: true })
  async sendTextGet(@Query() query: MessageTextQuery) {
    const whatsapp = await this.manager.getWorkingSession(query.session);
    const msg = new MessageTextRequest();
    msg.chatId = query.phone;
    msg.text = query.text;
    return whatsapp.sendText(msg);
  }

  @Post('/sendContactVcard')
  async sendContactVcard(@Body() request: MessageContactVcardRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.sendContactVCard(request);
  }

  @Get('/checkNumberStatus')
  @ApiOperation({
    summary: 'Check number status',
    description: 'DEPRECATED. Use "POST /contacts/check-exists" instead',
    deprecated: true,
  })
  async DEPRECATED_checkNumberStatus(
    @Query() request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.checkNumberStatus(request);
  }

  @Post('/reply')
  @ApiOperation({
    summary:
      'DEPRECATED - you can set "reply_to" field when sending text, image, etc',
    deprecated: true,
  })
  async reply(@Body() request: MessageReplyRequest) {
    const whatsapp = await this.manager.getWorkingSession(request.session);
    return whatsapp.reply(request);
  }
}
