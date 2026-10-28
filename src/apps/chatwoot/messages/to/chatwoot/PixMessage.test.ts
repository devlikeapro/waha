import { requireModule } from '@waha/__tests__/esm';
import { PixMessage } from '@waha/apps/chatwoot/messages/to/chatwoot/PixMessage';
import { resolveProtoMessage } from '@waha/apps/chatwoot/messages/to/chatwoot';
import { WAMessage } from '@waha/structures/responses.dto';
import { JestLogger } from '@waha/apps/app_sdk/jest/JestLogger';
import { i18n } from '@waha/apps/chatwoot/i18n';

jest.mock('@adiwajshing/baileys', () => requireModule('@adiwajshing/baileys'));

describe('PixMessage - pt-BR', () => {
  const locale = i18n.locale('pt-BR');

  it('GOWS - no total amount', () => {
    // Setup
    const buttonParamsJson = JSON.stringify({
      currency: 'BRL',
      total_amount: {
        value: 0,
        offset: 100,
      },
      reference_id: '4TB11111111',
      type: 'physical-goods',
      order: {
        status: 'pending',
        subtotal: {
          value: 0,
          offset: 100,
        },
        order_type: 'ORDER',
        items: [
          {
            name: '',
            amount: {
              value: 0,
              offset: 100,
            },
            quantity: 0,
            sale_amount: {
              value: 0,
              offset: 100,
            },
          },
        ],
      },
      payment_settings: [
        {
          type: 'pix_static_code',
          pix_static_code: {
            merchant_name: 'Merchant Name Here',
            key: '+5000000000000',
            key_type: 'PHONE',
          },
        },
      ],
      share_payment_status: false,
      referral: 'chat_attachment',
    });

    const payload = {
      id: 'false_559900000001@c.us_FAKEPIXORDER1',
      timestamp: 1899003201,
      from: '559900000001@c.us',
      fromMe: false,
      source: 'app',
      to: null,
      participant: null,
      hasMedia: false,
      ack: 2,
      ackName: 'DEVICE',
      body: '',
      _data: {
        Message: {
          messageContextInfo: {
            deviceListMetadata: {
              senderKeyHash: 'aFakeSenderKeyHash==',
              senderTimestamp: 1880001234,
              recipientKeyHash: 'anotherFakeRecipientKeyHash==',
              recipientTimestamp: 1880005678,
            },
            deviceListMetadataVersion: 2,
            messageSecret: 'fakeMessageSecret==',
          },
          interactiveMessage: {
            InteractiveMessage: {
              NativeFlowMessage: {
                buttons: [
                  {
                    name: 'payment_info',
                    buttonParamsJSON: buttonParamsJson,
                  },
                ],
              },
            },
          },
          contextInfo: {
            expiration: 0,
            ephemeralSettingTimestamp: 1880006789,
            disappearingMode: {
              initiator: 0,
              trigger: 0,
            },
          },
        },
      },
    } as unknown as WAMessage;

    // Test
    const logger = JestLogger();
    const protoMessage = resolveProtoMessage(payload._data);
    const converter = new PixMessage(locale, logger);
    const result = converter.convert(payload, protoMessage);

    // Assert
    const expected = `💳 **PIX - Copia e Cola**

**Merchant Name Here**

**Chave PIX:** +5000000000000
**Tipo:** PHONE
**Referência:** 4TB11111111

💳 **PIX Copia e Cola enviado**`;

    expect(protoMessage).not.toBeNull();
    expect(result).not.toBeNull();
    expect(result.content).toEqual(expected);
    expect(logger.fatal).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('GOWS - with total amount', () => {
    // Setup
    const buttonParamsJson = JSON.stringify({
      currency: 'BRL',
      total_amount: {
        value: 2512,
        offset: 100,
      },
      reference_id: '4TB11111111',
      type: 'physical-goods',
      order: {
        status: 'pending',
        subtotal: {
          value: 2512,
          offset: 100,
        },
        order_type: 'ORDER',
        items: [
          {
            name: '',
            amount: {
              value: 2512,
              offset: 100,
            },
            quantity: 1,
            sale_amount: {
              value: 2512,
              offset: 100,
            },
          },
        ],
      },
      payment_settings: [
        {
          type: 'pix_static_code',
          pix_static_code: {
            merchant_name: 'Merchant Name Here',
            key: '+5000000000000',
            key_type: 'PHONE',
          },
        },
      ],
      share_payment_status: false,
      referral: 'chat_attachment',
    });

    const payload = {
      id: 'false_559900000001@c.us_FAKEPIXORDER1',
      timestamp: 1899003201,
      from: '559900000001@c.us',
      fromMe: false,
      source: 'app',
      to: null,
      participant: null,
      hasMedia: false,
      ack: 2,
      ackName: 'DEVICE',
      body: '',
      _data: {
        Message: {
          messageContextInfo: {
            deviceListMetadata: {
              senderKeyHash: 'aFakeSenderKeyHash==',
              senderTimestamp: 1880001234,
              recipientKeyHash: 'anotherFakeRecipientKeyHash==',
              recipientTimestamp: 1880005678,
            },
            deviceListMetadataVersion: 2,
            messageSecret: 'fakeMessageSecret==',
          },
          interactiveMessage: {
            InteractiveMessage: {
              NativeFlowMessage: {
                buttons: [
                  {
                    name: 'payment_info',
                    buttonParamsJSON: buttonParamsJson,
                  },
                ],
              },
            },
          },
          contextInfo: {
            expiration: 0,
            ephemeralSettingTimestamp: 1880006789,
            disappearingMode: {
              initiator: 0,
              trigger: 0,
            },
          },
        },
      },
    } as unknown as WAMessage;

    // Test
    const logger = JestLogger();
    const protoMessage = resolveProtoMessage(payload._data);
    const converter = new PixMessage(locale, logger);
    const result = converter.convert(payload, protoMessage);

    // Assert
    const expected = `💳 **PIX - Copia e Cola**

**Merchant Name Here**

**Chave PIX:** +5000000000000
**Tipo:** PHONE
**Valor:** R$\u00A025,12
**Referência:** 4TB11111111

💳 **PIX Copia e Cola enviado**`;

    expect(protoMessage).not.toBeNull();
    expect(result).not.toBeNull();
    expect(result.content).toEqual(expected);
    expect(logger.fatal).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
