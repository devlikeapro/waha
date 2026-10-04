export function isWellBehavedNumber(n) {
  return Number.isFinite(n);
}
export function isPositiveNumber(n) {
  return typeof n === 'number' && n > 0 && Number.isFinite(n);
}