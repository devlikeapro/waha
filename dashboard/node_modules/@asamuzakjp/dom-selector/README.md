# DOM Selector

[![build](https://github.com/asamuzaK/domSelector/actions/workflows/node.js.yml/badge.svg)](https://github.com/asamuzaK/domSelector/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/asamuzaK/domSelector/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/asamuzaK/domSelector/actions/workflows/github-code-scanning/codeql)
[![npm (scoped)](https://img.shields.io/npm/v/@asamuzakjp/dom-selector)](https://www.npmjs.com/package/@asamuzakjp/dom-selector)

A CSS selector engine built for strict specification compliance.

## Features

* **Strict Specification Compliance**: Strictly adheres to modern web standards. It accurately parses, evaluates, and extracts elements across complex combinations of pseudo-classes and HTML attributes. Features comprehensive support for CSS Selectors Level 4 (e.g., `:is()`, `:not()`, `:where()`, `:has()`) and Shadow DOM pseudo-classes (`:host`, `:host-context`).
* **Utility Functions**: Provides utility methods alongside standard querying, such as `check()` for AST evaluation and `extractSubjects()` for extracting subject keys from selectors.
* **jsdom's Default Engine**: Adopted as the CSS selector engine for [jsdom](https://github.com/jsdom/jsdom).

## Install

``` console
npm i @asamuzakjp/dom-selector
```

## Usage

``` javascript
import { DOMSelector } from '@asamuzakjp/dom-selector';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM();

// Destructuring methods (all methods are bound to the instance)
const {
  check, closest, extractSubjects, matches, querySelector, querySelectorAll, supports
} = new DOMSelector(window);
```

## API

### `new DOMSelector(window, document?, opt?)`

Creates an instance of the DOMSelector.

* `window` **{Window}** The window object.
* `document` **{Document}?** The document object. Defaults to window.document.
* `opt` **{object}?** Options:
  * `opt.cacheSize` **{number}?** Maximum number of items to store in the internal cache. Default is 4096.

### `matches(selector, node, opt?)`

Equivalent to [Element.matches()](https://developer.mozilla.org/docs/Web/API/Element/matches).

* `selector` **{string}** CSS selector.
* `node` **{Element}** Element node.
* `opt` **{object}?** Options:
  * `opt.noexcept` **{boolean}?** Do not throw exceptions.
  * `opt.warn` **{boolean}?** Console warn (e.g. unsupported pseudo-class).
* **Returns** **{boolean}** `true` if matched, `false` otherwise.

### `closest(selector, node, opt?)`

Equivalent to [Element.closest()](https://developer.mozilla.org/docs/Web/API/Element/closest).

* `selector` **{string}** CSS selector.
* `node` **{Element}** Element node.
* `opt` **{object}?** Options:
  * `opt.noexcept` **{boolean}?** Do not throw exceptions.
  * `opt.warn` **{boolean}?** Console warn (e.g. unsupported pseudo-class).
* **Returns** **{Element | null}** The matched ancestor node or `null`.

### `querySelector(selector, node, opt?)`

Equivalent to [Document.querySelector()](https://developer.mozilla.org/docs/Web/API/Document/querySelector), [DocumentFragment.querySelector()](https://developer.mozilla.org/docs/Web/API/DocumentFragment/querySelector) and [Element.querySelector()](https://developer.mozilla.org/docs/Web/API/Element/querySelector).

* `selector` **{string}** CSS selector.
* `node` **{Document | DocumentFragment | Element}** Node to find within.
* `opt` **{object}?** Options:
  * `opt.noexcept` **{boolean}?** Do not throw exceptions.
  * `opt.warn` **{boolean}?** Console warn (e.g. unsupported pseudo-class).
* **Returns** **{Element | null}** The matched node or `null`.

### `querySelectorAll(selector, node, opt?)`

Equivalent to [Document.querySelectorAll()](https://developer.mozilla.org/docs/Web/API/Document/querySelectorAll), [DocumentFragment.querySelectorAll()](https://developer.mozilla.org/docs/Web/API/DocumentFragment/querySelectorAll) and [Element.querySelectorAll()](https://developer.mozilla.org/docs/Web/API/Element/querySelectorAll).
**NOTE**: Returns a standard `Array`, not a `NodeList`.

* `selector` **{string}** CSS selector.
* `node` **{Document | DocumentFragment | Element}** Node to find within.
* `opt` **{object}?** Options:
  * `opt.noexcept` **{boolean}?** Do not throw exceptions.
  * `opt.warn` **{boolean}?** Console warn (e.g. unsupported pseudo-class).
* **Returns** **{Array}** Array of matched nodes.

### `check(selector, node, opt?)`

Checks if an element matches a CSS selector and returns additional abstract syntax tree (AST) information.
**NOTE**: Any pseudo-elements in the selector are excluded from the matching evaluation.

* `selector` **{string}** CSS selector.
* `node` **{Element}** Element node.
* `opt` **{object}?** Options:
  * `opt.noexcept` **{boolean}?** Do not throw exceptions.
  * `opt.warn` **{boolean}?** Console warn (e.g. unsupported pseudo-class).
* **Returns** **{object}** An object containing the following properties:
  * `match` **{boolean}** `true` if the element matches the selector, `false` otherwise.
  * `pseudoElement` **{string | null}** The pseudo-element extracted from the selector, if any.
  * `ast` **{object | null}** The parsed AST object.

### `extractSubjects(selector, caseSensitive?)`

Parses a selector and extracts the rightmost subject keys (Id, Class, Tag).

* `selector` **{string}** CSS selector.
* `caseSensitive` **{boolean}?** `true` if the tag key should be case sensitive. Defaults to `false`.
* **Returns** **{Array\<{id: string|null, className: string|null, tag: string|null}\>}** An array of extracted keys.

### `supports(selector)`

Checks if the given CSS selector is supported by this engine.
See the table below for the full list of supported selectors.

* `selector` **{string}** CSS selector.
* **Returns** **{boolean}** `true` if the selector is supported, `false` otherwise.

### `clear(clearAll?)`

Clears the internal caches to free up memory.

* `clearAll` **{boolean}?** Whether to clear all caches. If false, only cached matching results are cleared. Defaults to `false`.
* **Returns** **{void}**

## Supported CSS selectors

| Pattern | Supported | Note |
| :--- | :---: | :--- |
| `*` | ✓ | |
| `E` | ✓ | |
| <code>ns\|E</code> | ✓ | |
| <code>*\|E</code> | ✓ | |
| <code>\|E</code> | ✓ | |
| `E F` | ✓ | |
| `E > F` | ✓ | |
| `E + F` | ✓ | |
| `E ~ F` | ✓ | |
| <code>F \|\| E</code> | Unsupported | |
| `E.warning` | ✓ | |
| `E#myid` | ✓ | |
| `E[foo]` | ✓ | |
| `E[foo="bar"]` | ✓ | |
| `E[foo="bar" i]` | ✓ | |
| `E[foo="bar" s]` | ✓ | |
| `E[foo~="bar"]` | ✓ | |
| `E[foo^="bar"]` | ✓ | |
| `E[foo$="bar"]` | ✓ | |
| `E[foo*="bar"]` | ✓ | |
| <code>E[foo\|="en"]</code> | ✓ | |
| `E:is(s1, s2, …)` | ✓ | |
| `E:not(s1, s2, …)` | ✓ | |
| `E:where(s1, s2, …)` | ✓ | |
| `E:has(rs1, rs2, …)` | ✓ | |
| `E:defined` | Partially supported | Matching with MathML is not yet supported. |
| `E:dir(ltr)` | ✓ | |
| `E:lang(en)` | ✓ | |
| `E:any-link` | ✓ | |
| `E:link` | ✓ | |
| `E:visited` | ✓ | Returns `false` or `null` to prevent fingerprinting. |
| `E:local-link` | ✓ | |
| `E:target` | ✓ | |
| `E:target-within` | | Removed from spec. |
| `E:scope` | ✓ | |
| `E:hover` | ✓ | |
| `E:active` | ✓ | |
| `E:focus` | ✓ | |
| `E:focus-visible` | ✓ | |
| `E:focus-within` | ✓ | |
| `E:current` | Unsupported | |
| `E:current(s)` | Unsupported | |
| `E:past` | Unsupported | |
| `E:future` | Unsupported | |
| `E:open` | Partially supported | Matching with `<select>`, e.g. `select:open`, or `<input type="color">` are not supported. |
| `E:popover-open` | Unsupported | |
| `E:enabled`<br>`E:disabled` | ✓ | |
| `E:read-write`<br>`E:read-only` | ✓ | |
| `E:placeholder-shown` | ✓ | |
| `E:default` | ✓ | |
| `E:checked` | ✓ | |
| `E:indeterminate` | ✓ | |
| `E:blank` | Unsupported | |
| `E:valid`<br>`E:invalid` | ✓ | |
| `E:in-range`<br>`E:out-of-range` | ✓ | |
| `E:required`<br>`E:optional` | ✓ | |
| `E:user-valid`<br>`E:user-invalid` | Unsupported | |
| `E:root` | ✓ | |
| `E:empty` | ✓ | |
| `E:nth-child(n [of S]?)` | ✓ | |
| `E:nth-last-child(n [of S]?)` | ✓ | |
| `E:first-child` | ✓ | |
| `E:last-child` | ✓ | |
| `E:only-child` | ✓ | |
| `E:nth-of-type(n)` | ✓ | |
| `E:nth-last-of-type(n)` | ✓ | |
| `E:first-of-type` | ✓ | |
| `E:last-of-type` | ✓ | |
| `E:only-of-type` | ✓ | |
| `E:nth-col(n)` | Unsupported | |
| `E:nth-last-col(n)` | Unsupported | |
| `CE:state(v)` | ✓ | \*1 |
| `:host` | ✓ | |
| `:host(s)` | ✓ | |
| `:host(:state(v))` | ✓ | \*1 |
| `:host:has(rs1, rs2, ...)` | ✓ | |
| `:host(s):has(rs1, rs2, ...)` | ✓ | |
| `:host-context(s)` | ✓ | |
| `:host-context(s):has(rs1, rs2, ...)` | ✓ | |
| `&` | ✓ | Only supports outermost `&`, i.e. equivalent to `:scope` |

\*1: `ElementInternals.states`, i.e. `CustomStateSet`, is not implemented in jsdom, so you need to apply a patch in the custom element constructor.

``` javascript
class LabeledCheckbox extends window.HTMLElement {
  #internals;
  constructor() {
    super();
    this.#internals = this.attachInternals();
    // patch CustomStateSet
    if (!this.#internals.states) {
      this.#internals.states = new Set();
    }
    this.addEventListener('click', this._onClick.bind(this));
  }
  get checked() {
    return this.#internals.states.has('checked');
  }
  set checked(flag) {
    if (flag) {
      this.#internals.states.add('checked');
    } else {
      this.#internals.states.delete('checked');
    }
  }
  _onClick(event) {
    this.checked = !this.checked;
  }
}
```

## Performance

See [benchmark](https://github.com/asamuzaK/domSelector/actions/workflows/benchmark.yml) for the latest results.

## Acknowledgments

The following resources have been of great help in the development of the DOM Selector.

* [CSSTree](https://github.com/csstree/csstree)
* [selery](https://github.com/danburzo/selery)
* [jsdom](https://github.com/jsdom/jsdom)
* [nwsapi](https://github.com/dperini/nwsapi)

---

Copyright (c) 2023 [asamuzaK (Kazz)](https://github.com/asamuzaK/)
