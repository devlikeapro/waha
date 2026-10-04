/**
 * @fileOverview Cartesian Axis
 */
import * as React from 'react';
import { SVGProps } from 'react';
import { Props as TextProps } from '../component/Text';
import { ImplicitLabelType } from '../component/Label';
import { CartesianViewBox, PresentationAttributesAdaptChildEvent, CartesianTickItem, AxisInterval, TickProp } from '../util/types';
import { AxisId, XAxisOrientation, XAxisPadding, YAxisOrientation, YAxisPadding } from '../state/cartesianAxisSlice';
import { ZIndexable } from '../zIndex/ZIndexLayer';
/** The orientation of the axis in correspondence to the chart */
export type Orientation = XAxisOrientation | YAxisOrientation;
/** A unit to be appended to a value */
export type Unit = string | number;
/** The formatter function of tick */
export type TickFormatter = (value: any, index: number) => string;
export interface CartesianAxisProps extends ZIndexable {
    className?: string;
    axisType?: 'xAxis' | 'yAxis';
    axisId?: AxisId;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    unit?: Unit;
    orientation?: Orientation;
    viewBox?: CartesianViewBox;
    tick?: TickProp<unknown>;
    /**
     * Additional props to spread to each tick Text element.
     * Optional, the CartesianAxis component will provide its own defaults calculated from other props.
     */
    tickTextProps?: TextProps;
    axisLine?: boolean | SVGProps<SVGLineElement>;
    tickLine?: boolean | SVGProps<SVGLineElement>;
    mirror?: boolean;
    tickMargin?: number;
    hide?: boolean;
    label?: ImplicitLabelType;
    /** Padding information passed to custom tick components */
    padding?: XAxisPadding | YAxisPadding;
    minTickGap?: number;
    /**
     * Careful - this is the same name as XAxis + YAxis `ticks` but completely different object!
     */
    ticks?: ReadonlyArray<CartesianTickItem>;
    tickSize?: number;
    tickFormatter?: TickFormatter;
    interval?: AxisInterval;
    /** Angle in which ticks will be rendered. */
    angle?: number;
    /**
     * CartesianAxis reads scale internally and this prop is ignored since 3.0
     * @deprecated
     */
    scale?: unknown;
    labelRef?: React.RefObject<SVGTextElement> | null;
    ref?: React.Ref<CartesianAxisRef>;
}
export interface CartesianAxisRef {
    getCalculatedWidth(): number;
    getCalculatedHeight(): number;
}
export declare const defaultCartesianAxisProps: {
    readonly x: 0;
    readonly y: 0;
    readonly width: 0;
    readonly height: 0;
    readonly viewBox: {
        readonly x: 0;
        readonly y: 0;
        readonly width: 0;
        readonly height: 0;
    };
    readonly orientation: "bottom";
    readonly ticks: CartesianAxisProps["ticks"];
    readonly stroke: "#666";
    readonly tickLine: true;
    readonly axisLine: true;
    readonly tick: true;
    readonly mirror: false;
    readonly minTickGap: 5;
    readonly tickSize: 6;
    readonly tickMargin: 2;
    readonly interval: "preserveEnd";
    readonly zIndex: 500;
};
export type Props = Omit<PresentationAttributesAdaptChildEvent<any, SVGElement>, 'viewBox' | 'scale' | 'ref'> & CartesianAxisProps;
/**
 * @deprecated
 *
 * This component is not meant to be used directly in app code.
 * Use XAxis or YAxis instead.
 *
 * Starting from Recharts v4.0 we will make this component internal only.
 */
export declare const CartesianAxis: React.ForwardRefExoticComponent<Omit<Props, "ref"> & React.RefAttributes<CartesianAxisRef>>;
