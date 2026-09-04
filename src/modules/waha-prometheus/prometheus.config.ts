import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseBool } from '@waha/helpers';
import { WAHAEvents, WAHAEventsWild } from '@waha/structures/enums.dto';
import { EventWildUnmask } from '@waha/utils/events';
import * as Joi from 'joi';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

enum Env {
  WAHA_PROMETHEUS_ENABLED = 'WAHA_PROMETHEUS_ENABLED',
  WAHA_PROMETHEUS_PATH = 'WAHA_PROMETHEUS_PATH',
  WAHA_PROMETHEUS_METRIC_PREFIX = 'WAHA_PROMETHEUS_METRIC_PREFIX',
  WAHA_PROMETHEUS_HTTP_DURATION_BUCKETS = 'WAHA_PROMETHEUS_HTTP_DURATION_BUCKETS',
  WAHA_PROMETHEUS_USERNAME = 'WAHA_PROMETHEUS_USERNAME',
  WAHA_PROMETHEUS_PASSWORD = 'WAHA_PROMETHEUS_PASSWORD',
  WAHA_PROMETHEUS_TRACK_EVENTS = 'WAHA_PROMETHEUS_TRACK_EVENTS',
}

const DEFAULT_PATH = '/metrics';
const DEFAULT_METRIC_PREFIX = 'waha_';
const DEFAULT_HTTP_DURATION_BUCKETS = [
  0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30,
];

export const PrometheusEnvSchema = Joi.object({
  [Env.WAHA_PROMETHEUS_ENABLED]: Joi.boolean().truthy('1').falsy('0'),
  [Env.WAHA_PROMETHEUS_PATH]: Joi.string().pattern(/^\//).allow(''),
  [Env.WAHA_PROMETHEUS_METRIC_PREFIX]: Joi.string().allow(''),
  [Env.WAHA_PROMETHEUS_HTTP_DURATION_BUCKETS]: Joi.string()
    .pattern(/^\d+(\.\d+)?(,\d+(\.\d+)?)*$/)
    .allow(''),
  [Env.WAHA_PROMETHEUS_USERNAME]: Joi.string().allow(''),
  [Env.WAHA_PROMETHEUS_PASSWORD]: Joi.string().allow(''),
  [Env.WAHA_PROMETHEUS_TRACK_EVENTS]: Joi.string().allow(''),
});

export function isPrometheusEnabled(env: NodeJS.ProcessEnv): boolean {
  const value = env[Env.WAHA_PROMETHEUS_ENABLED];
  if (!value) {
    return false;
  }
  return parseBool(value);
}

export function getPrometheusPath(): string {
  return process.env[Env.WAHA_PROMETHEUS_PATH] || DEFAULT_PATH;
}

@Injectable()
export class PrometheusConfigService {
  private eventUnmask = new EventWildUnmask(WAHAEvents, WAHAEventsWild);

  constructor(
    private configService: ConfigService,
    @InjectPinoLogger(PrometheusConfigService.name)
    private logger: PinoLogger,
  ) {}

  get path(): string {
    return getPrometheusPath();
  }

  get metricPrefix(): string {
    return this.configService.get(
      Env.WAHA_PROMETHEUS_METRIC_PREFIX,
      DEFAULT_METRIC_PREFIX,
    );
  }

  get httpDurationBuckets(): number[] {
    const value = this.configService.get(
      Env.WAHA_PROMETHEUS_HTTP_DURATION_BUCKETS,
      '',
    );
    if (!value) {
      return DEFAULT_HTTP_DURATION_BUCKETS;
    }
    return value.split(',').map((bucket) => parseFloat(bucket));
  }

  get events(): WAHAEvents[] {
    const value = this.configService.get(Env.WAHA_PROMETHEUS_TRACK_EVENTS, '');
    if (!value) {
      return [WAHAEvents.MESSAGE_ANY];
    }
    const names = value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    const result = this.eventUnmask.unmask(names);
    if (result.unknown.length > 0) {
      throw new Error(
        `${
          Env.WAHA_PROMETHEUS_TRACK_EVENTS
        } - unknown events '${result.unknown.join(', ')}', ` +
          `expected '*' or: ${Object.values(WAHAEvents).join(', ')}`,
      );
    }
    return result.events as WAHAEvents[];
  }

  get credentials(): [string, string] | null {
    const username = this.configService.get(Env.WAHA_PROMETHEUS_USERNAME, '');
    const password = this.configService.get(Env.WAHA_PROMETHEUS_PASSWORD, '');
    if (!username && !password) {
      return null;
    }
    if (!username || !password) {
      this.logger.warn(
        'Set up both WAHA_PROMETHEUS_USERNAME and WAHA_PROMETHEUS_PASSWORD ' +
          'to enable metrics endpoint authentication.',
      );
      return null;
    }
    return [username, password];
  }
}
