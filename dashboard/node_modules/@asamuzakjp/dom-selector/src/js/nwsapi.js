/**
 * nwsapi.js
 * Forked from nwsapi@2.2.2
 * @see https://github.com/dperini/nwsapi
 */

/* import */
import { LRUCache } from 'lru-cache';
import { isContentEditable } from './utility.js';

/* constants */
import { DOCUMENT_NODE, ELEMENT_NODE, MIME_HTML } from './constant.js';
const CACHE_SIZE = 4096;
const F_INIT = '"use strict";return function resolver(c,f,x,r)';
const S_HEAD = 'var e,n,o,j=r.length-1,k=-1';
const M_HEAD = 'var e,n,o';
const S_LOOP = 'main:while((e=c[++k]))';
const M_LOOP = 'e=c;';
const S_BODY = 'r[++j]=c[k];';
const M_BODY = '';
const S_TAIL = 'continue main;';
const M_TAIL = 'r=true;';
const CFG_OPERATORS = '[~*^$|]=|=';
const CFG_COMBINATORS = '[\\s>+~](?=[^>+~])';
const NEG_DOUBLE_ENC = '(?=(?:[^"]*"[^"]*")*[^"]*$)';
const NEG_SINGLE_ENC = "(?=(?:[^']*'[^']*')*[^']*$)";
const NEG_PARENS_ENC = '(?![^\\x28]*\\x29)';
const NEG_SQUARE_ENC = '(?![^\\x5b]*\\x5d)';
const NOT_ENOUGH_ARGS = 'Not enough arguments';
const SEL_INVALID = ' is not a valid selector';

/* fast maps */
const ATTR_STD_OPS = Object.freeze(
  Object.assign(Object.create(null), {
    '=': 1,
    '^=': 1,
    '$=': 1,
    '|=': 1,
    '*=': 1,
    '~=': 1
  })
);
const OPERATORS = Object.freeze(
  Object.assign(Object.create(null), {
    '=': { p1: '^', p2: '$', p3: 'true' },
    '^=': { p1: '^', p2: '', p3: 'true' },
    '$=': { p1: '', p2: '$', p3: 'true' },
    '*=': { p1: '', p2: '', p3: 'true' },
    '|=': { p1: '^', p2: '(-|$)', p3: 'true' },
    '~=': { p1: '(^|\\s)', p2: '(\\s|$)', p3: 'true' }
  })
);
const METHOD = Object.freeze(
  Object.assign(Object.create(null), {
    '#': 'getElementById',
    '*': 'getElementsByTagName',
    '.': 'getElementsByClassName'
  })
);
const GROUPS = Object.freeze(
  Object.assign(Object.create(null), {
    logicalsel:
      '(is|not|has)(?:\\x28\\s?(' +
      (() => {
        const out =
          '\\([^)(]*?(?:'.repeat(3) +
          '\\([^)(]*?\\)' +
          '[^)(]*?)*?\\)'.repeat(3);
        return out.slice(2, out.length - 2);
      })() +
      ')\\s?\\x29)',
    treestruct:
      '(nth(?:-last)?(?:-child|-of-type))(?:\\x28\\s?(even|odd|(?:[-+]?\\d*)(?:n\\s?[-+]?\\s?\\d*)?)\\s?(?:\\x29|$))',
    locationpc: '(any-link|link|target)\\b',
    structural: '(empty|(?:(?:first|last|only)(?:-child|-of-type)))\\b',
    inputstate: '(read-(?:only|write))\\b',
    inputvalue: '(checked|indeterminate)\\b'
  })
);
const HTML_TABLE = Object.freeze(
  Object.assign(Object.create(null), {
    accept: 1,
    'accept-charset': 1,
    align: 1,
    alink: 1,
    axis: 1,
    bgcolor: 1,
    charset: 1,
    checked: 1,
    clear: 1,
    codetype: 1,
    color: 1,
    compact: 1,
    declare: 1,
    defer: 1,
    dir: 1,
    direction: 1,
    disabled: 1,
    enctype: 1,
    face: 1,
    frame: 1,
    hreflang: 1,
    'http-equiv': 1,
    lang: 1,
    language: 1,
    link: 1,
    media: 1,
    method: 1,
    multiple: 1,
    nohref: 1,
    noresize: 1,
    noshade: 1,
    nowrap: 1,
    readonly: 1,
    rel: 1,
    rev: 1,
    rules: 1,
    scope: 1,
    scrolling: 1,
    selected: 1,
    shape: 1,
    target: 1,
    text: 1,
    type: 1,
    valign: 1,
    valuetype: 1,
    vlink: 1
  })
);
const REX = Object.freeze(
  Object.assign(Object.create(null), {
    regExpChar: /(?:(?!\\)[\\^$.*+?()[\]{}|/])/g,
    trimSpaces: /[\r\n\f]|^\s+|\s+$/g,
    commaGroup: new RegExp(
      '(\\s{0,255},\\s{0,255})' + NEG_SQUARE_ENC + NEG_PARENS_ENC,
      'g'
    ),
    splitGroup: /((?:\x28[^\x29]{0,255}\x29|\[[^\]]{0,255}\]|\\.|[^,])+)/g,
    combineWSP: new RegExp('\\s{1,255}' + NEG_SINGLE_ENC + NEG_DOUBLE_ENC, 'g'),
    tabCharWSP: new RegExp(
      '(\\s?\\t{1,255}\\s?)' + NEG_SINGLE_ENC + NEG_DOUBLE_ENC,
      'g'
    ),
    pseudosWSP: new RegExp('\\s{1,255}([-+])\\s{1,255}' + NEG_SQUARE_ENC, 'g'),
    nthElement: /(:nth(?:-last)?-child)/i,
    nthOfType: /(:nth(?:-last)?-of-type)/i,
    combinator: /\s?([>+~])\s?/g
  })
);

/**
 * @typedef {(c: Element|Array<Element>|NodeList, f?: ((element: Element) => boolean|void), x?: Element|Document|null, r?: boolean|Array<Element>) => boolean|Array<Element>} ResolverFactory
 */

