import { BarWithPosition, SizeList } from '../barSelectors';
export declare const combineAllBarPositions: (sizeList: SizeList, globalMaxBarSize: number | undefined, barGap: string | number, barCategoryGap: string | number, barBandSize: number, bandSize: number | undefined, childMaxBarSize: number | undefined) => ReadonlyArray<BarWithPosition> | undefined;
