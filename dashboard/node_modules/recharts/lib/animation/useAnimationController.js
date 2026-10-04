"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationControllerProvider = void 0;
exports.useAnimationController = useAnimationController;
var _react = require("react");
var _AnimationControllerImpl = require("./AnimationControllerImpl");
var AnimationControllerContext = /*#__PURE__*/(0, _react.createContext)(_AnimationControllerImpl.animationControllerImpl);

/**
 * Allows overriding the default AnimationController that Recharts uses internally to drive animations.
 * The default one uses requestAnimationFrame-based TimeoutController, and ticks through the animations
 * as time moves forward.
 *
 * Why would you want to use this? Several reasons:
 * - Unit tests are an excellent use (Recharts itself has ton of tests with mock TimeoutController)
 * - If you want to animate charts back and forth (Recharts only animates forward)
 * - If you want to replace requestAnimationFrame with something else
 *   - Perhaps a manual animation controls (https://recharts.github.io does this)
 *   - If you want to maybe animate charts based on mouse movement, or page scroll position, instead of time
 *
 * If you don't use this provider then all charts use the default requestAnimationFrame and default animation logic.
 *
 * If you use this component then all charts inside use your custom animationController.
 *
 * @see {@link https://recharts.github.io/en-US/guide/animations/ Animation guide}
 *
 * @since 3.9
 */
var AnimationControllerProvider = exports.AnimationControllerProvider = AnimationControllerContext.Provider;
function useAnimationController(animationControllerFromProps) {
  var animationControllerFromContext = (0, _react.useContext)(AnimationControllerContext);
  return (0, _react.useMemo)(() => animationControllerFromProps !== null && animationControllerFromProps !== void 0 ? animationControllerFromProps : animationControllerFromContext, [animationControllerFromProps, animationControllerFromContext]);
}