/**
 * Iterates through nodes and calls a callback function, concatenating elements.
 * @param {Array<Element>|NodeList} nodes - The nodes to process.
 * @param {((element: Element) => boolean | void)=} callback - Optional callback.
 * @returns {Array<Element>} A new array of the processed nodes.
 */
export const concatCall = (nodes, callback) => {
  const l = nodes.length;
  const list = new Array(l);
  for (let i = 0; i < l; i++) {
    if (callback((list[i] = nodes[i])) === false) {
      break;
    }
  }
  return list;
};

/**
 * Checks if a given node belongs to an HTML document.
 * @param {Element|Document} node - The node to evaluate.
 * @returns {boolean} True if it is an HTML document.
 */
export const isHTML = node => {
  const document = node.ownerDocument || node;
  return (
    document.nodeType === DOCUMENT_NODE && document.contentType === MIME_HTML
  );
};

/**
 * Checks if the given node is the target fragment in the document's URL.
 * @param {Element} node - The element to check.
 * @returns {boolean} True if the node is the current URL target.
 */
export const isTarget = node => {
  if (!node?.nodeType === ELEMENT_NODE || !node.id) {
    return false;
  }
  const document = node.ownerDocument;
  const { hash } = new URL(document.URL);
  return hash === `#${node.id}` && document.contains(node);
};

/**
 * Checks if an input element or progress bar is in an indeterminate state.
 * @param {Element} node - The element to evaluate.
 * @returns {boolean} True if the element's state is indeterminate.
 */
export const isIndeterminate = node => {
  if (
    (node.indeterminate &&
      node.localName === 'input' &&
      node.type === 'checkbox') ||
    (node.localName === 'progress' && !node.hasAttribute('value'))
  ) {
    return true;
  }
  if (
    node.localName === 'input' &&
    node.type === 'radio' &&
    !node.hasAttribute('checked')
  ) {
    const nodeName = node.name;
    let parent = node.parentNode;
    while (parent) {
      if (parent.localName === 'form') {
        break;
      }
      parent = parent.parentNode;
    }
    if (!parent) {
      parent = node.ownerDocument.documentElement;
    }
    const items = parent.getElementsByTagName('input');
    let checked;
    for (const item of items) {
      if (item.getAttribute('type') === 'radio') {
        if (nodeName) {
          if (item.getAttribute('name') === nodeName) {
            checked = !!item.checked;
          }
        } else if (!item.hasAttribute('name')) {
          checked = !!item.checked;
        }
        if (checked) {
          break;
        }
      }
    }
    if (!checked) {
      return true;
    }
  }
  return false;
};

/**
 * Performs preliminary string manipulation to optimize deep query lookups.
 * @param {string} selector - The raw selector string.
 * @param {Array<string>} tokens - Derived tokens matching selector end segments.
 * @returns {string} The optimized target selector slice.
 */
export const optimize = (selector, tokens) => {
  const index = tokens.index;
  const length = tokens[1].length + tokens[2].length;
  let middle = '';
  if (' >+~'.indexOf(selector.charAt(index - 1)) > -1) {
    if (':['.indexOf(selector.charAt(index + length + 1)) > -1) {
      middle = '*';
    }
  }
  let offset = 0;
  if (tokens[1] === '*') {
    offset = 1;
  }
  return (
    selector.slice(0, index) + middle + selector.slice(index + length - offset)
  );
};

/**
 * Validates the matched resolvers sequentially upon a defined Element.
 * @param {Array<ResolverFactory>} factory - Collection of factory lambda checking functions.
 * @param {Element} element - The referenced node resolving.
 * @param {((element: Element) => boolean | void)=} callback - Callback operation.
 * @returns {boolean} Whether all condition factories asserted positively.
 */
export const matchAssert = (factory, element, callback) => {
  let res = false;
  for (const factoryFn of factory) {
    if (factoryFn(element, null, null, false)) {
      res = true;
      break;
    }
  }
  if (res && typeof callback === 'function') {
    callback(element);
  }
  return res;
};

/**
 * Core logic for nth-index calculations.
 * This function is stateless; it relies on the provided 'state' object.
 * @param {Element} element - The element to check.
 * @param {boolean|number} dir - Direction/Mode (true: last, false: normal, 2: reset).
 * @param {object} state - The instance-specific cache state.
 * @param {boolean} isOfType - Whether to filter by element type (localName/namespaceURI).
 * @returns {number} The calculated index or -1 if reset.
 */
export const solveNth = (element, dir, state, isOfType) => {
  if (dir === 2) {
    state.idx = 0;
    state.len = 0;
    state.set = 0;
    state.nodes = [];
    state.parents = [];
    state.parent = undefined;
    return -1;
  }
  const name = isOfType ? element.localName : null;
  const nsURI = isOfType ? element.namespaceURI : null;
  if (isOfType && nsURI !== 'http://www.w3.org/1999/xhtml') {
    state.idx = 0;
    state.len = 0;
    state.set = 0;
    state.nodes = [];
    state.parents = [];
    state.parent = undefined;
  }
  const parentMatch = state.parent === element.parentElement;
  const hasTypeNode = isOfType
    ? state.nodes[state.set] && state.nodes[state.set][name]
    : true;
  let i, j, k, l;
  if (parentMatch && hasTypeNode) {
    i = state.set;
    j = state.idx;
    l = state.len;
  } else {
    l = state.parents.length;
    state.parent = element.parentElement;
    for (i = -1, j = 0, k = l - 1; l > j; ++j, --k) {
      if (state.parents[j] === state.parent) {
        i = j;
        break;
      }
      if (state.parents[k] === state.parent) {
        i = k;
        break;
      }
    }
    if (i < 0 || (isOfType && !state.nodes[i][name])) {
      state.parents[(i = l)] = state.parent;
      if (isOfType && !state.nodes[i]) {
        state.nodes[i] = Object.create(null);
      }
      l = 0;
      const targetArr = isOfType
        ? (state.nodes[i][name] = [])
        : (state.nodes[i] = []);
      let node = state?.parent?.firstElementChild || element;
      while (node) {
        if (node === element) {
          j = l;
        }
        if (
          !isOfType ||
          (node.localName === name && node.namespaceURI === nsURI)
        ) {
          targetArr[l] = node;
          ++l;
        }
        node = node.nextElementSibling;
      }
      state.set = i;
      state.idx = j;
      state.len = l;
      if (l < 2) {
        return l;
      }
    } else {
      l = isOfType ? state.nodes[i][name].length : state.nodes[i].length;
      state.set = i;
    }
  }
  const currentNodes = isOfType ? state.nodes[i][name] : state.nodes[i];
  if (element !== currentNodes[j] && element !== currentNodes[(j = 0)]) {
    for (j = 0, k = l - 1; l > j; ++j, --k) {
      if (currentNodes[j] === element) {
        break;
      }
      if (currentNodes[k] === element) {
        j = k;
        break;
      }
    }
  }
  state.idx = j + 1;
  state.len = l;
  return dir ? l - j : state.idx;
};

