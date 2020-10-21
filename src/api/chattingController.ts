import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {MessageOut, MessageReply} from "./all.dto";

@Controller('api')
@ApiTags('chatting')
export class ChattingController {
    @Post('/sendText')
    @ApiOperation({summary: 'Send a text message'})
    sendText(@Body() message: MessageOut) {
        return `You've sent: ${message.chatId} - ${message.text}`
    }

    @Post('/reply')
    @ApiOperation({summary: 'Reply to a text message'})
    reply(@Body() message: MessageReply) {
        return `You've sent: ${message.chatId} - ${message.text} - ${message.reply_to}`
    }
}
