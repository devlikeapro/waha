import * as React from 'react';
import { ActiveShape, ShapeAnimationProps, SymbolType } from './types';
import { ScatterPointItem } from '../cartesian/Scatter';
import { InnerSymbolsProp } from '../shape/Symbols';
import { DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME } from './Constants';
import { GraphicalItemId } from '../state/graphicalItemsSlice';
export type ScatterShapeProps = ScatterPointItem & ShapeAnimationProps & {
    isActive: boolean;
    index: number;
    [DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME]: GraphicalItemId;
};
export declare function ScatterSymbol({ option, ...props }: {
    option: ActiveShape<ScatterShapeProps & InnerSymbolsProp, SVGPathElement> | SymbolType;
} & ScatterShapeProps): React.JSX.Element;
