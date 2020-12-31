import {Body, Controller, Inject, NotImplementedException, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {
    Chat,
    MessageContactVcard,
    MessageFile,
    MessageImage,
    MessageLinkPreview,
    MessageLocation,
    MessageReply,
    MessageText
} from "./all.dto";
import {Whatsapp} from "venom-bot";

@Controller('api')
@ApiTags('chatting')
export class ChattingController {
    constructor(@Inject('WHATSAPP') private whatsapp: Whatsapp) {
    }

    @Post('/sendContactVcard')
    sendContactVcard(@Body() message: MessageContactVcard) {
        return this.whatsapp.sendContactVcard(message.chatId, message.contactsId, message.name)
    }

    @Post('/sendText')
    @ApiOperation({summary: 'Send a text message'})
    sendText(@Body() message: MessageText) {
        return this.whatsapp.sendText(message.chatId, message.text)
    }

    @Post('/sendLocation')
    sendLocation(@Body() message: MessageLocation) {
        return this.whatsapp.sendLocation(message.chatId, message.latitude, message.longitude, message.title)
    }

    @Post('/sendLinkPreview')
    sendLinkPreview(@Body() message: MessageLinkPreview) {
        return this.whatsapp.sendLinkPreview(message.chatId, message.url, message.title)
    }

    @Post('/sendImage')
    @ApiOperation({summary: 'NOT IMPLEMENTED YET'})
    sendImage(@Body() message: MessageImage) {
        throw new NotImplementedException();
        // TODO: Accept image URL, download it and then send with path
        return this.whatsapp.sendImage(message.chatId, message.path, message.filename, message.caption)
    }

    @Post('/sendFile')
    @ApiOperation({summary: 'NOT IMPLEMENTED YET'})
    sendFile(@Body() message: MessageFile) {
        throw new NotImplementedException();
        // TODO: Accept File URL, download it and then send with path
        return this.whatsapp.sendFile(message.chatId, message.path, message.filename, message.caption)
    }

    @Post('/reply')
    @ApiOperation({summary: 'Reply to a text message'})
    reply(@Body() message: MessageReply) {
        return this.whatsapp.reply(message.chatId, message.text, message.reply_to)
    }

    @Post('/sendSeen')
    sendSeen(@Body() chat: Chat) {
        return this.whatsapp.sendSeen(chat.chatId)
    }

    @Post('/startTyping')
    startTyping(@Body() chat: Chat) {
        // It's infinitive action
        this.whatsapp.startTyping(chat.chatId)
        return true
    }

    @Post('/stopTyping')
    stopTyping(@Body() chat: Chat) {
        this.whatsapp.stopTyping(chat.chatId)
        return true
    }
}
