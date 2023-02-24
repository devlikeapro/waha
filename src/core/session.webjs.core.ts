import {UnprocessableEntityException} from "@nestjs/common/exceptions/unprocessable-entity.exception";
import {Buttons, Chat, Client, Contact, Events, GroupChat, Location, Message} from "whatsapp-web.js";
import {Message as MessageInstance} from "whatsapp-web.js/src/structures"
import {WAEvents, WhatsappStatus} from "../structures/enums.dto";
import {WhatsappSession} from "./abc/session.abc";
import {WAMessage, WANumberExistResult} from "../structures/responses.dto";
import {
    ChatRequest,
    CheckNumberStatusQuery,
    MessageContactVcardRequest,
    MessageFileRequest,
    MessageImageRequest,
    MessageLinkPreviewRequest,
    MessageLocationRequest,
    MessageReactionRequest,
    MessageReplyRequest,
    MessageTextButtonsRequest,
    MessageTextRequest,
    MessageVoiceRequest
} from "../structures/chatting.dto";
import {AvailableInPlusVersion, NotImplementedByEngineError} from "./exceptions";
import {ContactQuery, ContactRequest} from "../structures/contacts.dto";
import {CreateGroupRequest, ParticipantsRequest} from "../structures/groups.dto";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const qrcode = require('qrcode-terminal');


export class WhatsappSessionWebJSCore extends WhatsappSession {
    whatsapp: Client;

    protected buildClient() {
        return new Client({
            puppeteer: {
                headless: true,
                executablePath: this.getBrowserExecutablePath(),
                args: this.getBrowserArgsForPuppeteer(),
            }
        });
    }

    async start() {
        this.whatsapp = this.buildClient()

        this.whatsapp.initialize().catch(error => {
            this.status = WhatsappStatus.FAILED
            this.log.error(error)
            return
        });

        // Connect events
        this.whatsapp.on(Events.QR_RECEIVED, (qr) => {
            qrcode.generate(qr, {small: true});
            this.status = WhatsappStatus.SCAN_QR_CODE
        });

        this.whatsapp.on(Events.AUTHENTICATED, () => {
            this.status = WhatsappStatus.WORKING
            this.log.log(`Session '${this.name}' has been authenticated!`)
        });
        return this
    }

    stop() {
        return this.whatsapp.pupPage.close()
    }

    /**
     * START - Methods for API
     */
    async getScreenshot(): Promise<Buffer | string> {
        if (this.status === WhatsappStatus.FAILED) {
            throw new UnprocessableEntityException(`The session under FAILED status. Please try to restart it.`);
        }
        return await this.whatsapp.pupPage.screenshot()
    }

    async checkNumberStatus(request: CheckNumberStatusQuery): Promise<WANumberExistResult> {
        const exist = await this.whatsapp.isRegisteredUser(this.ensureSuffix(request.phone))
        return {numberExists: exist}
    }

    sendText(request: MessageTextRequest) {
        return this.whatsapp.sendMessage(this.ensureSuffix(request.chatId), request.text)
    }

    sendTextButtons(request: MessageTextButtonsRequest) {
        const message = new Buttons("", request.buttons, request.title, request.text)
        return this.whatsapp.sendMessage(this.ensureSuffix(request.chatId), message)
    }

    sendContactVCard(request: MessageContactVcardRequest) {
        throw new NotImplementedByEngineError()
    }

    reply(request: MessageReplyRequest) {
        const options = {
            quotedMessageId: request.reply_to,
        };
        return this.whatsapp.sendMessage(request.chatId, request.text, options)
    }

    sendImage(request: MessageImageRequest) {
        throw new AvailableInPlusVersion()
    }

    sendFile(request: MessageFileRequest) {
        throw new AvailableInPlusVersion()
    }

    sendVoice(request: MessageVoiceRequest) {
        throw new AvailableInPlusVersion()
    }

    async sendLocation(request: MessageLocationRequest) {
        const location = new Location(
            request.latitude,
            request.longitude,
            request.title,
        )
        return this.whatsapp.sendMessage(request.chatId, location)
    }

    sendLinkPreview(request: MessageLinkPreviewRequest) {
        throw new NotImplementedByEngineError()
    }


    async sendSeen(request: ChatRequest) {
        const chat: Chat = await this.whatsapp.getChatById(request.chatId)
        await chat.sendSeen()
    }

    async startTyping(request: ChatRequest) {
        const chat: Chat = await this.whatsapp.getChatById(request.chatId)
        await chat.sendStateTyping()
    }

    async stopTyping(request: ChatRequest) {
        const chat: Chat = await this.whatsapp.getChatById(request.chatId)
        await chat.clearState()
    }

    async setReaction(request: MessageReactionRequest) {
        const messageId = this.deserializeId(request.messageId)
        console.log(messageId)

        // Recreate instance to react on it
        const message = new MessageInstance(this.whatsapp)
        message.id = messageId
        message._data = {id: messageId}

        return message.react(request.reaction)
    }


