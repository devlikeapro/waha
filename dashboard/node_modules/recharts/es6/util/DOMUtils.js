function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { Global } from './Global';
import { LRUCache } from './LRUCache';
var defaultConfig = {
  cacheSize: 2000,
  enableCache: true
};
var currentConfig = _objectSpread({}, defaultConfig);
var stringCache = new LRUCache(currentConfig.cacheSize);
var SPAN_STYLE = {
  position: 'absolute',
  top: '-20000px',
  left: 0,
  padding: 0,
  margin: 0,
  border: 'none',
  whiteSpace: 'pre'
};
var MEASUREMENT_SPAN_ID = 'recharts_measurement_span';
function createCacheKey(text, style) {
  // Simple string concatenation for better performance than JSON.stringify
  var fontSize = style.fontSize || '';
  var fontFamily = style.fontFamily || '';
  var fontWeight = style.fontWeight || '';
  var fontStyle = style.fontStyle || '';
  var letterSpacing = style.letterSpacing || '';
  var textTransform = style.textTransform || '';
  return "".concat(text, "|").concat(fontSize, "|").concat(fontFamily, "|").concat(fontWeight, "|").concat(fontStyle, "|").concat(letterSpacing, "|").concat(textTransform);
}

/**
 * Measure text using DOM (accurate but slower)
 * @param text - The text to measure
 * @param style - CSS style properties to apply
 * @returns The size of the text
 */
var measureTextWithDOM = (text, style) => {
  try {
    var measurementSpan = document.getElementById(MEASUREMENT_SPAN_ID);
    if (!measurementSpan) {
      measurementSpan = document.createElement('span');
      measurementSpan.setAttribute('id', MEASUREMENT_SPAN_ID);
      measurementSpan.setAttribute('aria-hidden', 'true');
      document.body.appendChild(measurementSpan);
    }

    // Apply styles directly without unnecessary object creation
    Object.assign(measurementSpan.style, SPAN_STYLE, style);
    measurementSpan.textContent = "".concat(text);
    var rect = measurementSpan.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  } catch (_unused) {
    return {
      width: 0,
      height: 0
    };
  }
};
export var getStringSize = function getStringSize(text) {
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (text === undefined || text === null || Global.isSsr) {
    return {
      width: 0,
      height: 0
    };
  }

  // If caching is disabled, measure directly
  if (!currentConfig.enableCache) {
    return measureTextWithDOM(text, style);
  }
  var cacheKey = createCacheKey(text, style);
  var cachedResult = stringCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  // Measure using DOM
  var result = measureTextWithDOM(text, style);

  // Store in LRU cache
  stringCache.set(cacheKey, result);
  return result;
};

/**
 * Configure text measurement behavior
 * @param config - Partial configuration to apply
 * @returns void
 */
export var configureTextMeasurement = config => {
  var newConfig = _objectSpread(_objectSpread({}, currentConfig), config);
  if (newConfig.cacheSize !== currentConfig.cacheSize) {
    stringCache = new LRUCache(newConfig.cacheSize);
  }
  currentConfig = newConfig;
};

/**
 * Get current text measurement configuration
 * @returns Current configuration
 */
export var getTextMeasurementConfig = () => _objectSpread({}, currentConfig);

/**
 * Clear the string size cache. Useful for testing or memory management.
 * @returns void
 */
export var clearStringCache = () => {
  stringCache.clear();
};

/**
 * Get cache statistics for debugging purposes.
 * @returns Cache statistics including size and max size
 */
export var getStringCacheStats = () => ({
  size: stringCache.size(),
  maxSize: currentConfig.cacheSize
});