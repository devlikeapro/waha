import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  ContactsPaginationParams,
  ContactProfilePictureQuery,
  ContactRequest,
  ContactUpdateBody,
} from '@waha/structures/contacts.dto';
import { CheckNumberStatusQuery } from '@waha/structures/chatting.dto';

const SessionField = z.string().describe('Session name');
const ContactIdField = z.string().describe('Contact ID (e.g. 11111@c.us)');

export const ContactsGetAllInput = DtoToZod(ContactsPaginationParams).extend({
  session: SessionField,
});

export const ContactGetInput = z.object({
  session: SessionField,
  id: ContactIdField,
});

export const ContactCheckExistsInput = DtoToZod(CheckNumberStatusQuery);

export const ContactProfilePictureInput = DtoToZod(ContactProfilePictureQuery);

export const ContactRequestInput = DtoToZod(ContactRequest);

export const ContactUpsertInput = DtoToZod(ContactUpdateBody).extend({
  session: SessionField,
  chatId: ContactIdField,
});
