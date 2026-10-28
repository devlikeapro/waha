/**
 * pseudo-class.js
 */

import {
  matchCheckedPseudoClass,
  matchDirectionPseudoClass,
  matchLanguagePseudoClass,
  matchLinkPseudoClass,
  matchOpenPseudoClass,
  matchPlaceholderShownPseudoClass,
  matchRangePseudoClass,
  matchReadOnlyPseudoClass,
  matchRequiredPseudoClass
} from './matcher.js';
import { generateCSS, unescapeSelector, walkAST } from './parser.js';
import {
  canUseFastClassSearch,
  canUseFastIdSearch,
  canUseFastTagSearch,
  findBestSeed,
  generateException,
  isCustomElement,
  isFocusVisible,
  isFocusableArea,
  populateHasAllowlist,
  traverseNode
} from './utility.js';
import {
  CLASS_SELECTOR,
  COMBINATOR,
  DIR_NEXT,
  DIR_PREV,
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE,
  FORM_PARTS,
  HEX,
  ID_SELECTOR,
  INPUT_CHECK,
  INPUT_DATE,
  INPUT_EDIT,
  INPUT_TEXT,
  KEYS_LOGICAL,
  NOT_SUPPORTED_ERR,
  PS_CLASS_SELECTOR,
  SHOW_ALL,
  SYNTAX_ERR,
  TEXT_NODE,
  TYPE_SELECTOR
} from './constant.js';
const KEYS_FORM_PS_VALID = new Set(FORM_PARTS);
const KEYS_INPUT_CHECK = new Set(INPUT_CHECK);
const KEYS_INPUT_PLACEHOLDER = new Set([...INPUT_TEXT, 'number']);
const KEYS_INPUT_RANGE = new Set([...INPUT_DATE, 'number', 'range']);
const KEYS_INPUT_REQUIRED = new Set([...INPUT_CHECK, ...INPUT_EDIT, 'file']);
const KEYS_INPUT_RESET = new Set(['button', 'reset']);
const KEYS_INPUT_SUBMIT = new Set(['image', 'submit']);
const KEYS_FORM_PS_DISABLED = new Set([
  ...FORM_PARTS,
  'fieldset',
  'optgroup',
  'option'
]);
const KEYS_PS_NTH_OF_TYPE = new Set([
  'first-of-type',
  'last-of-type',
  'only-of-type'
]);

/**
 * PseudoClassEvaluator
 * Handles the evaluation of CSS pseudo-classes.
 */
export class PseudoClassEvaluator {
  /* private fields */
  #evaluator;
  #anbCache;
  #astCache = new WeakMap();
  #documentURL;
  #focusWithinCache;
  #lastFocusVisible;
  #nthIndexCache;
  #psDefaultCache;
  #psDirCache;
  #psDisabledCache;
  #psHasFilterCache;
  #psIndeterminateCache;
  #psLangCache;
  #psValidCache;
  #setPool = [];
  #setPoolIndex = 0;

  /**
   * @param {import('./evaluator.js').Evaluator} evaluator - The Evaluator instance.
   */
  constructor(evaluator) {
    this.#evaluator = evaluator;
  }

  /**
   * Clears cached evaluation results.
   * @param {boolean} [all] - If true, clears all cached results.
   * @returns {void}
   */
  clearResults(all = false) {
    this.#anbCache = null;
    this.#focusWithinCache = null;
    this.#psDefaultCache = null;
    this.#psDirCache = null;
    this.#psDisabledCache = null;
    this.#psHasFilterCache = null;
    this.#psIndeterminateCache = null;
    this.#psLangCache = null;
    this.#psValidCache = null;
  }

  /**
   * Resets the evaluator state.
   * @returns {void}
   */
  reset() {
    this.#documentURL = null;
    this.#nthIndexCache = null;
    this.#setPool = [];
    this.#setPoolIndex = 0;
  }

