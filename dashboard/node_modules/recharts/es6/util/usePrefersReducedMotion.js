function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useEffect, useState } from 'react';
import { Global } from './Global';

/**
 * Detects and subscribes to the user's `prefers-reduced-motion` system preference.
 * Returns `true` when the user prefers reduced motion, `false` otherwise.
 * SSR-safe: always returns `false` during server-side rendering.
 */
export function usePrefersReducedMotion() {
  var _useState = useState(() => {
      if (Global.isSsr) {
        return false;
      }
      if (!window.matchMedia) {
        return false;
      }
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }),
    _useState2 = _slicedToArray(_useState, 2),
    prefersReducedMotion = _useState2[0],
    setPrefersReducedMotion = _useState2[1];
  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }
    var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    // eslint-disable-next-line consistent-return
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  return prefersReducedMotion;
}