/**
 * JavaScript animations require trigger and repaint as soon as possible,
 * so this class uses the timeoutController to trigger updates as quickly as the controller allows.
 *
 * JavaScript animation progress is represented as a stream of values. The exact type depends on the animationHandle type.
 * Each individual consumer is then responsible for mapping those values onto a React component.
 */
export var animationControllerImpl = (timeoutController, animationHandle, listener) => {
  var cancellable;
  var nextUpdate = now => {
    var timeRemaining = animationHandle.tick(now);
    if (animationHandle.getState() === 'active') {
      listener(animationHandle.getInterpolated());
      if (animationHandle.getProgress() === 1) {
        animationHandle.complete();
        cancellable = undefined;
        return;
      }
      cancellable = timeoutController.setTimeout(nextUpdate, timeRemaining);
      return;
    }
    cancellable = timeoutController.setTimeout(nextUpdate, timeRemaining);
  };
  cancellable = timeoutController.setTimeout(nextUpdate, 0);
  return () => {
    var _cancellable;
    return (_cancellable = cancellable) === null || _cancellable === void 0 ? void 0 : _cancellable();
  };
};