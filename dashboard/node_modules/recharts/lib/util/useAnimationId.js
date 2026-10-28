"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimationId = useAnimationId;
var _react = require("react");
var _DataUtils = require("./DataUtils");
/**
 * This hook returns a unique animation id for the object input.
 * If input changes (as in, reference equality is different), the animation id will change.
 * If input does not change, the animation id will not change.
 *
 * This is useful for animations. The Animate component
 * does have a `shouldReAnimate` prop but that doesn't seem to be doing what the name implies.
 * Also, we don't always want to re-animate on every render;
 * we only want to re-animate when the input changes. Not the internal state (e.g. `isAnimating`).
 *
 * @param input The object to check for changes. Uses reference equality (=== operator)
 * @param prefix Optional prefix to use for the animation id
 * @returns A unique animation id
 */
function useAnimationId(input) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'animation-';
  var animationId = (0, _react.useRef)((0, _DataUtils.uniqueId)(prefix));
  var prevProps = (0, _react.useRef)(input);
  if (prevProps.current !== input) {
    animationId.current = (0, _DataUtils.uniqueId)(prefix);
    prevProps.current = input;
  }
  return animationId.current;
}