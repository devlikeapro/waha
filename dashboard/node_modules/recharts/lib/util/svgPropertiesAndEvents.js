"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.svgPropertiesAndEvents = svgPropertiesAndEvents;
exports.svgPropertiesAndEventsFromUnknown = svgPropertiesAndEventsFromUnknown;
var _react = require("react");
var _excludeEventProps = require("./excludeEventProps");
var _svgPropertiesNoEvents = require("./svgPropertiesNoEvents");
/**
 * Filters an object to only include SVG properties, data attributes, and event handlers.
 * @param obj - The object to filter.
 * @returns A new object containing only valid SVG properties, data attributes, and event handlers.
 */
function svgPropertiesAndEvents(obj) {
  var result = {};
  // for ... in loop is 10x faster than Object.entries + filter + Object.fromEntries in Chrome

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if ((0, _svgPropertiesNoEvents.isSvgElementPropKey)(key) || (0, _svgPropertiesNoEvents.isDataAttribute)(key) || (0, _excludeEventProps.isEventKey)(key)) {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

/**
 * Function to filter SVG properties from various input types.
 * The input types can be:
 * - A record of string keys to any values, in which case it returns a record of only SVG properties
 * - A React element, in which case it returns the props of the element filtered to only SVG properties
 * - Anything else, in which case it returns null
 *
 * This function has a wide-open return type, because it will read and filter the props of an arbitrary React element.
 * This can be SVG, HTML, whatnot, with arbitrary values, so we can't type it more specifically.
 *
 * If you wish to have a type-safe version, use svgPropertiesNoEvents directly with a typed object.
 *
 * @param input - The input to filter, which can be a record, a React element, or other types.
 * @returns A record of SVG properties if the input is a record or React element, otherwise null.
 */
function svgPropertiesAndEventsFromUnknown(input) {
  if (input == null) {
    return null;
  }
  if (/*#__PURE__*/(0, _react.isValidElement)(input)) {
    // @ts-expect-error we can't type this better because input can be any React element
    return svgPropertiesAndEvents(input.props);
  }
  if (typeof input === 'object' && !Array.isArray(input)) {
    return svgPropertiesAndEvents(input);
  }
  return null;
}