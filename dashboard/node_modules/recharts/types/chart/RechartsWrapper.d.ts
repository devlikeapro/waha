import * as React from 'react';
import { CSSProperties, ReactNode, Ref } from 'react';
import { ExternalMouseEvents } from './types';
import { Percent } from '../util/types';
export type RechartsWrapperProps = ExternalMouseEvents & {
    children: ReactNode;
    width: number | Percent | undefined;
    height: number | Percent | undefined;
    /**
     * If true, then it will listen to container size changes and adapt the SVG chart accordingly.
     * If false, then it renders the chart at the specified width and height and will stay that way
     * even if the container size changes.
     */
    responsive: boolean;
    className?: string;
    style?: CSSProperties;
    ref?: Ref<HTMLDivElement>;
    /**
     * Treemap is special snowflake that handles its own mouse events so
     * here is a flag to disable the dispatching of mouse events from RechartsWrapper.
     * If false, then this disables mouse click and touch event dispatching.
     * Mouse move events are still dispatched because they are needed for tooltip synchronization.
     * @default true
     */
    dispatchTouchEvents?: boolean;
};
export declare const RechartsWrapper: React.ForwardRefExoticComponent<Omit<RechartsWrapperProps, "ref"> & React.RefAttributes<HTMLDivElement | null>>;
