import { createSelector } from 'reselect';
import { selectChartOffsetInternal } from './selectChartOffsetInternal';
import { selectMargin } from './containerSelectors';
import { isNumber } from '../../util/DataUtils';
export var selectBrushSettings = state => state.brush;
export var selectBrushDimensions = createSelector([selectBrushSettings, selectChartOffsetInternal, selectMargin], (brushSettings, offset, margin) => ({
  height: brushSettings.height,
  x: isNumber(brushSettings.x) ? brushSettings.x : offset.left,
  y: isNumber(brushSettings.y) ? brushSettings.y : offset.top + offset.height + offset.brushBottom - ((margin === null || margin === void 0 ? void 0 : margin.bottom) || 0),
  width: isNumber(brushSettings.width) ? brushSettings.width : offset.width
}));