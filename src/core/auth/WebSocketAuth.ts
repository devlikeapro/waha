import { Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import { ApiKeyStrategy } from '@waha/core/auth/apiKey.strategy';

@Injectable()
export class WebSocketAuth {
  constructor(private strategy: ApiKeyStrategy) {}

  async validateRequest(request: IncomingMessage) {
    const apikey = this.getKeyFromQueryParams('x-api-key', request);
    return await this.strategy.user(apikey);
  }

  private getKeyFromQueryParams(name: string, request: IncomingMessage) {
    // Case-insensitive
    name = name.toLowerCase();
    const query = new URL(request.url || '', 'http://localhost').searchParams;
    const matches: string[] = [];

    for (const [key, value] of query.entries()) {
      if (key.toLowerCase() === name) {
        matches.push(value);
      }
    }

    if (matches.length === 0) {
      return undefined;
    }
    return matches[0];
  }
}
