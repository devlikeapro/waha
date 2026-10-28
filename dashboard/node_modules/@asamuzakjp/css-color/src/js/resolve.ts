/**
 * resolve
 */

import { createCacheKey, getCache, setCache } from './cache';
import {
  NAMED_COLORS,
  convertRgbToHex,
  resolveColorFunc,
  resolveColorMix,
  resolveColorValue
} from './color';
import { isString } from './common';
import { cssCalc, resolveVar } from './css-calc-var';
import { resolveRelativeColor } from './relative-color';
import { splitValue } from './util';
import {
  ComputedColorChannels,
  Options,
  SpecifiedColorChannels
} from './typedef';

/* constants */
import {
  FN_COLOR,
  FN_MIX,
  SYN_COLOR_TYPE,
  SYN_FN_CALC,
  SYN_FN_LIGHT_DARK,
  SYN_FN_REL,
  SYN_FN_VAR,
  SYN_MIX,
  VAL_COMP,
  VAL_SPEC
} from './constant';
const NAMESPACE = 'resolve';
const RGB_TRANSPARENT = 'rgba(0, 0, 0, 0)';

/* regexp */
const REG_COLOR = new RegExp(`^(?:${SYN_COLOR_TYPE})$`);
const REG_FN_CALC = new RegExp(SYN_FN_CALC);
const REG_FN_COLOR =
  /^(?:(?:ok)?l(?:ab|ch)|color(?:-mix)?|hsla?|hwb|rgba?|var)\(/;
const REG_FN_LIGHT_DARK = new RegExp(SYN_FN_LIGHT_DARK);
const REG_FN_REL = new RegExp(SYN_FN_REL);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);
const REG_MIX = new RegExp(SYN_MIX);

/**
 * resolve color
 * @param value - CSS color value
 * @param opt - options
 * @returns resolved color
 */
