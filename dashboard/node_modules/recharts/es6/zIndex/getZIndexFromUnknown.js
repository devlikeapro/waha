import { isWellBehavedNumber } from '../util/isWellBehavedNumber';
export function getZIndexFromUnknown(input, defaultZIndex) {
  if (input && typeof input === 'object' && 'zIndex' in input && typeof input.zIndex === 'number' && isWellBehavedNumber(input.zIndex)) {
    return input.zIndex;
  }
  return defaultZIndex;
}