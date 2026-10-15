function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { clsx } from 'clsx';
import { adaptEventHandlers } from '../util/types';
import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents';
import { isNumber } from '../util/DataUtils';
/**
 * Renders a dot in the chart.
 *
 * This component accepts X and Y coordinates in pixels.
 * If you need to position the rectangle based on your chart's data,
 * consider using the {@link ReferenceDot} component instead.
 *
 * @param props
 * @constructor
 */
export var Dot = props => {
  var cx = props.cx,
    cy = props.cy,
    r = props.r,
    className = props.className;
  var layerClass = clsx('recharts-dot', className);
  if (isNumber(cx) && isNumber(cy) && isNumber(r)) {
    return /*#__PURE__*/React.createElement("circle", _extends({}, svgPropertiesNoEvents(props), adaptEventHandlers(props), {
      className: layerClass,
      cx: cx,
      cy: cy,
      r: r
    }));
  }
  return null;
};