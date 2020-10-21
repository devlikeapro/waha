export class Chat {
    chatId: string;
}

export class MessageContactVcard {
    chatId: string;
    contactsId: string;
    name: string
}

export class MessageText {
    chatId: string;
    text: string;
}

export class MessageReply {
    chatId: string;
    text: string;
    reply_to: string;
}

export class MessageLocation {
    chatId: string;
    latitude: string;
    longitude: string;
    title: string;
}

export class MessageImage {
    chatId: string;
    path: string;
    filename: string;
    caption: string;
}

export class MessageFile {
    chatId: string;
    path: string;
    filename: string;
    caption: string;
}

export class MessageLinkPreview {
    chatId: string;
    url: string;
    title: string;
}