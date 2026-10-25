import {
  buildContainerEnvironment,
  type GatewayEnv,
} from './gateway';

// Cloudflare Container label names are limited to 16 UTF-8 bytes.
export const RUNTIME_REVISION_LABEL = 'waha.runtime';
const UTF8 = new TextEncoder();

interface ContainerInfoLike {
  labels: Record<string, string>;
}

interface ContainerStartOptionsLike {
  enableInternet: boolean;
  env: Record<string, string>;
  labels: Record<string, string>;
}

export interface ManagedContainer {
  readonly running: boolean;
  destroy(): Promise<void>;
  inspect(): Promise<ContainerInfoLike | null>;
  setInactivityTimeout(durationMs: number): Promise<void>;
  start(options: ContainerStartOptionsLike): void;
}

export async function ensureConfiguredContainer(
  container: ManagedContainer,
  env: GatewayEnv,
  inactivityTimeoutMs: number,
): Promise<'replaced' | 'reused' | 'started'> {
  const containerEnvironment = buildContainerEnvironment(env);
  const runtimeFingerprint = await computeRuntimeFingerprint(env);
  let outcome: 'replaced' | 'reused' | 'started' = 'started';

  if (container.running) {
    const info = await container.inspect();
    if (
      info?.labels[RUNTIME_REVISION_LABEL] === runtimeFingerprint
    ) {
      outcome = 'reused';
    } else {
      await container.destroy();
      outcome = 'replaced';
    }
  }

  if (outcome !== 'reused') {
    container.start({
      enableInternet: true,
      env: containerEnvironment,
      labels: {
        [RUNTIME_REVISION_LABEL]: runtimeFingerprint,
      },
    });
  }

  await container.setInactivityTimeout(inactivityTimeoutMs);
  return outcome;
}

export async function computeRuntimeFingerprint(
  env: GatewayEnv,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    UTF8.encode(env.WAHA_API_KEY),
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign'],
  );
  const material = [
    env.WAHA_CONFIG_REVISION,
    env.WAHA_DISABLED_DASHBOARD_PASSWORD,
    env.WAHA_DISABLED_SWAGGER_PASSWORD,
    env.WHATSAPP_SESSIONS_POSTGRESQL_URL,
  ].join('\u0000');
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    UTF8.encode(material),
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export function keepaliveBackoffMs(failures: number): number {
  const boundedFailures = Math.max(1, Math.min(Math.floor(failures), 8));
  return Math.min(15 * 60 * 1000 * 2 ** (boundedFailures - 1), 60 * 60 * 1000);
}
