"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchAnimationItems = matchAnimationItems;
exports.matchAppend = void 0;
exports.matchByDataKey = matchByDataKey;
exports.matchByIndex = void 0;
var _ChartUtils = require("../util/ChartUtils");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * A tagged union describing the status of an item during animation.
 *
 * - `matched`: item exists in both previous and next data — interpolate between positions
 * - `added`: item is new (no previous position) — animate in
 * - `removed`: item was in previous data but not in next — animate out
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */

/**
 * A function that extracts a key from an animation item for matching purposes.
 * Items in the previous and next arrays that return the same key are considered
 * the same logical item and will animate between their positions.
 *
 * @param item The chart item (e.g., a bar rectangle, a line point, a pie sector)
 * @param index The index of the item in the array
 * @returns A string or number key, or null if the item cannot be matched
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */

/**
 * The union of all accepted `animationMatchBy` prop values:
 * a built-in sentinel string, or a custom matching function.
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */

/**
 * Match animation items by their array index (the default behavior).
 *
 * Previous items are paired with next items based on their position
 * in the array, with proportional stretching when array lengths differ.
 * When going from 5 to 15 items, each old point "covers" approximately 3 new points;
 * when shrinking, some old points are skipped.
 *
 * @example
 * import { matchByIndex } from 'recharts';
 * <Line animationMatchBy={matchByIndex} />
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
var matchByIndex = exports.matchByIndex = 'index';

/**
 * Match animation items sequentially: previous item 0 pairs with next item 0,
 * previous item 1 pairs with next item 1, and so on. When the new array is longer,
 * the extra items have no match and animate in from their default position.
 * When the new array is shorter, the ancient items are simply dropped.
 *
 * This is useful when new data is appended at the end of the array, and you want
 * existing points to stay in place while new points animate in.
 *
 * @example
 * import { matchAppend } from 'recharts';
 * <Line animationMatchBy={matchAppend} />
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
var matchAppend = exports.matchAppend = 'append';

/**
 * Create a matching function that pairs items by a data key from their payload.
 *
 * Useful for time-series or streaming charts where new data points are added
 * to one end and old points are removed from the other. This ensures existing
 * points animate smoothly to their new positions instead of shifting by index.
 *
 * @param dataKey The key to look up in each item's payload (e.g., 'timestamp', 'date', 'id')
 * @returns An AnimationMatchBy function that can be passed to the animationMatchBy prop
 *
 * @example
 * import { matchByDataKey } from 'recharts';
 * <Line animationMatchBy={matchByDataKey('timestamp')} />
 * <Bar animationMatchBy={matchByDataKey('name')} />
 * <Pie animationMatchBy={matchByDataKey('id')} />
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
function matchByDataKey(dataKey) {
  return item => {
    if (item.payload == null || typeof item.payload !== 'object') return null;
    var value = (0, _ChartUtils.getValueByDataKey)(item.payload, dataKey);
    if (value == null) return null;
    if (typeof value === 'string' || typeof value === 'number') return value;
    return JSON.stringify(value);
  };
}
function tagAlignedItems(alignedPrevItems, nextItems) {
  var removedPrevItems = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var tagged = [];
  /*
   * We put removed points at the start because we assume that a typical chart animates right-to-left
   * and the removed points will disappear from the left edge and outside the plot area.
   * If you chart behaves differently you may want to customize your matching function.
   */
  for (var prev of removedPrevItems) {
    tagged.push({
      status: 'removed',
      prev
    });
  }
  for (var i = 0; i < nextItems.length; i++) {
    // This function intentionally pairs by array index. The strategy-specific functions above are
    // responsible for producing an alignedPrevItems array whose indices already correspond to nextItems.
    var _prev = alignedPrevItems[i];
    var next = nextItems[i];
    if (_prev != null) {
      tagged.push({
        status: 'matched',
        prev: _prev,
        next
      });
    } else {
      tagged.push({
        status: 'added',
        next
      });
    }
  }
  return tagged;
}
function matchByIndexImpl(prevItems, nextItems) {
  var factor = prevItems.length / nextItems.length;
  var alignedPrevItems = nextItems.map((_, i) => prevItems[Math.floor(i * factor)]);
  return tagAlignedItems(alignedPrevItems, nextItems);
}
function matchAppendImpl(prevItems, nextItems) {
  var alignedPrevItems = nextItems.map((_, i) => prevItems[i]);
  return tagAlignedItems(alignedPrevItems, nextItems);
}
function buildPrevKeyMap(prevItems, matchBy) {
  var prevMap = new Map();
  for (var i = 0; i < prevItems.length; i++) {
    var _item = prevItems[i];
    if (_item == null) continue;
    var key = matchBy(_item, i);
    if (key != null && !prevMap.has(key)) {
      prevMap.set(key, _item);
    }
  }
  return prevMap;
}

/**
 * Match previous items to next items by key, and include removed items explicitly.
 *
 * @internal
 */
function matchByKey(prevItems, nextItems, matchBy) {
  var prevMap = buildPrevKeyMap(prevItems, matchBy);

  // Track which prev keys were matched
  var matchedKeys = new Set();
  var alignedPrevItems = nextItems.map((next, i) => {
    var key = matchBy(next, i);
    if (key != null) {
      var prev = prevMap.get(key);
      if (prev !== undefined) {
        matchedKeys.add(key);
        return prev;
      }
    }
    return undefined;
  });

  // Removed = prev items whose keys were not matched to any next item
  var removedPrevItems = [];
  for (var _ref3 of prevMap) {
    var _ref2 = _slicedToArray(_ref3, 2);
    var key = _ref2[0];
    var _item2 = _ref2[1];
    if (!matchedKeys.has(key)) {
      removedPrevItems.push(_item2);
    }
  }
  return tagAlignedItems(alignedPrevItems, nextItems, removedPrevItems);
}

/**
 * Match previous items to next items using the given matching strategy and return tagged animation items.
 *
 * On first render, all next items are returned as `{ status: 'added' }`.
 * For key-based matching, unmatched previous items are appended as `{ status: 'removed' }`.
 *
 * @internal
 */
function matchAnimationItems(prevItems, nextItems, matchBy) {
  if (nextItems == null) {
    return null;
  }
  if (prevItems == null) {
    return nextItems.map(next => ({
      status: 'added',
      next
    }));
  }
  if (matchBy === matchByIndex) {
    return matchByIndexImpl(prevItems, nextItems);
  }
  if (matchBy === matchAppend) {
    return matchAppendImpl(prevItems, nextItems);
  }
  return matchByKey(prevItems, nextItems, matchBy);
}