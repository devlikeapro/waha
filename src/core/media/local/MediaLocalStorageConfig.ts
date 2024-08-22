import { Injectable } from '@nestjs/common';
import { WhatsappConfigService } from '@waha/config.service';

@Injectable()
export class MediaLocalStorageConfig {
  public filesUri = '/api/files';

  constructor(private config: WhatsappConfigService) {}

  get filesURL(): string {
    return `${this.config.schema}://${this.config.hostname}:${this.config.port}${this.filesUri}/`;
  }

  get filesFolder(): string {
    return this.config.get('WHATSAPP_FILES_FOLDER', '/tmp/whatsapp-files');
  }

  get filesLifetime(): number {
    return parseInt(this.config.get('WHATSAPP_FILES_LIFETIME', '180'));
  }
}
