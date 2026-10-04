"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDigitCount = getDigitCount;
exports.rangeStep = rangeStep;
var _decimal = _interopRequireDefault(require("decimal.js-light"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @fileOverview Some common arithmetic methods
 * @author xile611
 * @date 2015-09-17
 */

/**
 * Get the digit count of a number.
 * If the absolute value is in the interval [0.1, 1), the result is 0.
 * If the absolute value is in the interval [0.01, 0.1), the digit count is -1.
 * If the absolute value is in the interval [0.001, 0.01), the digit count is -2.
 *
 * @param  {Number} value The number
 * @return {Integer}      Digit count
 */
function getDigitCount(value) {
  var result;
  if (value === 0) {
    result = 1;
  } else {
    result = Math.floor(new _decimal.default(value).abs().log(10).toNumber()) + 1;
  }
  return result;
}

/**
 * Get the data in the interval [start, end) with a fixed step.
 * Also handles JS calculation precision issues.
 *
 * @param  {Decimal} start Start point
 * @param  {Decimal} end   End point, not included
 * @param  {Decimal} step  Step size
 * @return {Array}         Array of numbers
 */
function rangeStep(start, end, step) {
  var num = new _decimal.default(start);
  var i = 0;
  var result = [];

  // magic number to prevent infinite loop
  while (num.lt(end) && i < 100000) {
    result.push(num.toNumber());
    num = num.add(step);
    i++;
  }
  return result;
}