"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectRadiusAxisRangeWithReversed = exports.selectRadiusAxisRange = exports.selectRadiusAxis = exports.selectPolarViewBox = exports.selectPolarOptions = exports.selectOuterRadius = exports.selectMaxRadius = exports.selectAngleAxisRangeWithReversed = exports.selectAngleAxisRange = exports.selectAngleAxis = exports.implicitRadiusAxis = exports.implicitAngleAxis = void 0;
var _reselect = require("reselect");
var _containerSelectors = require("./containerSelectors");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _PolarUtils = require("../../util/PolarUtils");
var _DataUtils = require("../../util/DataUtils");
var _defaultPolarAngleAxisProps = require("../../polar/defaultPolarAngleAxisProps");
var _defaultPolarRadiusAxisProps = require("../../polar/defaultPolarRadiusAxisProps");
var _combineAxisRangeWithReverse = require("./combiners/combineAxisRangeWithReverse");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _getAxisTypeBasedOnLayout = require("../../util/getAxisTypeBasedOnLayout");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var implicitAngleAxis = exports.implicitAngleAxis = {
  allowDataOverflow: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.allowDataOverflow,
  allowDecimals: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.allowDecimals,
  allowDuplicatedCategory: false,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: undefined,
  domain: undefined,
  id: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.angleAxisId,
  includeHidden: false,
  name: undefined,
  reversed: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.reversed,
  scale: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.scale,
  tick: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.tick,
  tickCount: undefined,
  ticks: undefined,
  type: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.type,
  unit: undefined,
  niceTicks: 'auto'
};
var implicitRadiusAxis = exports.implicitRadiusAxis = {
  allowDataOverflow: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.allowDataOverflow,
  allowDecimals: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.allowDecimals,
  allowDuplicatedCategory: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.radiusAxisId,
  includeHidden: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.includeHidden,
  name: undefined,
  reversed: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.reversed,
  scale: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.scale,
  tick: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.tick,
  tickCount: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.tickCount,
  ticks: undefined,
  type: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.type,
  unit: undefined,
  niceTicks: 'auto'
};
var selectAngleAxisNoDefaults = (state, angleAxisId) => {
  if (angleAxisId == null) {
    return undefined;
  }
  return state.polarAxis.angleAxis[angleAxisId];
};
var selectAngleAxis = exports.selectAngleAxis = (0, _reselect.createSelector)([selectAngleAxisNoDefaults, _chartLayoutContext.selectPolarChartLayout], (angleAxisSettings, layout) => {
  var _getAxisTypeBasedOnLa;
  if (angleAxisSettings != null) {
    return angleAxisSettings;
  }
  var evaluatedType = (_getAxisTypeBasedOnLa = (0, _getAxisTypeBasedOnLayout.getAxisTypeBasedOnLayout)(layout, 'angleAxis', implicitAngleAxis.type)) !== null && _getAxisTypeBasedOnLa !== void 0 ? _getAxisTypeBasedOnLa : 'category';
  return _objectSpread(_objectSpread({}, implicitAngleAxis), {}, {
    type: evaluatedType
  });
});
var selectRadiusAxisNoDefaults = (state, radiusAxisId) => {
  return state.polarAxis.radiusAxis[radiusAxisId];
};
var selectRadiusAxis = exports.selectRadiusAxis = (0, _reselect.createSelector)([selectRadiusAxisNoDefaults, _chartLayoutContext.selectPolarChartLayout], (radiusAxisSettings, layout) => {
  var _getAxisTypeBasedOnLa2;
  if (radiusAxisSettings != null) {
    return radiusAxisSettings;
  }
  var evaluatedType = (_getAxisTypeBasedOnLa2 = (0, _getAxisTypeBasedOnLayout.getAxisTypeBasedOnLayout)(layout, 'radiusAxis', implicitRadiusAxis.type)) !== null && _getAxisTypeBasedOnLa2 !== void 0 ? _getAxisTypeBasedOnLa2 : 'category';
  return _objectSpread(_objectSpread({}, implicitRadiusAxis), {}, {
    type: evaluatedType
  });
});
var selectPolarOptions = state => state.polarOptions;
exports.selectPolarOptions = selectPolarOptions;
var selectMaxRadius = exports.selectMaxRadius = (0, _reselect.createSelector)([_containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight, _selectChartOffsetInternal.selectChartOffsetInternal], _PolarUtils.getMaxRadius);
var selectInnerRadius = (0, _reselect.createSelector)([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return (0, _DataUtils.getPercentValue)(polarChartOptions.innerRadius, maxRadius, 0);
});
var selectOuterRadius = exports.selectOuterRadius = (0, _reselect.createSelector)([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return (0, _DataUtils.getPercentValue)(polarChartOptions.outerRadius, maxRadius, maxRadius * 0.8);
});
var combineAngleAxisRange = polarOptions => {
  if (polarOptions == null) {
    return [0, 0];
  }
  var startAngle = polarOptions.startAngle,
    endAngle = polarOptions.endAngle;
  return [startAngle, endAngle];
};
var selectAngleAxisRange = exports.selectAngleAxisRange = (0, _reselect.createSelector)([selectPolarOptions], combineAngleAxisRange);
var selectAngleAxisRangeWithReversed = exports.selectAngleAxisRangeWithReversed = (0, _reselect.createSelector)([selectAngleAxis, selectAngleAxisRange], _combineAxisRangeWithReverse.combineAxisRangeWithReverse);
var selectRadiusAxisRange = exports.selectRadiusAxisRange = (0, _reselect.createSelector)([selectMaxRadius, selectInnerRadius, selectOuterRadius], (maxRadius, innerRadius, outerRadius) => {
  if (maxRadius == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  return [innerRadius, outerRadius];
});
var selectRadiusAxisRangeWithReversed = exports.selectRadiusAxisRangeWithReversed = (0, _reselect.createSelector)([selectRadiusAxis, selectRadiusAxisRange], _combineAxisRangeWithReverse.combineAxisRangeWithReverse);
var selectPolarViewBox = exports.selectPolarViewBox = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectPolarOptions, selectInnerRadius, selectOuterRadius, _containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight], (layout, polarOptions, innerRadius, outerRadius, width, height) => {
  if (layout !== 'centric' && layout !== 'radial' || polarOptions == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  var cx = polarOptions.cx,
    cy = polarOptions.cy,
    startAngle = polarOptions.startAngle,
    endAngle = polarOptions.endAngle;
  return {
    cx: (0, _DataUtils.getPercentValue)(cx, width, width / 2),
    cy: (0, _DataUtils.getPercentValue)(cy, height, height / 2),
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    clockWise: false // this property look useful, why not use it?
  };
});