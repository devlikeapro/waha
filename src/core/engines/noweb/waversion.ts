import type { WAVersion } from '@adiwajshing/baileys';

export function parseWaVersion(value: string): WAVersion | null {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value.trim());
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function formatWaVersion(version: WAVersion): string {
  return version.join('.');
}

export function isWaVersionHigher(left: WAVersion, right: WAVersion): boolean {
  for (let index = 0; index < 3; index++) {
    if (left[index] !== right[index]) {
      return left[index] > right[index];
    }
  }
  return false;
}
