/**
 * mapper.js
 */
import { SelectorProcessor } from './processor.js';
import { parseSelector, walkAST } from './parser.js';
import { createHasValidator } from './selector.js';

/**
 * Mapper
 * Maps CSS selectors to parsed ASTs and sets up node arrays.
 */
export class Mapper {
  #context;
  #processor;

  /**
   * @param {import('./finder.js').Finder} context - The Finder instance.
   */
  constructor(context) {
    this.#context = context;
    this.#processor = new SelectorProcessor(context);
  }

  /**
   * Gets the corresponding AST and empty nodes array for the given selector.
   * @param {string} selector - The CSS selector string.
   * @returns {[Array<import('./processor.js').ProcessedASTNode>, Array<Array<Element>>, import('css-tree').CssNode]} An array containing the processed AST, an array for nodes, and the original selector AST.
   */
  correspond(selector) {
    const ctx = this.#context;
    const nodes = [];
    let ast = null;
    // Check cache.
    if (ctx.documentCache.has(ctx.document)) {
      const cachedItem = ctx.documentCache.get(ctx.document);
      if (cachedItem && cachedItem.has(selector)) {
        const item = cachedItem.get(selector);
        ast = item.ast;
        ctx.invalidate = item.invalidate;
        ctx.selectorAST = item.selectorAST;
      }
    }
    // Clear flags for reuse if cache hit.
    if (ast) {
      const l = ast.length;
      const freshAst = new Array(l);
      for (let i = 0; i < l; i++) {
        freshAst[i] = {
          branch: ast[i].branch,
          dir: null,
          filtered: false,
          find: false
        };
        nodes[i] = [];
      }
      return [freshAst, nodes, ctx.selectorAST];
    }
    // Parse selector and build metadata.
    const selectorAST = parseSelector(selector);
    const { branches, info } = walkAST(
      selectorAST,
      true,
      createHasValidator(ctx.window)
    );
    const {
      hasHasPseudoFunc,
      hasNestingSelector,
      hasNthChildOfSelector,
      hasStatePseudoClass,
      hasUnsupportedPseudoClass
    } = info;
    // Determine invalidation flags.
    ctx.invalidate =
      hasHasPseudoFunc ||
      hasNestingSelector ||
      hasStatePseudoClass ||
      hasUnsupportedPseudoClass ||
      hasNthChildOfSelector;
    // Process branches.
    const processed = this.#processor.process(branches, selector);
    ast = processed.ast;
    const descendant = processed.descendant;
    // Store in cache.
    let cachedItem;
    if (ctx.documentCache.has(ctx.document)) {
      cachedItem = ctx.documentCache.get(ctx.document);
    } else {
      cachedItem = new Map();
      ctx.documentCache.set(ctx.document, cachedItem);
    }
    cachedItem.set(selector, {
      ast,
      descendant,
      invalidate: ctx.invalidate,
      selectorAST
    });
    // Initialize nodes.
    const l = ast.length;
    const freshAst = new Array(l);
    for (let i = 0; i < l; i++) {
      freshAst[i] = {
        branch: ast[i].branch,
        dir: null,
        filtered: false,
        find: false
      };
      nodes[i] = [];
    }
    return [freshAst, nodes, selectorAST];
  }
}
