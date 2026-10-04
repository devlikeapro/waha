import { RechartsRootState } from '../store';
import { AxisId } from '../cartesianAxisSlice';
import { AngleAxisSettings, RadiusAxisSettings } from '../polarAxisSlice';
import { PolarChartOptions } from '../polarOptionsSlice';
import { AxisDomainTypeInput, PolarViewBoxRequired } from '../../util/types';
import { AxisRange } from './axisSelectors';
export declare const implicitAngleAxis: Omit<AngleAxisSettings, 'type'> & {
    type: AxisDomainTypeInput;
};
export declare const implicitRadiusAxis: Omit<RadiusAxisSettings, 'type'> & {
    type: AxisDomainTypeInput;
};
export declare const selectAngleAxis: (state: RechartsRootState, angleAxisId: AxisId | undefined) => AngleAxisSettings;
export declare const selectRadiusAxis: (state: RechartsRootState, radiusAxisId: AxisId) => RadiusAxisSettings;
export declare const selectPolarOptions: (state: RechartsRootState) => PolarChartOptions | null;
export declare const selectMaxRadius: (state: RechartsRootState) => number;
export declare const selectOuterRadius: (state: RechartsRootState) => number | undefined;
export declare const selectAngleAxisRange: (state: RechartsRootState) => AxisRange;
export declare const selectAngleAxisRangeWithReversed: (state: RechartsRootState, angleAxisId: AxisId) => AxisRange | undefined;
export declare const selectRadiusAxisRange: (state: RechartsRootState, radiusAxisId: AxisId) => AxisRange | undefined;
export declare const selectRadiusAxisRangeWithReversed: (state: RechartsRootState, radiusAxisId: AxisId) => AxisRange | undefined;
export declare const selectPolarViewBox: (state: RechartsRootState) => PolarViewBoxRequired | undefined;
