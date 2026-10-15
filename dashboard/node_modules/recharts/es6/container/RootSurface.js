var _excluded = ["children"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { forwardRef } from 'react';
import { useChartHeight, useChartWidth } from '../context/chartLayoutContext';
import { useAccessibilityLayer } from '../context/accessibilityContext';
import { useIsPanorama } from '../context/PanoramaContext';
import { Surface } from './Surface';
import { useAppSelector } from '../state/hooks';
import { selectBrushDimensions } from '../state/selectors/brushSelectors';
import { isPositiveNumber } from '../util/isWellBehavedNumber';
import { AllZIndexPortals } from '../zIndex/ZIndexPortal';
var FULL_WIDTH_AND_HEIGHT = {
  width: '100%',
  height: '100%',
  /*
   * display: block is necessary here because the default for an SVG is display: inline,
   * which in some browsers (Chrome) adds a little bit of extra space above and below the SVG
   * to make space for the descender of letters like "g" and "y". This throws off the height calculation
   * and causes the container to grow indefinitely on each render with responsive=true.
   * Display: block removes that extra space.
   *
   * Interestingly, Firefox does not have this problem, but it doesn't hurt to add the style anyway.
   */
  display: 'block'
};
var MainChartSurface = /*#__PURE__*/forwardRef((props, ref) => {
  var width = useChartWidth();
  var height = useChartHeight();
  var hasAccessibilityLayer = useAccessibilityLayer();
  if (!isPositiveNumber(width) || !isPositiveNumber(height)) {
    return null;
  }
  var children = props.children,
    otherAttributes = props.otherAttributes,
    title = props.title,
    desc = props.desc;
  var tabIndex, role;
  if (otherAttributes != null) {
    if (typeof otherAttributes.tabIndex === 'number') {
      tabIndex = otherAttributes.tabIndex;
    } else {
      tabIndex = hasAccessibilityLayer ? 0 : undefined;
    }
    if (typeof otherAttributes.role === 'string') {
      role = otherAttributes.role;
    } else {
      role = hasAccessibilityLayer ? 'application' : undefined;
    }
  }
  return /*#__PURE__*/React.createElement(Surface, _extends({}, otherAttributes, {
    title: title,
    desc: desc,
    role: role,
    tabIndex: tabIndex,
    width: width,
    height: height,
    style: FULL_WIDTH_AND_HEIGHT,
    ref: ref
  }), children);
});
var BrushPanoramaSurface = _ref => {
  var children = _ref.children;
  var brushDimensions = useAppSelector(selectBrushDimensions);
  if (!brushDimensions) {
    return null;
  }
  var width = brushDimensions.width,
    height = brushDimensions.height,
    y = brushDimensions.y,
    x = brushDimensions.x;
  return /*#__PURE__*/React.createElement(Surface, {
    width: width,
    height: height,
    x: x,
    y: y
  }, children);
};
export var RootSurface = /*#__PURE__*/forwardRef((_ref2, ref) => {
  var children = _ref2.children,
    rest = _objectWithoutProperties(_ref2, _excluded);
  var isPanorama = useIsPanorama();
  if (isPanorama) {
    return /*#__PURE__*/React.createElement(BrushPanoramaSurface, null, /*#__PURE__*/React.createElement(AllZIndexPortals, {
      isPanorama: true
    }, children));
  }
  return /*#__PURE__*/React.createElement(MainChartSurface, _extends({
    ref: ref
  }, rest), /*#__PURE__*/React.createElement(AllZIndexPortals, {
    isPanorama: false
  }, children));
});