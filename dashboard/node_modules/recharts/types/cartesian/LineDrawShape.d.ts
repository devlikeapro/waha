import * as React from 'react';
import { RefObject } from 'react';
import { Props as CurveProps } from '../shape/Curve';
import { ShapeAnimationProps } from '../util/types';
export type LineDrawShapeProps = Omit<CurveProps, 'pathRef'> & ShapeAnimationProps & {
    /**
     * CurveProps use Ref which includes the object plus callback.
     * Here in LineDrawShape we have to read from it so we only allow the object - but we keep `Curve.ref` the same
     * for backwards compatibility.
     * LineDrawShape is new since 3.9 so there's no backwards to go.
     */
    pathRef: RefObject<SVGPathElement>;
    /**
     * The computed visible length of the SVG path during entrance animation, in pixels.
     * - When a number: the shape should apply stroke-dasharray to reveal exactly this many pixels.
     * - When null or undefined: no entrance-driven stroke-dasharray should be applied.
     *
     * This value is computed by `useAnimatedLineLength` in the parent component.
     */
    visibleLength?: number | null;
};
/**
 * The default shape for Line. During the entrance animation, the line is progressively
 * revealed using the `strokeDasharray` SVG attribute: the visible portion grows from
 * 0 to the full path length as `animationElapsedTime` progresses from 0 to 1.
 *
 * This is the built-in shape for Line. It is automatically used when no custom `shape` prop
 * is provided. You can import and reuse it as a starting point for custom shapes,
 * or use it as a reference for building your own.
 *
 * The animation progress props (`animationElapsedTime`, `isAnimating`, `isEntrance`) are available
 * for custom shapes that want to add their own effects on top.
 *
 * @example
 * ```tsx
 * import { Line, LineDrawShape } from 'recharts';
 *
 * // Use the default shape explicitly (same as providing no shape prop)
 * <Line dataKey="value" shape={LineDrawShape} />
 * ```
 *
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 *
 * @since 3.9
 */
export declare function LineDrawShape(props: LineDrawShapeProps): React.ReactElement | null;