    /**
     * Contacts methods
     */
    getContact(query: ContactQuery) {
        return this.whatsapp.getContactById(this.ensureSuffix(query.contactId)).then(this.toWAContact)
    }

    getContacts() {
        return this.whatsapp.getContacts().then(contacts => contacts.map(this.toWAContact))
    }

    public async getContactAbout(query: ContactQuery) {
        const contact = await this.whatsapp.getContactById(this.ensureSuffix(query.contactId))
        return {"about": await contact.getAbout()}
    }

    public async getContactProfilePicture(query: ContactQuery) {
        const contact = await this.whatsapp.getContactById(this.ensureSuffix(query.contactId))
        return {"profilePictureURL": await contact.getProfilePicUrl()}
    }

    public async blockContact(request: ContactRequest) {
        const contact = await this.whatsapp.getContactById(this.ensureSuffix(request.contactId))
        await contact.block()
    }

    public async unblockContact(request: ContactRequest) {
        const contact = await this.whatsapp.getContactById(this.ensureSuffix(request.contactId))
        await contact.unblock()
    }

    /**
     * Group methods
     */
    public createGroup(request: CreateGroupRequest) {
        const participantIds = request.participants.map(participant => participant.id)
        return this.whatsapp.createGroup(request.name, participantIds)
    }

    public getGroups() {
        return this.whatsapp.getChats().then(chats => chats.filter(chat => chat.isGroup))
    }

    public getGroup(id) {
        return this.whatsapp.getChatById(id)
    }

    public async deleteGroup(id) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        return groupChat.delete()
    }

    public async leaveGroup(id) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        return groupChat.leave()
    }

    public async setDescription(id, description) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        return groupChat.setDescription(description)
    }

    public async setSubject(id, subject) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        return groupChat.setSubject(subject)
    }

    public async getInviteCode(id): Promise<string> {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        return groupChat.getInviteCode()
    }

    public async revokeInviteCode(id): Promise<string> {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        await groupChat.revokeInvite()
        return groupChat.getInviteCode()
    }

    public async getParticipants(id) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        return groupChat.participants
    }

    public async addParticipants(id, request: ParticipantsRequest) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        const participantIds = request.participants.map(participant => participant.id)
        return groupChat.addParticipants(participantIds)
    }

    public async removeParticipants(id, request: ParticipantsRequest) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        const participantIds = request.participants.map(participant => participant.id)
        return groupChat.removeParticipants(participantIds)
    }

    public async promoteParticipantsToAdmin(id, request: ParticipantsRequest) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        const participantIds = request.participants.map(participant => participant.id)
        return groupChat.promoteParticipants(participantIds)
    }

    public async demoteParticipantsToUser(id, request: ParticipantsRequest) {
        const groupChat = await this.whatsapp.getChatById(id) as GroupChat
        const participantIds = request.participants.map(participant => participant.id)
        return groupChat.demoteParticipants(participantIds)
    }

    /**
     * END - Methods for API
     */

    subscribe(event, handler) {
        if (event === WAEvents.MESSAGE) {
            this.whatsapp.on(Events.MESSAGE_RECEIVED, (message) => this.processIncomingMessage(message).then(handler))
        } else if (event === WAEvents.MESSAGE_ANY) {
            this.whatsapp.on(Events.MESSAGE_CREATE, (message) => this.processIncomingMessage(message).then(handler))
        } else if (event === WAEvents.STATE_CHANGE) {
            this.whatsapp.on(Events.STATE_CHANGED, handler)
        } else if (event === WAEvents.MESSAGE_ACK) {
            // We do not download media here
            this.whatsapp.on(Events.MESSAGE_ACK, (message) => this.toWAMessage(message).then(handler))
        } else if (event === WAEvents.GROUP_JOIN) {
            this.whatsapp.on(Events.GROUP_JOIN, handler)
        } else if (event === WAEvents.GROUP_LEAVE) {
            this.whatsapp.on(Events.GROUP_LEAVE, handler)
        } else {
            throw new NotImplementedByEngineError(`Engine does not support webhook event: ${event}`)
        }
    }

    private processIncomingMessage(message: Message) {
        return this.downloadMedia(message).then(this.toWAMessage)
    }

    protected toWAMessage(message: Message): Promise<WAMessage> {
        // @ts-ignore
        return Promise.resolve({
            id: message.id._serialized,
            timestamp: message.timestamp,
            from: message.from,
            fromMe: message.fromMe,
            to: message.to,
            body: message.body,
            // @ts-ignore
            hasMedia: Boolean(message.mediaUrl),
            // @ts-ignore
            mediaUrl: message.mediaUrl,
            // @ts-ignore
            ack: message.ack,
            location: message.location,
            vCards: message.vCards,
            _data: message.rawData,
        })
    }

    protected toWAContact(contact: Contact) {
        // @ts-ignore
        contact.id = contact.id._serialized
        return contact
    }

    protected async downloadMedia(message: Message) {
        if (!message.hasMedia) {
            return message
        }

        // @ts-ignore
        message.mediaUrl = await this.storage.save(message.id._serialized, "", undefined)
        return message
    }

}

