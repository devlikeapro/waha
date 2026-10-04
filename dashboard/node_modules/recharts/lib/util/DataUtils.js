"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findEntryInArray = findEntryInArray;
exports.hasDuplicate = exports.getPercentValue = exports.getLinearRegression = void 0;
exports.interpolate = interpolate;
exports.isNan = void 0;
exports.isNotNil = isNotNil;
exports.mathSign = exports.isPercent = exports.isNumber = exports.isNumOrStr = exports.isNullish = void 0;
exports.noop = noop;
exports.upperFirst = exports.uniqueId = void 0;
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _round = require("./round");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var mathSign = value => {
  if (value === 0) {
    return 0;
  }
  if (value > 0) {
    return 1;
  }
  return -1;
};
exports.mathSign = mathSign;
var isNan = value => {
  // eslint-disable-next-line eqeqeq
  return typeof value == 'number' && value != +value;
};

/**
 * Checks if the value is a percent string.
 * A valid percent string must end with '%' and have at least one character before the '%'.
 *
 * @param {string | number | undefined} value The value to check
 * @returns {boolean} true if the value is a percent string
 */
exports.isNan = isNan;
var isPercent = value => typeof value === 'string' && value.length > 1 && value.indexOf('%') === value.length - 1;
exports.isPercent = isPercent;
var isNumber = value => (typeof value === 'number' || value instanceof Number) && !isNan(value);
exports.isNumber = isNumber;
var isNumOrStr = value => isNumber(value) || typeof value === 'string';
exports.isNumOrStr = isNumOrStr;
var idCounter = 0;
var uniqueId = prefix => {
  var id = ++idCounter;
  return "".concat(prefix || '').concat(id);
};

/**
 * Calculates the numeric value represented by a percent string or number, based on a total value.
 *
 * - If `percent` is not a number or string, returns `defaultValue`.
 * - If `percent` is a percent string but `totalValue` is null/undefined, returns `defaultValue`.
 * - If the result is NaN, returns `defaultValue`.
 * - If `validate` is true and the result exceeds `totalValue`, returns `totalValue`.
 *
 * @param percent - The percent value to convert. Can be a number (e.g. 25) or a string ending with '%' (e.g. '25%').
 *                  If a string, it must end with '%' to be treated as a percent; otherwise, it is parsed as a number.
 * @param totalValue - The total value to calculate the percent of. Required if `percent` is a percent string.
 * @param defaultValue - The value returned if `percent` is undefined, invalid, or cannot be converted to a number.
 * @param validate - If true, ensures the result does not exceed `totalValue` (when provided).
 * @returns The calculated value, or `defaultValue` for invalid input.
 */
exports.uniqueId = uniqueId;
var getPercentValue = exports.getPercentValue = function getPercentValue(percent, totalValue) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var validate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!isNumber(percent) && typeof percent !== 'string') {
    return defaultValue;
  }
  var value;
  if (isPercent(percent)) {
    if (totalValue == null) {
      return defaultValue;
    }
    var index = percent.indexOf('%');
    value = totalValue * parseFloat(percent.slice(0, index)) / 100;
  } else {
    value = +percent;
  }
  if (isNan(value)) {
    value = defaultValue;
  }
  if (validate && totalValue != null && value > totalValue) {
    value = totalValue;
  }
  return value;
};
var hasDuplicate = ary => {
  if (!Array.isArray(ary)) {
    return false;
  }
  var len = ary.length;
  var cache = {};
  for (var i = 0; i < len; i++) {
    if (!cache[String(ary[i])]) {
      cache[String(ary[i])] = true;
    } else {
      return true;
    }
  }
  return false;
};

/**
 * Function to interpolate between two numbers.
 * If both start and end are numbers, it calculates the interpolated value based on the parameter animationElapsedTime (0 to 1).
 * If either start or end is not a number, it returns the end value directly.
 *
 * You will typically use this function when implementing custom animations.
 *
 * `animationElapsedTime` can be outside the (0, 1) range, depending on easing.
 *
 * This one interpolates only numbers;
 * if you want to interpolate colors or strings then perhaps see {@link https://d3js.org/d3-interpolate d3-interpolate}.
 * @param start the starting value (when animationElapsedTime=0)
 * @param end the final value (when animationElapsedTime=1)
 * @param animationElapsedTime interpolation factor; values in [0, 1] interpolate between start and end, and values outside that range extrapolate
 *
 * @since 3.9
 */
exports.hasDuplicate = hasDuplicate;
function interpolate(start, end, animationElapsedTime) {
  if (isNumber(start) && isNumber(end)) {
    return (0, _round.round)(start + animationElapsedTime * (end - start));
  }
  return end;
}
function findEntryInArray(ary, specifiedKey, specifiedValue) {
  if (!ary || !ary.length) {
    return undefined;
  }
  return ary.find(entry => entry && (typeof specifiedKey === 'function' ? specifiedKey(entry) : (0, _get.default)(entry, specifiedKey)) === specifiedValue);
}
/**
 * The least square linear regression
 * @param {Array} data The array of points
 * @returns {Object} The domain of x, and the parameter of linear function
 */
var getLinearRegression = data => {
  var len = data.length;
  var xsum = 0;
  var ysum = 0;
  var xysum = 0;
  var xxsum = 0;
  var xmin = Infinity;
  var xmax = -Infinity;
  var xcurrent = 0;
  var ycurrent = 0;
  for (var i = 0; i < len; i++) {
    var _data$i, _data$i2;
    xcurrent = ((_data$i = data[i]) === null || _data$i === void 0 ? void 0 : _data$i.cx) || 0;
    ycurrent = ((_data$i2 = data[i]) === null || _data$i2 === void 0 ? void 0 : _data$i2.cy) || 0;
    xsum += xcurrent;
    ysum += ycurrent;
    xysum += xcurrent * ycurrent;
    xxsum += xcurrent * xcurrent;
    xmin = Math.min(xmin, xcurrent);
    xmax = Math.max(xmax, xcurrent);
  }
  var a = len * xxsum !== xsum * xsum ? (len * xysum - xsum * ysum) / (len * xxsum - xsum * xsum) : 0;
  return {
    xmin,
    xmax,
    a,
    b: (ysum - a * xsum) / len
  };
};
exports.getLinearRegression = getLinearRegression;
/**
 * Checks if the value is null or undefined
 * @param value The value to check
 * @returns true if the value is null or undefined
 */
var isNullish = value => {
  return value === null || typeof value === 'undefined';
};

/**
 * Uppercase the first letter of a string
 * @param {string} value The string to uppercase
 * @returns {string} The uppercased string
 */
exports.isNullish = isNullish;
var upperFirst = value => {
  if (isNullish(value)) {
    return value;
  }
  return "".concat(value.charAt(0).toUpperCase()).concat(value.slice(1));
};

/**
 * Checks if the value is not null nor undefined.
 * @param value The value to check
 * @returns true if the value is not null nor undefined
 */
exports.upperFirst = upperFirst;
function isNotNil(value) {
  return value != null;
}

/**
 * No-operation function that does nothing.
 * Useful as a placeholder or default callback function.
 */
function noop() {}