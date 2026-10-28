"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTranslation = void 0;
var _react = require("react");
var _shim = require("use-sync-external-store/shim");
var _context = require("./context.js");
var _utils = require("./utils.js");
const notReadyT = (k, optsOrDefaultValue) => {
  if ((0, _utils.isString)(optsOrDefaultValue)) return optsOrDefaultValue;
  if ((0, _utils.isObject)(optsOrDefaultValue) && (0, _utils.isString)(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
  if (typeof k === 'function') return '';
  if (Array.isArray(k)) {
    const last = k[k.length - 1];
    return typeof last === 'function' ? '' : last;
  }
  return k;
};
const notReadySnapshot = {
  t: notReadyT,
  ready: false
};
const dummySubscribe = () => () => {};
const useTranslation = (ns, props = {}) => {
  const {
    i18n: i18nFromProps
  } = props;
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = (0, _react.useContext)(_context.I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || (0, _context.getI18n)();
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new _context.ReportNamespaces();
  if (!i18n) {
    (0, _utils.warnOnce)(i18n, 'NO_I18NEXT_INSTANCE', 'useTranslation: You will need to pass in an i18next instance by using initReactI18next or by passing it via props or context. In monorepo setups, make sure there is only one instance of react-i18next.');
  }
  const i18nOptions = (0, _react.useMemo)(() => ({
    ...(0, _context.getDefaults)(),
    ...i18n?.options?.react,
    ...props
  }), [i18n, props]);
  const {
    useSuspense,
    keyPrefix
  } = i18nOptions;
  const nsOrContext = ns || defaultNSFromContext || i18n?.options?.defaultNS;
  const unstableNamespaces = (0, _utils.isString)(nsOrContext) ? [nsOrContext] : nsOrContext || ['translation'];
  const namespaces = (0, _react.useMemo)(() => unstableNamespaces, unstableNamespaces);
  i18n?.reportNamespaces?.addUsedNamespaces?.(namespaces);
  const revisionRef = (0, _react.useRef)(0);
  const subscribe = (0, _react.useCallback)(callback => {
    if (!i18n) return dummySubscribe;
    const {
      bindI18n,
      bindI18nStore
    } = i18nOptions;
    const wrappedCallback = () => {
      revisionRef.current += 1;
      callback();
    };
    if (bindI18n) i18n.on(bindI18n, wrappedCallback);
    if (bindI18nStore) i18n.store.on(bindI18nStore, wrappedCallback);
    return () => {
      if (bindI18n) bindI18n.split(' ').forEach(e => i18n.off(e, wrappedCallback));
      if (bindI18nStore) bindI18nStore.split(' ').forEach(e => i18n.store.off(e, wrappedCallback));
    };
  }, [i18n, i18nOptions]);
  const snapshotRef = (0, _react.useRef)();
  const getSnapshot = (0, _react.useCallback)(() => {
    if (!i18n) {
      return notReadySnapshot;
    }
    const calculatedReady = !!(i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(n => (0, _utils.hasLoadedNamespace)(n, i18n, i18nOptions));
    const currentLng = props.lng || i18n.language;
    const currentRevision = revisionRef.current;
    const lastSnapshot = snapshotRef.current;
    if (lastSnapshot && lastSnapshot.ready === calculatedReady && lastSnapshot.lng === currentLng && lastSnapshot.keyPrefix === keyPrefix && lastSnapshot.revision === currentRevision) {
      return lastSnapshot;
    }
    const calculatedT = i18n.getFixedT(currentLng, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix, {
      scopeNs: namespaces
    });
    const newSnapshot = {
      t: calculatedT,
      ready: calculatedReady,
      lng: currentLng,
      keyPrefix,
      revision: currentRevision
    };
    snapshotRef.current = newSnapshot;
    return newSnapshot;
  }, [i18n, namespaces, keyPrefix, i18nOptions, props.lng]);
  const [loadCount, setLoadCount] = (0, _react.useState)(0);
  const {
    t,
    ready
  } = (0, _shim.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
  (0, _react.useEffect)(() => {
    if (i18n && !ready && !useSuspense) {
      const onLoaded = () => setLoadCount(c => c + 1);
      if (props.lng) {
        (0, _utils.loadLanguages)(i18n, props.lng, namespaces, onLoaded);
      } else {
        (0, _utils.loadNamespaces)(i18n, namespaces, onLoaded);
      }
    }
  }, [i18n, props.lng, namespaces, ready, useSuspense, loadCount]);
  const finalI18n = i18n || {};
  const wrapperRef = (0, _react.useRef)(null);
  const wrapperLangRef = (0, _react.useRef)();
  const languageKey = inst => `${inst.language}|${inst.resolvedLanguage}|${inst.languages?.join(',')}`;
  const createI18nWrapper = original => {
    const descriptors = Object.getOwnPropertyDescriptors(original);
    if (descriptors.__original) delete descriptors.__original;
    const wrapper = Object.create(Object.getPrototypeOf(original), descriptors);
    if (!Object.prototype.hasOwnProperty.call(wrapper, '__original')) {
      try {
        Object.defineProperty(wrapper, '__original', {
          value: original,
          writable: false,
          enumerable: false,
          configurable: false
        });
      } catch (_) {}
    }
    return wrapper;
  };
  const ret = (0, _react.useMemo)(() => {
    const original = finalI18n;
    const lang = original && languageKey(original);
    let i18nWrapper = original;
    if (original) {
      if (wrapperRef.current && wrapperRef.current.__original === original) {
        if (wrapperLangRef.current !== lang) {
          i18nWrapper = createI18nWrapper(original);
          wrapperRef.current = i18nWrapper;
          wrapperLangRef.current = lang;
        } else {
          i18nWrapper = wrapperRef.current;
        }
      } else {
        i18nWrapper = createI18nWrapper(original);
        wrapperRef.current = i18nWrapper;
        wrapperLangRef.current = lang;
      }
    }
    const effectiveT = !ready && !useSuspense ? (...args) => {
      (0, _utils.warnOnce)(i18n, 'USE_T_BEFORE_READY', 'useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t.');
      return t(...args);
    } : t;
    const arr = [effectiveT, i18nWrapper, ready];
    arr.t = effectiveT;
    arr.i18n = i18nWrapper;
    arr.ready = ready;
    return arr;
  }, [t, finalI18n, ready, finalI18n.resolvedLanguage, finalI18n.language, finalI18n.languages]);
  if (i18n && useSuspense && !ready) {
    let inDevelopment = false;
    try {
      inDevelopment = process.env.NODE_ENV !== 'production';
    } catch (e) {}
    if (inDevelopment) {
      (0, _utils.warnOnce)(i18n, 'SUSPENDED_WHILE_LOADING', 'useTranslation: suspended while translations are loading (useSuspense is true by default). Add a <Suspense> boundary above this component, or set react.useSuspense: false in the i18next init options. https://react.i18next.com/latest/usetranslation-hook');
    }
    throw new Promise(resolve => {
      const onLoaded = () => resolve();
      if (props.lng) {
        (0, _utils.loadLanguages)(i18n, props.lng, namespaces, onLoaded);
      } else {
        (0, _utils.loadNamespaces)(i18n, namespaces, onLoaded);
      }
    });
  }
  return ret;
};
exports.useTranslation = useTranslation;