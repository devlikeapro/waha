var _excluded = ["index"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { getNormalizedStackId } from '../util/ChartUtils';
import { useUniqueId } from '../util/useUniqueId';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { useAppSelector } from '../state/hooks';
import { selectStackRects } from '../state/selectors/barStackSelectors';
import { useIsPanorama } from '../context/PanoramaContext';
import { Layer } from '../container/Layer';
import { Rectangle } from '../shape/Rectangle';
import { propsAreEqual } from '../util/propsAreEqual';
var BarStackContext = /*#__PURE__*/createContext(undefined);

/**
 * Hook to resolve the stack ID for a Bar component.
 * If a stack ID is provided via props, it is used directly.
 * Otherwise, this will read stack ID from BarStack context if available.
 * If both are undefined, it returns undefined.
 * @param childStackId
 */
export var useStackId = childStackId => {
  var stackSettings = useContext(BarStackContext);
  if (stackSettings != null) {
    return stackSettings.stackId;
  }
  if (childStackId == null) {
    return undefined;
  }
  return getNormalizedStackId(childStackId);
};
export var defaultBarStackProps = {
  radius: 0
};
var getClipPathId = (stackId, index) => {
  return "recharts-bar-stack-clip-path-".concat(stackId, "-").concat(index);
};
export var useBarStackClipPathUrl = index => {
  var barStackContext = useContext(BarStackContext);
  if (barStackContext == null) {
    return undefined;
  }
  var stackId = barStackContext.stackId;
  return "url(#".concat(getClipPathId(stackId, index), ")");
};
export var BarStackClipLayer = _ref => {
  var index = _ref.index,
    rest = _objectWithoutProperties(_ref, _excluded);
  var clipPathUrl = useBarStackClipPathUrl(index);
  return /*#__PURE__*/React.createElement(Layer, _extends({
    className: "recharts-bar-stack-layer",
    clipPath: clipPathUrl
  }, rest));
};

/**
 * This React component will render a clipPath that the individual bars in the stack will reference
 * to achieve rounded corners for the entire stack.
 */
var BarStackClipPath = _ref2 => {
  var stackId = _ref2.stackId,
    radius = _ref2.radius;
  var isPanorama = useIsPanorama();
  var positions = useAppSelector(state => selectStackRects(state, stackId, isPanorama));
  if (positions == null || positions.length === 0) {
    return null;
  }
  /*
   * Render one clipPath per rectangle in the stack.
   * Each rectangle corresponds to one data entry in the chart.
   */
  return /*#__PURE__*/React.createElement("defs", null, positions.map((pos, index) => {
    if (pos == null) {
      return null;
    }
    var clipPathId = getClipPathId(stackId, index);
    return /*#__PURE__*/React.createElement("clipPath", {
      key: clipPathId,
      id: clipPathId
    }, /*#__PURE__*/React.createElement(Rectangle, {
      isAnimationActive: false,
      isUpdateAnimationActive: false,
      x: pos.x,
      y: pos.y,
      width: pos.width,
      height: pos.height,
      radius: radius
    }));
  }));
};
var BarStackImpl = props => {
  var resolvedStackId = useUniqueId('recharts-bar-stack', getNormalizedStackId(props.stackId));
  var _resolveDefaultProps = resolveDefaultProps(props, defaultBarStackProps),
    children = _resolveDefaultProps.children,
    radius = _resolveDefaultProps.radius;
  var context = useMemo(() => ({
    stackId: resolvedStackId,
    radius
  }), [resolvedStackId, radius]);
  return /*#__PURE__*/React.createElement(BarStackContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(BarStackClipPath, {
    stackId: resolvedStackId,
    radius: radius
  }), children);
};

/**
 * @provides BarStackContext
 * @since 3.6
 */
export var BarStack = /*#__PURE__*/React.memo(BarStackImpl, propsAreEqual);