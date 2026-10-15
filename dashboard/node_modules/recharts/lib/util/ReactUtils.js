"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SCALE_TYPES = void 0;
exports.findAllByType = findAllByType;
exports.toArray = exports.isClipDot = exports.getDisplayName = void 0;
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _react = require("react");
var _reactIs = require("react-is");
var _DataUtils = require("./DataUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var SCALE_TYPES = exports.SCALE_TYPES = ['auto', 'linear', 'pow', 'sqrt', 'log', 'identity', 'time', 'band', 'point', 'ordinal', 'quantile', 'quantize', 'utc', 'sequential', 'threshold'];

/**
 * @deprecated instead find another approach that does not depend on displayName.
 * Get the display name of a component
 * @param  {Object} Comp Specified Component
 * @return {String}      Display name of Component
 */
var getDisplayName = Comp => {
  if (typeof Comp === 'string') {
    return Comp;
  }
  if (!Comp) {
    return '';
  }
  return Comp.displayName || Comp.name || 'Component';
};

// `toArray` gets called multiple times during the render
// so we can memoize last invocation (since reference to `children` is the same)
exports.getDisplayName = getDisplayName;
var lastChildren = null;
var lastResult = null;

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * @param children do not use
 * @return deprecated do not use
 */
var toArray = children => {
  if (children === lastChildren && Array.isArray(lastResult)) {
    return lastResult;
  }
  var result = [];
  _react.Children.forEach(children, child => {
    if ((0, _DataUtils.isNullish)(child)) return;
    if ((0, _reactIs.isFragment)(child)) {
      result = result.concat(toArray(child.props.children));
    } else {
      // @ts-expect-error this could still be Iterable<ReactNode> and TS does not like that
      result.push(child);
    }
  });
  lastResult = result;
  lastChildren = children;
  return result;
};

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * Find and return all matched children by type.
 * `type` must be a React.ComponentType
 *
 * @param children do not use
 * @param type do not use
 * @return deprecated do not use
 */
exports.toArray = toArray;
function findAllByType(children, type) {
  var result = [];
  var types = [];
  if (Array.isArray(type)) {
    types = type.map(t => getDisplayName(t));
  } else {
    types = [getDisplayName(type)];
  }
  toArray(children).forEach(child => {
    // @ts-expect-error toArray and lodash.get are not compatible. Let's get rid of the whole findAllByType function
    var childType = (0, _get.default)(child, 'type.displayName') || (0, _get.default)(child, 'type.name');
    if (childType && types.indexOf(childType) !== -1) {
      result.push(child);
    }
  });
  return result;
}
var isClipDot = dot => {
  if (dot && typeof dot === 'object' && 'clipDot' in dot) {
    return Boolean(dot.clipDot);
  }
  return true;
};
exports.isClipDot = isClipDot;