import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  LidInput,
  LidsListInput,
  LidsSessionInput,
  PhoneNumberInput,
} from '@waha/apps/mcp/tools/lids.zod';

export class LidTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('lids-get-all', {
    title: 'Get all LIDs',
    description:
      'LIDs (Linked IDs) are anonymous identifiers WhatsApp assigns to contacts in some regions instead of phone numbers. ' +
      'Get all known LID-to-phone-number mappings for a session.',
    inputSchema: LidsListInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async getAll({ session, ...query }: z.infer<typeof LidsListInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/lids`,
      params: query,
    });
  }

  @Tool('lids-count', {
    title: 'Count LIDs',
    description: 'Get the number of known LIDs for a session',
    inputSchema: LidsSessionInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async count({ session }: z.infer<typeof LidsSessionInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/lids/count`,
    });
  }

  @Tool('lids-find-pn-by-lid', {
    title: 'Find phone number by LID',
    description: 'Look up the phone number (chat ID) for a given LID',
    inputSchema: LidInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async findPNByLid({ session, lid }: z.infer<typeof LidInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/lids/${lid}`,
    });
  }

  @Tool('lids-find-lid-by-pn', {
    title: 'Find LID by phone number',
    description: 'Look up the LID for a given phone number / chat ID',
    inputSchema: PhoneNumberInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async findLidByPN({
    session,
    phoneNumber,
  }: z.infer<typeof PhoneNumberInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/lids/pn/${phoneNumber}`,
    });
  }
}
