export class ChatIDNotFoundForContactError extends Error {
  constructor(public sender: any) {
    super('Chat ID not found');
  }
}

export class PhoneNumberNotFoundInWhatsAppError extends Error {
  constructor(public phone: any) {
    super(`Phone number not found in WhatsApp: ${phone}`);
  }
}

export class UnknownJIDFormat extends Error {
  constructor(public jid: string) {
    super(`WhatsApp Chat ID is not recognized: ${jid}`);
  }
}

export class ChatWootAppNotFoundError extends Error {
  constructor(public appId: string) {
    super(`Chatwoot app not found or disabled: ${appId}`);
  }
}
