function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import * as React from 'react';
import { useCallback, useState } from 'react';
import { JavascriptAnimate } from './JavascriptAnimate';
import { useAnimationId } from '../util/useAnimationId';
import { matchAnimationItems, matchByIndex } from './matchBy';
import { useAnimationStartSnapshot } from './useAnimationStartSnapshot';
/**
 * Hook that tracks animation state and provides callbacks for animation start/end.
 *
 * @param onAnimationStart optional callback to call when animation starts
 * @param onAnimationEnd optional callback to call when animation ends
 */
export function useAnimationCallbacks(onAnimationStart, onAnimationEnd) {
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isAnimating = _useState2[0],
    setIsAnimating = _useState2[1];
  var handleAnimationStart = useCallback(() => {
    if (typeof onAnimationStart === 'function') {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  var handleAnimationEnd = useCallback(() => {
    if (typeof onAnimationEnd === 'function') {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  return {
    isAnimating,
    handleAnimationStart,
    handleAnimationEnd
  };
}

/**
 * A function that interpolates animation items at a given time.
 * This function receives an array of changes, and must "unwrap" them
 * and interpolate appropriate values and return the result which Recharts will then render.
 *
 * @see {@link https://recharts.github.io/en-US/guide/animations/ Animations guide}
 *
 * @param items The tagged animation items describing what changed, or `null` on the very first render
 *   (entrance animation). Each item is self-describing:
 *   - `{ status: 'matched', prev, next }` — interpolate between `prev` and `next`
 *   - `{ status: 'added', next }` — animate in from a computed entry position
 *   - `{ status: 'removed', prev }` — animate out to a computed exit position
 *
 *   At `animationElapsedTime = 1`, removed items should be excluded from the result.
 *
 * @param animationElapsedTime A normalized time value (0 = start, 1 = end)
 * @param layout of the chart, useful for deciding the direction of animation
 * @returns The interpolated items at time animationElapsedTime
 *
 * @since 3.9
 */

/**
 * A reusable animation wrapper for array-based chart data.
 *
 * Encapsulates the common animation pattern shared by Bar, Scatter, Funnel, Pie,
 * Radar, RadialBar, Area, and Line:
 * 1. Track previous items in a ref
 * 2. Wrap in JavascriptAnimate
 * 3. Update ref when animationElapsedTime > 0
 *
 * @since 3.9
 */
export function AnimatedItems(props) {
  var _animationStartItems$;
  var animationInput = props.animationInput,
    animationIdPrefix = props.animationIdPrefix,
    items = props.items,
    previousItemsRef = props.previousItemsRef,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    onAnimationStart = props.onAnimationStart,
    onAnimationEnd = props.onAnimationEnd,
    animationInterpolateFn = props.animationInterpolateFn,
    animationMatchBy = props.animationMatchBy,
    shouldUpdatePreviousRef = props.shouldUpdatePreviousRef,
    children = props.children,
    layout = props.layout;
  var animationId = useAnimationId(animationInput, animationIdPrefix);
  var animationStartItems = useAnimationStartSnapshot(animationId, previousItemsRef);
  var rawPrevItems = (_animationStartItems$ = animationStartItems.startValue) !== null && _animationStartItems$ !== void 0 ? _animationStartItems$ : null;
  var animationItems = matchAnimationItems(rawPrevItems, items, animationMatchBy !== null && animationMatchBy !== void 0 ? animationMatchBy : matchByIndex);
  return /*#__PURE__*/React.createElement(JavascriptAnimate, {
    animationId: animationId,
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    onAnimationEnd: onAnimationEnd,
    onAnimationStart: onAnimationStart,
    key: animationId
  }, animationElapsedTime => {
    var isEntrance = rawPrevItems == null;
    var stepData = items == null ? items : animationInterpolateFn(animationItems, animationElapsedTime, layout);
    var canUpdate = shouldUpdatePreviousRef ? shouldUpdatePreviousRef(animationElapsedTime) : animationElapsedTime > 0;
    animationStartItems.syncStepValue(stepData, animationElapsedTime, canUpdate);
    if (stepData == null) {
      return null;
    }
    return children(stepData, animationElapsedTime, isEntrance);
  });
}