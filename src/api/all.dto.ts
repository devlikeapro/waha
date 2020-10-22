import {ApiProperty} from "@nestjs/swagger";

const chatId = ApiProperty({
    example: '791231234567@c.us'
})

export class Chat {
    @chatId
    chatId: string;
}

export class MessageContactVcard {
    @chatId
    chatId: string;
    contactsId: string;
    name: string
}

export class MessageText {
    @chatId
    chatId: string;
    text: string;
}

export class MessageReply {
    @chatId
    chatId: string;
    text: string;
    @ApiProperty({
        example: 'message.id',
    })
    reply_to: string;
}

export class MessageLocation {
    @chatId
    chatId: string;
    latitude: string;
    longitude: string;
    title: string;
}

export class MessageImage {
    @chatId
    chatId: string;
    path: string;
    filename: string;
    caption: string;
}

export class MessageFile {
    @chatId
    chatId: string;
    path: string;
    filename: string;
    caption: string;
}

export class MessageLinkPreview {
    @chatId
    chatId: string;
    url: string;
    title: string;
}