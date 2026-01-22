import { Injectable } from '@nestjs/common';
import { WhatsappConfigService } from '@waha/config.service';
import * as path from 'path';

@Injectable()
export class MediaLocalStorageConfig {
  public filesUri = '/api/files';

  constructor(private config: WhatsappConfigService) {}

  get filesURL(): string {
    return `${this.config.baseUrl}${this.filesUri}/`;
  }

  get filesFolder(): string {
    const configured = this.config.get('WHATSAPP_FILES_FOLDER', '');
    if (!configured) {
      return '/tmp/whatsapp-files';
    }
    if (path.isAbsolute(configured)) {
      return configured;
    }
    return path.resolve(process.cwd(), configured);
  }

  get filesLifetime(): number {
    return parseInt(this.config.get('WHATSAPP_FILES_LIFETIME', '180'));
  }
}
