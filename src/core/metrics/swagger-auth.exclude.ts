import * as lodash from 'lodash';
import { WAHA_METRICS_PATH } from '@waha/core/metrics/prometheus.registry';

export function swaggerBasicAuthExcludePaths(
  dashboardUri: string,
  extraFullPaths: string[],
): string[] {
  return lodash.uniq([
    '/api/',
    '/mcp',
    dashboardUri,
    '/health',
    '/ping',
    WAHA_METRICS_PATH,
    '/ws',
    '/webhooks/',
    '/jobs',
    '/jobs/',
    ...extraFullPaths,
  ]);
}
