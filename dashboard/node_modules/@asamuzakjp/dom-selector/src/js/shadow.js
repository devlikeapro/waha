/**
 * shadow.js
 */

import { generateCSS, walkAST } from './parser.js';
import { generateException } from './utility.js';
import { COMBINATOR, KEYS_LOGICAL, SYNTAX_ERR } from './constant.js';

/**
 * ShadowDOMEvaluator
 * Handles the evaluation of Shadow DOM specific selectors.
 */
export class ShadowDOMEvaluator {
  /* private fields */
  #evaluator;
  #verifyShadowHost;

  /**
   * @param {import('./evaluator.js').Evaluator} evaluator - The Evaluator instance.
   */
  constructor(evaluator) {
    this.#evaluator = evaluator;
    this.#verifyShadowHost = false;
  }

  /**
   * Gets the verifyShadowHost state.
   * @returns {boolean} True if verified, otherwise false.
   */
  get verifyShadowHost() {
    return this.#verifyShadowHost;
  }

  /**
   * Resets the evaluation state.
   * @returns {void}
   */
  reset() {
    this.#verifyShadowHost = false;
  }

  /**
   * Matches a selector for a shadow root.
   * @param {import('css-tree').CssNode} ast - The AST.
   * @param {DocumentFragment} node - The DocumentFragment node.
   * @param {object} [opt] - Options.
   * @returns {boolean} True if matches, otherwise false.
   */
  matchSelectorForShadowRoot(ast, node, opt = {}) {
    const { name: astName } = ast;
    if (KEYS_LOGICAL.has(astName)) {
      opt.isShadowRoot = true;
      return this.#evaluator.matchPseudoClassSelector(ast, node, opt);
    }
    if (astName === 'host' || astName === 'host-context') {
      const matches = this.evaluateShadowHost(ast, node, opt);
      if (matches) {
        this.#verifyShadowHost = true;
        return true;
      }
    }
    return false;
  }

  /**
   * Evaluates shadow host pseudo-classes.
   * @param {import('css-tree').CssNode} ast - The AST.
   * @param {DocumentFragment} node - The DocumentFragment node.
   * @returns {boolean} True if matches, otherwise false.
   */
  evaluateShadowHost(ast, node) {
    const { children: astChildren, name: astName } = ast;
    // Handle simple pseudo-class (no arguments).
    if (!Array.isArray(astChildren)) {
      if (astName === 'host') {
        return true;
      }
      const msg = `Invalid selector :${astName}`;
      this.#evaluator.onError(
        generateException(msg, SYNTAX_ERR, this.#evaluator.window)
      );
      return false;
    }
    // Handle functional pseudo-class like :host(...).
    if (astName !== 'host' && astName !== 'host-context') {
      const msg = `Invalid selector :${astName}()`;
      this.#evaluator.onError(
        generateException(msg, SYNTAX_ERR, this.#evaluator.window)
      );
      return false;
    }
    if (astChildren.length === 0) {
      const css = generateCSS(ast);
      const msg = `Invalid selector ${css}`;
      this.#evaluator.onError(
        generateException(msg, SYNTAX_ERR, this.#evaluator.window)
      );
      return false;
    }
    const { host } = node;
    for (const child of astChildren) {
      const { branches } = walkAST(child);
      for (const branch of branches) {
        if (astName === 'host' && this.#evaluateHostPseudo(branch, host, ast)) {
          return true;
        } else if (
          astName === 'host-context' &&
          this.#evaluateHostContextPseudo(branch, host, ast)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Evaluates the :host() pseudo-class.
   * @private
   * @param {Array<object>} leaves - The AST leaves.
   * @param {Element} host - The host element.
   * @param {import('css-tree').CssNode} ast - The original AST for error reporting.
   * @returns {boolean} True if matches, otherwise false.
   */
  #evaluateHostPseudo(leaves, host, ast) {
    const l = leaves.length;
    for (let i = 0; i < l; i++) {
      const leaf = leaves[i];
      if (leaf.type === COMBINATOR) {
        const css = generateCSS(ast);
        const msg = `Invalid selector ${css}`;
        this.#evaluator.onError(
          generateException(msg, SYNTAX_ERR, this.#evaluator.window)
        );
        return false;
      }
      if (!this.#evaluator.matchSelector(leaf, host)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluates the :host-context() pseudo-class.
   * @private
   * @param {Array<object>} leaves - The AST leaves.
   * @param {Element} host - The host element.
   * @param {import('css-tree').CssNode} ast - The original AST for error reporting.
   * @returns {boolean} True if matched, otherwise false.
   */
  #evaluateHostContextPseudo(leaves, host, ast) {
    let parent = host;
    while (parent) {
      let bool;
      const l = leaves.length;
      for (let i = 0; i < l; i++) {
        const leaf = leaves[i];
        if (leaf.type === COMBINATOR) {
          const css = generateCSS(ast);
          const msg = `Invalid selector ${css}`;
          this.#evaluator.onError(
            generateException(msg, SYNTAX_ERR, this.#evaluator.window)
          );
          return false;
        }
        bool = this.#evaluator.matchSelector(leaf, parent);
        if (!bool) {
          break;
        }
      }
      if (bool) {
        return true;
      }
      parent = parent.parentNode || parent.host;
    }
    return false;
  }
}
