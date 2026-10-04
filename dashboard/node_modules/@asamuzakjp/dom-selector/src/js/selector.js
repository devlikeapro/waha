/**
 * selector.js
 */

/* import */
import * as cssTree from 'css-tree';
import { generateException } from './utility.js';

/* constants */
import {
  ATTR_TYPE,
  COMBINATOR,
  COMBO,
  COMPOUND_I,
  HAS_COMPOUND,
  KEYS_LOGICAL,
  KEYS_PS_CLASS_SUPPORTED,
  LOGIC_COMPLEX,
  LOGIC_COMPOUND,
  N_TH,
  PSEUDO_CLASS,
  PS_CLASS_SELECTOR,
  PS_ELEMENT_SELECTOR,
  SELECTOR,
  SYNTAX_ERR,
  TAG_TYPE_WO_UNIVERSAL,
  TARGET_ALL
} from './constant.js';

/* regexp */
const REG_EXCLUDE_BASIC =
  /[|\\]|::|[^\u0021-\u007F\s]|\[\s*[\w$*=^|~-]+(?:(?:"[\w$*=^|~\s'-]+"|'[\w$*=^|~\s"-]+')?(?:\s+[\w$*=^|~-]+)+|"[^"\]]{1,255}|'[^'\]]{1,255})\s*\]|:(?:is|where)\(\s*\)|\[\s*data-/;
const REG_EXCLUDE_QSA = new RegExp(
  `(?:^(?:[A-Z]|\\.)[\\w-]*$|${COMPOUND_I}${COMBO}${COMPOUND_I})`,
  'i'
);
const REG_HAS = /has\(/i;
const REG_IS_NOT = /(?:is|not)\(/i;
const REG_COMPLEX = new RegExp(`${COMPOUND_I}${COMBO}${COMPOUND_I}`, 'i');
const REG_LOGIC_COMPLEX = new RegExp(
  `:(?!${PSEUDO_CLASS}|${N_TH}|${LOGIC_COMPLEX})`,
  'i'
);
const REG_LOGIC_COMPOUND = new RegExp(
  `:(?!${PSEUDO_CLASS}|${N_TH}|${LOGIC_COMPOUND})`,
  'i'
);
const REG_LOGIC_HAS_COMPOUND = new RegExp(
  `:(?!${PSEUDO_CLASS}|${N_TH}|${LOGIC_COMPOUND}|${HAS_COMPOUND})`
);
const REG_END_WITH_HAS = new RegExp(`:${HAS_COMPOUND}$`);
const REG_WO_LOGICAL = new RegExp(`:(?!${PSEUDO_CLASS}|${N_TH})`, 'i');
const REG_COMBO = new RegExp(COMBO);
const REG_ID = /#(\D[^#.*]+)/g;
const REG_CLASS = /\.(\D[^#.*]+)/g;
const REG_TAG = /^([^#.]+)/;
const REG_INVALID_SYNTAX =
  /[+~>]\s*[+~>]|^\s*[+~>]|[+~>]\s*$|^\s*,|,\s*,|,\s*$/;
const REG_TEST_LIB = new RegExp(
  `^(?:[*]?${ATTR_TYPE}(?:\\s*,\\s*${TAG_TYPE_WO_UNIVERSAL}${COMBO}${TAG_TYPE_WO_UNIVERSAL})?)$`
);

/**
 * Find a nested :has() pseudo-class.
 * @param {object} leaf - The AST leaf to check.
 * @returns {object|null} The leaf if it's :has, otherwise null.
 */
export const findNestedHas = leaf => leaf.name === 'has';

/**
 * Find a logical pseudo-class that contains a nested :has().
 * @param {object} leaf - The AST leaf to check.
 * @returns {object|null} The leaf if it matches, otherwise null.
 */
export const findLogicalWithNestedHas = leaf => {
  if (KEYS_LOGICAL.has(leaf.name) && cssTree.find(leaf, findNestedHas)) {
    return leaf;
  }
  return null;
};

/**
 * Validates nesting restrictions within :has() arguments.
 * @param {Array<object>} astChildren - The AST nodes representing the :has() arguments.
 * @returns {boolean} False if there's an invalid nesting constraint violation.
 */
export const validateHasNesting = astChildren => {
  const l = astChildren.length;
  for (let i = 0; i < l; i++) {
    const item = cssTree.find(astChildren[i], findLogicalWithNestedHas);
    if (item) {
      // If nested :has() is wrapped inside :is() or :where(), it is forgiven.
      if (item.name !== 'is' && item.name !== 'where') {
        return false;
      }
    }
  }
  return true;
};

/**
 * Creates a callback function to validate :has() nesting during AST walk.
 * @param {object} globalObj - The global window object.
 * @returns {(node: object) => void} The callback function for walkAST.
 */
export const createHasValidator = globalObj => node => {
  if (
    node.type === PS_CLASS_SELECTOR &&
    node.name.toLowerCase() === 'has' &&
    !validateHasNesting(Array.from(node.children || []))
  ) {
    const css = cssTree.generate(node);
    throw generateException(
      `Disallowed nested :has() pseudo-class: ${css}`,
      SYNTAX_ERR,
      globalObj
    );
  }
};

/**
 * Check if a combinator node is invalid (leading, trailing, or consecutive).
 * @param {string} type - The current node type.
 * @param {string|null} prevType - The previous node type.
 * @param {boolean} isLast - Whether the current node is the last in the list.
 * @returns {boolean} True if the combinator is invalid.
 */
export const isInvalidCombinator = (type, prevType, isLast) =>
  type === COMBINATOR &&
  (prevType === null || prevType === COMBINATOR || isLast);

/**
 * Checks if a given AST is supported by the DOMSelector engine.
 * @param {import('css-tree').CssNode} ast - The AST to validate.
 * @returns {boolean} True if the selector is fully supported.
 */
export const isSupportedAST = ast => {
  let isSupported = true;
  const walk = (
    node,
    context = { insideHas: false, insideForgiving: false }
  ) => {
    if (!isSupported || !node) {
      return;
    }
    const nextContext = { ...context };
    if (node.type === PS_ELEMENT_SELECTOR) {
      isSupported = false;
      return;
    } else if (node.type === PS_CLASS_SELECTOR) {
      let name = node.name;
      if (name && typeof name === 'string') {
        name = name.toLowerCase();
      }
      if (!KEYS_PS_CLASS_SUPPORTED.has(name)) {
        isSupported = false;
        return;
      }
      if (name === 'has') {
        if (context.insideHas && !context.insideForgiving) {
          isSupported = false;
          return;
        }
        nextContext.insideHas = true;
      } else if (name === 'is' || name === 'where') {
        nextContext.insideForgiving = true;
      }
    }
    if (node.children) {
      let prevType = null;
      if (node.children.head !== undefined) {
        let current = node.children.head;
        while (current) {
          if (!current.data) {
            current = current.next;
            continue;
          }
          const childType = current.data.type;
          if (
            node.type === SELECTOR &&
            isInvalidCombinator(childType, prevType, !current.next)
          ) {
            if (!(prevType === null && context.insideHas)) {
              isSupported = false;
              return;
            }
          }
          prevType = childType;
          walk(current.data, nextContext);
          if (!isSupported) {
            return;
          }
          current = current.next;
        }
      } else if (Array.isArray(node.children)) {
        const l = node.children.length;
        for (let i = 0; i < l; i++) {
          const child = node.children[i];
          if (!child) {
            continue;
          }
          const childType = child.type;
          if (
            node.type === SELECTOR &&
            isInvalidCombinator(childType, prevType, i === l - 1)
          ) {
            if (!(prevType === null && context.insideHas)) {
              isSupported = false;
              return;
            }
          }
          prevType = childType;
          walk(child, nextContext);
          if (!isSupported) {
            return;
          }
        }
      }
    }
    if (node.selector) {
      walk(node.selector, nextContext);
    }
  };
  walk(ast);
  return isSupported;
};

/**
 * Extracts the rightmost subject keys (id, class, tag) from a selector.
 * @param {string} selector - The CSS selector string to parse.
 * @param {boolean} caseSensitive - True if the tag should be case-sensitive.
 * @returns {Array<{id: string|null, className: string|null, tag: string|null}>} The list of extracted keys for each selector group.
 */
export const extractSubjectsRegExp = (selector, caseSensitive) => {
  const subjects = [];
  const groups = selector.split(',');
  for (const item of groups) {
    const group = item.trim();
    if (!group) {
      continue;
    }
    const compounds = group.split(REG_COMBO);
    const rightmost = compounds.at(-1);
    let idKey = null;
    let classKey = null;
    let tagKey = null;
    if (rightmost) {
      const idMatch = rightmost.match(REG_ID);
      if (idMatch) {
        idKey = idMatch.at(-1).slice(1);
      }
      const classMatch = rightmost.match(REG_CLASS);
      if (classMatch) {
        classKey = classMatch.at(-1).slice(1);
      }
      const tagMatch = rightmost.match(REG_TAG);
      if (tagMatch) {
        const tag = tagMatch[1];
        if (tag !== '*') {
          tagKey = caseSensitive ? tag : tag.toLowerCase();
        }
      }
    }
    subjects.push({ id: idKey, className: classKey, tag: tagKey });
  }
  return subjects;
};

/**
 * Filter a selector for use with nwsapi.
 * @param {string} selector - The selector string.
 * @param {string} target - The target type.
 * @returns {boolean} - True if the selector is valid for nwsapi.
 */
export const filterSelector = (selector, target) => {
  // Basic validation and fast-fail for null/undefined/non-string values.
  // Rejects stringified nullish values as well.
  if (
    !selector ||
    typeof selector !== 'string' ||
    selector === 'null' ||
    selector === 'undefined'
  ) {
    return false;
  }
  // Validate syntax.
  if (REG_INVALID_SYNTAX.test(selector)) {
    return false;
  }
  // Target-specific early exits.
  if (
    target === TARGET_ALL &&
    REG_EXCLUDE_QSA.test(selector) &&
    !REG_TEST_LIB.test(selector)
  ) {
    return false;
  }
  // Exclude various complex or unsupported selectors early.
  // i.e. non-ASCII, escaped selectors, namespaced selectors, pseudo-elements.
  if (
    selector.includes('/') ||
    selector.includes('&') ||
    REG_EXCLUDE_BASIC.test(selector)
  ) {
    return false;
  }
  // Validate attribute selector integrity.
  if (selector.includes('[')) {
    const index = selector.lastIndexOf('[');
    if (selector.indexOf(']', index) === -1) {
      return false;
    }
  }
  // Logic for pseudo-classes.
  if (selector.includes(':')) {
    // Determine if the selector has complex logical structures.
    const isComplex =
      target === TARGET_ALL ? false : REG_COMPLEX.test(selector);
    // Handle :has() specifically.
    if (REG_HAS.test(selector)) {
      if (!isComplex || REG_LOGIC_HAS_COMPOUND.test(selector)) {
        return false;
      }
      return REG_END_WITH_HAS.test(selector);
    }
    // Handle :is() and :not().
    if (REG_IS_NOT.test(selector)) {
      if (isComplex) {
        return !REG_LOGIC_COMPLEX.test(selector);
      }
      return !REG_LOGIC_COMPOUND.test(selector);
    }
    // Default check for other pseudo-classes against known list.
    if (REG_WO_LOGICAL.test(selector)) {
      return false;
    }
  }
  return true;
};
