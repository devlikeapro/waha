import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  AuthQRInput,
  AuthRequestCodeInput,
  ScreenshotInput,
} from '@waha/apps/mcp/tools/auth.zod';

function AuthContent(key: string): any {
  return {
    type: 'text' as const,
    text: `
You can either ask the user to scan a QR code or provide a phone number and call auth-request-code. auth-request-code is preferable, so ask for the phone number and pass it in international format without +.
If the user wants to open the QR code or screenshot in a browser, add "?x-api-key=${key}" to the query params.
`,
  };
}

export class AuthTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('auth-qr', {
    title: 'Get QR code',
    description:
      'Get QR code to pair WhatsApp Session. ' +
      'The first QR code is valid for 60 seconds; each subsequent code is valid for 20 seconds. ' +
      'If the code expires before scanning, call this tool again to get a fresh one. ' +
      'If you run out of codes the server closes the connection — reconnect and start over.',
    inputSchema: AuthQRInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async authQR({ session }: z.infer<typeof AuthQRInput>) {
    const result = await this.imageRequest(`/api/${session}/auth/qr`);
    result.content.push(AuthContent(this.api.key));
    return result;
  }

  @Tool('screenshot', {
    title: 'Get screenshot',
    description:
      'Get a screenshot of the current WhatsApp Web page (WEBJS/WPP only)',
    inputSchema: ScreenshotInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async screenshot({ session }: z.infer<typeof ScreenshotInput>) {
    const result = await this.imageRequest(
      `/api/screenshot?session=${session}`,
    );
    result.content.push(AuthContent(this.api.key));
    return result;
  }

  @Tool('auth-request-code', {
    title: 'Request pairing code',
    description:
      'Request a one-time pairing code for phone-number-based authentication (alternative to QR). ' +
      'Leave method empty for Web pairing.',
    inputSchema: AuthRequestCodeInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async requestCode({
    session,
    ...body
  }: z.infer<typeof AuthRequestCodeInput>) {
    const result = await this.textRequest({
      method: 'POST',
      url: `/api/${session}/auth/request-code`,
      data: body,
    });
    result.content.push({
      type: 'text',
      text:
        'Share the pairing code with the user and ask them to complete linking:\n' +
        '1. Open WhatsApp on your phone\n' +
        '2. Tap More Options ⋮ or Settings\n' +
        '3. Tap Linked Devices → Link a device\n' +
        '4. Tap "Link with phone number instead" and enter the code',
    });
    return result;
  }
}
