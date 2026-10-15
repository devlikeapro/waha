/*!
 * DOM Selector - A CSS selector engine.
 * @license MIT
 * @copyright asamuzaK (Kazz)
 * @see {@link https://github.com/asamuzaK/domSelector/blob/main/LICENSE}
 */

/* import */
import { LRUCache } from 'lru-cache';
import { Finder } from './js/finder.js';
import { Nwsapi } from './js/nwsapi.js';
import { extractSubjectsAst, parseSelector } from './js/parser.js';
import {
  extractSubjectsRegExp,
  filterSelector,
  isSupportedAST
} from './js/selector.js';
import {
  collectAllDescendants,
  findByExactIdAttribute,
  findBySimpleAttribute,
  getType
} from './js/utility.js';

/* constants */
import {
  DOCUMENT_NODE,
  ELEMENT_NODE,
  MIME_HTML,
  TARGET_ALL,
  TARGET_FIRST,
  TARGET_LINEAL,
  TARGET_SELF
} from './js/constant.js';
const CACHE_SIZE = 4096;

/* regexp */
const REG_SELECTOR = /[[\]():\\"'`]/;
const REG_UNIVERSAL = /^\s*(?:\*\|)?\*\s*$/;

/* types */
/**
 * @typedef {object} CheckResult
 * @property {boolean} match - The match result.
 * @property {string|null} pseudoElement - The pseudo-element, if any.
 * @property {import('css-tree').CssNode|null} ast - The AST object.
 */

/**
 * @typedef {object} UserOptions
 * @property {boolean} [noexcept] - True to suppress exceptions.
 * @property {boolean} [warn] - True to enable console warnings.
 */

/**
 * @typedef {object} FindOptions
 * @property {string} [dir] - The traversal direction.
 * @property {boolean} [check] - True if running in internal check mode.
 * @property {boolean} [forgive] - True to ignore unknown or invalid selectors.
 * @property {boolean} [noexcept] - True to suppress exceptions.
 * @property {boolean} [warn] - True to enable console warnings.
 * @property {boolean} [isShadowRoot] - Indicates if the node is a ShadowRoot.
 * @property {object} [globalObject] - The Window object.
 */

/* DOMSelector */
export class DOMSelector {
  /* private fields */
  #window;
  #document;
  #finder;
  #idlUtils;
  #nwsapi;
  #cache;

  /**
   * Creates an instance of DOMSelector.
   * @param {Window} window - The Window object.
   * @param {Document} document - The Document object.
   * @param {object} [opt] - Options.
   * @param {number} [opt.cacheSize] - The maximum size of the LRU cache.
   * @param {object} [opt.idlUtils] - The internal IDL wrapper used for jsdom.
   */
  constructor(window, document, opt = {}) {
    const { cacheSize, idlUtils } = opt;
    this.#window = window;
    this.#document = document ?? window.document;
    this.#idlUtils = idlUtils;
    this.#cache = new LRUCache({
      max: cacheSize ?? CACHE_SIZE
    });
    this.#finder = new Finder(this.#window);
    this.#nwsapi = new Nwsapi(this.#window, this.#document, cacheSize);
  }

  /**
   * Clears the internal caches.
   * @param {boolean} [clearAll] - Whether to clear all caches. If false,
   * only cached matching results are cleared.
   * @returns {void}
   */
  clear(clearAll = false) {
    if (clearAll) {
      this.#cache.clear();
    }
    this.#finder.clearResults(true);
    this.#nwsapi.clear(clearAll);
  }

  /**
   * Parses a selector and extracts the rightmost subject keys (Id, Class, Tag).
   * @param {string} selector - The CSS selector to parse.
   * @param {boolean} [caseSensitive] - True if key should be case sensitive.
   * @returns {Array<{id: string|null, className: string|null, tag: string|null}>} The list of extracted keys for each selector group.
   */
  extractSubjects(selector, caseSensitive = false) {
    if (!selector || typeof selector !== 'string') {
      return [{ id: null, className: null, tag: null }];
    }
    const cacheKey = `extract_${selector}_${caseSensitive}`;
    let subjects = this.#cache.get(cacheKey);
    if (subjects !== undefined) {
      return subjects;
    }
    subjects = [];
    if (!REG_SELECTOR.test(selector)) {
      subjects = extractSubjectsRegExp(selector, caseSensitive);
    } else {
      try {
        const ast = parseSelector(selector);
        subjects = extractSubjectsAst(ast);
      } catch {
        // fall through
      }
    }
    if (!subjects.length) {
      subjects.push({ id: null, className: null, tag: null });
    }
    this.#cache.set(cacheKey, subjects);
    return subjects;
  }

  /**
   * Checks if the given CSS selector is supported by this engine.
   * @param {string} selector - The CSS selector to check.
   * @returns {boolean} `true` if the selector is supported, `false` otherwise.
   */
  supports(selector) {
    if (typeof selector !== 'string') {
      return false;
    }
    const cacheKey = `supports_${selector}`;
    let isSupported = this.#cache.get(cacheKey);
    if (isSupported !== undefined) {
      return isSupported;
    }
    if (filterSelector(selector, TARGET_SELF)) {
      isSupported = true;
    } else {
      try {
        const ast = parseSelector(selector);
        isSupported = isSupportedAST(ast);
      } catch {
        isSupported = false;
      }
    }
    this.#cache.set(cacheKey, isSupported);
    return isSupported;
  }

  /**
   * Checks if an element matches a CSS selector.
   * @param {string} selector - The CSS selector to check against.
   * @param {Element} node - The element node to check.
   * @param {object} [opt] - Optional parameters.
   * @param {boolean} [opt.requireAst] - Indicates always try to parse AST.
   * @returns {CheckResult|null} An object containing the check result.
   */
  check(selector, node, opt = {}) {
    node = this.#wrapNode(node);
    const error = this.#validateNodeType(node, true);
    if (error) {
      this.#finder.onError(error, opt);
      return null;
    }
    if (REG_UNIVERSAL.test(selector)) {
      const astCacheKey = `check_ast_${selector.trim()}`;
      let ast = this.#cache.get(astCacheKey);
      if (ast === undefined) {
        ast = parseSelector(selector);
        this.#cache.set(astCacheKey, ast);
      }
      return {
        ast,
        match: true,
        pseudoElement: null
      };
    }
    const nwsapiRes = this.#tryNwsapi(
      selector,
      node,
      TARGET_SELF,
      n => this.#nwsapi.match(selector, n),
      true
    );
    if (nwsapiRes.success) {
      let ast = null;
      if (nwsapiRes.result || opt.requireAst) {
        const astCacheKey = `check_ast_${selector}`;
        ast = this.#cache.get(astCacheKey);
        if (ast === undefined) {
          ast = parseSelector(selector);
          this.#cache.set(astCacheKey, ast);
        }
      }
      return {
        match: nwsapiRes.result,
        ast,
        pseudoElement: null
      };
    }
    const options = {
      check: true,
      noexcept: true,
      warn: false,
      globalObject: this.#window
    };
    return this.#finder.setup(selector, node, options).find(TARGET_SELF);
  }

  /**
   * Returns true if the element matches the selector.
   * @param {string} selector - The CSS selector to match against.
   * @param {Element} node - The element node to test.
   * @param {UserOptions} [opt] - User options.
   * @returns {boolean} True if the element matches, false otherwise.
   */
  matches(selector, node, opt = {}) {
    node = this.#wrapNode(node);
    const options = {
      ...opt,
      check: false,
      globalObject: this.#window
    };
    const error = this.#validateNodeType(node, true);
    if (error) {
      return this.#finder.onError(error, options);
    }
    if (REG_UNIVERSAL.test(selector)) {
      return true;
    }
    const nwsapiRes = this.#tryNwsapi(selector, node, TARGET_SELF, n =>
      this.#nwsapi.match(selector, n)
    );
    if (nwsapiRes.success) {
      return nwsapiRes.result;
    }
    const nodes = this.#findNodes(selector, node, options, TARGET_SELF);
    return !!(nodes && nodes.size > 0);
  }

  /**
   * Traverses up the DOM tree to find the first node that matches the selector.
   * @param {string} selector - The CSS selector to match against.
   * @param {Element} node - The element from which to start traversing.
   * @param {UserOptions} [opt] - User options.
   * @returns {Element|null} The first matching ancestor element, or `null`.
   */
  closest(selector, node, opt = {}) {
    node = this.#wrapNode(node);
    const options = {
      ...opt,
      check: false,
      globalObject: this.#window
    };
    const error = this.#validateNodeType(node, true);
    if (error) {
      return this.#finder.onError(error, options);
    }
    if (REG_UNIVERSAL.test(selector)) {
      return node;
    }
    const nwsapiRes = this.#tryNwsapi(selector, node, TARGET_LINEAL, n =>
      this.#nwsapi.closest(selector, n)
    );
    if (nwsapiRes.success) {
      return nwsapiRes.result;
    }
    const nodes = this.#findNodes(selector, node, options, TARGET_LINEAL);
    if (nodes && nodes.size) {
      let refNode = node;
      while (refNode) {
        if (nodes.has(refNode)) {
          return refNode;
        }
        refNode = refNode.parentNode;
      }
    }
    return null;
  }

  /**
   * Returns the first element within the subtree that matches the selector.
   * @param {string} selector - The CSS selector to match.
   * @param {Document|DocumentFragment|Element} node - The node to find within.
   * @param {UserOptions} [opt] - User options.
   * @returns {Element|null} The first matching element, or `null`.
   */
  querySelector(selector, node, opt = {}) {
    node = this.#wrapNode(node);
    const options = {
      ...opt,
      check: false,
      globalObject: this.#window
    };
    const error = this.#validateNodeType(node);
    if (error) {
      this.#finder.onError(error, options);
      return null;
    }
    if (REG_UNIVERSAL.test(selector)) {
      return node.firstElementChild;
    }
    const fastNode = findByExactIdAttribute(selector, node);
    if (fastNode === null || fastNode?.nodeType === ELEMENT_NODE) {
      return fastNode;
    }
    const nodes = this.#findNodes(selector, node, options, TARGET_FIRST);
    if (nodes && nodes.size) {
      return nodes.values().next().value;
    }
    return null;
  }

  /**
   * Returns an array of elements within the subtree that match the selector.
   * Note: This method returns an Array, not a NodeList.
   * @param {string} selector - The CSS selector to match.
   * @param {Document|DocumentFragment|Element} node - The node to find within.
   * @param {UserOptions} [opt] - User options.
   * @returns {Array<Element>} An array of elements, or an empty array.
   */
  querySelectorAll(selector, node, opt = {}) {
    node = this.#wrapNode(node);
    const options = {
      ...opt,
      check: false,
      globalObject: this.#window
    };
    const error = this.#validateNodeType(node);
    if (error) {
      this.#finder.onError(error, options);
      return [];
    }
    if (REG_UNIVERSAL.test(selector)) {
      const document =
        node.nodeType === DOCUMENT_NODE ? node : node.ownerDocument;
      return collectAllDescendants(node, document);
    }
    const fastNodes = findBySimpleAttribute(selector, node);
    if (Array.isArray(fastNodes)) {
      return fastNodes;
    }
    const nodes = this.#findNodes(selector, node, options, TARGET_ALL);
    if (nodes && nodes.size) {
      return [...nodes];
    }
    return [];
  }

  /**
   * Wraps the node for IDL internal implementation if idlUtils is present.
   * @private
   * @param {Document|DocumentFragment|Element} node - The raw node.
   * @returns {object} The wrapped or raw node.
   */
  #wrapNode(node) {
    return this.#idlUtils ? this.#idlUtils.wrapperForImpl(node) : node;
  }

  /**
   * Validates a node and returns an Error if invalid.
   * @private
   * @param {Document|DocumentFragment|Element} node - The node to check.
   * @param {boolean} [element] - `true` if the node must be an Element.
   * @returns {TypeError|null} Returns a TypeError if invalid, otherwise null.
   */
  #validateNodeType(node, element = false) {
    if (!node?.nodeType) {
      return new this.#window.TypeError(`Unexpected type ${getType(node)}`);
    }
    if (element && node.nodeType !== ELEMENT_NODE) {
      return new this.#window.TypeError(`Unexpected node ${node.nodeName}`);
    }
    return null;
  }

  /**
   * Executes Nwsapi matching logic with caching and error wrapping.
   * @private
   * @param {string} selector - The CSS selector to match against.
   * @param {Document|Element} node - The target node to check.
   * @param {number} targetType - The target type indicating the scope.
   * @param {(node: Element) => Array<Element>|Element|boolean|null} callback - The specific nwsapi function.
   * @param {boolean} [isCheck] - True if called from the check method.
   * @returns {{success: boolean, result: Array<Element>|Element|boolean|null}} An object indicating whether the execution succeeded and its result.
   */
  #tryNwsapi(selector, node, targetType, callback, isCheck = false) {
    const document = node.ownerDocument;
    // jsdom passes an internal document to the constructor but wraps entry nodes.
    if (
      node.isConnected &&
      (document === this.#document ||
        this.#idlUtils?.implForWrapper?.(document) === this.#document) &&
      document.contentType === MIME_HTML &&
      document.documentElement
    ) {
      const cacheKey = `${isCheck ? 'check' : targetType}_${selector}`;
      let filterMatches = this.#cache.get(cacheKey);
      if (filterMatches === undefined) {
        filterMatches = filterSelector(selector, targetType);
        this.#cache.set(cacheKey, filterMatches);
      }
      if (filterMatches) {
        try {
          const result = callback(node);
          return { result, success: true };
        } catch {
          // fall through
        }
      }
    }
    return { result: null, success: false };
  }

  /**
   * Encapsulates Finder traversal logic and error handling.
   * @private
   * @param {string} selector - The CSS selector to match against.
   * @param {Document|DocumentFragment|Element} node - The node from which to start searching.
   * @param {FindOptions} [opt] - The finder options.
   * @param {number} targetType - The target type indicating the scope.
   * @returns {Set<Element>|null} The search results from Finder, or null.
   */
  #findNodes(selector, node, opt, targetType) {
    try {
      const res = this.#finder.setup(selector, node, opt).find(targetType);
      if (res instanceof Set) {
        return res;
      }
    } catch (e) {
      this.#finder.onError(e, opt);
    }
    return null;
  }
}
