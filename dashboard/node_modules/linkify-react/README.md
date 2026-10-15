# linkify-react

[![npm version](https://badge.fury.io/js/linkify-react.svg)](https://www.npmjs.com/package/linkify-react)

[Linkify](https://linkify.js.org/) React component. Use it to find URLs, email addresses and more in child strings and replace them with strings and &lt;a&gt; elements.

## Installation

Install from the command line with NPM

```
npm install linkifyjs linkify-react
```

Import into your JavaScript with `require`

```js
const Linkify = require('linkify-react');
```

or with ES modules

```js
import Linkify from 'linkify-react';
```

## Usage

```jsx
const contents = 'helloworld.com';

<Linkify options={...}>
  {contents}
</Linkify>
```

[Read the full documentation](https://linkify.js.org/docs/linkify-react.html).

## License

MIT
