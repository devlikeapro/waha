import * as React from 'react';
import { Props as FunnelProps, FunnelTrapezoidItem } from '../cartesian/Funnel';
import { ShapeAnimationProps } from './types';
export declare const defaultFunnelShape: React.FC<import("..").TrapezoidProps>;
export type FunnelTrapezoidProps = {
    option: Exclude<FunnelProps['shape'], undefined> | FunnelProps['activeShape'];
    isActive: boolean;
} & ShapeAnimationProps & FunnelTrapezoidItem;
export declare function FunnelTrapezoid({ option, ...shapeProps }: FunnelTrapezoidProps): React.JSX.Element;
