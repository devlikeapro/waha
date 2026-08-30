export const WAHA_METRICS_PATH = '/metrics';
export const WAHA_METRICS_PREFIX = 'waha_';
export const WAHA_HTTP_DURATION_BUCKETS = [
  0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30,
];

export function isMetricsPath(path: string): boolean {
  if (!path) {
    return false;
  }
  const pathname = path.split('?')[0];
  return (
    pathname === WAHA_METRICS_PATH ||
    pathname.startsWith(`${WAHA_METRICS_PATH}/`)
  );
}
