"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JavascriptAnimation = exports.CSSTransitionAnimation = void 0;
var _DataUtils = require("../util/DataUtils");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // eslint-disable-next-line max-classes-per-file
var INIT = 'init';
var PENDING = 'pending';
var ACTIVE = 'active';
var COMPLETED = 'completed';
function duration(time) {
  return Math.max(0, time);
}
class RechartsAnimation {
  /**
   * Returns the absolute time after the animationBegin delay has been completed,
   * and when the animationDuration started ticking.
   */
  getAnimationStartedTime() {
    return this.animationStartedTime;
  }

  /**
   * Returns the absolute time of when the animation began - now it will wait for {animationBegin} ms before the transition starts
   */
  getBeginStartedTime() {
    return this.beginStartedTime;
  }
  constructor(param) {
    var _param$onAnimationSta;
    _defineProperty(this, "state", INIT);
    this.animationId = param.animationId;
    this.onAnimationEnd = param.onAnimationEnd;
    this.animationDuration = duration(param.animationDuration);
    this.animationBegin = duration(param.animationBegin);
    this.progress = 0;
    this.from = param.from;
    this.to = param.to;
    this.easing = param.easing;
    // Mimic what the previous animationManager was doing - call onAnimationStart immediately and synchronously
    (_param$onAnimationSta = param.onAnimationStart) === null || _param$onAnimationSta === void 0 || _param$onAnimationSta.call(param);
  }
  /**
   * Returns the state machine current state
   * - `init`:       animation had just been created. It immediately calls `onAnimationStart`
   * - `pending`:    animation is now paused for `animationBegin` milliseconds until the transition begins
   * - `active`:     animation is transitioning items on screen
   * - `completed`:  animation has completed its transition and executed `onAnimationEnd`.
   *                 This state is final and the animation is no longer allowed to transition to other states.
   */
  getState() {
    return this.state;
  }

  /**
   * Returns the easing input or function
   */
  getEasing() {
    return this.easing;
  }

  /**
   * Returns the configuration - the duration of the transition.
   * Does not change in time, does not change when state changes, this is a static value.
   */
  getAnimationDuration() {
    return this.animationDuration;
  }

  /**
   * Sets the current time of the animation. The animation sets its internal state and progress accordingly.
   * This is current, absolute time; not additive!
   * This allows you to essentially "travel back in time" based on the value you pass in here.
   *
   * Returns the (relative) time remaining until the current activity is over.
   * Meaning: if the state is in a middle of a delay, returns the time left until the delay is finished.
   * If the state is in the middle of a transition, returns time left until that transition is complete.
   * This is useful because it's the same number you can take and put into setTimeout(fn, X)
   * as that's how much time we need to wait until the next state transition happens.
   */
  tick(now) {
    if (this.getState() === INIT) {
      this.state = PENDING;
      this.beginStartedTime = now;
      return this.animationBegin;
    }
    if (this.getState() === PENDING) {
      if (this.beginStartedTime == null) {
        throw new Error();
      }
      var _timeElapsed = now - this.beginStartedTime;
      if (_timeElapsed >= this.animationBegin) {
        this.state = ACTIVE;
        this.animationStartedTime = now;
        // The state flipped just now so the elapsed time is zero
        return this.nextAnimationUpdate(0);
      }
      return duration(this.animationBegin - _timeElapsed);
    }
    if (this.getState() === ACTIVE) {
      if (this.animationStartedTime == null) {
        throw new Error();
      }
      var _timeElapsed2 = now - this.animationStartedTime;
      this.setProgress(_timeElapsed2 / this.animationDuration);
      return this.nextAnimationUpdate(_timeElapsed2);
    }

    // state === COMPLETED, nothing interesting is going to happen
    return 0;
  }
  setProgress(newProgress) {
    this.progress = Math.min(1, Math.max(0, newProgress));
  }

  /**
   * Returns an abstract "progress" which is number between 0 and 1 which shows the distance of transition.
   * This progress depends on the animation state:
   * - `init`: 0
   * - `pending`: 0
   * - `active`: transitioning between [0, 1] based on the time elapsed
   * - `completed`: 1
   *
   * The progress is hard-capped to be between 0 and 1 (inclusive) to avoid overshooting caused by coarse timers.
   * For this reason, the easing function must be applied _after_ this animation state,
   * so that one has a chance to construct dynamic "overshoot" animations.
   *
   * The progress is linear with time.
   * If you wish for easing, use `getInterpolated()` instead.
   */
  getProgress() {
    return this.progress;
  }

