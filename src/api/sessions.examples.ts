import { AppName } from '@waha/apps/app_sdk/apps/apps';

export const SessionExamples = {
  basic: {
    summary: 'Basic Session',
    value: {
      name: 'default',
    },
  },
  withWebhooks: {
    summary: 'Session Webhooks',
    value: {
      name: 'default',
      config: {
        webhooks: [
          {
            url: 'https://example.com/webhooks/waha',
            events: ['message', 'session.status'],
            hmac: {
              key: 'super-secret',
            },
            retries: {
              delaySeconds: 2,
              attempts: 5,
              policy: 'linear',
            },
            customHeaders: [
              {
                name: 'X-Request-ID',
                value: '123',
              },
            ],
          },
        ],
      },
    },
  },
  withApps: {
    summary: 'Session Apps',
    value: {
      name: 'default',
      apps: [
        {
          app: AppName.calls,
          id: 'app_unique_id',
          session: '',
          config: {
            dm: {
              reject: true,
              message:
                "📞❌ We don't take calls right now.\n🎤 Please send a voice message or 📝 text — we'll reply ASAP!",
            },
            group: {
              reject: true,
              message:
                "📞❌ We don't take calls right now.\n🎤 Please send a voice message or 📝 text — we'll reply ASAP!",
            },
          },
        },
      ],
      start: true,
    },
  },
  full: {
    summary: 'Full Session Example',
    value: {
      name: 'default',
      start: true,
      config: {
        metadata: {
          'user.id': '123',
        },
        debug: true,
        webhooks: [
          {
            url: 'https://example.com/webhooks/waha',
            events: ['message', 'session.status'],
            hmac: {
              key: 'super-secret',
            },
          },
        ],
      },
      apps: [
        {
          app: AppName.calls,
          enabled: true,
          config: {
            dm: {
              reject: true,
              message:
                "📞❌ We don't take calls right now.\n🎤 Please send a voice message or 📝 text — we'll reply ASAP!",
            },
            group: {
              reject: true,
            },
          },
        },
      ],
    },
  },
};
