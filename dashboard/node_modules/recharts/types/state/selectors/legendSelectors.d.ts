import type { RechartsRootState } from '../store';
import type { LegendSettings } from '../legendSlice';
import type { LegendPayload } from '../../component/DefaultLegendContent';
import type { Size } from '../../util/types';
export declare const selectLegendSettings: (state: RechartsRootState) => LegendSettings;
export declare const selectLegendSize: (state: RechartsRootState) => Size;
export declare const selectLegendPayload: (state: RechartsRootState) => ReadonlyArray<LegendPayload>;
