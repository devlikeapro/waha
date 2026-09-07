import { Injectable } from '@nestjs/common';
import type { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';
import { SessionPluginsProvider } from '@waha/plugins/SessionPluginsService';
import { MaintainOnlineStatusConfigService } from '@waha/modules/waha-maintain-online-status/maintain-online-status.config';
import { MaintainOnlineStatusPlugin } from '@waha/modules/waha-maintain-online-status/MaintainOnlineStatusPlugin';

@Injectable()
export class MaintainOnlineStatusPluginsProvider
  implements SessionPluginsProvider
{
  constructor(private config: MaintainOnlineStatusConfigService) {}

  plugins(session: WhatsappSession): PluginOptions[] {
    return [
      MaintainOnlineStatusPlugin.with({ duration: this.config.duration }, null),
    ];
  }
}
