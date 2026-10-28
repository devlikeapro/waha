var _excluded = ["x", "y", "lineHeight", "capHeight", "fill", "scaleToFit", "textAnchor", "verticalAnchor"],
  _excluded2 = ["dx", "dy", "angle", "className", "breakAll"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import * as React from 'react';
import { useMemo, forwardRef } from 'react';
import { clsx } from 'clsx';
import { isNullish, isNumber, isNumOrStr } from '../util/DataUtils';
import { Global } from '../util/Global';
import { getStringSize } from '../util/DOMUtils';
import { reduceCSSCalc } from '../util/ReduceCSSCalc';
import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { isWellBehavedNumber } from '../util/isWellBehavedNumber';
var BREAKING_SPACES = /[ \f\n\r\t\v\u2028\u2029]+/;
var calculateWordWidths = _ref => {
  var children = _ref.children,
    breakAll = _ref.breakAll,
    style = _ref.style;
  try {
    var words = [];
    if (!isNullish(children)) {
      if (breakAll) {
        words = children.toString().split('');
      } else {
        words = children.toString().split(BREAKING_SPACES);
      }
    }
    var wordsWithComputedWidth = words.map(word => ({
      word,
      width: getStringSize(word, style).width
    }));
    var spaceWidth = breakAll ? 0 : getStringSize('\u00A0', style).width;
    return {
      wordsWithComputedWidth,
      spaceWidth
    };
  } catch (_unused) {
    return null;
  }
};

/**
 * @inline
 */

export function isValidTextAnchor(value) {
  return value === 'start' || value === 'middle' || value === 'end' || value === 'inherit';
}

/**
 * @inline
 */

/**
 * @inline
 */

export function isRenderableText(val) {
  return isNullish(val) || typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean';
}
var calculate = (words, lineWidth, spaceWidth, scaleToFit) => words.reduce((result, _ref2) => {
  var word = _ref2.word,
    width = _ref2.width;
  var currentLine = result[result.length - 1];
  if (currentLine && width != null && (lineWidth == null || scaleToFit || currentLine.width + width + spaceWidth < Number(lineWidth))) {
    // Word can be added to an existing line
    currentLine.words.push(word);
    currentLine.width += width + spaceWidth;
  } else {
    // Add first word to line or word is too long to scaleToFit on existing line
    var newLine = {
      words: [word],
      width
    };
    result.push(newLine);
  }
  return result;
}, []);
var findLongestLine = words => words.reduce((a, b) => a.width > b.width ? a : b);
var suffix = '…';
var checkOverflow = (text, index, breakAll, style, maxLines, lineWidth, spaceWidth, scaleToFit) => {
  var tempText = text.slice(0, index);
  var words = calculateWordWidths({
    breakAll,
    style,
    children: tempText + suffix
  });
  if (!words) {
    return [false, []];
  }
  var result = calculate(words.wordsWithComputedWidth, lineWidth, spaceWidth, scaleToFit);
  var doesOverflow = result.length > maxLines || findLongestLine(result).width > Number(lineWidth);
  return [doesOverflow, result];
};
var calculateWordsByLines = (_ref3, initialWordsWithComputedWith, spaceWidth, lineWidth, scaleToFit) => {
  var maxLines = _ref3.maxLines,
    children = _ref3.children,
    style = _ref3.style,
    breakAll = _ref3.breakAll;
  var shouldLimitLines = isNumber(maxLines);
  var text = String(children);
  var originalResult = calculate(initialWordsWithComputedWith, lineWidth, spaceWidth, scaleToFit);
  if (!shouldLimitLines || scaleToFit) {
    return originalResult;
  }
  var overflows = originalResult.length > maxLines || findLongestLine(originalResult).width > Number(lineWidth);
  if (!overflows) {
    return originalResult;
  }
  var start = 0;
  var end = text.length - 1;
  var iterations = 0;
  var trimmedResult;
  while (start <= end && iterations <= text.length - 1) {
    var middle = Math.floor((start + end) / 2);
    var prev = middle - 1;
    var _checkOverflow = checkOverflow(text, prev, breakAll, style, maxLines, lineWidth, spaceWidth, scaleToFit),
      _checkOverflow2 = _slicedToArray(_checkOverflow, 2),
      doesPrevOverflow = _checkOverflow2[0],
      result = _checkOverflow2[1];
    var _checkOverflow3 = checkOverflow(text, middle, breakAll, style, maxLines, lineWidth, spaceWidth, scaleToFit),
      _checkOverflow4 = _slicedToArray(_checkOverflow3, 1),
      doesMiddleOverflow = _checkOverflow4[0];
    if (!doesPrevOverflow && !doesMiddleOverflow) {
      start = middle + 1;
    }
    if (doesPrevOverflow && doesMiddleOverflow) {
      end = middle - 1;
    }
    if (!doesPrevOverflow && doesMiddleOverflow) {
      trimmedResult = result;
      break;
    }
    iterations++;
  }

  // Fallback to originalResult (result without trimming) if we cannot find the
  // where to trim.  This should not happen :tm:
  return trimmedResult || originalResult;
};
var getWordsWithoutCalculate = children => {
  var words = !isNullish(children) ? children.toString().split(BREAKING_SPACES) : [];
  return [{
    words,
    width: undefined
  }];
};
export var getWordsByLines = _ref4 => {
  var width = _ref4.width,
    scaleToFit = _ref4.scaleToFit,
    children = _ref4.children,
    style = _ref4.style,
    breakAll = _ref4.breakAll,
    maxLines = _ref4.maxLines;
  // Only perform calculations if using features that require them (multiline, scaleToFit)
  if ((width || scaleToFit) && !Global.isSsr) {
    var wordsWithComputedWidth, spaceWidth;
    var wordWidths = calculateWordWidths({
      breakAll,
      children,
      style
    });
    if (wordWidths) {
      var wcw = wordWidths.wordsWithComputedWidth,
        sw = wordWidths.spaceWidth;
      wordsWithComputedWidth = wcw;
      spaceWidth = sw;
    } else {
      return getWordsWithoutCalculate(children);
    }
    return calculateWordsByLines({
      breakAll,
      children,
      maxLines,
      style
    }, wordsWithComputedWidth, spaceWidth, width, Boolean(scaleToFit));
  }
  return getWordsWithoutCalculate(children);
};
var DEFAULT_FILL = '#808080';
export var textDefaultProps = {
  angle: 0,
  breakAll: false,
  // Magic number from d3
  capHeight: '0.71em',
  fill: DEFAULT_FILL,
  lineHeight: '1em',
  scaleToFit: false,
  textAnchor: 'start',
  // Maintain compat with existing charts / default SVG behavior
  verticalAnchor: 'end',
  x: 0,
  y: 0
};
export var Text = /*#__PURE__*/forwardRef((outsideProps, ref) => {
  var _resolveDefaultProps = resolveDefaultProps(outsideProps, textDefaultProps),
    propsX = _resolveDefaultProps.x,
    propsY = _resolveDefaultProps.y,
    lineHeight = _resolveDefaultProps.lineHeight,
    capHeight = _resolveDefaultProps.capHeight,
    fill = _resolveDefaultProps.fill,
    scaleToFit = _resolveDefaultProps.scaleToFit,
    textAnchor = _resolveDefaultProps.textAnchor,
    verticalAnchor = _resolveDefaultProps.verticalAnchor,
    props = _objectWithoutProperties(_resolveDefaultProps, _excluded);
  var wordsByLines = useMemo(() => {
    return getWordsByLines({
      breakAll: props.breakAll,
      children: props.children,
      maxLines: props.maxLines,
      scaleToFit,
      style: props.style,
      width: props.width
    });
  }, [props.breakAll, props.children, props.maxLines, scaleToFit, props.style, props.width]);
  var dx = props.dx,
    dy = props.dy,
    angle = props.angle,
    className = props.className,
    breakAll = props.breakAll,
    textProps = _objectWithoutProperties(props, _excluded2);
  if (!isNumOrStr(propsX) || !isNumOrStr(propsY) || wordsByLines.length === 0) {
    return null;
  }
  var x = Number(propsX) + (isNumber(dx) ? dx : 0);
  var y = Number(propsY) + (isNumber(dy) ? dy : 0);
  if (!isWellBehavedNumber(x) || !isWellBehavedNumber(y)) {
    return null;
  }
  var startDy;
  switch (verticalAnchor) {
    case 'start':
      startDy = reduceCSSCalc("calc(".concat(capHeight, ")"));
      break;
    case 'middle':
      startDy = reduceCSSCalc("calc(".concat((wordsByLines.length - 1) / 2, " * -").concat(lineHeight, " + (").concat(capHeight, " / 2))"));
      break;
    default:
      startDy = reduceCSSCalc("calc(".concat(wordsByLines.length - 1, " * -").concat(lineHeight, ")"));
      break;
  }
  var transforms = [];
  var firstLine = wordsByLines[0];
  if (scaleToFit && firstLine != null) {
    var lineWidth = firstLine.width;
    var width = props.width;
    transforms.push("scale(".concat(isNumber(width) && isNumber(lineWidth) ? width / lineWidth : 1, ")"));
  }
  if (angle) {
    transforms.push("rotate(".concat(angle, ", ").concat(x, ", ").concat(y, ")"));
  }
  if (transforms.length) {
    textProps.transform = transforms.join(' ');
  }
  return /*#__PURE__*/React.createElement("text", _extends({}, svgPropertiesAndEvents(textProps), {
    ref: ref,
    x: x,
    y: y,
    className: clsx('recharts-text', className),
    textAnchor: textAnchor,
    fill: fill.includes('url') ? DEFAULT_FILL : fill
  }), wordsByLines.map((line, index) => {
    var words = line.words.join(breakAll ? '' : ' ');
    return (
      /*#__PURE__*/
      // duplicate words will cause duplicate keys which is why we add the array index here
      React.createElement("tspan", {
        x: x,
        dy: index === 0 ? startDy : lineHeight,
        key: "".concat(words, "-").concat(index)
      }, words)
    );
  }));
});
Text.displayName = 'Text';