  /**
   * Completes the animation. Completed animation:
   * - cannot be manipulated anymore
   * - its progress is set to 1
   * - tick function doesn't do anything
   * - getState() always returns 'completed'
   */
  complete() {
    this.progress = 1;
    if (this.state === 'active') {
      var _this$onAnimationEnd;
      // Do not call callbacks if the animation was interrupted before it even started!
      (_this$onAnimationEnd = this.onAnimationEnd) === null || _this$onAnimationEnd === void 0 || _this$onAnimationEnd.call(this);
    }
    this.state = COMPLETED;
  }

  /**
   * Returns the starting value of the animation.
   * Does not include progress, easing, interpolation, none of that - just the static starting value
   */
  getFrom() {
    return this.from;
  }

  /**
   * Returns the end value of the animation.
   * Does not include progress, easing, interpolation, none of that - just the static end value
   */
  getTo() {
    return this.to;
  }

  /**
   * Unique identifier of an animation
   */
  getAnimationId() {
    return this.animationId;
  }

  /**
   * Returns the configuration - the duration of delay in between animation initialization, and transition.
   * Does not change in time, does not change when state changes, this is a static value.
   */
  getAnimationBegin() {
    return this.animationBegin;
  }

  /**
   * Returns value of the transition at the current time.
   * The exact details differ based on the animation type
   */

  /**
   * Returns the duration of time of when the controller should ask for the next update
   */
}

/**
 * Animation handle representing a Javascript-based animation.
 * This animation requires one render cycle for each frame, and it calls setTimeout as quickly as possible
 *
 * @since 3.9
 */
class JavascriptAnimation extends RechartsAnimation {
  // eslint-disable-next-line class-methods-use-this
  nextAnimationUpdate() {
    /*
     * JavaScript-based animations have to update as soon as possible,
     * so we return 0 here to indicate that the next update should be scheduled immediately
     * and it should trigger render on every occasion.
     */
    return 0;
  }

  /**
   * Returns value of the animation after its easing function had been applied.
   * This value, unlike getProgress(), can escape the [0..1] range
   * because this is entirely within the easing function control. Spring typically does this.
   */
  getInterpolated() {
    return this.easing((0, _DataUtils.interpolate)(this.getFrom(), this.getTo(), this.getProgress()));
  }
}

/**
 * Animation handle representing a CSS transition.
 * This animation requires only one render, and the actual transition is then handled by the browser.
 *
 * @since 3.9
 */
exports.JavascriptAnimation = JavascriptAnimation;
class CSSTransitionAnimation extends RechartsAnimation {
  nextAnimationUpdate(timeElapsed) {
    /**
     * CSS transitions do not need DOM updates past the initial render
     * so here we just instruct the controller to wait until the animation duration is over.
     */
    return duration(this.animationDuration - timeElapsed);
  }

  /**
   * Returns the final value of the animation (the `to`).
   *
   * CSS transitions leave both interpolation and easing to the browser,
   * so all we need to do here is return the final state
   * and let browser handle the rest.
   */
  getInterpolated() {
    return this.getTo();
  }
}

/**
 * Recharts animation state machine.
 *
 * Possible transitions are:
 * - `init`: starting state - `onAnimationStart` executes
 * - `init` to `pending` - `animationBegin` duration begins
 * - `pending` to `active` - `animationDuration` duration begins, timer ticks decide the progress
 * - `active` to `completed` - `onAnimationEnd` executes
 *
 * The state always moves in this direction, cannot move backwards.
 *
 * The animation queue is static and consists of four elements:
 * - `onAnimationStart`: function that is called when the animation is created
 * - `animationBegin`: delay between `onAnimationStart` and the transition
 * - the transition itself, takes `animationDuration` ms to finish
 * - `onAnimationEnd`: function that is called when the animation is moving from `active` to `completed`
 *
 * @see {@link https://recharts.github.io/en-US/guide/animations/ Animation guide}
 *
 * @since 3.9
 */
exports.CSSTransitionAnimation = CSSTransitionAnimation;