import { MaybeStackedGraphicalItem } from '../../types/StackedGraphicalItem';
import { BarPositionPosition } from '../../../util/ChartUtils';
import { BarWithPosition } from '../barSelectors';
export declare const combineBarPosition: (allBarPositions: ReadonlyArray<BarWithPosition> | undefined, barSettings: MaybeStackedGraphicalItem | undefined) => BarPositionPosition | undefined;
