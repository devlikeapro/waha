function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useEffect, useState } from 'react';
import { noop } from '../util/DataUtils';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { createEasingFunction } from './easing';
import { useAnimationController } from './useAnimationController';
import { Global } from '../util/Global';
import { usePrefersReducedMotion } from '../util/usePrefersReducedMotion';
import { JavascriptAnimation } from './AnimationHandle';
import { RequestAnimationFrameTimeoutController } from './timeoutController';
var defaultJavascriptAnimateProps = {
  begin: 0,
  duration: 1000,
  easing: 'ease',
  isActive: true,
  canBegin: true,
  onAnimationEnd: () => {},
  onAnimationStart: () => {}
};
var from = 0;
var to = 1;
export function JavascriptAnimate(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultJavascriptAnimateProps);
  var animationId = props.animationId,
    isActiveProp = props.isActive,
    canBegin = props.canBegin,
    duration = props.duration,
    easing = props.easing,
    begin = props.begin,
    onAnimationEnd = props.onAnimationEnd,
    onAnimationStart = props.onAnimationStart,
    children = props.children;
  var prefersReducedMotion = usePrefersReducedMotion();
  var isActive = isActiveProp === 'auto' ? !Global.isSsr && !prefersReducedMotion : isActiveProp;
  var animationController = useAnimationController(props.animationController);
  var _useState = useState(isActive ? from : to),
    _useState2 = _slicedToArray(_useState, 2),
    style = _useState2[0],
    setStyle = _useState2[1];
  useEffect(() => {
    if (!isActive) {
      setStyle(to);
    }
  }, [isActive]);
  useEffect(() => {
    var easingFunction = createEasingFunction(easing);
    if (!isActive || !canBegin || easingFunction == null) {
      return noop;
    }
    var timeoutController = new RequestAnimationFrameTimeoutController();
    var animation = new JavascriptAnimation({
      animationId,
      easing: easingFunction,
      animationDuration: duration,
      animationBegin: begin,
      onAnimationStart,
      onAnimationEnd,
      from,
      to
    });
    return animationController(timeoutController, animation, setStyle);
  }, [animationController, animationId, isActive, canBegin, duration, easing, begin, onAnimationStart, onAnimationEnd]);
  return children(Number(style));
}