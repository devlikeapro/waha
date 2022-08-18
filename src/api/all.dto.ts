import {ApiProperty} from "@nestjs/swagger";

const chatIdProperty = ApiProperty({
    example: '791231234567@c.us'
})
const sessionNameProperty = ApiProperty({
    default: "default",
    example: 'default',
})

export class Session {
    @sessionNameProperty
    sessionName: string;
}

export class Chat {
    @chatIdProperty
    chatId: string;
}

export class MessageContactVcard {
    @chatIdProperty
    chatId: string;
    contactsId: string;
    name: string
}

export class MessageText {
    @chatIdProperty
    chatId: string;
    text: string;
}

export class MessageReply {
    @chatIdProperty
    chatId: string;
    text: string;
    @ApiProperty({
        example: 'message.id',
    })
    reply_to: string;
}

export class MessageLocation {
    @chatIdProperty
    chatId: string;
    latitude: string;
    longitude: string;
    title: string;
}

export class MessageImage {
    @chatIdProperty
    chatId: string;
    path: string;
    filename: string;
    caption: string;
}

export class MessageFile {
    @chatIdProperty
    chatId: string;
    path: string;
    filename: string;
    caption: string;
}

export class MessageLinkPreview {
    @chatIdProperty
    chatId: string;
    url: string;
    title: string;
}
