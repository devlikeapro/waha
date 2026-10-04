import { AllStackGroups, StackSeries } from '../../../util/stacks/stackTypes';
import { MaybeStackedGraphicalItem } from '../../types/StackedGraphicalItem';
export declare const combineStackedData: (stackGroups: AllStackGroups | undefined, barSettings: MaybeStackedGraphicalItem | undefined) => StackSeries | undefined;
