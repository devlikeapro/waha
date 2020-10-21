import {Body, Controller, Inject, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {MessageOut, MessageReply} from "./all.dto";
import {Whatsapp} from "venom-bot";

@Controller('api')
@ApiTags('chatting')
export class ChattingController {
    constructor(@Inject('WHATSAPP') private whatsapp: Whatsapp) {
    }

    @Post('/sendText')
    @ApiOperation({summary: 'Send a text message'})
    sendText(@Body() message: MessageOut) {
        return this.whatsapp.sendText(message.chatId, message.text)
    }

    @Post('/reply')
    @ApiOperation({summary: 'Reply to a text message'})
    reply(@Body() message: MessageReply) {
        return this.whatsapp.reply(message.chatId, message.text, message.reply_to, [])
    }
}
