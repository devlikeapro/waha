import * as React from 'react';
import { CSSProperties, SVGProps } from 'react';
interface Words {
    words: Array<string>;
    width: number | undefined;
}
/**
 * @inline
 */
export type TextAnchor = 'start' | 'middle' | 'end' | 'inherit';
export declare function isValidTextAnchor(value: string | undefined): value is TextAnchor;
/**
 * @inline
 */
export type TextVerticalAnchor = 'start' | 'middle' | 'end';
/**
 * @inline
 */
export type RenderableText = string | number | boolean | null | undefined;
export declare function isRenderableText(val: unknown): val is RenderableText;
interface TextProps {
    /**
     * When true, scales the text to fit within the specified width.
     * The text will be scaled down proportionally to fit the available space.
     *
     * **Important interactions:**
     * - Requires `width` to be defined to have any effect. If width is undefined, scaleToFit does nothing.
     * - When enabled, `maxLines` restrictions are bypassed and ellipsis truncation is disabled.
     * - Uses the first line's width to calculate the scale factor.
     * - The scaling transform is applied as `scale(width / lineWidth)`.
     *
     * @defaultValue false
     */
    scaleToFit?: boolean;
    /**
     * Text rotation angle in degrees.
     * Positive values rotate clockwise, negative values rotate counterclockwise.
     *
     * @defaultValue 0
     */
    angle?: number;
    /**
     * Horizontal text alignment within the text element.
     * - 'start': Text starts at the x coordinate (left-aligned for LTR text)
     * - 'middle': Text is centered on the x coordinate
     * - 'end': Text ends at the x coordinate (right-aligned for LTR text)
     * - 'inherit': Inherits the text-anchor from parent element
     *
     * **Note:** This controls horizontal alignment only and does not affect RTL text behavior.
     * @defaultValue 'start'
     */
    textAnchor?: TextAnchor;
    /**
     * Vertical text alignment relative to the y coordinate.
     * - 'start': Text baseline starts at y coordinate (text appears below the y position)
     * - 'middle': Text is vertically centered on the y coordinate
     * - 'end': Text baseline ends at y coordinate (text appears above the y position)
     *
     * **Note:** This controls vertical positioning only and does not affect RTL (right-to-left) text behavior.
     * The alignment calculation uses capHeight and lineHeight to determine the starting dy offset.
     *
     * @defaultValue 'end'
     */
    verticalAnchor?: TextVerticalAnchor;
    /**
     * CSS styles to apply to the text element.
     * These styles are used for text measurement calculations when width constraints or scaleToFit are used.
     * Font-related properties (fontSize, fontFamily, fontWeight, etc.) are particularly important for accurate measurements.
     */
    style?: CSSProperties;
    /**
     * Line height for multi-line text.
     * Can be a number (height in pixels) or a string with CSS units.
     * Used to calculate spacing between lines when text wraps to multiple lines.
     * Also used in verticalAnchor calculations for positioning the text block.
     * @defaultValue '1em'
     */
    lineHeight?: number | string;
    /**
     * When true, enables character-level breaking instead of word-level breaking.
     * - false: Text breaks at word boundaries (spaces, tabs, etc.)
     * - true: Text can break between any characters, useful for languages without spaces
     *
     * **Note:** Only effective when `width` is defined to enable line breaking.
     * @defaultValue false
     */
    breakAll?: boolean;
    /**
     * The text content to render.
     * Can be a string or number. Numbers will be converted to strings.
     * undefined or null values will result in no text being rendered.
     */
    children?: RenderableText;
    /**
     * Maximum number of lines to display when text wrapping is enabled.
     * When text exceeds this limit, it will be truncated with an ellipsis (…).
     *
     * **Important requirements for ellipsis truncation:**
     * - `width` must be defined (no effect when width is undefined)
     * - `scaleToFit` must be false (when scaleToFit is true, maxLines is bypassed)
     * - Text must actually overflow the specified maxLines or width constraints
     *
     * **Truncation behavior:**
     * - Uses binary search to find the optimal truncation point
     * - Adds ellipsis (…) at the end of the truncated text
     * - Ensures the truncated text + ellipsis fits within the constraints
     *
     * **Interaction with other props:**
     * - When `scaleToFit` is true, this property is ignored
     * - Requires `width` to be set for line breaking to occur
     */
    maxLines?: number;
    /**
     * When width is specified, the text will automatically wrap by calculating the width of text.
     */
    width?: number | string;
}
export type Props = Omit<SVGProps<SVGTextElement>, 'textAnchor' | 'verticalAnchor'> & TextProps;
type GetWordsByLinesProps = Pick<Props, 'width' | 'scaleToFit' | 'children' | 'style' | 'breakAll' | 'maxLines'>;
export declare const getWordsByLines: ({ width, scaleToFit, children, style, breakAll, maxLines }: GetWordsByLinesProps) => readonly Words[];
export declare const textDefaultProps: {
    readonly angle: 0;
    readonly breakAll: false;
    readonly capHeight: "0.71em";
    readonly fill: "#808080";
    readonly lineHeight: "1em";
    readonly scaleToFit: false;
    readonly textAnchor: "start";
    readonly verticalAnchor: "end";
    readonly x: 0;
    readonly y: 0;
};
export declare const Text: React.ForwardRefExoticComponent<Omit<Props, "ref"> & React.RefAttributes<SVGTextElement>>;
export {};
