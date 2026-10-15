/**
 * CalculatedCartesianPosition returns horizontalAnchor and verticalAnchor
 * which work directly with an SVG text element
 * but for use in HTML context we have to translate them into CSS transform(translate)
 * so this is what this function is doing.
 *
 * horizontalPosition is type: type TextAnchor = 'start' | 'middle' | 'end' | 'inherit'
 * verticalPosition is type: type TextVerticalAnchor = 'start' | 'middle' | 'end'
 *
 * @param horizontalPosition as returned from {@link getCartesianPosition}
 * @param verticalPosition as returned from {@link getCartesianPosition}
 * @return CSS transform string
 */
export function cartesianPositionToCSSTranslate(horizontalPosition, verticalPosition) {
  var _verticalValues$verti;
  // 'start' / 'start' is the default HTML behavior, no transform needed
  if (horizontalPosition === 'start' && verticalPosition === 'start') {
    return '';
  }
  var horizontalValues = {
    start: '0',
    middle: '-50%',
    end: '-100%'
  };
  var verticalValues = {
    start: '0',
    middle: '-50%',
    end: '-100%'
  };
  var x = horizontalPosition === 'inherit' ? '0' : horizontalValues[horizontalPosition];
  var y = (_verticalValues$verti = verticalValues[verticalPosition]) !== null && _verticalValues$verti !== void 0 ? _verticalValues$verti : '0';
  return "translate(".concat(x, ", ").concat(y, ")");
}