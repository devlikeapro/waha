import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import {
  ChatRequest,
  CheckNumberStatusQuery,
  GetMessageQuery,
  MessageContactVcardRequest,
  MessageFileRequest,
  MessageImageRequest,
  MessageLinkPreviewRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessageReactionRequest,
  MessageReplyRequest,
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
@ApiTags('chatting')
export class ChattingController {
  constructor(private manager: SessionManager) {}

  @Get('/checkNumberStatus')
  @ApiOperation({ summary: 'Check number status' })
  async checkNumberStatus(
    @Query() request: CheckNumberStatusQuery,
  ): Promise<WANumberExistResult> {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.checkNumberStatus(request);
  }

  @Post('/sendContactVcard')
  sendContactVcard(@Body() request: MessageContactVcardRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendContactVCard(request);
  }

  @Get('/sendText')
  @ApiOperation({ summary: 'Send a text message' })
  sendTextGet(@Query() query: MessageTextQuery) {
    const whatsapp = this.manager.getSession(query.session);
    const msg = new MessageTextRequest();
    msg.chatId = query.phone;
    msg.text = query.text;
    return whatsapp.sendText(msg);
  }

  @Post('/sendText')
  @ApiOperation({ summary: 'Send a text message' })
  sendText(@Body() request: MessageTextRequest): Promise<WAMessage> {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendText(request);
  }

  @Post('/sendPoll')
  @ApiOperation({
    summary: 'Send a poll with options. You can use it as buttons replace',
  })
  sendPoll(@Body() request: MessagePollRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendPoll(request);
  }

  @Post('/sendLocation')
  sendLocation(@Body() request: MessageLocationRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendLocation(request);
  }

  @Post('/sendLinkPreview')
  sendLinkPreview(@Body() request: MessageLinkPreviewRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendLinkPreview(request);
  }

  @Post('/sendImage')
  @ApiOperation({
    summary:
      'Send an image. Either from an URL or base64 data - look at the request schemas for details.',
  })
  sendImage(@Body() request: MessageImageRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendImage(request);
  }

  @Post('/sendFile')
  @ApiOperation({
    summary:
      'Send a file. Either from an URL or base64 data - look at the request schemas for details.',
  })
  sendFile(@Body() request: MessageFileRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendFile(request);
  }

  @Post('/sendVoice')
  @ApiOperation({
    summary:
      'Send an voice message. Either from an URL or base64 data - look at the request schemas for details.',
  })
  sendVoice(@Body() request: MessageVoiceRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendVoice(request);
  }

  @Post('/sendVideo')
  @ApiOperation({
    summary:
      'Send a video. Either from an URL or base64 data - look at the request schemas for details.',
  })
  sendVideo(@Body() request: MessageVideoRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.sendVideo(request);
  }

  @Post('/reply')
  @ApiOperation({ summary: 'Reply to a text message' })
  reply(@Body() request: MessageReplyRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.reply(request);
  }

  @Post('/sendSeen')
  sendSeen(@Body() chat: SendSeenRequest) {
    const whatsapp = this.manager.getSession(chat.session);
    return whatsapp.sendSeen(chat);
  }

  @Post('/startTyping')
  async startTyping(@Body() chat: ChatRequest) {
    // It's infinitive action
    const whatsapp = this.manager.getSession(chat.session);
    await whatsapp.startTyping(chat);
    return { result: true };
  }

  @Post('/stopTyping')
  async stopTyping(@Body() chat: ChatRequest) {
    const whatsapp = this.manager.getSession(chat.session);
    await whatsapp.stopTyping(chat);
    return { result: true };
  }

  @Put('/reaction')
  @ApiOperation({ summary: 'React to a message with an emoji' })
  setReaction(@Body() request: MessageReactionRequest) {
    const whatsapp = this.manager.getSession(request.session);
    return whatsapp.setReaction(request);
  }

  @Get('/messages')
  @ApiOperation({ summary: 'Get messages in a chat' })
  getMessages(@Query() query: GetMessageQuery) {
    const whatsapp = this.manager.getSession(query.session);
    return whatsapp.getMessages(query);
  }
}
