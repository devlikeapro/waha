"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSSR = void 0;
var _react = require("react");
var _context = require("./context.js");
var _utils = require("./utils.js");
const useSSR = (initialI18nStore, initialLanguage, props = {}) => {
  const {
    i18n: i18nFromProps
  } = props;
  const {
    i18n: i18nFromContext
  } = (0, _react.useContext)(_context.I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || (0, _context.getI18n)();
  if (!i18n) {
    (0, _utils.warnOnce)(i18n, 'NO_I18NEXT_INSTANCE', 'useSSR: You will need to pass in an i18next instance by using initReactI18next or by passing it via props or context. In monorepo setups, make sure there is only one instance of react-i18next.');
    return;
  }
  if (i18n.options?.isClone) return;
  if (initialI18nStore && !i18n.initializedStoreOnce) {
    if (!i18n.services?.resourceStore) {
      (0, _utils.warnOnce)(i18n, 'I18N_NOT_INITIALIZED', 'useSSR: i18n instance was found but not initialized (services.resourceStore is missing). Make sure you call i18next.init() before using useSSR — e.g. at module level, not only in getStaticProps/getServerSideProps.');
      return;
    }
    i18n.services.resourceStore.data = initialI18nStore;
    i18n.options.ns = Object.values(initialI18nStore).reduce((mem, lngResources) => {
      Object.keys(lngResources).forEach(ns => {
        if (mem.indexOf(ns) < 0) mem.push(ns);
      });
      return mem;
    }, i18n.options.ns);
    i18n.initializedStoreOnce = true;
    i18n.isInitialized = true;
  }
  if (initialLanguage && !i18n.initializedLanguageOnce) {
    i18n.changeLanguage(initialLanguage);
    i18n.initializedLanguageOnce = true;
  }
};
exports.useSSR = useSSR;