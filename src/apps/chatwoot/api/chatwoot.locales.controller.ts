import { Controller, Get } from '@nestjs/common';
import { sortBy } from 'lodash';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { i18n } from '@waha/apps/chatwoot/i18n';

interface LanguageResponse {
  name: string;
  locale: string;
}

@Controller('api/apps/chatwoot')
@ApiSecurity('api_key')
export class ChatwootLocalesController {
  @Get('locales')
  @ApiOperation({
    summary: 'Get available languages for Chatwoot app',
    description: 'Get available languages for Chatwoot app',
  })
  getLanguages(): LanguageResponse[] {
    const locales = i18n.available();
    const priority = ['en-US', 'pt-BR', 'es-ES'];
    return sortBy(locales, [
      (x) => {
        const idx = priority.indexOf(x.locale);
        return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
      },
      'locale',
    ]);
  }
}