  /**
   * Matches a pseudo-class selector.
   * @see https://html.spec.whatwg.org/_pseudo-classes
   * @param {import('css-tree').CssNode} ast - The AST.
   * @param {Element} node - The Element node.
   * @param {import('../index.js').FindOptions} [opt] - Options.
   * @returns {boolean} True if matches, otherwise false.
   */
  matchPseudoClassSelector(ast, node, opt = {}) {
    const { children: astChildren, name: astName } = ast;
    const { localName, parentNode } = node;
    const { forgive, warn = this.#evaluator.warn } = opt;
    if (Array.isArray(astChildren)) {
      // :has(), :is(), :not(), :where()
      if (KEYS_LOGICAL.has(astName)) {
        return this.#evaluateLogicalPseudo(ast, node, opt);
      }
      return this.#evaluatePseudoClassFunc(ast, node, opt);
    }
    if (KEYS_PS_NTH_OF_TYPE.has(astName)) {
      if (!parentNode) {
        return node === this.#evaluator.root;
      }
      const { localName, namespaceURI } = node;
      let hasPrev = false;
      let hasNext = false;
      let current = node.previousElementSibling;
      while (current) {
        if (
          current.localName === localName &&
          current.namespaceURI === namespaceURI
        ) {
          hasPrev = true;
          break;
        }
        current = current.previousElementSibling;
      }
      if (astName !== 'first-of-type') {
        current = node.nextElementSibling;
        while (current) {
          if (
            current.localName === localName &&
            current.namespaceURI === namespaceURI
          ) {
            hasNext = true;
            break;
          }
          current = current.nextElementSibling;
        }
      }
      switch (astName) {
        case 'first-of-type': {
          return !hasPrev;
        }
        case 'last-of-type': {
          return !hasNext;
        }
        case 'only-of-type':
        default: {
          return !hasPrev && !hasNext;
        }
      }
    }
    switch (astName) {
      case 'any-link':
      case 'link': {
        return matchLinkPseudoClass(node);
      }
      case 'checked': {
        return matchCheckedPseudoClass(node);
      }
      case 'defined': {
        if (node.hasAttribute('is') || localName.includes('-')) {
          return isCustomElement(node);
        }
        return (
          node instanceof this.#evaluator.window.HTMLElement ||
          node instanceof this.#evaluator.window.SVGElement
        );
      }
      case 'first-child':
      case 'last-child':
      case 'only-child': {
        if (!parentNode) {
          return node === this.#evaluator.root;
        }
        if (astName === 'first-child') {
          return node === parentNode.firstElementChild;
        }
        if (astName === 'last-child') {
          return node === parentNode.lastElementChild;
        }
        return (
          node === parentNode.firstElementChild &&
          node === parentNode.lastElementChild
        );
      }
      case 'in-range':
      case 'out-of-range': {
        return matchRangePseudoClass(astName, node, KEYS_INPUT_RANGE);
      }
      case 'open': {
        // <select> and <input type="color"> are not supported.
        return matchOpenPseudoClass(node);
      }
      case 'optional':
      case 'required': {
        return matchRequiredPseudoClass(astName, node, KEYS_INPUT_REQUIRED);
      }
      case 'placeholder-shown': {
        return matchPlaceholderShownPseudoClass(node, KEYS_INPUT_PLACEHOLDER);
      }
      case 'read-only':
      case 'read-write': {
        return matchReadOnlyPseudoClass(astName, node);
      }
      case 'root': {
        return node === this.#evaluator.document.documentElement;
      }
      case 'scope': {
        if (this.#evaluator.node.nodeType === ELEMENT_NODE) {
          return !this.#evaluator.shadow && node === this.#evaluator.node;
        }
        return node === this.#evaluator.document.documentElement;
      }
      // Handled by private methods.
      case 'active': {
        return this.#matchActivePseudoClass(node);
      }
      case 'default': {
        return this.#matchDefaultPseudoClass(node);
      }
      case 'disabled':
      case 'enabled': {
        return this.#matchDisabledPseudoClass(astName, node);
      }
      case 'empty': {
        return this.#matchEmptyPseudoClass(node);
      }
      case 'focus': {
        return this.#matchFocusPseudoClass(node);
      }
      case 'focus-visible': {
        return this.#matchFocusVisiblePseudoClass(node);
      }
      case 'focus-within': {
        return this.#matchFocusWithinPseudoClass(node);
      }
      case 'hover': {
        return this.#matchHoverPseudoClass(node);
      }
      case 'indeterminate': {
        return this.#matchIndeterminatePseudoClass(node);
      }
      case 'invalid':
      case 'valid': {
        return this.#matchValidityPseudoClass(astName, node);
      }
      case 'local-link': {
        return this.#matchLocalLinkPseudoClass(node);
      }
      case 'target': {
        return this.#matchTargetPseudoClass(node);
      }
      // No-op pseudo-classes.
      case 'host': {
        break;
      }
      case 'popover-open': {
        // FIXME: Not implemented in jsdom
        // @see https://github.com/jsdom/jsdom/issues/3721
        // return node.popover && isVisible(node);
        break;
      }
      case 'visited': {
        // Prevent fingerprinting.
        break;
      }
      // Legacy pseudo-elements.
      case 'after':
      case 'before':
      case 'first-letter':
      case 'first-line': {
        if (warn) {
          this.#evaluator.onError(
            generateException(
              `Unsupported pseudo-element ::${astName}`,
              NOT_SUPPORTED_ERR,
              this.#evaluator.window
            )
          );
        }
        break;
      }
      // Not supported.
      case 'autofill':
      case 'blank':
      case 'buffering':
      case 'current':
      case 'fullscreen':
      case 'future':
      case 'has-slotted':
      case 'heading':
      case 'modal':
      case 'muted':
      case 'past':
      case 'paused':
      case 'picture-in-picture':
      case 'playing':
      case 'seeking':
      case 'stalled':
      case 'user-invalid':
      case 'user-valid':
      case 'volume-locked':
      case '-webkit-autofill': {
        if (warn) {
          this.#evaluator.onError(
            generateException(
              `Unsupported pseudo-class :${astName}`,
              NOT_SUPPORTED_ERR,
              this.#evaluator.window
            )
          );
        }
        break;
      }
      default: {
        if (astName.startsWith('-webkit-')) {
          if (warn) {
            this.#evaluator.onError(
              generateException(
                `Unsupported pseudo-class :${astName}`,
                NOT_SUPPORTED_ERR,
                this.#evaluator.window
              )
            );
          }
        } else if (!forgive) {
          this.#evaluator.onError(
            generateException(
              `Unknown pseudo-class :${astName}`,
              SYNTAX_ERR,
              this.#evaluator.window
            )
          );
        }
      }
    }
    return false;
  }

  /**
   * Evaluates logical pseudo-class selector.
   * @private
   * @param {import('css-tree').CssNode} ast - The AST.
   * @param {Element} node - The Element node.
   * @param {import('../index.js').FindOptions} opt - Options.
   * @returns {boolean} True if matches, otherwise false.
   */
  #evaluateLogicalPseudo(ast, node, opt) {
    const { children: astChildren, name: astName } = ast;
    if (!astChildren.length && astName !== 'is' && astName !== 'where') {
      const css = generateCSS(ast);
      this.#evaluator.onError(
        generateException(
          `Invalid selector ${css}`,
          SYNTAX_ERR,
          this.#evaluator.window
        )
      );
      return false;
    }
    const cachedAstData = this.#astCache.get(ast);
    if (cachedAstData) {
      return this.#matchLogicalPseudoFunc(cachedAstData, node, opt);
    }
    const { branches } = walkAST(ast);
    if (astName === 'has') {
      const astData = { astName, branches };
      this.#astCache.set(ast, astData);
      return this.#matchLogicalPseudoFunc(astData, node, opt);
    }
    let isInvalidShadow = false;
    const twigBranches = [];
    const l = branches.length;
    for (let i = 0; i < l; i++) {
      const leaves = branches[i];
      const branch = [];
      const leavesSet = new Set();
      const leavesLen = leaves.length;
      if (!isInvalidShadow && astName !== 'has') {
        if (leavesLen > 1) {
          isInvalidShadow = true;
        } else if (astName === 'not') {
          const [{ type: childAstType }] = leaves;
          if (childAstType !== PS_CLASS_SELECTOR) {
            isInvalidShadow = true;
          }
        }
      }
      for (let j = 0; j < leavesLen; j++) {
        const item = leaves[j];
        if (item.type === COMBINATOR) {
          branch.push({ combo: item, leaves: [...leavesSet] });
          leavesSet.clear();
        } else {
          leavesSet.add(item);
        }
        if (j === leavesLen - 1) {
          branch.push({ combo: null, leaves: [...leavesSet] });
          leavesSet.clear();
        }
      }
      twigBranches.push(branch);
    }
    const astData = { astName, isInvalidShadow, twigBranches };
    this.#astCache.set(ast, astData);
    return this.#matchLogicalPseudoFunc(astData, node, opt);
  }

  /**
   * Evaluates pseudo-class function.
   * @private
   * @see https://html.spec.whatwg.org/_pseudo-classes
   * @param {import('css-tree').CssNode} ast - The AST.
   * @param {Element} node - The Element node.
   * @param {import('../index.js').FindOptions} [opt] - Options.
   * @returns {boolean} True if matches, otherwise false.
   */
  #evaluatePseudoClassFunc(ast, node, opt = {}) {
    const { children: astChildren, name: astName } = ast;
    const { forgive, warn = this.#evaluator.warn } = opt;
    if (/^nth-(?:last-)?(?:child|of-type)$/.test(astName)) {
      if (astChildren.length !== 1) {
        const css = generateCSS(ast);
        this.#evaluator.onError(
          generateException(
            `Invalid selector ${css}`,
            SYNTAX_ERR,
            this.#evaluator.window
          )
        );
        return false;
      }
      const [branch] = astChildren;
      return this.#matchAnPlusB(branch, node, astName, opt);
    }
    switch (astName) {
      case 'dir': {
        if (astChildren.length !== 1) {
          const css = generateCSS(ast);
          this.#evaluator.onError(
            generateException(
              `Invalid selector ${css}`,
              SYNTAX_ERR,
              this.#evaluator.window
            )
          );
          return false;
        }
        const [astChild] = astChildren;
        if (!this.#psDirCache) {
          this.#psDirCache = new WeakMap();
        }
        return matchDirectionPseudoClass(astChild, node, this.#psDirCache);
      }
      case 'lang': {
        if (!astChildren.length) {
          const css = generateCSS(ast);
          this.#evaluator.onError(
            generateException(
              `Invalid selector ${css}`,
              SYNTAX_ERR,
              this.#evaluator.window
            )
          );
          return false;
        }
        if (!this.#psLangCache) {
          this.#psLangCache = new WeakMap();
        }
        let bool;
        for (const astChild of astChildren) {
          bool = matchLanguagePseudoClass(astChild, node, this.#psLangCache);
          if (bool) {
            break;
          }
        }
        return !!bool;
      }
      case 'state': {
        if (isCustomElement(node)) {
          const [{ value: stateValue }] = astChildren;
          if (stateValue) {
            if (node[stateValue]) {
              return true;
            }
            for (const i in node) {
              const prop = node[i];
              if (prop instanceof this.#evaluator.window.ElementInternals) {
                if (prop?.states?.has(stateValue)) {
                  return true;
                }
                break;
              }
            }
          }
        }
        break;
      }
      // Ignore :host() and :host-context().
      case 'host':
      case 'host-context': {
        break;
      }
      // Not supported.
      case 'current':
      case 'heading':
      case 'nth-col':
      case 'nth-last-col': {
        if (warn) {
          this.#evaluator.onError(
            generateException(
              `Unsupported pseudo-class :${astName}()`,
              NOT_SUPPORTED_ERR,
              this.#evaluator.window
            )
          );
        }
        break;
      }
      // Deprecated in CSS Selectors 3.
      case 'contains': {
        if (warn) {
          this.#evaluator.onError(
            generateException(
              `Unknown pseudo-class :${astName}()`,
              NOT_SUPPORTED_ERR,
              this.#evaluator.window
            )
          );
        }
        break;
      }
      default: {
        if (!forgive) {
          this.#evaluator.onError(
            generateException(
              `Unknown pseudo-class :${astName}()`,
              SYNTAX_ERR,
              this.#evaluator.window
            )
          );
        }
      }
    }
    return false;
  }

  /**
   * Evaluates the :active pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchActivePseudoClass(node) {
    const { buttons, target, type } =
      this.#evaluator.eventHandler.currentEvent ?? {};
    return (
      type === 'mousedown' &&
      (buttons & 1) === 1 &&
      target?.nodeType === ELEMENT_NODE &&
      node.contains(target)
    );
  }

  /**
   * Evaluates the :default pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchDefaultPseudoClass(node) {
    const { localName } = node;
    if (localName === 'option') {
      return node.hasAttribute('selected');
    }
    const attrType = node.getAttribute('type');
    if (
      localName === 'input' &&
      node.hasAttribute('type') &&
      node.hasAttribute('checked')
    ) {
      return KEYS_INPUT_CHECK.has(attrType);
    }
    if (
      (localName === 'button' &&
        !(node.hasAttribute('type') && KEYS_INPUT_RESET.has(attrType))) ||
      (localName === 'input' &&
        node.hasAttribute('type') &&
        KEYS_INPUT_SUBMIT.has(attrType))
    ) {
      let form = node.parentNode;
      while (form) {
        if (form.localName === 'form') {
          break;
        }
        form = form.parentNode;
      }
      if (form) {
        if (!this.#psDefaultCache) {
          this.#psDefaultCache = new WeakMap();
        }
        let defaultSubmit = this.#psDefaultCache.get(form);
        if (defaultSubmit === undefined) {
          const walker = this.#evaluator.createTreeWalker(form, {
            force: true
          });
          let refNode = traverseNode(form, walker);
          refNode = walker.firstChild();
          while (refNode) {
            const nodeName = refNode.localName;
            const nodeAttrType = refNode.getAttribute('type');
            let m;
            if (nodeName === 'button') {
              m = !(
                refNode.hasAttribute('type') &&
                KEYS_INPUT_RESET.has(nodeAttrType)
              );
            } else if (nodeName === 'input') {
              m =
                refNode.hasAttribute('type') &&
                KEYS_INPUT_SUBMIT.has(nodeAttrType);
            }
            if (m) {
              defaultSubmit = refNode;
              break;
            }
            refNode = walker.nextNode();
          }
          this.#psDefaultCache.set(form, defaultSubmit);
        }
        return defaultSubmit === node;
      }
    }
    return false;
  }

  /**
   * Evaluates the :disabled and :enabled pseudo-classes with tree-caching.
   * @private
   * @param {string} astName - The pseudo-class name ('disabled' or 'enabled').
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchDisabledPseudoClass(astName, node) {
    const { localName, parentNode } = node;
    if (
      !KEYS_FORM_PS_DISABLED.has(localName) &&
      !isCustomElement(node, { formAssociated: true })
    ) {
      return false;
    }
    if (node.disabled || node.hasAttribute('disabled')) {
      return astName === 'disabled';
    }
    if (!this.#psDisabledCache) {
      this.#psDisabledCache = new WeakMap();
    }
    let isDisabled = this.#psDisabledCache.get(node);
    if (isDisabled !== undefined) {
      if (astName === 'disabled') {
        return isDisabled;
      }
      return !isDisabled;
    }
    isDisabled = false;
    if (localName === 'option') {
      if (
        parentNode &&
        parentNode.localName === 'optgroup' &&
        (parentNode.disabled || parentNode.hasAttribute('disabled'))
      ) {
        isDisabled = true;
      }
    } else if (localName !== 'optgroup') {
      let current = parentNode;
      while (current) {
        if (current.localName === 'fieldset') {
          if (current.disabled || current.hasAttribute('disabled')) {
            let legend;
            let element = current.firstElementChild;
            while (element) {
              if (element.localName === 'legend') {
                legend = element;
                break;
              }
              element = element.nextElementSibling;
            }
            if (!legend || !legend.contains(node)) {
              isDisabled = true;
              break;
            }
          }
        }
        current = current.parentNode;
      }
    }
    if (isDisabled) {
      this.#psDisabledCache.set(node, isDisabled);
    }
    if (astName === 'disabled') {
      return isDisabled;
    }
    return !isDisabled;
  }

  /**
   * Evaluates the :empty pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchEmptyPseudoClass(node) {
    if (!node.hasChildNodes()) {
      return true;
    }
    const walker = this.#evaluator.createTreeWalker(node, {
      force: true,
      whatToShow: SHOW_ALL
    });
    let refNode = walker.firstChild();
    let bool;
    while (refNode) {
      bool =
        refNode.nodeType !== ELEMENT_NODE && refNode.nodeType !== TEXT_NODE;
      if (!bool) {
        break;
      }
      refNode = walker.nextSibling();
    }
    return bool;
  }

  /**
   * Evaluates the :focus pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchFocusPseudoClass(node) {
    const { activeElement } = this.#evaluator.document;
    if (!activeElement) {
      return false;
    }
    let active = activeElement;
    while (active) {
      if (node === active) {
        if (active.shadowRoot && active.shadowRoot.activeElement) {
          return true;
        }
        return isFocusableArea(node);
      }
      if (active.shadowRoot && active.shadowRoot.activeElement) {
        active = active.shadowRoot.activeElement;
      } else {
        break;
      }
    }
    return false;
  }

  /**
   * Evaluates the :focus-visible pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchFocusVisiblePseudoClass(node) {
    if (
      node === this.#evaluator.document.activeElement &&
      isFocusableArea(node)
    ) {
      let bool = false;
      if (isFocusVisible(node)) {
        bool = true;
      } else if (this.#evaluator.eventHandler.currentFocus) {
        const { relatedTarget, target: focusTarget } =
          this.#evaluator.eventHandler.currentFocus;
        if (focusTarget === node) {
          if (isFocusVisible(relatedTarget)) {
            bool = true;
          } else if (this.#evaluator.eventHandler.currentEvent) {
            const { altKey, ctrlKey, key, metaKey, target, type } =
              this.#evaluator.eventHandler.currentEvent;
            if (target === relatedTarget) {
              if (
                !this.#lastFocusVisible ||
                focusTarget === this.#lastFocusVisible
              ) {
                bool = true;
              }
            } else if (key === 'Tab') {
              if (
                (type === 'keydown' && target !== node) ||
                (type === 'keyup' && target === node)
              ) {
                if (target === focusTarget) {
                  if (
                    !this.#lastFocusVisible ||
                    (target === this.#lastFocusVisible &&
                      relatedTarget === null)
                  ) {
                    bool = true;
                  }
                } else {
                  bool = true;
                }
              }
            } else if (key) {
              if (
                (type === 'keydown' || type === 'keyup') &&
                !altKey &&
                !ctrlKey &&
                !metaKey &&
                target === node
              ) {
                bool = true;
              }
            }
          } else if (
            relatedTarget === null ||
            relatedTarget === this.#lastFocusVisible
          ) {
            bool = true;
          }
        }
      }
      if (bool) {
        this.#lastFocusVisible = node;
        return bool;
      }
      if (this.#lastFocusVisible === node) {
        this.#lastFocusVisible = null;
      }
    }
    return false;
  }

  /**
   * Evaluates the :focus-within pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchFocusWithinPseudoClass(node) {
    if (!this.#focusWithinCache) {
      this.#focusWithinCache = new Set();
      let currentFocus = this.#evaluator.document.activeElement;
      while (currentFocus?.shadowRoot?.activeElement) {
        currentFocus = currentFocus.shadowRoot.activeElement;
      }
      if (currentFocus && isFocusableArea(currentFocus)) {
        while (currentFocus) {
          this.#focusWithinCache.add(currentFocus);
          if (currentFocus.parentNode) {
            currentFocus = currentFocus.parentNode;
          } else if (
            currentFocus.nodeType === DOCUMENT_FRAGMENT_NODE &&
            currentFocus.host
          ) {
            currentFocus = currentFocus.host;
          } else {
            break;
          }
        }
      }
    }
    return this.#focusWithinCache.has(node);
  }

  /**
   * Evaluates the :hover pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchHoverPseudoClass(node) {
    const { target, type } = this.#evaluator.eventHandler.currentEvent ?? {};
    return (
      /^(?:click|mouse(?:down|over|up))$/.test(type) &&
      target?.nodeType === ELEMENT_NODE &&
      node.contains(target)
    );
  }

  /**
   * Evaluates the :indeterminate pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchIndeterminatePseudoClass(node) {
    const { localName } = node;
    if (localName === 'progress') {
      return !node.hasAttribute('value');
    }
    if (localName === 'input' && node.type === 'checkbox') {
      return node.indeterminate;
    }
    if (localName === 'input' && node.type === 'radio') {
      if (node.checked || node.hasAttribute('checked')) {
        return false;
      }
      const nodeName = node.name;
      let parent = node.parentNode;
      while (parent) {
        if (parent.localName === 'form') {
          break;
        }
        parent = parent.parentNode;
      }
      if (!parent) {
        parent = this.#evaluator.document.documentElement;
      }
      if (!this.#psIndeterminateCache) {
        this.#psIndeterminateCache = new WeakMap();
      }
      let parentCache = this.#psIndeterminateCache.get(parent);
      if (parentCache === undefined) {
        parentCache = new Map();
        this.#psIndeterminateCache.set(parent, parentCache);
      }
      let checked = parentCache.get(nodeName);
      if (checked === undefined) {
        const walker = this.#evaluator.createTreeWalker(parent, {
          force: true
        });
        let refNode = traverseNode(parent, walker);
        refNode = walker.firstChild();
        while (refNode) {
          if (
            refNode.localName === 'input' &&
            refNode.getAttribute('type') === 'radio'
          ) {
            if (nodeName && refNode.getAttribute('name') === nodeName) {
              checked = !!refNode.checked;
            }
            if (checked) {
              break;
            }
          }
          refNode = walker.nextNode();
        }
        checked = !!checked;
        parentCache.set(nodeName, checked);
      }
      return !checked;
    }
    return false;
  }

  /**
   * Evaluates the :local-link pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchLocalLinkPseudoClass(node) {
    const { localName } = node;
    if (
      (localName === 'a' || localName === 'area') &&
      node.hasAttribute('href')
    ) {
      if (!this.#documentURL) {
        this.#documentURL = new URL(this.#evaluator.document.URL);
      }
      const { href, origin, pathname } = this.#documentURL;
      const attrURL = new URL(node.getAttribute('href'), href);
      return attrURL.origin === origin && attrURL.pathname === pathname;
    }
    return false;
  }

  /**
   * Evaluates the :target pseudo-class.
   * @private
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchTargetPseudoClass(node) {
    if (!this.#documentURL) {
      this.#documentURL = new URL(this.#evaluator.document.URL);
    }
    const { hash } = this.#documentURL;
    return !!(
      hash &&
      hash === `#${node.id}` &&
      this.#evaluator.document.contains(node)
    );
  }

  /**
   * Evaluates the :valid and :invalid pseudo-classes.
   * @private
   * @param {string} astName - The name of the pseudo-class.
   * @param {Element} node - The Element node.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchValidityPseudoClass(astName, node) {
    const { localName } = node;
    if (KEYS_FORM_PS_VALID.has(localName)) {
      let { valid } = node.validity;
      if (node.maxLength >= 0) {
        valid = node.maxLength >= node.value.length;
      }
      if (valid && node.minLength >= 0) {
        valid = node.minLength <= node.value.length;
      }
      return astName === 'invalid' ? !valid : valid;
    }
    if (localName === 'form' || localName === 'fieldset') {
      if (!this.#psValidCache) {
        this.#psValidCache = new WeakMap();
      }
      let valid = this.#psValidCache.get(node);
      if (valid === undefined) {
        const walker = this.#evaluator.createTreeWalker(node, { force: true });
        let refNode = traverseNode(node, walker);
        refNode = walker.firstChild();
        if (!refNode) {
          valid = true;
        } else {
          while (refNode) {
            if (KEYS_FORM_PS_VALID.has(refNode.localName)) {
              valid = refNode.validity.valid;
              if (refNode.maxLength >= 0) {
                valid = refNode.maxLength >= refNode.value.length;
              }
              if (valid && refNode.minLength >= 0) {
                valid = refNode.minLength <= refNode.value.length;
              }
              if (!valid) {
                break;
              }
            }
            refNode = walker.nextNode();
          }
        }
        this.#psValidCache.set(node, valid);
      }
      return astName === 'invalid' ? !valid : valid;
    }
    return false;
  }

  /**
   * Evaluates An+B mathematically.
   * @private
   * @param {import('css-tree').CssNode} ast - The AST.
   * @param {Element} node - The Element node.
   * @param {string} nthName - The name of the nth pseudo-class.
   * @param {import('../index.js').FindOptions} opt - Options.
   * @returns {boolean} True if matches, otherwise false.
   */
  #matchAnPlusB(ast, node, nthName, opt) {
    const { parentNode } = node;
    if (!parentNode && node !== this.#evaluator.root) {
      return false;
    }
    if (!this.#anbCache) {
      this.#anbCache = new WeakMap();
    }
    let anb = this.#anbCache.get(ast);
    if (anb === undefined) {
      const {
        nth: { a, b, name: nthIdentName },
        selector
      } = ast;
      anb = {
        a: 0,
        b: 0,
        isLast: nthName.includes('last'),
        isOfType: nthName.includes('of-type'),
        selector: null
      };
      if (nthIdentName) {
        if (nthIdentName === 'even') {
          anb.a = 2;
          anb.b = 0;
        } else if (nthIdentName === 'odd') {
          anb.a = 2;
          anb.b = 1;
        }
      } else {
        const intA = parseInt(a);
        if (Number.isInteger(intA)) {
          anb.a = intA;
        }
        const intB = parseInt(b);
        if (Number.isInteger(intB)) {
          anb.b = intB;
        }
      }
      if (selector && /^nth-(?:last-)?child$/.test(nthName)) {
        anb.selector = selector;
      }
      this.#anbCache.set(ast, anb);
    }
    const { a, b, isLast, isOfType, selector: anbSelector } = anb;
    let pos;
    if (!parentNode) {
      if (anbSelector) {
        const selectorBranches = this.#getSelectorBranches(anbSelector);
        if (
          !this.#filterNthChildOfSelectorBranches(selectorBranches, node, opt)
        ) {
          return false;
        }
      }
      pos = 1;
    } else {
      if (!this.#nthIndexCache) {
        this.#nthIndexCache = new WeakMap();
      }
      let parentCache = this.#nthIndexCache.get(parentNode);
      if (parentCache === undefined) {
        parentCache = new Map();
        this.#nthIndexCache.set(parentNode, parentCache);
      }
      let indexMap = parentCache.get(ast);
      if (indexMap === undefined) {
        indexMap = new Map();
        parentCache.set(ast, indexMap);
        let currentPos = 1;
        let current = isLast
          ? parentNode.lastElementChild
          : parentNode.firstElementChild;
        if (anbSelector) {
          const selectorBranches = this.#getSelectorBranches(anbSelector);
          while (current) {
            if (
              this.#filterNthChildOfSelectorBranches(
                selectorBranches,
                current,
                opt
              )
            ) {
              indexMap.set(current, currentPos++);
            }
            current = isLast
              ? current.previousElementSibling
              : current.nextElementSibling;
          }
        } else {
          const typeCounts = new Map();
          while (current) {
            if (isOfType) {
              const typeKey = `${current.localName}|${current.namespaceURI}`;
              const tPos = (typeCounts.get(typeKey) || 0) + 1;
              typeCounts.set(typeKey, tPos);
              indexMap.set(current, tPos);
            } else {
              indexMap.set(current, currentPos++);
            }
            current = isLast
              ? current.previousElementSibling
              : current.nextElementSibling;
          }
        }
      }
      pos = indexMap.get(node);
      if (pos === undefined) {
        return false;
      }
    }
    if (a === 0) {
      return pos === b;
    }
    const diff = pos - b;
    if (diff % a !== 0) {
      return false;
    }
    return a > 0 ? diff >= 0 : diff <= 0;
  }

  /**
   * Gets selector branches from cache or parses them.
   * @private
   * @param {import('css-tree').CssNode} selector - The AST.
   * @returns {Array<Array<import('css-tree').CssNode>>} The selector branches.
   */
  #getSelectorBranches(selector) {
    let branches = this.#astCache.get(selector);
    if (branches) {
      return branches;
    }
    const walkedResult = walkAST(selector);
    branches = walkedResult.branches;
    this.#astCache.set(selector, branches);
    return branches;
  }

  /**
   * Checks if a node matches any of the given selector branches.
   * @private
   * @param {Array<Array<import('css-tree').CssNode>>} branches - The selector branches to test.
   * @param {Element} node - The element node to match against.
   * @param {import('../index.js').FindOptions} opt - Options.
   * @returns {boolean} True if any branch matches, otherwise false.
   */
  #filterNthChildOfSelectorBranches(branches, node, opt) {
    let filterMatch = false;
    for (const branch of branches) {
      if (this.#evaluator.matchLeaves(branch, node, opt)) {
        filterMatch = true;
        break;
      }
    }
    return filterMatch;
  }

  /**
   * Matches logical pseudo-class functions.
   * @private
   * @param {import('css-tree').CssNode} astData - The AST data.
   * @param {Element} node - The Element node.
   * @param {import('../index.js').FindOptions} [opt] - Options.
   * @returns {boolean} True if matches, otherwise false.
   */
  #matchLogicalPseudoFunc(astData, node, opt = {}) {
    const { astName, isInvalidShadow, twigBranches } = astData;
    if (astName === 'has') {
      return this.#evaluateHasPseudo(astData, node, opt) === node;
    }
    const isShadowRoot =
      (opt.isShadowRoot || this.#evaluator.shadow) &&
      node.nodeType === DOCUMENT_FRAGMENT_NODE;
    if (isShadowRoot && isInvalidShadow) {
      return false;
    }
    const prevForgive = opt.forgive;
    const prevDir = opt.dir;
    opt.forgive = astName === 'is' || astName === 'where';
    opt.dir = undefined;
    const l = twigBranches.length;
    let bool = false;
    for (let i = 0; i < l; i++) {
      const branch = twigBranches[i];
      const lastIndex = branch.length - 1;
      const { leaves } = branch[lastIndex];
      bool = this.#evaluator.matchLeaves(leaves, node, opt);
      if (bool && lastIndex > 0) {
        const initialPoolIndex = this.#setPoolIndex;
        let currentNodes = this.#acquireSet();
        currentNodes.add(node);
        for (let j = lastIndex - 1; j >= 0; j--) {
          const twig = branch[j];
          const isLastStep = j === 0;
          const nextNodes = isLastStep ? null : this.#acquireSet();
          let hasMatch = false;
          opt.dir = DIR_PREV;
          for (const nextNode of currentNodes) {
            for (const matchedNode of this.#evaluator.yieldCombinatorMatches(
              twig,
              nextNode,
              opt
            )) {
              hasMatch = true;
              if (isLastStep) {
                break;
              }
              nextNodes.add(matchedNode);
            }
            if (isLastStep && hasMatch) {
              break;
            }
          }
          if (!hasMatch) {
            bool = false;
            break;
          }
          if (isLastStep) {
            bool = true;
          } else {
            currentNodes = nextNodes;
          }
        }
        this.#setPoolIndex = initialPoolIndex;
      }
      if (bool) {
        break;
      }
    }
    opt.forgive = prevForgive;
    opt.dir = prevDir;
    return astName === 'not' ? !bool : bool;
  }

  /**
   * Evaluates :has() pseudo-class.
   * @private
   * @param {import('css-tree').CssNode} astData - The AST data.
   * @param {Element} node - The Element node.
   * @param {import('../index.js').FindOptions} [opt] - Options.
   * @returns {Element|null} The matched node.
   */
  #evaluateHasPseudo(astData, node, opt = {}) {
    const { branches } = astData;
    let bool = false;
    if (!this.#psHasFilterCache) {
      this.#psHasFilterCache = new WeakMap();
    }
    let rootCache = this.#psHasFilterCache.get(this.#evaluator.root);
    if (rootCache === undefined) {
      rootCache = new WeakMap();
      this.#psHasFilterCache.set(this.#evaluator.root, rootCache);
    }
    for (const leaves of branches) {
      if (!rootCache.has(leaves)) {
        const filterResult = this.#buildHasAllowlist(leaves);
        rootCache.set(leaves, filterResult);
      }
      const allowlist = rootCache.get(leaves);
      if (
        allowlist &&
        allowlist.seeded &&
        node.nodeType !== DOCUMENT_FRAGMENT_NODE &&
        !allowlist.set.has(node)
      ) {
        continue;
      }
      bool = this.#matchHasPseudoFunc(leaves, node, opt);
      if (bool) {
        break;
      }
    }
    if (!bool) {
      return null;
    }
    if (
      (opt.isShadowRoot || this.#evaluator.shadow) &&
      node.nodeType === DOCUMENT_FRAGMENT_NODE
    ) {
      return this.#evaluator.verifyShadowHost ? node : null;
    }
    return node;
  }

  /**
   * Builds an Allowlist for the :has() branch using a sparse seed element.
   * @private
   * @param {Array<import('css-tree').CssNode>} leaves - The AST leaves of the selector branch.
   * @returns {object|null} The wrapper object containing the WeakSet, or null.
   */
  #buildHasAllowlist(leaves) {
    if (
      this.#evaluator.shadow ||
      this.#evaluator.node.nodeType === DOCUMENT_FRAGMENT_NODE
    ) {
      return null;
    }
    const { seed } = findBestSeed(leaves);
    if (!seed) {
      return null;
    }
    let seedElements = null;
    let isSingleNode = false;
    if (seed.type === 'id') {
      if (typeof this.#evaluator.root.getElementById === 'function') {
        const node = this.#evaluator.root.getElementById(seed.value);
        if (node) {
          seedElements = node;
          isSingleNode = true;
        }
      }
    } else if (seed.type === 'class') {
      if (typeof this.#evaluator.root.getElementsByClassName === 'function') {
        seedElements = this.#evaluator.root.getElementsByClassName(seed.value);
      }
    } else if (seed.type === 'tag') {
      if (typeof this.#evaluator.root.getElementsByTagName === 'function') {
        seedElements = this.#evaluator.root.getElementsByTagName(seed.value);
      }
    }
    if (!seedElements) {
      return null;
    }
    const len = isSingleNode ? 1 : seedElements.length;
    if (len === 0 || len > HEX * HEX) {
      return null;
    }
    const filterResult = { seeded: true, set: new WeakSet() };
    const list = filterResult.set;
    const visitedAncestors = new Set();
    if (this.#evaluator.node) {
      list.add(this.#evaluator.node);
    }
    for (let i = 0; i < len; i++) {
      const current = isSingleNode ? seedElements : seedElements[i];
      if (current) {
        populateHasAllowlist(current, list, visitedAncestors);
      }
    }
    return filterResult;
  }

  /**
   * Retrieves a cleared Set from the pool.
   * @private
   * @returns {Set<object>} A cleared Set instance.
   */
  #acquireSet() {
    if (this.#setPoolIndex === this.#setPool.length) {
      this.#setPool.push(new Set());
    }
    const set = this.#setPool[this.#setPoolIndex++];
    set.clear();
    return set;
  }

  /**
   * Matches the :has() pseudo-class function.
   * @private
   * @param {Array<import('css-tree').CssNode>} astLeaves - The AST leaves.
   * @param {Element} node - The Element node.
   * @param {import('../index.js').FindOptions} [opt] - Options.
   * @returns {boolean} True if matched, otherwise false.
   */
  #matchHasPseudoFunc(astLeaves, node, opt = {}) {
    let combo;
    let startIndex = 0;
    if (astLeaves[0].type === COMBINATOR) {
      combo = astLeaves[0];
      startIndex = 1;
    } else {
      combo = { name: ' ', type: COMBINATOR };
      startIndex = 0;
    }
    const twigLeaves = [];
    const l = astLeaves.length;
    let nextComboIndex = startIndex;
    for (; nextComboIndex < l; nextComboIndex++) {
      if (astLeaves[nextComboIndex].type === COMBINATOR) {
        break;
      }
      twigLeaves.push(astLeaves[nextComboIndex]);
    }
    const twig = { combo, leaves: twigLeaves };
    opt.dir = DIR_NEXT;
    const remainingLeaves = astLeaves.slice(nextComboIndex);
    return this.#hasCombinatorMatch(twig, node, remainingLeaves, opt);
  }

  /**
   * Evaluates if any combinator match satisfies the condition to short-circuit.
   * @private
   * @param {import('./processor.js').ProcessedBranch} twig - The AST twig object.
   * @param {Element} node - The Element node.
   * @param {Array<object>} remainingLeaves - The remaining AST leaves.
   * @param {import('../index.js').FindOptions} opt - Options.
   * @returns {boolean} True if matched, otherwise false.
   */
  #hasCombinatorMatch(twig, node, remainingLeaves, opt) {
    const {
      combo: { name: comboName },
      leaves
    } = twig;
    const isLastLeaf = remainingLeaves.length === 0;
    switch (comboName) {
      case '+': {
        const refNode = node.nextElementSibling;
        return refNode
          ? this.#checkNode(refNode, leaves, remainingLeaves, opt)
          : false;
      }
      case '~': {
        let refNode = node.nextElementSibling;
        while (refNode) {
          if (this.#checkNode(refNode, leaves, remainingLeaves, opt)) {
            return true;
          }
          refNode = refNode.nextElementSibling;
        }
        return false;
      }
      case '>': {
        let refNode = node.firstElementChild;
        while (refNode) {
          if (this.#checkNode(refNode, leaves, remainingLeaves, opt)) {
            return true;
          }
          refNode = refNode.nextElementSibling;
        }
        return false;
      }
      case ' ':
      default: {
        const [leaf] = leaves;
        const filterLeaves = this.#evaluator.getFilterLeaves(leaves);
        const isLastFilter = filterLeaves.length === 0;
        if (leaf.type === CLASS_SELECTOR && canUseFastClassSearch(node)) {
          const leafName = unescapeSelector(leaf.name);
          const collection = node.getElementsByClassName(leafName);
          for (let i = 0, len = collection.length; i < len; i++) {
            const item = collection[i];
            if (
              isLastFilter ||
              this.#evaluator.matchLeaves(filterLeaves, item, opt)
            ) {
              if (isLastLeaf) {
                return true;
              }
              if (this.#matchHasPseudoFunc(remainingLeaves, item, opt)) {
                return true;
              }
            }
          }
          return false;
        }
        if (
          leaf.type === TYPE_SELECTOR &&
          canUseFastTagSearch(node, leaf.name) &&
          leaf.name !== '*'
        ) {
          const leafName = unescapeSelector(leaf.name);
          const collection = node.getElementsByTagName(leafName);
          for (let i = 0, len = collection.length; i < len; i++) {
            const item = collection[i];
            if (
              isLastFilter ||
              this.#evaluator.matchLeaves(filterLeaves, item, opt)
            ) {
              if (isLastLeaf) {
                return true;
              }
              if (this.#matchHasPseudoFunc(remainingLeaves, item, opt)) {
                return true;
              }
            }
          }
          return false;
        }
        if (
          leaf.type === ID_SELECTOR &&
          canUseFastIdSearch(node, this.#evaluator.root)
        ) {
          const leafName = unescapeSelector(leaf.name);
          const foundNode = this.#evaluator.root.getElementById(leafName);
          if (foundNode && foundNode !== node && node.contains(foundNode)) {
            if (
              isLastFilter ||
              this.#evaluator.matchLeaves(filterLeaves, foundNode, opt)
            ) {
              if (isLastLeaf) {
                return true;
              }
              if (this.#matchHasPseudoFunc(remainingLeaves, foundNode, opt)) {
                return true;
              }
            }
          }
        }
        const walker = this.#evaluator.createTreeWalker(node);
        traverseNode(node, walker);
        let currentNode = walker.firstChild();
        while (currentNode) {
          if (this.#checkNode(currentNode, leaves, remainingLeaves, opt)) {
            return true;
          }
          currentNode = walker.nextNode();
        }
        return false;
      }
    }
  }

  /**
   * Checks if a target node satisfies the given conditions.
   * @private
   * @param {Element} refNode - The element node to check.
   * @param {Array<import('css-tree').CssNode>} leaves - The current AST leaves.
   * @param {Array<import('css-tree').CssNode>} remainingLeaves - The remaining AST leaves.
   * @param {import('../index.js').FindOptions} opt - Options.
   * @returns {boolean} True if matched, otherwise false.
   */
  #checkNode(refNode, leaves, remainingLeaves, opt) {
    if (this.#evaluator.matchLeaves(leaves, refNode, opt)) {
      if (remainingLeaves.length === 0) {
        return true;
      }
      if (this.#matchHasPseudoFunc(remainingLeaves, refNode, opt)) {
        return true;
      }
    }
    return false;
  }
}
