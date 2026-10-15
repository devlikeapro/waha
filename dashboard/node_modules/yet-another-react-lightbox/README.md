<div align="center">

<img alt="" src=".github/assets/logo.webp" width="180" height="180" />

# Yet Another React Lightbox

[![NPM Version](https://img.shields.io/npm/v/yet-another-react-lightbox.svg?color=blue)](https://www.npmjs.com/package/yet-another-react-lightbox)
[![Bundle Size](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.npmjs.org%2Fyet-another-react-lightbox%2Flatest&query=%24.bundleSize&label=bundle%20size&color=blue&cacheSeconds=3600)](https://github.com/igordanchenko/yet-another-react-lightbox/blob/main/.size-limit.json)
[![License MIT](https://img.shields.io/npm/l/yet-another-react-lightbox.svg?color=blue)](https://github.com/igordanchenko/yet-another-react-lightbox/blob/main/LICENSE)

Modern React lightbox component. Performant, easy to use, customizable, and
extendable.

</div>

## Overview

- **Built for React:** works with React 19, 18, 17, and 16.8.0+
- **UX:** supports keyboard, mouse, touchpad, and touchscreen navigation
- **Preloading:** never displays partially downloaded images
- **Performance:** preloads limited number of images without compromising
  performance or UX
- **Responsive:** responsive images with automatic resolution switching are
  supported out of the box
- **Video:** video slides are supported via an optional plugin
- **Zoom:** image zoom is supported via an optional plugin
- **Customization:** customize any UI element or add your own custom slides
- **No bloat:** never bundle rarely used features; add optional features via
  plugins
- **TypeScript:** type definitions come built-in with the package
- **RTL:** compatible with RTL layout

![Yet Another React Lightbox | Example](https://images.yet-another-react-lightbox.com/example.jpg)

## Documentation

[https://yet-another-react-lightbox.com/documentation](https://yet-another-react-lightbox.com/documentation)

## Examples

[https://yet-another-react-lightbox.com/examples](https://yet-another-react-lightbox.com/examples)

## Changelog

[https://github.com/igordanchenko/yet-another-react-lightbox/releases](https://github.com/igordanchenko/yet-another-react-lightbox/releases)

## Installation

```shell
npm install yet-another-react-lightbox
```

## Minimal Setup Example

```jsx
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          { src: "/image1.jpg" },
          { src: "/image2.jpg" },
          { src: "/image3.jpg" },
        ]}
      />
    </>
  );
}
```

## Recommended Setup

Unlike many other lightbox libraries, Yet Another React Lightbox is not limited
to just two images per slide ("thumbnail" and "original" / "full size").
Instead, we favor responsive images with automatic resolution switching and
recommend you provide multiple files of different resolutions for each image
slide. Yet Another React Lightbox automatically populates `srcset` / `sizes`
attributes and lets the user's browser decide which image is more appropriate
for its viewport size.

```jsx
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          {
            src: "/image1x3840.jpg",
            alt: "image 1",
            width: 3840,
            height: 2560,
            srcSet: [
              { src: "/image1x320.jpg", width: 320, height: 213 },
              { src: "/image1x640.jpg", width: 640, height: 427 },
              { src: "/image1x1200.jpg", width: 1200, height: 800 },
              { src: "/image1x2048.jpg", width: 2048, height: 1365 },
              { src: "/image1x3840.jpg", width: 3840, height: 2560 },
            ],
          },
          // ...
        ]}
      />
    </>
  );
}
```

You can also integrate 3rd-party image components (e.g., Next.js Image or Gatsby
Image) via a custom render function. See
[examples](https://yet-another-react-lightbox.com/examples) on the documentation
website.

## Plugins

Yet Another React Lightbox allows you to add optional features to your project
based on your requirements via plugins.

The following plugins are bundled in the package:

- [Captions](https://yet-another-react-lightbox.com/plugins/captions) - adds
  support for slide title and description
- [Counter](https://yet-another-react-lightbox.com/plugins/counter) - adds
  slides counter
- [Download](https://yet-another-react-lightbox.com/plugins/download) - adds
  download button
- [Fullscreen](https://yet-another-react-lightbox.com/plugins/fullscreen) - adds
  support for fullscreen mode
- [Inline](https://yet-another-react-lightbox.com/plugins/inline) - transforms
  the lightbox into an image carousel
- [Share](https://yet-another-react-lightbox.com/plugins/share) - adds sharing
  button
- [Slideshow](https://yet-another-react-lightbox.com/plugins/slideshow) - adds
  slideshow button
- [Thumbnails](https://yet-another-react-lightbox.com/plugins/thumbnails) - adds
  thumbnails track
- [Video](https://yet-another-react-lightbox.com/plugins/video) - adds support
  for video slides
- [Zoom](https://yet-another-react-lightbox.com/plugins/zoom) - adds image zoom
  feature

## Sponsors

This project is supported by the following companies, organizations, and
individuals who help make its continued development and maintenance possible.

<p align="center">
  <a target="_blank" rel="noreferrer noopener" href="https://cdn.jsdelivr.net/gh/igordanchenko/sponsors/sponsors.svg">
    <img alt="Sponsors" src="https://cdn.jsdelivr.net/gh/igordanchenko/sponsors/sponsors.svg"/>
  </a>
</p>

Support this project by becoming a
[sponsor](https://github.com/sponsors/igordanchenko). Both recurring and
one-time contributions are very much appreciated.

## License

MIT © 2022 [Igor Danchenko](https://github.com/igordanchenko)
