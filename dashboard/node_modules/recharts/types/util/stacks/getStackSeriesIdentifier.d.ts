import { StackSeriesIdentifier } from './stackTypes';
import { MaybeStackedGraphicalItem } from '../../state/types/StackedGraphicalItem';
export declare function getStackSeriesIdentifier(graphicalItem: MaybeStackedGraphicalItem): StackSeriesIdentifier;
export declare function getStackSeriesIdentifier(graphicalItem: undefined): undefined;
export declare function getStackSeriesIdentifier(graphicalItem: MaybeStackedGraphicalItem | undefined): StackSeriesIdentifier | undefined;
