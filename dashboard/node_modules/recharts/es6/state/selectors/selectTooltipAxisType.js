import { selectChartLayout } from '../../context/chartLayoutContext';

/**
 * angle, radius, X, Y, and Z axes all have domain and range and scale and associated settings
 */

/**
 * Z axis is never displayed and so it lacks ticks and tick settings.
 */

export var selectTooltipAxisType = state => {
  var layout = selectChartLayout(state);
  if (layout === 'horizontal') {
    return 'xAxis';
  }
  if (layout === 'vertical') {
    return 'yAxis';
  }
  if (layout === 'centric') {
    return 'angleAxis';
  }
  return 'radiusAxis';
};