import * as React from 'react';
import { Props as CurveProps } from '../shape/Curve';
import { LayoutType, ShapeAnimationProps } from '../util/types';
export type AreaRevealShapeProps = CurveProps & ShapeAnimationProps & {
    layout?: LayoutType;
    isRange?: boolean;
};
/**
 * The default shape for Area that reveals the chart with a left-to-right (or top-to-bottom)
 * clip-path animation on entrance, and renders the plain curve otherwise.
 *
 * This component renders the complete Area visual: the filled area curve, the stroke curve,
 * and (for range areas) the baseline stroke curve. During entrance animation, all curves are
 * wrapped in a clip-path that progressively reveals the area.
 *
 * This is the built-in entrance animation for Area. It is automatically used when no custom
 * `shape` prop is provided. You can import and reuse it as a starting point for custom shapes.
 *
 * @example
 * ```tsx
 * import { Area, AreaRevealShape } from 'recharts';
 *
 * // Use the default shape explicitly (same as providing no shape prop)
 * <Area dataKey="value" shape={AreaRevealShape} />
 * ```
 *
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 *
 * @since 3.9
 */
export declare function AreaRevealShape(props: AreaRevealShapeProps): React.ReactElement | null;
