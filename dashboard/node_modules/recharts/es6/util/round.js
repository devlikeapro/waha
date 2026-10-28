// if you go lower than 3, wild wild things happen during rendering
var defaultRoundPrecision = 4;
export function round(num) {
  var roundPrecision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultRoundPrecision;
  var factor = 10 ** roundPrecision;
  var rounded = Math.round(num * factor) / factor;
  if (Object.is(rounded, -0)) {
    return 0;
  }
  return rounded;
}

/**
 * This function will accept a string template literal and for each
 * variable placeholder, it will round the value to avoid long float numbers in
 * the SVG path which might cause rendering issues in some browsers.
 */
export function roundTemplateLiteral(strings) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }
  return strings.reduce((result, string, i) => {
    var value = values[i - 1];
    if (typeof value === 'string') {
      return result + value + string;
    }
    if (value !== undefined) {
      return result + round(value) + string;
    }
    return result + string;
  }, '');
}