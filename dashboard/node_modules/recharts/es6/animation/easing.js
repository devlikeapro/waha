export var ACCURACY = 1e-4;
var cubicBezierFactor = (c1, c2) => [0, 3 * c1, 3 * c2 - 6 * c1, 3 * c1 - 3 * c2 + 1];
var evaluatePolynomial = (params, animationElapsedTime) => params.map((param, i) => param * animationElapsedTime ** i).reduce((pre, curr) => pre + curr);
var cubicBezier = (c1, c2) => animationElapsedTime => {
  var params = cubicBezierFactor(c1, c2);
  return evaluatePolynomial(params, animationElapsedTime);
};
var derivativeCubicBezier = (c1, c2) => animationElapsedTime => {
  var params = cubicBezierFactor(c1, c2);
  var newParams = [...params.map((param, i) => param * i).slice(1), 0];
  return evaluatePolynomial(newParams, animationElapsedTime);
};
var parseCubicBezier = easing => {
  var _easingParts$;
  var easingParts = easing.split('(');
  if (easingParts.length !== 2 || easingParts[0] !== 'cubic-bezier') {
    return null;
  }
  var numbers = (_easingParts$ = easingParts[1]) === null || _easingParts$ === void 0 || (_easingParts$ = _easingParts$.split(')')[0]) === null || _easingParts$ === void 0 ? void 0 : _easingParts$.split(',');
  if (numbers == null || numbers.length !== 4) {
    return null;
  }
  var coords = numbers.map(x => parseFloat(x));
  return [coords[0], coords[1], coords[2], coords[3]];
};
var getBezierCoordinates = function getBezierCoordinates() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (args.length === 1) {
    switch (args[0]) {
      case 'linear':
        return [0.0, 0.0, 1.0, 1.0];
      case 'ease':
        return [0.25, 0.1, 0.25, 1.0];
      case 'ease-in':
        return [0.42, 0.0, 1.0, 1.0];
      case 'ease-out':
        return [0.42, 0.0, 0.58, 1.0];
      case 'ease-in-out':
        return [0.0, 0.0, 0.58, 1.0];
      default:
        {
          var easing = parseCubicBezier(args[0]);
          if (easing) {
            return easing;
          }
        }
    }
  }
  if (args.length === 4) {
    return args;
  }

  // Fallback for invalid inputs. The previous implementation was buggy and would lead to NaN.
  // Returning linear easing is a safe default.
  return [0.0, 0.0, 1.0, 1.0];
};
var createBezierEasing = (x1, y1, x2, y2) => {
  var curveX = cubicBezier(x1, x2);
  var curveY = cubicBezier(y1, y2);
  var derCurveX = derivativeCubicBezier(x1, x2);
  var rangeValue = value => {
    if (value > 1) {
      return 1;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  };
  var bezier = _animationElapsedTime => {
    var animationElapsedTime = _animationElapsedTime > 1 ? 1 : _animationElapsedTime;
    var x = animationElapsedTime;
    for (var i = 0; i < 8; ++i) {
      var evalT = curveX(x) - animationElapsedTime;
      var derVal = derCurveX(x);
      if (Math.abs(evalT - animationElapsedTime) < ACCURACY || derVal < ACCURACY) {
        return curveY(x);
      }
      x = rangeValue(x - evalT / derVal);
    }
    return curveY(x);
  };
  bezier.isStepper = false;
  return bezier;
};

// calculate cubic-bezier using Newton's method
export var configBezier = function configBezier() {
  return createBezierEasing(...getBezierCoordinates(...arguments));
};
/**
 * Creates a performance-optimized, progress-based spring easing function.
 * It pre-calculates ("bakes") spring physics frames upfront based on a fixed duration,
 * then returns a pure, lightweight function mapping progress (0 to 1) to the animated position.
 * This approach is ideal for low-power devices because it removes heavy physics math from the frame loop.
 */
export var createSpringEasing = function createSpringEasing() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _config$stiff = config.stiff,
    stiff = _config$stiff === void 0 ? 100 : _config$stiff,
    _config$damping = config.damping,
    damping = _config$damping === void 0 ? 8 : _config$damping,
    _config$dt = config.dt,
    dt = _config$dt === void 0 ? 16.67 : _config$dt;
  var destX = 1;
  var positions = [0];
  var currX = 0;
  var currV = 0;

  // Safety valve to prevent accidental infinite loops if physics config is extreme
  var maxIterations = 10000;
  var iterations = 0;

  // 1. Run the simulation until the spring completely stops moving
  while (iterations < maxIterations) {
    var FSpring = -(currX - destX) * stiff;
    var FDamping = currV * damping;
    currV += (FSpring - FDamping) * dt / 1000;
    currX += currV * dt / 1000;
    positions.push(currX);

    // Stop only when position is essentially at 1.0 AND bounce velocity has died down
    if (Math.abs(currX - destX) < ACCURACY && Math.abs(currV) < ACCURACY) {
      break;
    }
    iterations++;
  }

  // Force the absolute final element to be exactly 1.0 for a perfect finish
  positions[positions.length - 1] = destX;
  var maxIndex = positions.length - 1;

  // 2. The ultra-smooth runtime function mapping your 0..1 progress
  return t => {
    var _positions$index, _positions, _positions$index2;
    if (t <= 0) return 0;
    if (t >= 1) return destX;

    // Scale t (0..1) proportionally across our entire pre-calculated array
    var exactFrame = t * maxIndex;
    var index = Math.floor(exactFrame);
    var fraction = exactFrame - index;

    // Blend between the two closest frames
    return ((_positions$index = positions[index]) !== null && _positions$index !== void 0 ? _positions$index : 0) + (((_positions = positions[index + 1]) !== null && _positions !== void 0 ? _positions : 0) - ((_positions$index2 = positions[index]) !== null && _positions$index2 !== void 0 ? _positions$index2 : 0)) * fraction;
  };
};

/**
 * @inline
 */

export var createEasingFunction = easing => {
  if (typeof easing === 'string') {
    switch (easing) {
      case 'ease':
      case 'ease-in-out':
      case 'ease-out':
      case 'ease-in':
      case 'linear':
        return configBezier(easing);
      case 'spring':
        return createSpringEasing();
      default:
        if (easing.split('(')[0] === 'cubic-bezier') {
          return configBezier(easing);
        }
    }
  }
  if (typeof easing === 'function') {
    return easing;
  }
  return null;
};