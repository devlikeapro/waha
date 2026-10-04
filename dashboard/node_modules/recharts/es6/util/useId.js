var _ref;
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import * as React from 'react';
import { uniqueId } from './DataUtils';

/**
 * Fallback for React.useId() for versions prior to React 18.
 * Generates a unique ID using a simple counter and a prefix.
 *
 * @returns A unique ID that remains consistent across renders.
 */
export var useIdFallback = () => {
  var _React$useState = React.useState(() => uniqueId('uid-')),
    _React$useState2 = _slicedToArray(_React$useState, 1),
    id = _React$useState2[0];
  return id;
};

/*
 * This weird syntax is used to avoid a build-time error in React 17 and earlier when building with Webpack.
 * See https://github.com/webpack/webpack/issues/14814
 */
export var useId = (_ref = React['useId'.toString()]) !== null && _ref !== void 0 ? _ref : useIdFallback;