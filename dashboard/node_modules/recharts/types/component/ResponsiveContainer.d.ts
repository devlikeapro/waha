import * as React from 'react';
import { CSSProperties, ReactNode } from 'react';
import { Percent, Size } from '../util/types';
export interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'className' | 'style' | 'onResize'> {
    /**
     * width / height. If specified, the height will be calculated by width / aspect.
     */
    aspect?: number;
    /**
     * The width of chart container.
     * Can be a number or a percent string like "100%".
     * @default '100%'
     */
    width?: Percent | number;
    /**
     * The height of chart container.
     * Can be a number or a percent string like "100%".
     * @default '100%'
     */
    height?: Percent | number;
    /**
     * The minimum width of the container.
     * @default 0
     */
    minWidth?: string | number;
    /**
     * The minimum height of the container.
     */
    minHeight?: string | number;
    /**
     * The initial width and height of the container.
     * @default {"width":-1,"height":-1}
     */
    initialDimension?: {
        width: number;
        height: number;
    };
    /** The maximum height of the container. It can be a number. */
    maxHeight?: number;
    /**
     * The content of the container.
     * It can contain multiple charts, and then they will all share the same dimensions.
     */
    children: ReactNode;
    /**
     * If specified a positive number, debounced function will be used to handle the resize event.
     * @default 0
     */
    debounce?: number;
    /**
     * Unique identifier of this component.
     * Used as an HTML attribute `id`.
     */
    id?: string | number;
    /** The HTML element's class name */
    className?: string | number;
    /** The style of the container. */
    style?: CSSProperties;
    /**
     * If specified provides a callback providing the updated chart width and height values.
     */
    onResize?: (width: number, height: number) => void;
}
export declare const useResponsiveContainerContext: () => Size;
/**
 * The `ResponsiveContainer` component is a container that adjusts its width and height based on the size of its parent element.
 * It is used to create responsive charts that adapt to different screen sizes.
 *
 * This component uses the {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver ResizeObserver} API to monitor changes to the size of its parent element.
 * If you need to support older browsers that do not support this API, you may need to include a polyfill.
 *
 * @see {@link https://recharts.github.io/en-US/guide/sizes/ Chart size guide}
 *
 * @provides ResponsiveContainerContext
 */
export declare const ResponsiveContainer: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
