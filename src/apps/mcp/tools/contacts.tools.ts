import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  ContactCheckExistsInput,
  ContactGetInput,
  ContactProfilePictureInput,
  ContactRequestInput,
  ContactsGetAllInput,
  ContactUpsertInput,
} from '@waha/apps/mcp/tools/contacts.zod';

export class ContactTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('contacts-get-all', {
    title: 'Get all contacts',
    description: 'Get all contacts for a session',
    inputSchema: ContactsGetAllInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getAll({ session, ...query }: z.infer<typeof ContactsGetAllInput>) {
    return this.textRequest({
      method: 'GET',
      url: '/api/contacts/all',
      params: { session: session, ...query },
    });
  }

  @Tool('contacts-get', {
    title: 'Get contact info',
    description:
      'Get basic contact info. Always returns a result even if the number is not registered in WhatsApp — use contacts-check-exists to verify registration.',
    inputSchema: ContactGetInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async get({ session, id }: z.infer<typeof ContactGetInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/contacts/${id}`,
    });
  }

  @Tool('contacts-check-exists', {
    title: 'Check if number is on WhatsApp',
    description: 'Check whether a phone number is registered in WhatsApp',
    inputSchema: ContactCheckExistsInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async checkExists(query: z.infer<typeof ContactCheckExistsInput>) {
    return this.textRequest({
      method: 'GET',
      url: '/api/contacts/check-exists',
      params: query,
    });
  }

  @Tool('contacts-get-about', {
    title: "Get contact's about",
    description:
      'Get the contact\'s "about" / status text. Returns null if privacy settings block access.',
    inputSchema: ContactGetInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getAbout({ session, id }: z.infer<typeof ContactGetInput>) {
    return this.textRequest({
      method: 'GET',
      url: '/api/contacts/about',
      params: { session: session, contactId: id },
    });
  }

  @Tool('contacts-get-picture', {
    title: "Get contact's profile picture",
    description:
      "Get the contact's profile picture URL. Returns null if privacy settings block access.",
    inputSchema: ContactProfilePictureInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getProfilePicture(query: z.infer<typeof ContactProfilePictureInput>) {
    return this.textRequest({
      method: 'GET',
      url: '/api/contacts/profile-picture',
      params: query,
    });
  }

  @Tool('contacts-block', {
    title: 'Block contact',
    description: 'Block a contact',
    inputSchema: ContactRequestInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async block(body: z.infer<typeof ContactRequestInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/contacts/block',
      data: body,
    });
  }

  @Tool('contacts-unblock', {
    title: 'Unblock contact',
    description: 'Unblock a contact',
    inputSchema: ContactRequestInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async unblock(body: z.infer<typeof ContactRequestInput>) {
    return this.textRequest({
      method: 'POST',
      url: '/api/contacts/unblock',
      data: body,
    });
  }

  @Tool('contacts-upsert', {
    title: 'Create or update contact',
    description:
      'Create or update a contact in the phone address book. May not work if multiple WhatsApp apps are installed on the same phone.',
    inputSchema: ContactUpsertInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async upsert({
    session,
    chatId,
    ...body
  }: z.infer<typeof ContactUpsertInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/contacts/${chatId}`,
      data: body,
    });
  }
}
