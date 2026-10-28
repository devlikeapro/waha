/**
 * @fileOverview Default Tooltip Content
 */
import * as React from 'react';
import { CSSProperties, ReactNode, SVGProps } from 'react';
import { DataKey } from '../util/types';
export type TooltipType = 'none';
export type ValueType = number | string | ReadonlyArray<number | string>;
export type NameType = number | string;
export type Formatter<TValue extends ValueType = ValueType, TName extends NameType = NameType> = (value: TValue | undefined, name: TName | undefined, item: Payload<TValue, TName>, index: number, payload: ReadonlyArray<Payload<TValue, TName>>) => [React.ReactNode, TName] | React.ReactNode;
export interface Payload<TValue extends ValueType = ValueType, TName extends NameType = NameType> extends Omit<SVGProps<SVGElement>, 'name'> {
    type?: TooltipType;
    color?: string;
    formatter?: Formatter<TValue, TName>;
    name?: TName;
    value?: TValue;
    unit?: ReactNode;
    fill?: string;
    dataKey?: DataKey<any>;
    nameKey?: DataKey<any>;
    payload?: any;
    chartType?: string;
    stroke?: string;
    strokeDasharray?: string | number;
    strokeWidth?: number | string;
    className?: string;
    hide?: boolean;
    /**
     * The id of the graphical item that the data point belongs to
     */
    graphicalItemId: string;
}
/**
 * @inline
 */
export type TooltipItemSorter<TValue extends ValueType = ValueType, TName extends NameType = NameType> = 'dataKey' | 'value' | 'name' | ((item: Payload<TValue, TName>) => number | string | undefined);
export interface Props<TValue extends ValueType = ValueType, TName extends NameType = NameType> {
    separator?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    formatter?: Formatter<TValue, TName>;
    contentStyle?: CSSProperties;
    itemStyle?: CSSProperties;
    labelStyle?: CSSProperties;
    labelFormatter?: (label: ReactNode, payload: ReadonlyArray<Payload<TValue, TName>>) => ReactNode;
    label?: ReactNode;
    payload?: ReadonlyArray<Payload<TValue, TName>>;
    itemSorter?: TooltipItemSorter<TValue, TName>;
    accessibilityLayer?: boolean;
}
export declare const defaultDefaultTooltipContentProps: {
    readonly separator: " : ";
    readonly contentStyle: {
        readonly margin: 0;
        readonly padding: 10;
        readonly backgroundColor: "#fff";
        readonly border: "1px solid #ccc";
        readonly whiteSpace: "nowrap";
    };
    readonly itemStyle: {
        readonly display: "block";
        readonly paddingTop: 4;
        readonly paddingBottom: 4;
        readonly color: "#000";
    };
    readonly labelStyle: {};
    readonly accessibilityLayer: false;
};
/**
 * This component is by default rendered inside the {@link Tooltip} component. You would not use it directly.
 *
 * You can use this component to customize the content of the tooltip,
 * or you can provide your own completely independent content.
 */
export declare const DefaultTooltipContent: (props: Props) => React.JSX.Element;
