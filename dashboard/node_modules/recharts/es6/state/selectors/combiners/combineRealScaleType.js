import * as d3Scales from 'victory-vendor/d3-scale';
import { upperFirst } from '../../../util/DataUtils';
function getD3ScaleName(name) {
  return "scale".concat(upperFirst(name));
}
function isSupportedScaleName(name) {
  return getD3ScaleName(name) in d3Scales;
}
export var combineRealScaleType = (axisConfig, hasBar, chartType) => {
  if (axisConfig == null) {
    return undefined;
  }
  var scale = axisConfig.scale,
    type = axisConfig.type;
  if (scale === 'auto') {
    if (type === 'category' && chartType && (chartType.indexOf('LineChart') >= 0 || chartType.indexOf('AreaChart') >= 0 || chartType.indexOf('ComposedChart') >= 0 && !hasBar)) {
      return 'point';
    }
    if (type === 'category') {
      return 'band';
    }
    return 'linear';
  }
  if (typeof scale === 'string') {
    return isSupportedScaleName(scale) ? scale : 'point';
  }
  return undefined;
};