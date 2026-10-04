var _excluded = ["width", "height", "responsive", "children", "className", "style", "compact", "title", "desc"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { forwardRef } from 'react';
import { RootSurface } from '../container/RootSurface';
import { RechartsWrapper } from './RechartsWrapper';
import { ClipPathProvider } from '../container/ClipPathProvider';
import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents';
import { ReportChartSize } from '../context/chartLayoutContext';
export var CategoricalChart = /*#__PURE__*/forwardRef((props, ref) => {
  var width = props.width,
    height = props.height,
    responsive = props.responsive,
    children = props.children,
    className = props.className,
    style = props.style,
    compact = props.compact,
    title = props.title,
    desc = props.desc,
    others = _objectWithoutProperties(props, _excluded);
  var attrs = svgPropertiesNoEvents(others);

  /*
   * The "compact" mode is used as the panorama within Brush.
   * However because `compact` is a public prop, let's assume that it can render outside of Brush too.
   */
  if (compact) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportChartSize, {
      width: width,
      height: height
    }), /*#__PURE__*/React.createElement(RootSurface, {
      otherAttributes: attrs,
      title: title,
      desc: desc
    }, children));
  }
  return /*#__PURE__*/React.createElement(RechartsWrapper, {
    className: className,
    style: style,
    width: width,
    height: height,
    responsive: responsive !== null && responsive !== void 0 ? responsive : false,
    onClick: props.onClick,
    onMouseLeave: props.onMouseLeave,
    onMouseEnter: props.onMouseEnter,
    onMouseMove: props.onMouseMove,
    onMouseDown: props.onMouseDown,
    onMouseUp: props.onMouseUp,
    onContextMenu: props.onContextMenu,
    onDoubleClick: props.onDoubleClick,
    onTouchStart: props.onTouchStart,
    onTouchMove: props.onTouchMove,
    onTouchEnd: props.onTouchEnd
  }, /*#__PURE__*/React.createElement(RootSurface, {
    otherAttributes: attrs,
    title: title,
    desc: desc,
    ref: ref
  }, /*#__PURE__*/React.createElement(ClipPathProvider, null, children)));
});