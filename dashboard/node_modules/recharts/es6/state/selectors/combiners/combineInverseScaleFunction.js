import { createCategoricalInverse } from '../../../util/scale/createCategoricalInverse';
export function combineInverseScaleFunction(configuredScale) {
  if (configuredScale == null) {
    return undefined;
  }
  if ('invert' in configuredScale && typeof configuredScale.invert === 'function') {
    return configuredScale.invert.bind(configuredScale);
  }
  return createCategoricalInverse(configuredScale, undefined);
}