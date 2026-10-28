/**
 * Stores the dimensions and position of a DOM element as returned by `getBoundingClientRect()`.
 *
 * Values are viewport-relative and may be fractional (subpixel precision).
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect}
 */
export type ElementOffset = {
    /**
     * Height of an element as returned by `getBoundingClientRect()`.
     * This is the CSS height including padding and border, and may be a fractional value.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect/height}
     */
    height: number;
    /**
     * Distance from the left edge of the viewport to the left edge of the element,
     * as returned by `getBoundingClientRect()`.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect/left}
     */
    left: number;
    /**
     * Distance from the top edge of the viewport to the top edge of the element,
     * as returned by `getBoundingClientRect()`.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect/top}
     */
    top: number;
    /**
     * Width of an element as returned by `getBoundingClientRect()`.
     * This is the CSS width including padding and border, and may be a fractional value.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect/width}
     */
    width: number;
};
/**
 * Callback ref setter returned by {@link useElementOffset}.
 *
 * Pass this to a DOM element's `ref` prop to start observing its layout.
 *
 * @param node - the DOM element to observe, or `null` when the element unmounts
 */
export type SetElementOffset = (node: HTMLElement | null) => void;
/**
 * Use this to listen to element layout changes.
 *
 * Very useful for reading actual sizes of DOM elements relative to the viewport.
 *
 * Uses ResizeObserver to automatically detect size changes of the observed element.
 *
 * @param extraDependencies use this to trigger new DOM dimensions read when any of these change. Good for things like payload and label, that will re-render something down in the children array, but you want to read the layout box of a parent.
 * @returns [lastElementOffset, updateElementOffset] most recent value, and setter. Pass the setter to a DOM element ref like this: `<div ref={updateElementOffset}>`
 */
export declare function useElementOffset(extraDependencies?: ReadonlyArray<unknown>): [ElementOffset, SetElementOffset];
