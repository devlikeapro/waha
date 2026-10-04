"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestAnimationFrameTimeoutController = void 0;
/**
 * Callback type for the timeout function.
 * Receives current time as an argument.
 */

/**
 * A function that, when called, cancels the timeout.
 *
 * @since 3.9
 */

/**
 * TimeoutController is responsible for controlling the movement of time.
 * Think of it as a clock.
 *
 * Recharts default implementation uses requestAnimationFrame which works great in a browser.
 * You may choose to override this which is especially useful if you want to control animations.
 *
 * Why would you want to do this?
 * - unit tests
 * - animations based on something other than time: UI controls, page scroll, mouse movement ...
 *
 * @see {@link https://recharts.github.io/en-US/guide/animations/ Animation guide}
 *
 * @since 3.9
 */

class RequestAnimationFrameTimeoutController {
  setTimeout(callback) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var startTime = performance.now();
    var requestId = null;
    var executeCallback = now => {
      if (now - startTime >= delay) {
        callback(now);
      } else {
        requestId = requestAnimationFrame(executeCallback);
      }
    };
    requestId = requestAnimationFrame(executeCallback);
    return () => {
      if (requestId != null) {
        cancelAnimationFrame(requestId);
      }
    };
  }
}
exports.RequestAnimationFrameTimeoutController = RequestAnimationFrameTimeoutController;