export const resolveColor = (
  value: string,
  opt: Options = {}
): string | null => {
  if (!isString(value)) {
    throw new TypeError(`${value} is not a string.`);
  }
  value = value.trim();
  const {
    colorScheme = 'normal',
    currentColor = '',
    format = VAL_COMP,
    nullable = false
  } = opt;
  const cacheKey: string = createCacheKey(
    { namespace: NAMESPACE, name: 'resolve', value },
    opt
  );
  const cachedResult = getCache(cacheKey);
  if (cachedResult !== false) {
    return cachedResult.item as string | null;
  }
  // 1. var() resolution
  if (REG_FN_VAR.test(value)) {
    if (format === VAL_SPEC) {
      setCache(cacheKey, value);
      return value;
    }
    const resolvedVar = resolveVar(value, opt);
    if (resolvedVar === null) {
      const res =
        format === 'hex' || format === 'hexAlpha' || nullable
          ? null
          : RGB_TRANSPARENT;
      setCache(cacheKey, res);
      return res;
    }
    value = resolvedVar;
  }
  if (opt.format !== format) {
    opt.format = format;
  }
  value = value.toLowerCase();
  // 2. light-dark() resolution
  if (REG_FN_LIGHT_DARK.test(value) && value.endsWith(')')) {
    const colorParts = value.replace(REG_FN_LIGHT_DARK, '').replace(/\)$/, '');
    const [light = '', dark = ''] = splitValue(colorParts, { delimiter: ',' });
    if (light && dark) {
      if (format === VAL_SPEC) {
        const lightColor = resolveColor(light, opt);
        const darkColor = resolveColor(dark, opt);
        const res =
          lightColor && darkColor
            ? `light-dark(${lightColor}, ${darkColor})`
            : '';
        setCache(cacheKey, res);
        return res;
      }
      const chosen = colorScheme === 'dark' ? dark : light;
      const resolved = resolveColor(chosen, opt);
      const res = resolved === null && !nullable ? RGB_TRANSPARENT : resolved;
      setCache(cacheKey, res);
      return res;
    }
    // fallback for invalid light-dark
    let invalidRes;
    if (format === VAL_SPEC) {
      invalidRes = '';
    } else if (format === 'hex' || format === 'hexAlpha') {
      invalidRes = null;
    } else {
      invalidRes = RGB_TRANSPARENT;
    }
    setCache(cacheKey, invalidRes);
    return invalidRes;
  }
  // 3. Relative Color resolution
  if (REG_FN_REL.test(value)) {
    const resolvedRel = resolveRelativeColor(value, opt, resolveColor);
    if (format === VAL_COMP) {
      const res =
        resolvedRel === null && !nullable ? RGB_TRANSPARENT : resolvedRel;
      setCache(cacheKey, res);
      return res;
    }
    if (format === VAL_SPEC) {
      const res = resolvedRel === null ? '' : resolvedRel;
      setCache(cacheKey, res);
      return res;
    }
    value = resolvedRel === null ? '' : resolvedRel;
  }
  // 4. calc() resolution
  if (REG_FN_CALC.test(value)) {
    value = cssCalc(value, opt);
  }
  // 5. Keyword & Color-space resolution
  let cs = '';
  let r = NaN;
  let g = NaN;
  let b = NaN;
  let alpha = NaN;
  if (value === 'transparent') {
    let res: string | null;
    switch (format) {
      case VAL_SPEC: {
        res = value;
        break;
      }
      case 'hex': {
        res = null;
        break;
      }
      case 'hexAlpha': {
        res = '#00000000';
        break;
      }
      default: {
        res = RGB_TRANSPARENT;
      }
    }
    setCache(cacheKey, res);
    return res;
  }
  if (value === 'currentcolor') {
    if (format === VAL_SPEC) {
      setCache(cacheKey, value);
      return value;
    }
    if (currentColor) {
      let resolvedCurrent;
      if (currentColor.startsWith(FN_MIX)) {
        resolvedCurrent = resolveColorMix(currentColor, opt, resolveColor);
      } else if (currentColor.startsWith(FN_COLOR)) {
        resolvedCurrent = resolveColorFunc(currentColor, opt);
      } else {
        resolvedCurrent = resolveColorValue(currentColor, opt);
      }
      if (resolvedCurrent === null) {
        setCache(cacheKey, null);
        return null;
      }
      [cs, r, g, b, alpha] = resolvedCurrent as ComputedColorChannels;
    } else {
      // value is handled below if not VAL_COMP
      const res = format === VAL_COMP ? RGB_TRANSPARENT : value;
      if (format === VAL_COMP) {
        setCache(cacheKey, res);
        return res;
      }
    }
  } else if (format === VAL_SPEC) {
    let res = '';
    if (value.startsWith(FN_MIX)) {
      const mixRes = resolveColorMix(value, opt, resolveColor);
      if (mixRes && isString(mixRes)) {
        res = mixRes;
      }
    } else if (value.startsWith(FN_COLOR)) {
      const funcRes = resolveColorFunc(value, opt);
      if (Array.isArray(funcRes)) {
        const [scs, rr, gg, bb, aa] = funcRes as SpecifiedColorChannels;
        res =
          aa === 1
            ? `color(${scs} ${rr} ${gg} ${bb})`
            : `color(${scs} ${rr} ${gg} ${bb} / ${aa})`;
      }
    } else {
      const rgb = resolveColorValue(value, opt);
      if (Array.isArray(rgb)) {
        const [scs, rr, gg, bb, aa] = rgb as SpecifiedColorChannels;
        if (scs === 'rgb') {
          res =
            aa === 1
              ? `${scs}(${rr}, ${gg}, ${bb})`
              : `${scs}a(${rr}, ${gg}, ${bb}, ${aa})`;
        } else {
          res =
            aa === 1
              ? `${scs}(${rr} ${gg} ${bb})`
              : `${scs}(${rr} ${gg} ${bb} / ${aa})`;
        }
      } else if (rgb) {
        res = rgb;
      }
    }
    setCache(cacheKey, res);
    return res;
  } else if (value.startsWith(FN_MIX)) {
    if (currentColor) {
      value = value.replace(/currentcolor/g, currentColor);
    }
    value = value.replace(/transparent/g, RGB_TRANSPARENT);
    const resolvedMix = resolveColorMix(value, opt, resolveColor);
    if (resolvedMix === null) {
      setCache(cacheKey, null);
      return null;
    }
    [cs, r, g, b, alpha] = resolvedMix as ComputedColorChannels;
  } else if (value.startsWith(FN_COLOR)) {
    const resolvedFunc = resolveColorFunc(value, opt);
    if (resolvedFunc === null) {
      setCache(cacheKey, null);
      return null;
    }
    [cs, r, g, b, alpha] = resolvedFunc as ComputedColorChannels;
  } else if (value) {
    const resolvedVal = resolveColorValue(value, opt);
    if (resolvedVal === null) {
      setCache(cacheKey, null);
      return null;
    }
    [cs, r, g, b, alpha] = resolvedVal as ComputedColorChannels;
  }
  // 6. Format Finalization
  let finalRes: string | null = '';
  switch (format) {
    case 'hex':
    case 'hexAlpha': {
      if (
        Number.isNaN(r) ||
        Number.isNaN(g) ||
        Number.isNaN(b) ||
        Number.isNaN(alpha) ||
        (format === 'hex' && alpha === 0)
      ) {
        finalRes = null;
      } else {
        finalRes = convertRgbToHex([r, g, b, format === 'hex' ? 1 : alpha]);
      }
      break;
    }
    default: {
      if (cs === 'rgb') {
        finalRes =
          alpha === 1
            ? `${cs}(${r}, ${g}, ${b})`
            : `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
      } else if (['lab', 'lch', 'oklab', 'oklch'].includes(cs)) {
        finalRes =
          alpha === 1
            ? `${cs}(${r} ${g} ${b})`
            : `${cs}(${r} ${g} ${b} / ${alpha})`;
      } else {
        finalRes =
          alpha === 1
            ? `color(${cs} ${r} ${g} ${b})`
            : `color(${cs} ${r} ${g} ${b} / ${alpha})`;
      }
    }
  }
  setCache(cacheKey, finalRes);
  return finalRes;
};

/**
 * resolve CSS color
 * @param value - CSS color value. system colors are not supported
 * @param opt - options
 * @returns resolved value
 */
export const resolve = (value: string, opt: Options = {}): string | null => {
  opt.nullable = false;
  return resolveColor(value, opt);
};

/**
 * is color
 * @param value - CSS value
 * @param opt - options
 * @returns result
 */
export const isColor = (value: unknown, opt: Options = {}): boolean => {
  if (!isString(value)) {
    return false;
  }
  const str = value.toLowerCase().trim();
  if (!str) {
    return false;
  }
  if (/^[a-z]+$/.test(str)) {
    return (
      str === 'currentcolor' ||
      str === 'transparent' ||
      Object.hasOwn(NAMED_COLORS, str)
    );
  }
  if (REG_COLOR.test(str) || REG_MIX.test(str)) {
    return true;
  }
  if (REG_FN_COLOR.test(str)) {
    const colorOpt = { ...opt, nullable: true };
    if (!colorOpt.format) colorOpt.format = VAL_SPEC;
    return !!resolveColor(str, colorOpt);
  }
  return false;
};
