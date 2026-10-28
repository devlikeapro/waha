import { RechartsRootState } from '../store';
/**
 * angle, radius, X, Y, and Z axes all have domain and range and scale and associated settings
 */
export type AllAxisTypes = 'xAxis' | 'yAxis' | 'zAxis' | 'radiusAxis' | 'angleAxis';
/**
 * Z axis is never displayed and so it lacks ticks and tick settings.
 */
export type RenderableAxisType = 'xAxis' | 'yAxis' | 'angleAxis' | 'radiusAxis';
export declare const selectTooltipAxisType: (state: RechartsRootState) => RenderableAxisType;
