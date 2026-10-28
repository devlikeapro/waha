function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { createSelector } from 'reselect';
import { selectChartHeight, selectChartWidth } from './containerSelectors';
import { selectChartOffsetInternal } from './selectChartOffsetInternal';
import { getMaxRadius } from '../../util/PolarUtils';
import { getPercentValue } from '../../util/DataUtils';
import { defaultPolarAngleAxisProps } from '../../polar/defaultPolarAngleAxisProps';
import { defaultPolarRadiusAxisProps } from '../../polar/defaultPolarRadiusAxisProps';
import { combineAxisRangeWithReverse } from './combiners/combineAxisRangeWithReverse';
import { selectChartLayout, selectPolarChartLayout } from '../../context/chartLayoutContext';
import { getAxisTypeBasedOnLayout } from '../../util/getAxisTypeBasedOnLayout';
export var implicitAngleAxis = {
  allowDataOverflow: defaultPolarAngleAxisProps.allowDataOverflow,
  allowDecimals: defaultPolarAngleAxisProps.allowDecimals,
  allowDuplicatedCategory: false,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarAngleAxisProps.angleAxisId,
  includeHidden: false,
  name: undefined,
  reversed: defaultPolarAngleAxisProps.reversed,
  scale: defaultPolarAngleAxisProps.scale,
  tick: defaultPolarAngleAxisProps.tick,
  tickCount: undefined,
  ticks: undefined,
  type: defaultPolarAngleAxisProps.type,
  unit: undefined,
  niceTicks: 'auto'
};
export var implicitRadiusAxis = {
  allowDataOverflow: defaultPolarRadiusAxisProps.allowDataOverflow,
  allowDecimals: defaultPolarRadiusAxisProps.allowDecimals,
  allowDuplicatedCategory: defaultPolarRadiusAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarRadiusAxisProps.radiusAxisId,
  includeHidden: defaultPolarRadiusAxisProps.includeHidden,
  name: undefined,
  reversed: defaultPolarRadiusAxisProps.reversed,
  scale: defaultPolarRadiusAxisProps.scale,
  tick: defaultPolarRadiusAxisProps.tick,
  tickCount: defaultPolarRadiusAxisProps.tickCount,
  ticks: undefined,
  type: defaultPolarRadiusAxisProps.type,
  unit: undefined,
  niceTicks: 'auto'
};
var selectAngleAxisNoDefaults = (state, angleAxisId) => {
  if (angleAxisId == null) {
    return undefined;
  }
  return state.polarAxis.angleAxis[angleAxisId];
};
export var selectAngleAxis = createSelector([selectAngleAxisNoDefaults, selectPolarChartLayout], (angleAxisSettings, layout) => {
  var _getAxisTypeBasedOnLa;
  if (angleAxisSettings != null) {
    return angleAxisSettings;
  }
  var evaluatedType = (_getAxisTypeBasedOnLa = getAxisTypeBasedOnLayout(layout, 'angleAxis', implicitAngleAxis.type)) !== null && _getAxisTypeBasedOnLa !== void 0 ? _getAxisTypeBasedOnLa : 'category';
  return _objectSpread(_objectSpread({}, implicitAngleAxis), {}, {
    type: evaluatedType
  });
});
var selectRadiusAxisNoDefaults = (state, radiusAxisId) => {
  return state.polarAxis.radiusAxis[radiusAxisId];
};
export var selectRadiusAxis = createSelector([selectRadiusAxisNoDefaults, selectPolarChartLayout], (radiusAxisSettings, layout) => {
  var _getAxisTypeBasedOnLa2;
  if (radiusAxisSettings != null) {
    return radiusAxisSettings;
  }
  var evaluatedType = (_getAxisTypeBasedOnLa2 = getAxisTypeBasedOnLayout(layout, 'radiusAxis', implicitRadiusAxis.type)) !== null && _getAxisTypeBasedOnLa2 !== void 0 ? _getAxisTypeBasedOnLa2 : 'category';
  return _objectSpread(_objectSpread({}, implicitRadiusAxis), {}, {
    type: evaluatedType
  });
});
export var selectPolarOptions = state => state.polarOptions;
export var selectMaxRadius = createSelector([selectChartWidth, selectChartHeight, selectChartOffsetInternal], getMaxRadius);
var selectInnerRadius = createSelector([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return getPercentValue(polarChartOptions.innerRadius, maxRadius, 0);
});
export var selectOuterRadius = createSelector([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return getPercentValue(polarChartOptions.outerRadius, maxRadius, maxRadius * 0.8);
});
var combineAngleAxisRange = polarOptions => {
  if (polarOptions == null) {
    return [0, 0];
  }
  var startAngle = polarOptions.startAngle,
    endAngle = polarOptions.endAngle;
  return [startAngle, endAngle];
};
export var selectAngleAxisRange = createSelector([selectPolarOptions], combineAngleAxisRange);
export var selectAngleAxisRangeWithReversed = createSelector([selectAngleAxis, selectAngleAxisRange], combineAxisRangeWithReverse);
export var selectRadiusAxisRange = createSelector([selectMaxRadius, selectInnerRadius, selectOuterRadius], (maxRadius, innerRadius, outerRadius) => {
  if (maxRadius == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  return [innerRadius, outerRadius];
});
export var selectRadiusAxisRangeWithReversed = createSelector([selectRadiusAxis, selectRadiusAxisRange], combineAxisRangeWithReverse);
export var selectPolarViewBox = createSelector([selectChartLayout, selectPolarOptions, selectInnerRadius, selectOuterRadius, selectChartWidth, selectChartHeight], (layout, polarOptions, innerRadius, outerRadius, width, height) => {
  if (layout !== 'centric' && layout !== 'radial' || polarOptions == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  var cx = polarOptions.cx,
    cy = polarOptions.cy,
    startAngle = polarOptions.startAngle,
    endAngle = polarOptions.endAngle;
  return {
    cx: getPercentValue(cx, width, width / 2),
    cy: getPercentValue(cy, height, height / 2),
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    clockWise: false // this property look useful, why not use it?
  };
});