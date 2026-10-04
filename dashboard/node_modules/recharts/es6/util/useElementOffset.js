function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useCallback, useEffect, useRef, useState } from 'react';
var EPS = 1;

/**
 * Stores the dimensions and position of a DOM element as returned by `getBoundingClientRect()`.
 *
 * Values are viewport-relative and may be fractional (subpixel precision).
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect}
 */

/**
 * Callback ref setter returned by {@link useElementOffset}.
 *
 * Pass this to a DOM element's `ref` prop to start observing its layout.
 *
 * @param node - the DOM element to observe, or `null` when the element unmounts
 */

/**
 * Checks whether two ElementOffset values differ by more than `EPS` (1px) in any dimension.
 *
 * @param a - the first ElementOffset to compare
 * @param b - the second ElementOffset to compare
 * @returns true if any dimension differs by more than 1px
 */
function hasSignificantChange(a, b) {
  return Math.abs(a.height - b.height) > EPS || Math.abs(a.left - b.left) > EPS || Math.abs(a.top - b.top) > EPS || Math.abs(a.width - b.width) > EPS;
}

/**
 * Reads the current bounding box of a DOM element using `getBoundingClientRect()`.
 *
 * @param node - the DOM element to measure
 * @returns an ElementOffset with the element's current dimensions and viewport-relative position
 */
function readElementOffset(node) {
  var rect = node.getBoundingClientRect();
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width
  };
}

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
export function useElementOffset() {
  var extraDependencies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var _useState = useState({
      height: 0,
      left: 0,
      top: 0,
      width: 0
    }),
    _useState2 = _slicedToArray(_useState, 2),
    lastBoundingBox = _useState2[0],
    setLastBoundingBox = _useState2[1];
  var observerRef = useRef(null);
  var lastBoundingBoxRef = useRef(lastBoundingBox);
  lastBoundingBoxRef.current = lastBoundingBox;
  var updateBoundingBox = useCallback(node => {
    // Disconnect any previously active ResizeObserver
    if (observerRef.current != null) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (node != null) {
      // Measure immediately on ref attach
      var box = readElementOffset(node);
      if (hasSignificantChange(box, lastBoundingBoxRef.current)) {
        setLastBoundingBox(box);
      }

      // Set up ResizeObserver for future size changes
      if (typeof ResizeObserver !== 'undefined') {
        var observer = new ResizeObserver(() => {
          var newBox = readElementOffset(node);
          if (hasSignificantChange(newBox, lastBoundingBoxRef.current)) {
            setLastBoundingBox(newBox);
          }
        });
        observer.observe(node);
        observerRef.current = observer;
      }
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [...extraDependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      var _observerRef$current;
      (_observerRef$current = observerRef.current) === null || _observerRef$current === void 0 || _observerRef$current.disconnect();
    };
  }, []);
  return [lastBoundingBox, updateBoundingBox];
}