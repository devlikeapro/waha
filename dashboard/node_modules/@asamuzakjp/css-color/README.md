# CSS color

[![build](https://github.com/asamuzaK/cssColor/actions/workflows/node.js.yml/badge.svg)](https://github.com/asamuzaK/cssColor/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/asamuzaK/cssColor/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/asamuzaK/cssColor/actions/workflows/github-code-scanning/codeql)
[![npm (scoped)](https://img.shields.io/npm/v/@asamuzakjp/css-color)](https://www.npmjs.com/package/@asamuzakjp/css-color)

A robust and modern library to resolve, parse, and convert CSS colors.
Supports the latest CSS Color Module Level 4 & 5 specifications.

## Features

- **Modern CSS Color Support:** Accurately resolves `color-mix()`, `color()`, modern color spaces (`oklch`, `oklab`, `lch`, `lab`, `hwb`, etc.), and relative colors (`lab(from red l a b)`, `color(from red xyz-d50 x y z)`).
- **Deep Resolution:** Deeply resolves `var()` and `calc()` functions embedded within color values.
- **Gradient Parsing:** Supports parsing and validation for `linear-gradient`, `radial-gradient`, and `conic-gradient`.
- **Comprehensive Color Conversion:** Highly accurate converters between HEX, HSL, HWB, LAB, LCH, Oklab, Oklch, RGB, and XYZ color spaces.
- **Bonus Utilities:** Includes convenient functions to validate colors or gradients, extract CSS variables, and safely split CSS values.
- **Used in jsdom:** Adopted as the CSS color parser and resolver for `jsdom`.
- **Pure ESM with TypeScript Ready:** Native ESM (`type: "module"`) with comprehensive TypeScript definitions.

## Install

```console
npm i @asamuzakjp/css-color
```

## Quick Start

```javascript
import { convert, resolve, utils } from '@asamuzakjp/css-color';
```

### Samples

1. Resolve complex modern CSS colors:

```javascript
const resolvedMix = resolve(
  'color-mix(in oklab, lch(67.5345 42.5 258.2), color(srgb 0 0.5 0))'
);
// => 'oklab(0.620754 -0.0931934 -0.00374881)'
```

2. Resolve with Custom Properties and calc():

```javascript
const resolvedVar = resolve('hsl(calc(var(--base-hue) * 3) 100% 50% / .5)', {
  customProperty: { '--base-hue': '210deg' }
});
// => 'rgba(128, 0, 255, 0.5)'
```

3. Convert between color spaces:

```javascript
const hex = convert.colorToHex('lab(46.2775% -47.5621 48.5837)');
// => '#008000'
```

4. Validate colors and gradients:

```javascript
const isColor = utils.isColor('light-dark(red, blue)');
// => true

const isGradient = utils.isGradient(
  'conic-gradient(from 0.5turn at 50% 50%, red, blue)'
);
// => true
```

## API Reference

### `resolve(color, opt?)`

Resolves a CSS color string into its computed or specified value. System colors are not supported.

- **`color`** `<string>`: The CSS color value to resolve.
- **`opt`** `<object>` _(optional)_:
  - `opt.currentColor`: Color to use for the `currentcolor` keyword.
  - `opt.customProperty`: Object containing `--` prefixed keys and their values, or a `callback(propertyName)` function to dynamically resolve CSS variables.
  - `opt.dimension`: Object mapping units (e.g., `em`, `rem`, `vw`) to pixel numbers, or a `callback(unit)` function for dynamic length resolution.
  - `opt.format`: Output format. Options: `computedValue` (default), `specifiedValue`, `hex`, `hexAlpha`.
  - `opt.colorScheme`: `normal` (default), `light`, or `dark` (useful for `light-dark()` resolution).

### `convert`

A collection of color conversion utilities.

<!-- prettier-ignore -->
| Function | Returns | Options | Description |
| :-------------- | :-------------- | :-------------- | :-------------- |
| `convert.colorToHex(value, opt?)` | `string \| null` | `opt.alpha` `<boolean>`<br>_(+ see `resolve` options)_ | Returns `#rrggbb` or `#rrggbbaa` (if `opt.alpha` is true). |
| `convert.colorToHsl(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to HSL channels: `[h, s, l, alpha]` |
| `convert.colorToHwb(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to HWB channels: `[h, w, b, alpha]` |
| `convert.colorToLab(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to CIE LAB channels: `[l, a, b, alpha]` |
| `convert.colorToLch(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to CIE LCH channels: `[l, c, h, alpha]` |
| `convert.colorToOklab(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to Oklab channels: `[l, a, b, alpha]` |
| `convert.colorToOklch(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to Oklch channels: `[l, c, h, alpha]` |
| `convert.colorToRgb(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to sRGB channels: `[r, g, b, alpha]` |
| `convert.colorToXyz(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to CIE XYZ channels (defaults to D65): `[x, y, z, alpha]` |
| `convert.colorToXyzD50(value, opt?)` | `number[]` | _See `resolve` options_ | Converts to CIE XYZ channels with D50 white point. |

### `utils`

Helpful internal tools exposed for advanced usage, parsing, and validation.

<!-- prettier-ignore -->
| Function | Returns | Options (`opt`) | Description |
| :-------------- | :-------------- | :-------------- | :-------------- |
| `utils.cssCalc(value, opt?)` | `string` | `opt.dimension`<br>_(+ see `resolve` options)_ | Resolves CSS `calc()` expressions. |
| `utils.cssVar(value, opt?)` | `string` | `opt.customProperty`<br>_(+ see `resolve` options)_ | Resolves CSS `var()` expressions. |
| `utils.extractDashedIdent(value)` | `string[]` | _None_ | Extracts custom property names (dashed-ident tokens) from a value. |
| `utils.isColor(value, opt?)` | `boolean` | _See `resolve` options_ | Returns `true` if the string is a valid CSS color. |
| `utils.isGradient(value, opt?)` | `boolean` | _See `resolve` options_ | Returns `true` if the string is a valid CSS gradient. |
| `utils.resolveGradient(value, opt?)` | `string` | _See `resolve` options_ | Resolves CSS gradient strings. |
| `utils.resolveLengthInPixels(value, unit, opt?)` | `number` | `opt.dimension`<br>_(+ see `resolve` options)_ | Converts an absolute or relative CSS length to pixels. |
| `utils.splitValue(value, opt?)` | `string[]` | `opt.delimiter` `<string>`<br>`opt.preserveComment` `<boolean>` | Safely splits a CSS value by a specified delimiter (` `, `,`, `/`). |

## Acknowledgments

The following resources have been of great help in the development of this library:

- [csstools/postcss-plugins](https://github.com/csstools/postcss-plugins)
- [lru-cache](https://github.com/isaacs/node-lru-cache)

---

Copyright (c) 2024 [asamuzaK (Kazz)](https://github.com/asamuzaK/)
