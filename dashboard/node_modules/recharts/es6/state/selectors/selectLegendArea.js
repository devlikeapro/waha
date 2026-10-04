import { createSelector } from 'reselect';
import { selectChartHeight, selectChartWidth, selectMargin } from './containerSelectors';
export var selectLegendArea = createSelector([selectChartWidth, selectChartHeight, selectMargin], (chartWidth, chartHeight, margin) => {
  return {
    x: margin.left || 0,
    y: margin.top || 0,
    width: Math.max(chartWidth - (margin.left || 0) - (margin.right || 0), 0),
    height: Math.max(chartHeight - (margin.top || 0) - (margin.bottom || 0), 0)
  };
});