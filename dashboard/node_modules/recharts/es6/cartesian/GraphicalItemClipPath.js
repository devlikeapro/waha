import * as React from 'react';
import { useAppSelector } from '../state/hooks';
import { implicitXAxis, implicitYAxis, selectXAxisRange, selectXAxisSettings, selectYAxisRange, selectYAxisSettings } from '../state/selectors/axisSelectors';
import { usePlotArea } from '../hooks';
export function useNeedsClip(xAxisId, yAxisId) {
  var _xAxis$allowDataOverf, _yAxis$allowDataOverf;
  var xAxis = useAppSelector(state => selectXAxisSettings(state, xAxisId));
  var yAxis = useAppSelector(state => selectYAxisSettings(state, yAxisId));
  var needClipX = (_xAxis$allowDataOverf = xAxis === null || xAxis === void 0 ? void 0 : xAxis.allowDataOverflow) !== null && _xAxis$allowDataOverf !== void 0 ? _xAxis$allowDataOverf : implicitXAxis.allowDataOverflow;
  var needClipY = (_yAxis$allowDataOverf = yAxis === null || yAxis === void 0 ? void 0 : yAxis.allowDataOverflow) !== null && _yAxis$allowDataOverf !== void 0 ? _yAxis$allowDataOverf : implicitYAxis.allowDataOverflow;
  var needClip = needClipX || needClipY;
  return {
    needClip,
    needClipX,
    needClipY
  };
}
export function GraphicalItemClipPath(_ref) {
  var xAxisId = _ref.xAxisId,
    yAxisId = _ref.yAxisId,
    clipPathId = _ref.clipPathId;
  var plotArea = usePlotArea();
  var _useNeedsClip = useNeedsClip(xAxisId, yAxisId),
    needClipX = _useNeedsClip.needClipX,
    needClipY = _useNeedsClip.needClipY,
    needClip = _useNeedsClip.needClip;
  var xAxisRange = useAppSelector(state => selectXAxisRange(state, xAxisId, false));
  var yAxisRange = useAppSelector(state => selectYAxisRange(state, yAxisId, false));
  if (!needClip || !plotArea) {
    return null;
  }
  var x = plotArea.x,
    y = plotArea.y,
    width = plotArea.width,
    height = plotArea.height;
  var clipX = needClipX && xAxisRange ? Math.min(xAxisRange[0], xAxisRange[1]) : x - width / 2;
  var clipY = needClipY && yAxisRange ? Math.min(yAxisRange[0], yAxisRange[1]) : y - height / 2;
  var clipWidth = needClipX && xAxisRange ? Math.abs(xAxisRange[1] - xAxisRange[0]) : width * 2;
  var clipHeight = needClipY && yAxisRange ? Math.abs(yAxisRange[1] - yAxisRange[0]) : height * 2;
  return /*#__PURE__*/React.createElement("clipPath", {
    id: "clipPath-".concat(clipPathId)
  }, /*#__PURE__*/React.createElement("rect", {
    x: clipX,
    y: clipY,
    width: clipWidth,
    height: clipHeight
  }));
}