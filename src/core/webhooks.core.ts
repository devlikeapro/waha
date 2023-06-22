import { ConsoleLogger } from '@nestjs/common';

import { WAHAEvents } from '../structures/enums.dto';
import { WAWebhook } from '../structures/responses.dto';
import { WebhookConfig } from '../structures/webhooks.dto';
import { WhatsappSession } from './abc/session.abc';
import { WebhookConductor, WebhookSender } from './abc/webhooks.abc';
import { NotImplementedByEngineError } from './exceptions';
import request = require('request');

export class WebhookSenderCore extends WebhookSender {
  send(json) {
    this.log.log(`Sending POST to ${this.url}...`);
    this.log.debug(`POST DATA: ${JSON.stringify(json)}`);

    request.post(this.url, { json: json }, (error, res, body) => {
      if (error) {
        this.log.error(error);
        return;
      }
      this.log.log(`POST request was sent with status code: ${res.statusCode}`);
      this.log.verbose(`Response: ${JSON.stringify(body)}`);
    });
  }
}

export class WebhookConductorCore implements WebhookConductor {
  constructor(protected log: ConsoleLogger) {
    this.log = log;
  }

  protected buildSender(webhookConfig: WebhookConfig): WebhookSender {
    return new WebhookSenderCore(this.log, webhookConfig);
  }

  private getSuitableEvents(events: WAHAEvents[] | string[]): WAHAEvents[] {
    const allEvents = Object.values(WAHAEvents);

    // Enable all events if * in the events
    // @ts-ignore
    if (events.includes('*')) {
      return allEvents;
    }

    // Get only known events, log and ignore others
    const rightEvents = [];
    for (const event of events) {
      // @ts-ignore
      if (!allEvents.includes(event)) {
        this.log.error(`Unknown event for webhook: '${event}'`);
        continue;
      }
      rightEvents.push(event);
    }
    return rightEvents;
  }

  public configure(session: WhatsappSession, webhooks: WebhookConfig[]) {
    for (const webhookConfig of webhooks) {
      this.configureSingleWebhook(session, webhookConfig);
    }
  }

  private configureSingleWebhook(
    session: WhatsappSession,
    webhook: WebhookConfig,
  ) {
    if (!webhook || !webhook.url || webhook.events.length === 0) {
      return;
    }

    const url = webhook.url;
    this.log.log(`Configuring webhooks for ${url}...`);
    const events = this.getSuitableEvents(webhook.events);
    const sender = this.buildSender(webhook);
    for (const event of events) {
      try {
        session.subscribe(event, (data: any) =>
          this.callWebhook(event, session, data, sender),
        );
      } catch (error) {
        if (error instanceof NotImplementedByEngineError) {
          this.log.error(error);
        } else {
          throw error;
        }
      }
      this.log.log(`Event '${event}' is enabled for url: ${url}`);
    }
    this.log.log(`Webhooks were configured for ${url}.`);
  }

  public callWebhook(
    event,
    session: WhatsappSession,
    data: any,
    sender: WebhookSender,
  ) {
    const json: WAWebhook = {
      event: event,
      session: session.name,
      payload: data,
      engine: session.engine,
    };
    sender.send(json);
  }
}
