export class Message {
    readonly chatId: string;
    readonly text: string;
}

export class MessageReply {
    readonly chatId: string;
    readonly text: string;
    readonly reply_to: string;
}
