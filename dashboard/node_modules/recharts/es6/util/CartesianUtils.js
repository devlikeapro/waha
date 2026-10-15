export var rectWithPoints = (_ref, _ref2) => {
  var x1 = _ref.x,
    y1 = _ref.y;
  var x2 = _ref2.x,
    y2 = _ref2.y;
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1)
  };
};

/**
 * Compute the x, y, width, and height of a box from two reference points.
 * @param  {Object} coords     x1, x2, y1, and y2
 * @return {Object} object
 */
export var rectWithCoords = _ref3 => {
  var x1 = _ref3.x1,
    y1 = _ref3.y1,
    x2 = _ref3.x2,
    y2 = _ref3.y2;
  return rectWithPoints({
    x: x1,
    y: y1
  }, {
    x: x2,
    y: y2
  });
};

/** Normalizes the angle so that 0 <= angle < 180.
 * @param {number} angle Angle in degrees.
 * @return {number} the normalized angle with a value of at least 0 and never greater or equal to 180. */
export function normalizeAngle(angle) {
  return (angle % 180 + 180) % 180;
}

/** Calculates the width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 * @param {Object} size Width and height of the text in a horizontal position.
 * @param {number} angle Angle in degrees in which the text is displayed.
 * @return {number} The width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 */
export var getAngledRectangleWidth = function getAngledRectangleWidth(_ref4) {
  var width = _ref4.width,
    height = _ref4.height;
  var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Ensure angle is >= 0 && < 180
  var normalizedAngle = normalizeAngle(angle);
  var angleRadians = normalizedAngle * Math.PI / 180;

  /* Depending on the height and width of the rectangle, we may need to use different formulas to calculate the angled
   * width. This threshold defines when each formula should kick in. */
  var angleThreshold = Math.atan(height / width);
  var angledWidth = angleRadians > angleThreshold && angleRadians < Math.PI - angleThreshold ? height / Math.sin(angleRadians) : width / Math.cos(angleRadians);
  return Math.abs(angledWidth);
};