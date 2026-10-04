import * as React from 'react';
import { SVGProps } from 'react';
import { SymbolType as D3SymbolType } from 'victory-vendor/d3-shape';
import { SymbolType } from '../util/types';
type SizeType = 'area' | 'diameter';
export interface InnerSymbolsProp {
    className?: string;
    type?: SymbolType;
    cx?: number;
    cy?: number;
    size?: number;
    sizeType?: SizeType;
}
export type SymbolsProps = Omit<SVGProps<SVGPathElement>, 'type'> & InnerSymbolsProp;
/**
 * Renders a symbol from a set of predefined shapes.
 */
export declare const Symbols: {
    ({ type, size, sizeType, ...rest }: SymbolsProps): React.JSX.Element | null;
    registerSymbol: (key: string, factory: D3SymbolType) => void;
};
export {};
