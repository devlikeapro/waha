import { Injectable } from '@nestjs/common';
import type { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';

/**
 * Contract for modules contributing session plugins - register the implementation in SessionPluginsService.
 */
export interface SessionPluginsProvider {
  plugins(session: WhatsappSession): PluginOptions[];
}

/**
 * Collects session plugins from modules, so the session manager can add them without importing the modules.
 */
@Injectable()
export class SessionPluginsService {
  private providers: SessionPluginsProvider[] = [];

  register(provider: SessionPluginsProvider): void {
    this.providers.push(provider);
  }

  plugins(session: WhatsappSession): PluginOptions[] {
    return this.providers.flatMap((provider) => provider.plugins(session));
  }
}
