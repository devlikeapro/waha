import { Client } from 'whatsapp-web.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadUtils } = require('./WahaInjected');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChatFactory = require('whatsapp-web.js/src/factories/ChatFactory');

export class WebjsClient extends Client {
  async inject() {
    // Even tho this.inject is not defined as interface in Client.ts
    // We can still call and override it
    // @ts-ignore
    await super.inject();
    //Load util functions (serializers, helper functions)
    await this.pupPage.evaluate(LoadUtils);
  }

  async getChats(limit?: number, offset?: number) {
    if (limit == null && offset == null) {
      return await super.getChats();
    }
    return await this.getChats2(limit, offset);
  }

  private async getChats2(limit?: number, offset?: number) {
    const chats = await this.pupPage.evaluate(
      async (limit, offset) => {
        // @ts-ignore
        return await window.WAHA.getChats(limit, offset);
      },
      limit,
      offset,
    );

    return chats.map((chat) => ChatFactory.create(this, chat));
  }
}
