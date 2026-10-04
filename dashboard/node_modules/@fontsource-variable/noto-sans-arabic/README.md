# Fontsource Noto Sans Arabic

[![npm (scoped)](https://img.shields.io/npm/v/@fontsource-variable/noto-sans-arabic?color=brightgreen)](https://www.npmjs.com/package/@fontsource-variable/noto-sans-arabic) [![Generic badge](https://img.shields.io/badge/fontsource-passing-brightgreen)](https://github.com/fontsource/fontsource) [![Monthly downloads](https://badgen.net/npm/dm/@fontsource-variable/noto-sans-arabic)](https://github.com/fontsource/fontsource) [![Total downloads](https://badgen.net/npm/dt/@fontsource-variable/noto-sans-arabic)](https://github.com/fontsource/fontsource)

The CSS and web font files to easily self-host the “Noto Sans Arabic” variable font. Please visit the main [Fontsource website](https://fontsource.org/fonts/noto-sans-arabic) to view more details on this package.

## Quick Installation

Fontsource offers multiple methods to import the CSS, including using a bundler like Vite or using SASS. You can find full documentation [here](https://fontsource.org/docs/getting-started/introduction).

```javascript
npm install @fontsource-variable/noto-sans-arabic
```

Within your app entry file or site component, import it in.

```javascript
import "@fontsource-variable/noto-sans-arabic"; // Defaults to wght axis
import "@fontsource-variable/noto-sans-arabic/wght.css"; // Specify axis
import "@fontsource-variable/noto-sans-arabic/wght-italic.css"; // Specify axis and style
```

Supported variables:
- Weights: `[100,200,300,400,500,600,700,800,900]`
- Styles: `[normal]`
- Subsets: `[arabic,latin,latin-ext,math,symbols]`
- Axes: `[wdth,wght]`

> Note: `italic` may not be supported by all fonts. To learn more about what axes and styles are supported, please visit the [Fontsource website](https://fontsource.org/fonts/noto-sans-arabic).

Finally, you can reference the font name in a CSS stylesheet, CSS Module, or CSS-in-JS.

```css
body {
  font-family: "Noto Sans Arabic Variable";
}
```

## Licensing
Always make sure to read the license for each font you use. Most of the fonts in the collection use the SIL Open Font License, v1.1. Some fonts use the Apache 2 license. The Ubuntu fonts use the Ubuntu Font License v1.0.

Copyright 2022 The Noto Project Authors (https://github.com/notofonts/arabic)
[OFL-1.1](https://openfontlicense.org)

## Other Notes
Font version (provided by source): `v33`.

If you have any suggestions or ideas to improve the performance of font loading or expand the existing library, feel free to star and contribute to this repository. You can share your suggestions or ideas by creating an [issue](https://github.com/fontsource/fontsource/issues).