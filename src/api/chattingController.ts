import {Body, Controller, Post} from '@nestjs/common';
import {ApiService} from './api.service';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Message, MessageReply} from "./all.dto";

@Controller('api')
@ApiTags('chatting')
export class ChattingController {
    constructor(private readonly apiService: ApiService) {
    }

    @Post('/sendText')
    @ApiOperation({summary: 'Send a text message'})
    sendText(@Body() message: Message) {
        return `You've sent: ${message.chatId} - ${message.text}`
    }

    @Post('/reply')
    @ApiOperation({summary: 'Reply to a text message'})
    reply(@Body() message: MessageReply) {
        return `You've sent: ${message.chatId} - ${message.text} - ${message.reply_to}`
    }
}
