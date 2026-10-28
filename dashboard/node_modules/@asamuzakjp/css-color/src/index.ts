/*!
 * CSS color - Resolve, parse, convert CSS color.
 * @license MIT
 * @copyright asamuzaK (Kazz)
 * @see {@link https://github.com/asamuzaK/cssColor/blob/main/LICENSE}
 */

import { cssCalc, cssVar } from './js/css-calc-var';
import { isGradient, resolveGradient } from './js/css-gradient';
import { isColor } from './js/resolve';
import {
  extractDashedIdent,
  resolveLengthInPixels,
  splitValue
} from './js/util';

export { convert } from './js/convert';
export { resolve } from './js/resolve';
/* utils */
export const utils = {
  cssCalc,
  cssVar,
  extractDashedIdent,
  isColor,
  isGradient,
  resolveGradient,
  resolveLengthInPixels,
  splitValue
};
