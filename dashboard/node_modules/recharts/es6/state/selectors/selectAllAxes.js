import { createSelector } from 'reselect';
export var selectAllXAxes = createSelector(state => state.cartesianAxis.xAxis, xAxisMap => {
  return Object.values(xAxisMap);
});
export var selectAllYAxes = createSelector(state => state.cartesianAxis.yAxis, yAxisMap => {
  return Object.values(yAxisMap);
});