/**
 * Both helpers detect the unit by magnitude, using 1e12 as the threshold:
 * as unix SECONDS 1e12 is year 33658, as unix MILLISECONDS it's Sep 2001 - so any realistic "now-ish"
 * timestamp is below 1e12 in seconds and above it in milliseconds.
 */

/**
 * Normalize a unix timestamp to SECONDS.
 * Milliseconds get converted (floored), values already in seconds pass through unchanged.
 *
 * EnsureSeconds(1784477333) => 1784477333 (already seconds)
 * EnsureSeconds(1784477333000) => 1784477333 (ms => seconds)
 */
export function EnsureSeconds(ms: number) {
  if (!ms) {
    return ms;
  }
  if (ms >= 1e12) {
    return Math.floor(ms / 1000);
  }
  return ms;
}

/**
 * Normalize a unix timestamp to MILLISECONDS. Seconds get converted, values already in milliseconds pass through unchanged.
 *
 * EnsureMilliseconds(1784477333) => 1784477333000 (seconds => ms)
 * EnsureMilliseconds(1784477333000) => 1784477333000 (already ms)
 */
export function EnsureMilliseconds(seconds: number) {
  if (!seconds) {
    return seconds;
  }
  if (seconds < 1e12) {
    return seconds * 1000;
  }
  return seconds;
}
