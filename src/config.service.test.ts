import { ConfigService } from '@nestjs/config';
import { WhatsappConfigService } from '@waha/config.service';

function serviceWith(value: string | undefined): WhatsappConfigService {
  const configService = {
    get: (key: string, defaultValue?: string) => {
      if (key === 'WAHA_PROMETHEUS_ENABLED') {
        if (value === undefined) {
          return defaultValue;
        }
        return value;
      }
      return defaultValue;
    },
  } as ConfigService;
  return new WhatsappConfigService(configService);
}

describe('WhatsappConfigService.prometheusEnabled', () => {
  test('defaults to false', () => {
    expect(serviceWith(undefined).prometheusEnabled).toBe(false);
    expect(serviceWith('').prometheusEnabled).toBe(false);
    expect(serviceWith('false').prometheusEnabled).toBe(false);
    expect(serviceWith('0').prometheusEnabled).toBe(false);
  });

  test('accepts true and 1', () => {
    expect(serviceWith('true').prometheusEnabled).toBe(true);
    expect(serviceWith('1').prometheusEnabled).toBe(true);
    expect(serviceWith('TRUE').prometheusEnabled).toBe(true);
  });
});
