import type { WAHAEngine, WAHAEvents } from '@waha/structures/enums.dto';
import {
  ShouldMarkAsReadInChatWoot,
  ShouldProcessAckInChatWoot,
} from '@waha/apps/chatwoot/consumers/waha/message.ack.utils';

interface TestParam {
  name: string;
  ShouldMarkAsReadInChatWoot: boolean;
  ShouldProcessAckInChatWoot: boolean;
  GOWS: any;
  NOWEB: any;
  WEBJS: any;
}

/**
 * Me - 444444444444 (lid - 144444444444444)
 * Participant - 11111111111 (lid - 011111111111111)
 * Group - 222222222222222222
 */
const TestCases: TestParam[] = [
  {
    name: 'Participant read My message (READ ack)',
    ShouldMarkAsReadInChatWoot: true,
    ShouldProcessAckInChatWoot: true,
    GOWS: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack' as WAHAEvents,
      payload: {
        id: 'true_11111111111@c.us_3333333333333333333333',
        from: '11111111111@c.us',
        to: null,
        participant: null,
        fromMe: true,
        ack: 3,
        ackName: 'READ',
        _data: {
          Chat: '11111111111@s.whatsapp.net',
          Sender: '11111111111@s.whatsapp.net',
          IsFromMe: false,
          IsGroup: false,
          AddressingMode: '',
          SenderAlt: '',
          RecipientAlt: '',
          BroadcastListOwner: '',
          BroadcastRecipients: null,
          MessageIDs: ['3333333333333333333333'],
          Type: 'read',
          MessageSender: '',
        },
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        lid: '144444444444444@lid',
        jid: '444444444444:42@s.whatsapp.net',
        pushName: '',
      },
      environment: {
        version: '2025.10.4',
        engine: 'GOWS',
        tier: 'PLUS',
        browser: null,
      },
      engine: 'GOWS' as WAHAEngine,
    },
    NOWEB: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack',
      payload: {
        id: 'true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        from: '11111111111@c.us',
        fromMe: true,
        ack: 3,
        ackName: 'READ',
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        pushName: '',
        lid: '144444444444444@lid',
      },
      engine: 'NOWEB',
      environment: {
        version: '2025.10.4',
        engine: 'NOWEB',
        tier: 'PLUS',
        browser: null,
      },
    },
    WEBJS: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack',
      payload: {
        id: 'true_11111111111@c.us_AAA',
        from: '444444444444@c.us',
        fromMe: true,
        source: 'app',
        to: '11111111111@c.us',
        body: 'Nn',
        hasMedia: false,
        media: null,
        ack: 3,
        ackName: 'READ',
        vCards: [],
        _data: {
          id: {
            fromMe: true,
            remote: '11111111111@c.us',
            id: 'AAA',
            _serialized: 'true_11111111111@c.us_AAA',
          },
          viewed: false,
          from: '444444444444@c.us',
          to: '11111111111@c.us',
          author: '444444444444@c.us',
          ack: 3,
        },
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        pushName: '',
      },
      engine: 'WEBJS',
      environment: {
        version: '2025.10.4',
        engine: 'WEBJS',
        tier: 'PLUS',
        browser: '/usr/bin/google-chrome-stable',
      },
    },
  },
  {
    name: 'Participant received My message (DEVICE ack)',
    ShouldMarkAsReadInChatWoot: false,
    ShouldProcessAckInChatWoot: true,
    GOWS: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack' as WAHAEvents,
      payload: {
        id: 'true_11111111111@c.us_3333333333333333333333',
        from: '11111111111@c.us',
        to: null,
        participant: null,
        fromMe: true,
        ack: 2,
        ackName: 'DEVICE',
        _data: {
          Chat: '11111111111@s.whatsapp.net',
          Sender: '11111111111:3@s.whatsapp.net',
          IsFromMe: false,
          IsGroup: false,
          AddressingMode: '',
          SenderAlt: '',
          RecipientAlt: '',
          BroadcastListOwner: '',
          BroadcastRecipients: null,
          MessageIDs: ['3333333333333333333333'],
          Type: '',
          MessageSender: '',
        },
      },
      me: {
        id: '444444444444@c.us',
        lid: '144444444444444@lid',
        jid: '444444444444:42@s.whatsapp.net',
        pushName: '',
      },
      environment: {
        version: '2025.10.4',
        engine: 'GOWS',
        tier: 'PLUS',
        browser: null,
      },
      engine: 'GOWS' as WAHAEngine,
    },
    NOWEB: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack',
      payload: {
        id: 'true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        from: '11111111111@c.us',
        fromMe: true,
        ack: 2,
        ackName: 'DEVICE',
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        pushName: '',
        lid: '1144444444444444@lid',
      },
      engine: 'NOWEB',
      environment: {
        version: '2025.10.4',
        engine: 'NOWEB',
        tier: 'PLUS',
        browser: null,
      },
    },
    WEBJS: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack',
      payload: {
        id: 'true_11111111111@c.us_AAA',
        from: '444444444444@c.us',
        fromMe: true,
        source: 'app',
        to: '11111111111@c.us',
        body: 'Nn',
        hasMedia: false,
        media: null,
        ack: 2,
        ackName: 'DEVICE',
        vCards: [],
        _data: {
          id: {
            fromMe: true,
            remote: '11111111111@c.us',
            id: 'AAA',
            _serialized: 'true_11111111111@c.us_AAA',
          },
          from: '444444444444@c.us',
          to: '11111111111@c.us',
          author: '444444444444@c.us',
          ack: 2,
        },
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        pushName: '',
      },
      engine: 'WEBJS',
      environment: {
        version: '2025.10.4',
        engine: 'WEBJS',
        tier: 'PLUS',
        browser: '/usr/bin/google-chrome-stable',
      },
    },
  },
  {
    name: 'Me read Participant message on another device (READ ack)',
    ShouldMarkAsReadInChatWoot: false,
    ShouldProcessAckInChatWoot: false,
    GOWS: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack' as WAHAEvents,
      payload: {
        id: 'false_11111111111@c.us_3333333333333333333333',
        from: '11111111111@c.us',
        to: null,
        participant: null,
        fromMe: false,
        ack: 3,
        ackName: 'READ',
        _data: {
          Chat: '11111111111@s.whatsapp.net',
          Sender: '444444444444@s.whatsapp.net',
          IsFromMe: true,
          IsGroup: false,
          AddressingMode: '',
          SenderAlt: '',
          RecipientAlt: '',
          BroadcastListOwner: '',
          BroadcastRecipients: null,
          MessageIDs: ['3333333333333333333333'],
          Type: 'read',
          MessageSender: '11111111111@s.whatsapp.net',
        },
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        lid: '144444444444444@lid',
        jid: '444444444444:42@s.whatsapp.net',
        pushName: '',
      },
      environment: {
        version: '2025.10.4',
        engine: 'GOWS',
        tier: 'PLUS',
        browser: null,
      },
      engine: 'GOWS' as WAHAEngine,
    },
    NOWEB: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack',
      payload: {
        id: '11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        from: '11111111111@c.us',
        fromMe: false,
        ack: 3,
        ackName: 'READ',
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        pushName: '',
        lid: '1144444444444444@lid',
      },
      engine: 'NOWEB',
      environment: {
        version: '2025.10.4',
        engine: 'NOWEB',
        tier: 'PLUS',
        browser: null,
      },
    },
    WEBJS: null,
  },
  {
    name: 'Participant read My Group Message (READ ack)',
    ShouldMarkAsReadInChatWoot: false,
    ShouldProcessAckInChatWoot: false,
    GOWS: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      payload: {
        id: 'true_222222222222222222@g.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA_444444444444@c.us',
        from: '222222222222222222@g.us',
        to: '011111111111111@lid',
        participant: '011111111111111@lid',
        fromMe: true,
        ack: 3,
        ackName: 'READ',
        _data: {
          Chat: '222222222222222222@g.us',
          Sender: '011111111111111@lid',
          IsFromMe: false,
          IsGroup: true,
          AddressingMode: '',
          SenderAlt: '',
          RecipientAlt: '',
          BroadcastListOwner: '',
          BroadcastRecipients: null,
          MessageIDs: ['AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
          Type: 'read',
          MessageSender: '',
        },
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        lid: '144444444444444@lid',
        jid: '444444444444:42@s.whatsapp.net',
        pushName: '',
      },
      environment: {
        version: '2025.10.4',
        engine: 'GOWS',
        tier: 'PLUS',
        browser: null,
      },
    },
    NOWEB: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack',
      payload: {
        id: 'true_222222222222222222@g.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA_444444444444@c.us',
        from: '222222222222222222@g.us',
        to: '222222222222222222@g.us',
        participant: '011111111111111@lid',
        fromMe: true,
        ack: 3,
        ackName: 'READ',
        _data: {
          key: {
            remoteJid: '222222222222222222@g.us',
            id: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            fromMe: true,
            participant: '011111111111111@lid',
          },
          receipt: {
            userJid: '011111111111111@lid',
          },
        },
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        pushName: '',
        lid: '1144444444444444@lid',
      },
      engine: 'NOWEB',
      environment: {
        version: '2025.10.4',
        engine: 'NOWEB',
        tier: 'PLUS',
        browser: null,
      },
    },
    WEBJS: {
      id: 'evt_00000000000000000000000000',
      session: 'default',
      event: 'message.ack',
      payload: {
        id: 'true_222222222222222222@g.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA_444444444444@c.us',
        from: '222222222222222222@g.us',
        to: '222222222222222222@g.us',
        participant: '011111111111111@lid',
        fromMe: false,
        ack: 3,
        ackName: 'READ',
        _data: {
          tag: 'receipt',
          attrs: {
            from: {
              $1: {
                type: 0,
                user: '222222222222222222',
                server: 'g.us',
              },
            },
            type: 'read',
            id: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            participant: {
              $1: {
                type: 1,
                user: '011111111111111',
                device: 0,
                domainType: 1,
              },
            },
          },
          content: null,
        },
      },
      metadata: {},
      me: {
        id: '444444444444@c.us',
        pushName: '',
      },
      engine: 'WEBJS',
      environment: {
        version: '2025.10.4',
        engine: 'WEBJS',
        tier: 'PLUS',
        browser: '/usr/bin/google-chrome-stable',
      },
    },
  },
];

const engines = ['GOWS', 'NOWEB', 'WEBJS'];

describe('ShouldMarkAsReadInChatWoot', () => {
  for (const engine of engines) {
    describe(engine, () => {
      for (const param of TestCases) {
        const name = `[${param.ShouldMarkAsReadInChatWoot}] ${param.name}`;
        const event = param[engine];
        const testfn = event ? test : test.skip;
        const expected = param.ShouldMarkAsReadInChatWoot;
        testfn(name, () => {
          // Test
          const result = ShouldMarkAsReadInChatWoot(event);
          expect(result).toBe(expected);
        });
      }
    });
  }
});

describe('ShouldProcessAckInChatWoot', () => {
  for (const engine of engines) {
    describe(engine, () => {
      for (const param of TestCases) {
        const name = `[${param.ShouldProcessAckInChatWoot}] ${param.name}`;
        const event = param[engine];
        const testfn = event ? test : test.skip;
        const expected = param.ShouldProcessAckInChatWoot;
        testfn(name, () => {
          // Test
          const result = ShouldProcessAckInChatWoot(event);
          expect(result).toBe(expected);
        });
      }
    });
  }
});
