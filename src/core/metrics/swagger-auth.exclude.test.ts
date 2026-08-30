import { swaggerBasicAuthExcludePaths } from '@waha/core/metrics/swagger-auth.exclude';

describe('swaggerBasicAuthExcludePaths', () => {
  test('keeps ping and metrics public', () => {
    const paths = swaggerBasicAuthExcludePaths('/dashboard', ['/custom']);
    expect(paths).toContain('/ping');
    expect(paths).toContain('/metrics');
    expect(paths).toContain('/jobs');
    expect(paths).toContain('/custom');
    expect(paths).toContain('/dashboard');
  });
});
