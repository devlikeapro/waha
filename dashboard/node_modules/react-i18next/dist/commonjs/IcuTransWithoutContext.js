"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IcuTransWithoutContext = IcuTransWithoutContext;
var _react = _interopRequireDefault(require("react"));
var _utils = require("./utils.js");
var _i18nInstance = require("./i18nInstance.js");
var _index = require("./IcuTransUtils/index.js");
function IcuTransWithoutContext({
  i18nKey,
  defaultTranslation,
  content,
  ns,
  values = {},
  i18n: i18nFromProps,
  t: tFromProps
}) {
  const i18n = i18nFromProps || (0, _i18nInstance.getI18n)();
  if (!i18n) {
    (0, _utils.warnOnce)(i18n, 'NO_I18NEXT_INSTANCE', `IcuTrans: You need to pass in an i18next instance using i18nextReactModule`, {
      i18nKey
    });
    return _react.default.createElement(_react.default.Fragment, {}, defaultTranslation);
  }
  const t = tFromProps || i18n.t?.bind(i18n) || (k => k);
  let namespaces = ns || t.ns || i18n.options?.defaultNS;
  namespaces = (0, _utils.isString)(namespaces) ? [namespaces] : namespaces || ['translation'];
  let mergedValues = values;
  if (i18n.options?.interpolation?.defaultVariables) {
    mergedValues = values && Object.keys(values).length > 0 ? {
      ...values,
      ...i18n.options.interpolation.defaultVariables
    } : {
      ...i18n.options.interpolation.defaultVariables
    };
  }
  const translation = t(i18nKey || defaultTranslation, {
    defaultValue: defaultTranslation,
    ...mergedValues,
    ns: namespaces
  });
  try {
    const rendered = (0, _index.renderTranslation)(translation, content);
    return _react.default.createElement(_react.default.Fragment, {}, ...rendered);
  } catch (error) {
    (0, _utils.warn)(i18n, 'ICU_TRANS_RENDER_ERROR', `IcuTrans component error for key "${i18nKey}": ${error.message}`, {
      i18nKey,
      error
    });
    return _react.default.createElement(_react.default.Fragment, {}, translation);
  }
}
IcuTransWithoutContext.displayName = 'IcuTransWithoutContext';