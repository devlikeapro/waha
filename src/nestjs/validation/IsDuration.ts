import { registerDecorator, ValidationOptions } from 'class-validator';
import * as ms from 'ms';

/**
 * Parse a human duration ('30m', '24h', '7d') into milliseconds.
 * Returns null when the value is not a valid non-negative duration.
 */
export function parseDurationMs(value: any): number | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }
  let duration: number | undefined;
  try {
    duration = ms(value as ms.StringValue);
  } catch {
    return null;
  }
  if (typeof duration !== 'number' || Number.isNaN(duration) || duration < 0) {
    return null;
  }
  return duration;
}

export function IsDuration(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDuration',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return parseDurationMs(value) !== null;
        },
        defaultMessage() {
          return 'must be a duration string like "30m", "24h" or "7d".';
        },
      },
    });
  };
}
