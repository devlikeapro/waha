import { RechartsScaleType } from '../../../util/types';
import { BaseCartesianAxis } from '../../cartesianAxisSlice';
export declare const combineRealScaleType: (axisConfig: BaseCartesianAxis | undefined, hasBar: boolean, chartType: string) => RechartsScaleType | undefined;