/**
 * Nwsapi
 * Compiles CSS selectors to efficiently match and query nodes.
 */
export class Nwsapi {
  /* private */
  #boundDocumentOrder;
  #compat;
  #document;
  #hasDupes = false;
  #htmlDoc = false;
  #lastContext;
  #lastMatched;
  #lastSelected;
  #matchLambdas;
  #matchResolvers;
  #nthChildState;
  #nthTypeState;
  #quirksMode = false;
  #selectLambdas;
  #selectResolvers;
  #snapshot;
  #uidCounter = 0;
  #window;

  /* static */
  static #reOptimizer;
  static #reValidator;
  static #patterns;
  static {
    const identifier = '(?:--|-?[a-z_])[\\w-]*';
    const pseudonames = '[-\\w]+';
    const pseudoparms = '[-+]?\\d*(?:n\\s?[-+]?\\s?\\d*)';
    const doublequote = '"[^"\\\\]*(?:\\\\.[^"\\\\]*)*(?:"|$)';
    const singlequote = "'[^'\\\\]*(?:\\\\.[^'\\\\]*)*(?:'|$)";
    const attrparser = `${identifier}|${doublequote}|${singlequote}`;
    const attrvalues = '([\\x22\\x27]?)((?!\\3)*|(?:\\\\?.)*?)(?:\\3|$)';
    const attributes = `\\[\\s?(${identifier}(?::${identifier})?)\\s?(?:(${CFG_OPERATORS})\\s?(?:${attrparser}))?(?:\\s?\\b(i))?\\s?(?:\\]|$)`;
    const attrmatcher = attributes.replace(attrparser, attrvalues);
    const pseudoclass = `(?:\\x28\\s*${pseudoparms}?|\\*|:${pseudonames}(?:\\x28${pseudoparms}?\\x29?)?|[.#]?${identifier}|${attributes}|\\s?[>+~]\\s?|\\s?,\\s?|[\\s\\x29])*`;
    const standardValidator = `(?=\\s?[^>+~(){}<])(?:\\*|[.#]?${identifier}|${attributes}|::?${pseudonames}${pseudoclass}|\\s?${CFG_COMBINATORS}\\s?|\\s?,\\s?|\\s)+`;
    this.#reOptimizer = new RegExp(
      `([.:#*]?)(${identifier})(?::[-\\w]+|\\[[^\\]]+(?:\\]|$)|\\x28[^\\x29]+(?:\\x29|$))*$`,
      'i'
    );
    this.#reValidator = new RegExp(standardValidator, 'gi');
    this.#patterns = Object.freeze({
      treestruct: new RegExp(`^:(?:${GROUPS.treestruct})(.*)`, 'i'),
      structural: new RegExp(`^:(?:${GROUPS.structural})(.*)`, 'i'),
      inputstate: new RegExp(`^:(?:${GROUPS.inputstate})(.*)`, 'i'),
      inputvalue: new RegExp(`^:(?:${GROUPS.inputvalue})(.*)`, 'i'),
      locationpc: new RegExp(`^:(?:${GROUPS.locationpc})(.*)`, 'i'),
      logicalsel: new RegExp(`^:(?:${GROUPS.logicalsel})(.*)`, 'i'),
      children: /^\s?>\s?(.*)/,
      adjacent: /^\s?\+\s?(.*)/,
      relative: /^\s?~\s?(.*)/,
      ancestor: /^\s+(.*)/,
      universal: /^\*(.*)/,
      id: new RegExp(`^#(${identifier})(.*)`, 'i'),
      tagName: new RegExp(`^(${identifier})(.*)`, 'i'),
      className: new RegExp(`^\\.(${identifier})(.*)`, 'i'),
      attribute: new RegExp(`^(?:${attrmatcher})(.*)`)
    });
  }

  /**
   * Initializes the Nwsapi instance.
   * @param {Window} window - The Window object.
   * @param {Document} document - The Document node.
   * @param {number} [cacheSize] - The max number of items to cache.
   */
  constructor(window, document, cacheSize = CACHE_SIZE) {
    this.#window = window;
    const cacheOpt = {
      max: cacheSize
    };
    this.#matchLambdas = new LRUCache(cacheOpt);
    this.#selectLambdas = new LRUCache(cacheOpt);
    this.#matchResolvers = new LRUCache(cacheOpt);
    this.#selectResolvers = new LRUCache(cacheOpt);
    this.#nthChildState = {
      idx: 0,
      len: 0,
      set: 0,
      parent: undefined,
      parents: [],
      nodes: []
    };
    this.#nthTypeState = {
      idx: 0,
      len: 0,
      set: 0,
      parent: undefined,
      parents: [],
      nodes: []
    };
    this.#snapshot = Object.freeze(
      Object.assign(Object.create(null), {
        isContentEditable,
        isIndeterminate,
        isTarget,
        nthElement: (element, dir) =>
          solveNth(element, dir, this.#nthChildState, false),
        nthOfType: (element, dir) =>
          solveNth(element, dir, this.#nthTypeState, true)
      })
    );
    this.#compat = Object.freeze(
      Object.assign(Object.create(null), {
        '#': (c, n) => () => this.byId(n, c),
        '*': (c, n) => () => this.byTag(n, c),
        '.': (c, n) => () => this.byClass(n, c)
      })
    );
    this.#lastContext = this.#switchContext(document, true);
    this.#boundDocumentOrder = this.#documentOrder.bind(this);
  }

  /**
   * Comparison function to sort DOM nodes by document order.
   * @private
   * @param {Element} a - The first node.
   * @param {Element} b - The second node.
   * @returns {number} Sort indication (-1, 0, or 1).
   */
  #documentOrder(a, b) {
    if (a === b) {
      this.hasDupes = true;
      return 0;
    }
    if (a.compareDocumentPosition(b) & 4) {
      return -1;
    }
    return 1;
  }

  /**
   * Filters an array of nodes to remove duplicates.
   * @private
   * @param {Array<Element>} nodes - The array of nodes.
   * @returns {Array<Element>} A new array containing unique nodes.
   */
  #unique(nodes) {
    let i = 0;
    let j = -1;
    let l = nodes.length + 1;
    const list = [];
    while (--l) {
      if (nodes[i++] === nodes[i]) {
        continue;
      }
      list[++j] = nodes[i - 1];
    }
    this.hasDupes = false;
    return list;
  }

  /**
   * Retrieve elements by ID through an iterative tree walk.
   * Ensures all elements with duplicate IDs are found.
   * @param {string} id - The ID to search for.
   * @param {Element|Document} context - The base element or document.
   * @returns {Array<Element>} The list of matching elements.
   */
  byId(id, context) {
    const nodes = [];
    const all = context.getElementsByTagName('*');
    for (const element of all) {
      if (element.id === id) {
        nodes.push(element);
      }
    }
    return nodes;
  }

  /**
   * Context-agnostic implementation of `getElementsByTagName`.
   * @param {string} tag - The tag name to search for.
   * @param {Element|Document|DocumentFragment} context - The scope.
   * @returns {Array<Element>} An array of matched elements.
   */
  byTag(tag, context) {
    const api = METHOD['*'];
    if (api in context) {
      const collection = context[api](tag);
      const len = collection.length;
      const arr = new Array(len);
      for (let i = 0; i < len; i++) {
        arr[i] = collection[i];
      }
      return arr;
    }
    const nodes = [];
    const lowerTag = tag.toLowerCase();
    let e = context.firstElementChild;
    while (e) {
      if (tag === '*' || e.localName === lowerTag) {
        nodes.push(e);
      }
      const children = e[api](tag);
      for (const child of children) {
        nodes.push(child);
      }
      e = e.nextElementSibling;
    }
    return nodes;
  }

  /**
   * Context-agnostic implementation of `getElementsByClassName`.
   * @param {string} cls - The class name to search for.
   * @param {Element|Document|DocumentFragment} context - The scope context.
   * @returns {Array<Element>} An array of matched elements.
   */
  byClass(cls, context) {
    const api = METHOD['.'];
    if (api in context) {
      const collection = context[api](cls);
      const len = collection.length;
      const arr = new Array(len);
      for (let i = 0; i < len; i++) {
        arr[i] = collection[i];
      }
      return arr;
    }
    return [];
  }

  /**
   * Centralized error handler.
   * @private
   * @param {string} message - The error message to emit.
   * @param {string} proto - The exception prototype type name.
   * @throws {Error|DOMException} Will always throw to guarantee fallback routing.
   */
  #emit(message, proto) {
    if (proto === 'TypeError') {
      throw new this.#window.TypeError(message);
    } else {
      throw new this.#window.DOMException(message, 'SyntaxError');
    }
  }

  /**
   * Swaps the the underlying document context for parsing and resolving nodes.
   * @private
   * @param {Element|Document} context - The new context element or document.
   * @param {boolean} [force] - Forces re-initialization of contextual flags.
   * @returns {Element|Document} The applied context object.
   */
  #switchContext(context, force) {
    const oldDoc = this.#document;
    this.#document = context.ownerDocument || context;
    if (force || oldDoc !== this.#document) {
      this.#htmlDoc = isHTML(this.#document);
      this.#quirksMode =
        this.#htmlDoc && this.#document.compatMode.indexOf('CSS') < 0;
    }
    return context;
  }

  /**
   * Transforms a selector string sequence into a javascript string.
   * @param {string} expression - The unparsed selector sequence expression.
   * @param {string} source - The initial source string macro logic to compound.
   * @param {boolean} mode - Selectively evaluates caching string derivations between matched and selected calls.
   * @returns {string} The final compiled block of javascript mapping logic string.
   */
  compileSelector(expression, source, mode) {
    let selector = expression.replace(REX.combinator, '$1');
    const selectorString = mode ? this.#lastSelected : this.#lastMatched;
    while (selector) {
      const symbol = selector[0];
      switch (symbol) {
        case '*': {
          ({ source, selector } = this.compileUniversal(selector, source));
          break;
        }
        case '#': {
          ({ source, selector } = this.compileId(selector, source));
          break;
        }
        case '.': {
          ({ source, selector } = this.compileClass(selector, source));
          break;
        }
        case '[': {
          ({ source, selector } = this.compileAttribute(selector, source));
          break;
        }
        case '~':
        case '+':
        case '\x09':
        case '\x20':
        case '>': {
          ({ source, selector } = this.compileCombinator(
            symbol,
            selector,
            source
          ));
          break;
        }
        case ':': {
          ({ source, selector } = this.compilePseudo(
            selector,
            source,
            selectorString
          ));
          break;
        }
        default: {
          if (/[_a-z]/i.test(symbol)) {
            ({ source, selector } = this.compileTag(selector, source));
          } else {
            this.#emit(`'${selectorString}'${SEL_INVALID}`);
          }
          break;
        }
      }
    }
    return source;
  }

  /**
   * Compiles universal selector.
   * @param {string} selector - The unparsed selector string sequence.
   * @param {string} source - The compiled source string wrapper.
   * @returns {{source: string, selector: string}} The new modified sequence object representation.
   */
  compileUniversal(selector, source) {
    const match = selector.match(Nwsapi.#patterns.universal);
    return { source, selector: match.pop() };
  }

  /**
   * Compiles id targeting selector.
   * @param {string} selector - The unparsed selector string sequence.
   * @param {string} source - The compiled source string wrapper.
   * @returns {{source: string, selector: string}} The new modified sequence object representation.
   */
  compileId(selector, source) {
    const match = selector.match(Nwsapi.#patterns.id);
    return {
      source: `if(/^${match[1]}$/.test(e.getAttribute("id")??"")){${source}}`,
      selector: match.pop()
    };
  }

  /**
   * Compiles class targeting selector.
   * @param {string} selector - The unparsed selector string sequence.
   * @param {string} source - The compiled source string wrapper.
   * @returns {{source: string, selector: string}} The new modified sequence object representation.
   */
  compileClass(selector, source) {
    const match = selector.match(Nwsapi.#patterns.className);
    const compatLocal = this.#quirksMode ? 'i' : '';
    return {
      source: `if(/(^|\\s)${match[1]}(\\s|$)/${compatLocal}.test(e.getAttribute("class")??"")){${source}}`,
      selector: match.pop()
    };
  }

  /**
   * Compiles tag name targeted selector.
   * @param {string} selector - The unparsed selector string sequence.
   * @param {string} source - The compiled source string wrapper.
   * @returns {{source: string, selector: string}} The new modified sequence object representation.
   */
  compileTag(selector, source) {
    const match = selector.match(Nwsapi.#patterns.tagName);
    const tagCompare = match[1].toLowerCase();
    return {
      source: `if(e.localName==="${tagCompare}"){${source}}`,
      selector: match.pop()
    };
  }

  /**
   * Compiles attribute targeting selector expression.
   * @param {string} selector - The unparsed selector string sequence.
   * @param {string} source - The compiled source string wrapper.
   * @returns {{source: string, selector: string}} The new modified sequence object representation.
   */
  compileAttribute(selector, source) {
    const match = selector.match(Nwsapi.#patterns.attribute);
    const name = match[1];
    let expr = name.split(':');
    expr = expr.length === 2 ? expr[1] : expr[0];
    let test;
    if (match[2]) {
      test = OPERATORS[match[2]];
    }
    if (match[4] === '') {
      if (match[2] === '~=') {
        test = { p1: '^\\s', p2: '+$', p3: 'true' };
      } else if (match[2] in ATTR_STD_OPS && match[2] !== '~=') {
        test = { p1: '^', p2: '$', p3: 'true' };
      }
    } else {
      if (match[2] === '~=' && match[4].includes(' ')) {
        return { source: `if(false){${source}}`, selector: match.pop() };
      } else if (match[4]) {
        match[4] = match[4].replace(REX.regExpChar, '\\$&');
      }
    }
    const type =
      match[5] === 'i' || (this.#htmlDoc && HTML_TABLE[expr.toLowerCase()])
        ? 'i'
        : '';
    let attrCheck = '';
    if (!match[2]) {
      attrCheck = `e.hasAttribute&&e.hasAttribute("${name}")`;
    } else if (!match[4] && ATTR_STD_OPS[match[2]] && match[2] !== '~=') {
      attrCheck = `e.getAttribute&&e.getAttribute("${name}")===""`;
    } else {
      attrCheck = `(/${test.p1}${match[4]}${test.p2}/${type}).test(e.getAttribute&&e.getAttribute("${name}"))===${test.p3}`;
    }
    return {
      source: `if(${attrCheck}){${source}}`,
      selector: match.pop()
    };
  }

  /**
   * Compiles relationship structural combinators.
   * @param {string} symbol - The symbol mapping target connection logic.
   * @param {string} selector - The unparsed selector string sequence.
   * @param {string} source - The compiled source string wrapper.
   * @returns {{source: string, selector: string}} The new modified sequence object representation.
   */
  compileCombinator(symbol, selector, source) {
    let match;
    if (symbol === '~') {
      match = selector.match(Nwsapi.#patterns.relative);
      source = `n=e;while((e=e.previousElementSibling)){${source}}e=n;`;
    } else if (symbol === '+') {
      match = selector.match(Nwsapi.#patterns.adjacent);
      source = `n=e;if((e=e.previousElementSibling)){${source}}e=n;`;
    } else if (symbol === '\x09' || symbol === '\x20') {
      match = selector.match(Nwsapi.#patterns.ancestor);
      source = `n=e;while((e=e.parentElement)){${source}}e=n;`;
    } else if (symbol === '>') {
      match = selector.match(Nwsapi.#patterns.children);
      source = `n=e;if((e=e.parentElement)){${source}}e=n;`;
    }
    return { source, selector: match.pop() };
  }

  /**
   * Routes resolving pseudo-classes toward corresponding logic functions.
   * @param {string} selector - The unparsed selector string sequence.
   * @param {string} source - The compiled source string wrapper.
   * @param {string} selectorString - Original string block utilized within error output.
   * @returns {{source: string, selector: string}} The new modified sequence object representation.
   */
  compilePseudo(selector, source, selectorString) {
    let match;
    if ((match = selector.match(Nwsapi.#patterns.structural))) {
      source = this.compilePseudoStructural(match, source);
    } else if ((match = selector.match(Nwsapi.#patterns.treestruct))) {
      source = this.compilePseudoTreeStruct(match, source, selectorString);
    } else if ((match = selector.match(Nwsapi.#patterns.logicalsel))) {
      source = this.compilePseudoLogical(match, source);
    } else if ((match = selector.match(Nwsapi.#patterns.locationpc))) {
      source = this.compilePseudoLocation(match, source);
    } else if ((match = selector.match(Nwsapi.#patterns.inputstate))) {
      source = this.compilePseudoInputState(match, source);
    } else if ((match = selector.match(Nwsapi.#patterns.inputvalue))) {
      source = this.compilePseudoInputValue(match, source);
    } else {
      this.#emit(`unknown pseudo-class selector '${selector}'`);
    }
    return { source, selector: match.pop() };
  }

  /**
   * Compiles simple structural pseudo-class selectors.
   * @param {Array<string>} match - Group matched properties extracted from regex processing.
   * @param {string} source - The parent compiled mapping logic sequence base to interlock with.
   * @returns {string} The executed source output constraint.
   */
  compilePseudoStructural(match, source) {
    const pseudoName = match[1].toLowerCase();
    switch (pseudoName) {
      case 'empty': {
        return `n=e.firstChild;while(n&&!(/1|3/).test(n.nodeType)){n=n.nextSibling}if(!n){${source}}`;
      }
      case 'only-child': {
        return `if(!e.nextElementSibling&&!e.previousElementSibling){${source}}`;
      }
      case 'last-child': {
        return `if(!e.nextElementSibling){${source}}`;
      }
      case 'first-child': {
        return `if(!e.previousElementSibling){${source}}`;
      }
      case 'only-of-type': {
        return `o=e.localName;n=e;while((n=n.nextElementSibling)&&n.localName!==o);if(!n){n=e;while((n=n.previousElementSibling)&&n.localName!==o);}if(!n){${source}}`;
      }
      case 'last-of-type': {
        return `n=e;o=e.localName;while((n=n.nextElementSibling)&&n.localName!==o);if(!n){${source}}`;
      }
      case 'first-of-type': {
        return `n=e;o=e.localName;while((n=n.previousElementSibling)&&n.localName!==o);if(!n){${source}}`;
      }
      default: {
        return source;
      }
    }
  }

  /**
   * Compiles targeted complex iteration pseudo classes.
   * @param {Array<string>} match - Group matched properties extracted from regex processing.
   * @param {string} source - The parent compiled mapping logic sequence base to interlock with.
   * @param {string} selectorString - Original string block utilized within error output.
   * @returns {string} The computed logic operation function snippet string.
   */
  compilePseudoTreeStruct(match, source, selectorString) {
    const pseudoName = match[1] ? match[1].toLowerCase() : '';
    const formula = match[2];
    if (!pseudoName || !formula) {
      this.#emit(`'${selectorString}'${SEL_INVALID}`);
      return source;
    }
    const exprBool = /-of-type/i.test(pseudoName);
    const typeBool = /last/i.test(pseudoName);
    let test = '';
    if (formula === 'n') {
      return `if(true){${source}}`;
    }
    if (formula === '1') {
      const testDir = typeBool ? 'next' : 'previous';
      if (exprBool) {
        return `n=e;o=e.localName;while((n=n.${testDir}ElementSibling)&&n.localName!==o);if(!n){${source}}`;
      }
      return `if(!e.${testDir}ElementSibling){${source}}`;
    }
    if (
      formula === 'even' ||
      formula === '2n0' ||
      formula === '2n+0' ||
      formula === '2n'
    ) {
      test = 'n%2===0';
    } else if (formula === 'odd' || formula === '2n1' || formula === '2n+1') {
      test = 'n%2===1';
    } else {
      const hasN = /n/i.test(formula);
      const nParts = formula.split('n');
      let a = parseInt(nParts[0], 10) || 0;
      const b = parseInt(nParts[1], 10) || 0;
      if (nParts[0] === '-') {
        a = -1;
      }
      if (nParts[0] === '+') {
        a = 1;
      }
      let nTerm = 'n';
      if (b) {
        const sign = b > 0 ? '-' : '+';
        nTerm = `(n${sign}${Math.abs(b)})`;
      }
      test = `${nTerm}%${a}===0`;
      if (a >= 1) {
        if (hasN) {
          const extra = Math.abs(a) !== 1 ? `&&${test}` : '';
          test = `n>${b - 1}${extra}`;
        } else {
          test = `n===${a}`;
        }
      } else if (a <= -1) {
        const extra = Math.abs(a) !== 1 ? `&&${test}` : '';
        test = `n<${b + 1}${extra}`;
      } else if (a === 0) {
        test = `n===${b}`;
      }
    }
    const exprStr = exprBool ? 'OfType' : 'Element';
    const typeStr = typeBool ? 'true' : 'false';
    return `n=s.nth${exprStr}(e,${typeStr});if(${test}){${source}}`;
  }

  /**
   * Compiles dynamic query processing targeting internal pseudo matching loops.
   * @param {Array<string>} match - Group matched properties extracted from regex processing.
   * @param {string} source - The parent compiled mapping logic sequence base to interlock with.
   * @returns {string} String wrapper resolving the specified matched logic loop blocks.
   */
  compilePseudoLogical(match, source) {
    const pseudoName = match[1].toLowerCase();
    const expr = match[2]
      .replace(REX.commaGroup, ',')
      .replace(REX.trimSpaces, '');
    if (pseudoName === 'is' || pseudoName === 'not') {
      const subExprs = expr.match(REX.splitGroup) || [expr];
      const uid = ++this.#uidCounter;
      const label = `l_${uid}`;
      let code = `{ let r_${uid}=false, e_${uid}=e, n_${uid}=n, o_${uid}=o; ${label}: { `;
      for (const subExpr of subExprs) {
        const subCode = this.compileSelector(
          subExpr,
          `r_${uid}=true; break ${label};`,
          false
        );
        code += `{ ${subCode} } e=e_${uid}; n=n_${uid}; o=o_${uid}; `;
      }
      code += `} e=e_${uid}; n=n_${uid}; o=o_${uid}; `;
      if (pseudoName === 'is') {
        return `${code} if(r_${uid}){${source}} }`;
      } else {
        return `${code} if(!r_${uid}){${source}} }`;
      }
    } else if (pseudoName === 'has') {
      const escapedExpr = expr.replace(/\\/g, '\\\\').replace(/\x22/g, '\\"');
      this.#matchResolvers.clear();
      return `if(e.querySelector(":scope ${escapedExpr}")){${source}}`;
    }
    return source;
  }

  /**
   * Resolves structural specific location evaluation parsing queries.
   * @param {Array<string>} match - Group matched properties extracted from regex processing.
   * @param {string} source - The parent compiled mapping logic sequence base to interlock with.
   * @returns {string} Processed function execution evaluation snippet structure string.
   */
  compilePseudoLocation(match, source) {
    const pseudoName = match[1].toLowerCase();
    if (pseudoName === 'any-link' || pseudoName === 'link') {
      return `if(/^a|area$/i.test(e.localName)&&e.hasAttribute("href")){${source}}`;
    } else if (pseudoName === 'target') {
      return `if(s.isTarget(e)){${source}}`;
    }
    return source;
  }

  /**
   * Compiles input elements pseudo constraints analyzing read-only attributes.
   * @param {Array<string>} match - Group matched properties extracted from regex processing.
   * @param {string} source - The parent compiled mapping logic sequence base to interlock with.
   * @returns {string} Evaluated conditional logic block processing sequence input evaluation constraints string.
   */
  compilePseudoInputState(match, source) {
    const pseudoName = match[1].toLowerCase();
    if (pseudoName === 'read-only') {
      return `if((/^textarea$/i.test(e.localName)&&(e.readOnly||e.disabled))||(/^input$/i.test(e.localName)&&("|date|datetime-local|email|month|number|password|search|tel|text|time|url|week|".includes("|"+e.type+"|")?(e.readOnly||e.disabled):true))||(!/^(?:input|textarea)$/i.test(e.localName) && !s.isContentEditable(e))){${source}}`;
    } else if (pseudoName === 'read-write') {
      return `if((/^textarea$/i.test(e.localName)&&!e.readOnly&&!e.disabled)||(/^input$/i.test(e.localName)&&"|date|datetime-local|email|month|number|password|search|tel|text|time|url|week|".includes("|"+e.type+"|")&&!e.readOnly&&!e.disabled)||(!/^(?:input|textarea)$/i.test(e.localName) && s.isContentEditable(e))){${source}}`;
    }
    return source;
  }

  /**
   * Validates elements form states resolving input evaluation context.
   * @param {Array<string>} match - Group matched properties extracted from regex processing.
   * @param {string} source - The parent compiled mapping logic sequence base to interlock with.
   * @returns {string} Function context execution constraint wrapper processing mapping condition validations.
   */
  compilePseudoInputValue(match, source) {
    const pseudoName = match[1].toLowerCase();
    if (pseudoName === 'checked') {
      return `if((/^input$/i.test(e.localName)&&("|radio|checkbox|".includes("|"+e.type+"|")&&e.checked)||(/^option$/i.test(e.localName)&&(e.selected||e.checked)))){${source}}`;
    } else if (pseudoName === 'indeterminate') {
      return `if(s.isIndeterminate(e)){${source}}`;
    }
    return source;
  }

  /**
   * Checks and fetches lambdas from GenerationalCache, compiling closures.
   * @param {string} selector - The CSS selector string.
   * @param {boolean} mode - Mode specifying lambda output behavior (true: select, false: match).
   * @returns {ResolverFactory} The generated executable selector processing function.
   */
  compile(selector, mode) {
    let head = '';
    let loop = '';
    let macro = '';
    let source = '';
    let cached;
    if (mode) {
      cached = this.#selectLambdas.get(selector);
      if (cached !== undefined) {
        return cached;
      }
      head = S_HEAD;
      macro = S_BODY + S_TAIL;
      loop = S_LOOP;
    } else {
      cached = this.#matchLambdas.get(selector);
      if (cached !== undefined) {
        return cached;
      }
      head = M_HEAD;
      macro = M_BODY + M_TAIL;
      loop = M_LOOP;
    }
    source = this.compileSelector(selector, macro, mode);
    if (mode) {
      loop += '{' + source + '}';
    } else {
      loop += source;
    }
    if (mode && selector.includes(':nth')) {
      if (REX.nthElement.test(selector)) {
        loop += 's.nthElement(null, 2);';
      }
      if (REX.nthOfType.test(selector)) {
        loop += 's.nthOfType(null, 2);';
      }
    }
    const factory = Function(
      's',
      F_INIT + '{' + head + ';' + loop + 'return r;}'
    )(this.#snapshot);
    if (mode) {
      this.#selectLambdas.set(selector, factory);
    } else {
      this.#matchLambdas.set(selector, factory);
    }
    return factory;
  }

  /**
   * Centralized collector pipeline constructing combined resolvers.
   * @param {Array<string>} selectors - The comma-split groups of selector patterns.
   * @param {Element|Document} context - The context object to query from.
   * @param {((element: Element) => boolean | void)=} callback - Function to be applied over returned nodes.
   * @returns {object} An object containing the mapped arrays of resolvers and results.
   */
  collect(selectors, context, callback) {
    let i, l, type;
    const seen = Object.create(null);
    let token = ['', '*', '*'];
    const optimized = selectors;
    const factory = [];
    const htmlset = [];
    const nodeset = [];
    let results = [];
    for (i = 0, l = selectors.length; l > i; ++i) {
      if (!seen[selectors[i]]) {
        seen[selectors[i]] = true;
        type = selectors[i].match(Nwsapi.#reOptimizer);
        if (type && type[1] !== ':') {
          token = type;
          if (!token[1]) {
            token[1] = '*';
          }
          optimized[i] = optimize(optimized[i], token);
        } else {
          token = ['', '*', '*'];
        }
      }
      nodeset[i] = token[1] + token[2];
      htmlset[i] = this.#compat[token[1]](context, token[2]);
      factory[i] = this.compile(optimized[i], true);
      factory[i](htmlset[i](), callback, context, results);
    }
    if (l > 1) {
      results.sort(this.#boundDocumentOrder);
      if (this.hasDupes) {
        results = this.#unique(results);
      }
    }
    return { callback, context, factory, htmlset, nodeset, results };
  }

  /**
   * Creates mapping pipelines directly collecting matching lambdas.
   * @private
   * @param {Array<string>} selectors - The comma-split groups of selector patterns.
   * @returns {object} Object encapsulating generated lambda constraints.
   */
  #matchCollect(selectors) {
    return {
      factory: selectors.map(selector => {
        return this.compile(selector, false);
      })
    };
  }

  /**
   * Normalizes the selector string and returns an array of expressions.
   * @private
   * @param {string} selectors - The target CSS selector string to process.
   * @returns {Array<string>} An array of selector expressions split by commas.
   */
  #parseSelector(selectors) {
    const rawSelectors =
      typeof selectors !== 'string' ? String(selectors) : selectors;
    const parsed = rawSelectors
      .replace(/\0|\\$/g, '\ufffd')
      .replace(REX.combineWSP, '\x20')
      .replace(REX.pseudosWSP, '$1')
      .replace(REX.tabCharWSP, '\t')
      .replace(REX.commaGroup, ',')
      .replace(REX.trimSpaces, '');
    let expressions = parsed.match(Nwsapi.#reValidator);
    if (!expressions || expressions.join('') !== parsed) {
      this.#emit(`'${rawSelectors}'${SEL_INVALID}`);
    } else {
      expressions = parsed.match(REX.splitGroup);
      if (parsed.at(-1) === ',') {
        this.#emit(`'${rawSelectors}'${SEL_INVALID}`);
      }
    }
    return expressions;
  }

  /**
   * Validates whether an element complies strictly with the selector condition.
   * @param {string} selectors - The CSS selector condition input.
   * @param {Element} element - The single element attempting matching.
   * @param {((element: Element) => boolean | void)=} callback - A callback evaluated on success.
   * @returns {boolean} Return true if matched else false.
   */
  match(selectors, element, callback) {
    if (selectors === undefined) {
      this.#emit(NOT_ENOUGH_ARGS, 'TypeError');
    }
    if (selectors === '') {
      this.#emit(`''${SEL_INVALID}`);
    }
    const cachedResolver = this.#matchResolvers.get(selectors);
    if (element && !/:has\(/.test(selectors) && cachedResolver !== undefined) {
      return matchAssert(cachedResolver.factory, element, callback);
    }
    this.#lastMatched = selectors;
    const expressions = this.#parseSelector(selectors);
    const newResolver = this.#matchCollect(expressions);
    this.#matchResolvers.set(selectors, newResolver);
    return matchAssert(newResolver.factory, element, callback);
  }

  /**
   * Searches upwards finding the nearest element evaluating to the selector.
   * @param {string} selectors - The CSS target rule lookup.
   * @param {Element} element - The start baseline tracking backwards.
   * @param {((element: Element) => boolean | void)=} callback - An optional callback evaluated securely upon a hit.
   * @returns {Element|null} The nearest matched element instance or `null` if terminating unfulfilled.
   */
  closest(selectors, element, callback) {
    while (element) {
      if (this.match(selectors, element, callback)) {
        break;
      }
      element = element.parentElement;
    }
    return element;
  }

  /**
   * Collects a structural list of every single matching child element.
   * @param {string} selectors - Extensible compound selector queries targeting DOM layouts.
   * @param {Element|Document} context - Root tree execution base.
   * @param {((element: Element) => boolean | void)=} callback - Iterative injection applied conditionally.
   * @returns {Array<Element>} Collection representing matching elements inside the root boundary.
   */
  select(selectors, context, callback) {
    if (selectors === undefined) {
      this.#emit(NOT_ENOUGH_ARGS, 'TypeError');
    }
    if (selectors === '') {
      this.#emit(`''${SEL_INVALID}`);
    }
    if (!context) {
      context = this.#document;
    }
    if (this.#lastContext !== context) {
      this.#lastContext = this.#switchContext(context);
    }
    let nodes = [];
    const resolver = this.#selectResolvers.get(selectors);
    if (resolver !== undefined) {
      if (resolver.context === context && resolver.callback === callback) {
        const f = resolver.factory;
        const h = resolver.htmlset;
        const n = resolver.nodeset;
        if (n.length > 1) {
          const l = n.length;
          for (let i = 0; i < l; ++i) {
            const list = this.#compat[n[i][0]](context, n[i].slice(1))();
            f[i](list, callback, context, nodes);
          }
          if (l > 1 && nodes.length > 1) {
            nodes.sort(this.#boundDocumentOrder);
            if (this.hasDupes) {
              nodes = this.#unique(nodes);
            }
          }
        } else {
          nodes = f[0](h[0](), callback, context, nodes);
        }
        if (typeof callback === 'function') {
          return concatCall(nodes, callback);
        }
        return nodes;
      }
    }
    this.#lastSelected = selectors;
    const expressions = this.#parseSelector(selectors);
    const newResolver = this.collect(expressions, context, callback);
    this.#selectResolvers.set(selectors, newResolver);
    nodes = newResolver.results;
    if (typeof callback === 'function') {
      return concatCall(nodes, callback);
    }
    return nodes;
  }

  /**
   * Returns the first matching element within the `select()` method.
   * @param {string} selectors - Standard string format selector queries targeting the document tree.
   * @param {Element|Document} context - Element evaluation starting scope block.
   * @param {((element: Element) => boolean | void)=} callback - Conditionally executes mapping on retrieval.
   * @returns {Element|null} Single element mapping success or `null`.
   */
  first(selectors, context, callback) {
    if (selectors === '') {
      this.#emit(`''${SEL_INVALID}`);
    }
    if (!context) {
      context = this.#document;
    }
    const localCallback =
      typeof callback === 'function'
        ? element => {
            callback(element);
            return false;
          }
        : () => {
            return false;
          };
    const result = this.select(selectors, context, localCallback);
    if (result[0]) {
      return result[0];
    }
    return null;
  }

  /**
   * Clears internal caches and state.
   * @param {boolean} [clearAll] - Whether to clear all caches.
   */
  clear(clearAll = false) {
    if (clearAll) {
      this.#matchLambdas.clear();
      this.#selectLambdas.clear();
      this.#matchResolvers.clear();
      this.#selectResolvers.clear();
    }
    this.#snapshot.nthElement(null, 2);
    this.#snapshot.nthOfType(null, 2);
  }
}
