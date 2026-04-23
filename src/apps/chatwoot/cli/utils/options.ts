import * as ms from 'ms';
import { Option } from 'commander';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';

/**
 * Parse human string into milliseconds
 */
export function ParseMS(value: string) {
  const duration = ms(value as ms.StringValue);
  if (duration == null) throw new Error(`Invalid duration: "${value}"`);
  if (duration < 0) throw new Error(`Duration cannot be negative: "${value}"`);
  return duration;
}

export function ParseSeconds(value: string): number {
  const duration = ParseMS(value);
  return Math.floor(duration / 1000);
}

export class JobAttemptsOption extends Option {
  constructor(l: Locale, def: number) {
    super('--at, --attempts <number>', l.r('cli.cmd.options.job.attempts'));
    this.argParser(NotNegativeNumber);
    this.default(def);
  }
}

export class JobTimeoutOption extends Option {
  constructor(l: Locale, def: string) {
    super('-t, --timeout <duration>', l.r('cli.cmd.options.job.timeout'));
    this.argParser(ParseMS);
    this.default(ParseMS(def));
  }
}

export function ProgressOption(
  description: string,
  def: number = 1000,
): Option {
  return new Option('-p, --progress [number]', description)
    .argParser(NotNegativeNumber)
    .default(def);
}

export function NotNegativeNumber(value: string): number {
  const n = parseInt(value, 10);
  if (isNaN(n)) {
    throw new Error(`Invalid number: "${value}"`);
  }
  if (n < 0) {
    throw new Error(`Number must be positive or 0: "${value}"`);
  }
  return n;
}

export function PositiveNumber(value: string): number {
  const n = parseInt(value, 10);
  if (isNaN(n)) {
    throw new Error(`Invalid number: "${value}"`);
  }
  if (n <= 0) {
    throw new Error(`Number must be positive: "${value}"`);
  }
  return n;
}
