import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export const WHATSAPP_DEFAULT_SESSION_NAME = "default"

//
// Queries
//
export class SessionQuery {
    @IsNotEmpty()
    sessionName: string = WHATSAPP_DEFAULT_SESSION_NAME;
}

export class CheckNumberStatusQuery extends SessionQuery {
    @IsString()
    phone: string
}

export class MessageTextQuery extends SessionQuery {
    @IsString()
    phone: string
    @IsString()
    text: string
}

//
// Requests
//

const chatIdProperty = ApiProperty({
    example: '791231234567@c.us'
})
const sessionNameProperty = ApiProperty({
    default: WHATSAPP_DEFAULT_SESSION_NAME,
})

export class SessionRequest {
    @sessionNameProperty
    sessionName: string;
}

export class ChatRequest extends SessionRequest {
    @chatIdProperty
    chatId: string;
}

export class MessageContactVcard extends ChatRequest {
    contactsId: string;
    name: string
}

export class MessageText extends ChatRequest {
    text: string;
}

export class MessageTextButtons extends ChatRequest {
    text: string;
    title: string;
    buttons: any[];
}

export class MessageReply extends ChatRequest {
    text: string;
    @ApiProperty({
        example: 'message.id',
    })
    reply_to: string;
}

export class MessageLocation extends ChatRequest {
    latitude: string;
    longitude: string;
    title: string;
}

export class MessageImage extends ChatRequest {
    path: string;
    filename: string;
    caption: string;
}

export class MessageFile extends ChatRequest {
    path: string;
    filename: string;
    caption: string;
}

export class MessageLinkPreview extends ChatRequest {
    url: string;
    title: string;
}
