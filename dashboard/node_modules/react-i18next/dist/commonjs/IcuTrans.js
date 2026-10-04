"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IcuTrans = IcuTrans;
var _react = require("react");
var _IcuTransWithoutContext = require("./IcuTransWithoutContext.js");
var _context = require("./context.js");
function IcuTrans({
  i18nKey,
  defaultTranslation,
  content,
  ns,
  values = {},
  i18n: i18nFromProps,
  t: tFromProps
}) {
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = (0, _react.useContext)(_context.I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || (0, _context.getI18n)();
  const t = tFromProps || i18n?.t.bind(i18n);
  return (0, _IcuTransWithoutContext.IcuTransWithoutContext)({
    i18nKey,
    defaultTranslation,
    content,
    ns: ns || t?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
    values,
    i18n,
    t: tFromProps
  });
}
IcuTrans.displayName = 'IcuTrans';