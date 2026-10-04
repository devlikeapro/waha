import * as React from 'react';
import { Coordinate, DataKey } from '../util/types';
import { TooltipPayload } from '../state/tooltipSlice';
/**
 * Some graphical items choose to provide more information to the tooltip
 * and some do not.
 */
export type TooltipTriggerInfo = {
    tooltipPayload?: TooltipPayload;
    tooltipPosition?: Coordinate;
};
export type MouseEnterLeaveEvent<T, E extends SVGElement = SVGElement> = (data: T, index: number, event: React.MouseEvent<E>) => void;
export declare const useMouseEnterItemDispatch: <T extends TooltipTriggerInfo, E extends SVGElement = SVGElement>(onMouseEnterFromProps: MouseEnterLeaveEvent<T, E> | undefined, dataKey: DataKey<any> | undefined, graphicalItemId: string) => (data: T, index: number) => (event: React.MouseEvent<E>) => void;
export declare const useMouseLeaveItemDispatch: <T extends TooltipTriggerInfo, E extends SVGElement = SVGElement>(onMouseLeaveFromProps: undefined | MouseEnterLeaveEvent<T, E>) => (data: T, index: number) => (event: React.MouseEvent<E>) => void;
export declare const useMouseClickItemDispatch: <T extends TooltipTriggerInfo, E extends SVGElement = SVGElement>(onMouseClickFromProps: MouseEnterLeaveEvent<T, E> | undefined, dataKey: DataKey<any> | undefined, graphicalItemId: string) => (data: T, index: number) => (event: React.MouseEvent<E>) => void;
