import * as React from 'react';
import { ReactElement, SVGProps } from 'react';
import { ChartOffsetInternal, Coordinate, LayoutType, PolarCoordinate, TooltipEventType } from '../util/types';
import { TooltipIndex, TooltipPayload } from '../state/tooltipSlice';
import { ZIndexable } from '../zIndex/ZIndexLayer';
/**
 * If set false, no cursor will be drawn when tooltip is active.
 * If set an object, the option is the configuration of cursor.
 * If set a React element, the option is the custom react element of drawing cursor
 */
export type CursorDefinition = boolean | ReactElement | SVGProps<SVGElement>;
export interface CursorProps extends ZIndexable {
    cursor: CursorDefinition;
    tooltipEventType: TooltipEventType;
    coordinate: Coordinate | PolarCoordinate | undefined;
    payload: TooltipPayload;
    index: TooltipIndex | undefined;
}
export type CursorConnectedProps = CursorProps & {
    tooltipAxisBandSize: number;
    layout: LayoutType;
    offset: ChartOffsetInternal;
    chartName: string;
};
export declare function CursorInternal(props: CursorConnectedProps): React.JSX.Element | null;
export declare function Cursor(props: CursorProps): React.JSX.Element | null;
