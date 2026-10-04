import type { CSSProperties } from 'react';
import type { Percent } from '../util/types';
export declare const defaultResponsiveContainerProps: {
    readonly width: "100%";
    readonly height: "100%";
    readonly debounce: 0;
    readonly minWidth: 0;
    readonly initialDimension: {
        readonly width: -1;
        readonly height: -1;
    };
};
export declare const calculateChartDimensions: (containerWidth: number | undefined, containerHeight: number | undefined, props: {
    width: Percent | number | undefined;
    height: Percent | number | undefined;
    aspect: number | undefined;
    maxHeight: number | undefined;
}) => {
    calculatedWidth: number | undefined;
    calculatedHeight: number | undefined;
};
/**
 * This zero-size, overflow-visible is required to allow the chart to shrink.
 * Without it, the chart itself will fill the ResponsiveContainer, and while it allows the chart to grow,
 * it would always keep the container at the size of the chart,
 * and ResizeObserver would never fire.
 * With this zero-size element, the chart itself never actually fills the container,
 * it just so happens that it is visible because it overflows.
 * I learned this trick from the `react-virtualized` library: https://github.com/bvaughn/react-virtualized-auto-sizer/blob/master/src/AutoSizer.ts
 * See https://github.com/recharts/recharts/issues/172 and also https://github.com/bvaughn/react-virtualized/issues/68
 *
 * Also, we don't need to apply the zero-size style if the dimension is a fixed number (or undefined),
 * because in that case the chart can't shrink in that dimension anyway.
 * This fixes defining the dimensions using aspect ratio: https://github.com/recharts/recharts/issues/6245
 */
export declare const getInnerDivStyle: (props: {
    width?: Percent | number;
    height?: Percent | number;
}) => CSSProperties;
export declare function getDefaultWidthAndHeight({ width, height, aspect, }: {
    width: Percent | number | undefined;
    height: Percent | number | undefined;
    aspect: number | undefined;
}): {
    width: Percent | number | undefined;
    height: Percent | number | undefined;
};
