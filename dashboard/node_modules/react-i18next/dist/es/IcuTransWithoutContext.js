import React from 'react';
import { warn, warnOnce, isString } from './utils.js';
import { getI18n } from './i18nInstance.js';
import { renderTranslation } from './IcuTransUtils/index.js';
export function IcuTransWithoutContext({
  i18nKey,
  defaultTranslation,
  content,
  ns,
  values = {},
  i18n: i18nFromProps,
  t: tFromProps
}) {
  const i18n = i18nFromProps || getI18n();
  if (!i18n) {
    warnOnce(i18n, 'NO_I18NEXT_INSTANCE', `IcuTrans: You need to pass in an i18next instance using i18nextReactModule`, {
      i18nKey
    });
    return React.createElement(React.Fragment, {}, defaultTranslation);
  }
  const t = tFromProps || i18n.t?.bind(i18n) || (k => k);
  let namespaces = ns || t.ns || i18n.options?.defaultNS;
  namespaces = isString(namespaces) ? [namespaces] : namespaces || ['translation'];
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
    const rendered = renderTranslation(translation, content);
    return React.createElement(React.Fragment, {}, ...rendered);
  } catch (error) {
    warn(i18n, 'ICU_TRANS_RENDER_ERROR', `IcuTrans component error for key "${i18nKey}": ${error.message}`, {
      i18nKey,
      error
    });
    return React.createElement(React.Fragment, {}, translation);
  }
}
IcuTransWithoutContext.displayName = 'IcuTransWithoutContext';