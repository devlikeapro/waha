import { MaybeStackedGraphicalItem } from '../../types/StackedGraphicalItem';
import { StackId } from '../../../util/ChartUtils';
import { SizeList } from '../barSelectors';
import { DataKey } from '../../../util/types';
export declare const combineBarSizeList: (allBars: ReadonlyArray<MaybeStackedGraphicalItem>, globalSize: string | number | undefined, totalSize: number | undefined) => SizeList;
export type BarCategory = {
    stackId: StackId | undefined;
    /**
     * List of dataKeys of items stacked at this position.
     * All of these Bars are either sharing the same stackId,
     * or this is an array with one Bar because it has no stackId defined.
     *
     * This structure limits us to having one dataKey only once per stack which I think is reasonable.
     * People who want to have the same data twice can duplicate their data to have two distinct dataKeys.
     */
    dataKeys: ReadonlyArray<DataKey<any>>;
    /**
     * Width (in horizontal chart) or height (in vertical chart) of this stack of items
     */
    barSize: number | undefined;
};
