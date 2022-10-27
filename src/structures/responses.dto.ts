import {ApiProperty} from "@nestjs/swagger";
import {WAEvents} from "./enums.dto";

export class WANumberExistResult {
    numberExists: boolean
}


export class WAGroupNotification {
    @ApiProperty({
        description: "ID that represents the groupNotification",
    })
    id: any

    @ApiProperty({
        description: "Unix timestamp for when the groupNotification was created",
    })
    timestamp: number

    @ApiProperty({
        description: "ID for the Chat that this groupNotification was sent for",
    })
    chatId: string


    @ApiProperty({
        description: "ContactId for the user that produced the GroupNotification",
    })
    author: string

    @ApiProperty({
        description: "Extra content",
    })
    body: string

    @ApiProperty({
        description: "Contact IDs for the users that were affected by this GroupNotification",
    })
    recipientIds: string[]
}

export enum WAMessageAck {
    ACK_ERROR = -1,
    ACK_PENDING = 0,
    ACK_SERVER = 1,
    ACK_DEVICE = 2,
    ACK_READ = 3,
    ACK_PLAYED = 4,
}

export class WALocation {
    description?: string | null
    latitude: string
    longitude: string
}


export class WAMessage {
    @ApiProperty({
        description: "Message ID",
        example: "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    })
    id: string

    /**  */
    @ApiProperty({
        description: "Unix timestamp for when the message was created",
        example: 1666943582
    })
    timestamp: number

    @ApiProperty({
        description: "ID for the Chat that this message was sent to, except if the message was sent by the current user "
    })
    from: string

    @ApiProperty({
        description: "Indicates if the message was sent by the current user"
    })
    fromMe: boolean

    @ApiProperty({
        description: `
* ID for who this message is for.
* If the message is sent by the current user, it will be the Chat to which the message is being sent.
* If the message is sent by another user, it will be the ID for the current user.
`
    })
    to: string

    @ApiProperty({
        description: "Message content"
    })
    body: string

    @ApiProperty({
        description: "Indicates if the message has media available for download"
    })
    hasMedia: boolean

    @ApiProperty({
        description: "The URL for the media in the message if any",
        example: "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
    })
    mediaUrl: string

    @ApiProperty({
        description: "ACK status for the message"
    })
    ack: WAMessageAck

    @ApiProperty({
        description: "If the message was sent to a group, this field will contain the user that sent the message."
    })
    author?: string;

    @ApiProperty({
        description: "Location information contained in the message, if the message is type \"location\""
    })
    location?: WALocation

    @ApiProperty({
        description: "List of vCards contained in the message."
    })
    vCards?: string[]

    /** Returns message in a raw format */
    @ApiProperty({
        description: "Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend."
    })
    _data?: any
}

export class WAWebhook {
    event: WAEvents
    // eslint-disable-next-line @typescript-eslint/ban-types
    payload: WAMessage | WAGroupNotification | object
}
