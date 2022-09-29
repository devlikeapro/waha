import {Body, Controller, Get, NotImplementedException, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {
    ChatRequest,
    CheckNumberStatusQuery,
    MessageContactVcard,
    MessageFile,
    MessageImage,
    MessageLinkPreview,
    MessageLocation,
    MessageReply,
    MessageText,
    MessageTextQuery,
    MessageTextButtons
} from "./all.dto";
import {ensureSuffix, WhatsappSessionManager} from "../whatsapp.service";

@Controller('api')
@ApiTags('chatting')
export class ChattingController {
    constructor(private whatsappSessionManager: WhatsappSessionManager) {
    }

    @Get('/checkNumberStatus')
    @ApiOperation({summary: 'Check number status'})
    async checkNumberStatus(
        @Query() request: CheckNumberStatusQuery,
    ) {
        const whatsapp = this.whatsappSessionManager.getSession(request.sessionName)
        try {
            const result = await whatsapp.checkNumberStatus(ensureSuffix(request.phone))
            return {numberExists: result['numberExists']}
        } catch (e) {
            return {numberExists: false}
        }
    }

    @Post('/sendContactVcard')
    sendContactVcard(@Body() message: MessageContactVcard) {
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        return whatsapp.sendContactVcard(message.chatId, message.contactsId, message.name)
    }

    @Get('/sendText')
    @ApiOperation({summary: 'Send a text message'})
    sendTextGet(
        @Query() message: MessageTextQuery,
    ) {
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        return whatsapp.sendText(ensureSuffix(message.phone), message.text)
    }

    @Post('/sendText')
    @ApiOperation({summary: 'Send a text message'})
    sendText(@Body() message: MessageText) {
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        return whatsapp.sendText(ensureSuffix(message.chatId), message.text)
    }

    @Post('/sendTextButtons')
    @ApiOperation({summary: 'Send a text message with buttons'})
    sendTextButtons(@Body() message: MessageTextButtons) {
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        /* const buttons = [
            {
              "buttonText": {
                "displayText": "Text of Button 1"
                }
              },
            {
              "buttonText": {
                "displayText": "Text of Button 2"
                }
              }
            ] */
        return whatsapp.sendButtons(ensureSuffix(message.chatId), message.title, message.buttons, message.text)
    }

    @Post('/sendLocation')
    sendLocation(@Body() message: MessageLocation) {
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        return whatsapp.sendLocation(message.chatId, message.latitude, message.longitude, message.title)
    }

    @Post('/sendLinkPreview')
    sendLinkPreview(@Body() message: MessageLinkPreview) {
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        return whatsapp.sendLinkPreview(message.chatId, message.url, message.title)
    }

    @Post('/sendImage')
    @ApiOperation({summary: 'NOT IMPLEMENTED YET'})
    sendImage(@Body() message: MessageImage) {
        throw new NotImplementedException();
        // TODO: Accept image URL, download it and then send with path
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        return whatsapp.sendImage(message.chatId, message.path, message.filename, message.caption)
    }

    @Post('/sendFile')
    @ApiOperation({summary: 'NOT IMPLEMENTED YET'})
    sendFile(@Body() message: MessageFile) {
        throw new NotImplementedException();
        // TODO: Accept File URL, download it and then send with path
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        return whatsapp.sendFile(message.chatId, message.path, message.filename, message.caption)
    }

    @Post('/reply')
    @ApiOperation({summary: 'Reply to a text message'})
    reply(@Body() message: MessageReply) {
        const whatsapp = this.whatsappSessionManager.getSession(message.sessionName)
        return whatsapp.reply(message.chatId, message.text, message.reply_to)
    }

    @Post('/sendSeen')
    sendSeen(@Body() chat: ChatRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(chat.sessionName)
        return whatsapp.sendSeen(chat.chatId)
    }

    @Post('/startTyping')
    startTyping(@Body() chat: ChatRequest) {
        // It's infinitive action
        const whatsapp = this.whatsappSessionManager.getSession(chat.sessionName)
        whatsapp.startTyping(chat.chatId)
        return true
    }

    @Post('/stopTyping')
    stopTyping(@Body() chat: ChatRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(chat.sessionName)
        whatsapp.stopTyping(chat.chatId)
        return true
    }
}
