import { unescape } from './unescape.js';
let defaultOptions = {
  bindI18n: 'languageChanged',
  bindI18nStore: '',
  transEmptyNodeValue: '',
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: '',
  transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
  useSuspense: true,
  unescape,
  transDefaultProps: undefined
};
export const setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};
export const getDefaults = () => defaultOptions;