import { clsx } from 'clsx';
import { isNumber } from '../DataUtils';
var CSS_CLASS_PREFIX = 'recharts-tooltip-wrapper';
var TOOLTIP_HIDDEN = {
  visibility: 'hidden'
};
export function getTooltipCSSClassName(_ref) {
  var coordinate = _ref.coordinate,
    translateX = _ref.translateX,
    translateY = _ref.translateY;
  return clsx(CSS_CLASS_PREFIX, {
    ["".concat(CSS_CLASS_PREFIX, "-right")]: isNumber(translateX) && coordinate && isNumber(coordinate.x) && translateX >= coordinate.x,
    ["".concat(CSS_CLASS_PREFIX, "-left")]: isNumber(translateX) && coordinate && isNumber(coordinate.x) && translateX < coordinate.x,
    ["".concat(CSS_CLASS_PREFIX, "-bottom")]: isNumber(translateY) && coordinate && isNumber(coordinate.y) && translateY >= coordinate.y,
    ["".concat(CSS_CLASS_PREFIX, "-top")]: isNumber(translateY) && coordinate && isNumber(coordinate.y) && translateY < coordinate.y
  });
}
export function getTooltipTranslateXY(_ref2) {
  var allowEscapeViewBox = _ref2.allowEscapeViewBox,
    coordinate = _ref2.coordinate,
    key = _ref2.key,
    offset = _ref2.offset,
    position = _ref2.position,
    reverseDirection = _ref2.reverseDirection,
    tooltipDimension = _ref2.tooltipDimension,
    viewBox = _ref2.viewBox,
    viewBoxDimension = _ref2.viewBoxDimension;
  if (position && isNumber(position[key])) {
    return position[key];
  }
  var negative = coordinate[key] - tooltipDimension - (offset > 0 ? offset : 0);
  var positive = coordinate[key] + offset;
  if (allowEscapeViewBox[key]) {
    return reverseDirection[key] ? negative : positive;
  }
  var viewBoxKey = viewBox[key];
  if (viewBoxKey == null) {
    return 0;
  }
  if (reverseDirection[key]) {
    var _tooltipBoundary = negative;
    var _viewBoxBoundary = viewBoxKey;
    if (_tooltipBoundary < _viewBoxBoundary) {
      return Math.max(positive, viewBoxKey);
    }
    return Math.max(negative, viewBoxKey);
  }
  if (viewBoxDimension == null) {
    return 0;
  }
  var tooltipBoundary = positive + tooltipDimension;
  var viewBoxBoundary = viewBoxKey + viewBoxDimension;
  if (tooltipBoundary > viewBoxBoundary) {
    return Math.max(negative, viewBoxKey);
  }
  return Math.max(positive, viewBoxKey);
}
export function getTransformStyle(_ref3) {
  var translateX = _ref3.translateX,
    translateY = _ref3.translateY,
    useTranslate3d = _ref3.useTranslate3d;
  return {
    transform: useTranslate3d ? "translate3d(".concat(translateX, "px, ").concat(translateY, "px, 0)") : "translate(".concat(translateX, "px, ").concat(translateY, "px)")
  };
}
export function getTooltipTranslate(_ref4) {
  var allowEscapeViewBox = _ref4.allowEscapeViewBox,
    coordinate = _ref4.coordinate,
    offsetTop = _ref4.offsetTop,
    offsetLeft = _ref4.offsetLeft,
    position = _ref4.position,
    reverseDirection = _ref4.reverseDirection,
    tooltipBox = _ref4.tooltipBox,
    useTranslate3d = _ref4.useTranslate3d,
    viewBox = _ref4.viewBox;
  var cssProperties, translateX, translateY;
  if (tooltipBox && tooltipBox.height > 0 && tooltipBox.width > 0 && coordinate) {
    translateX = getTooltipTranslateXY({
      allowEscapeViewBox,
      coordinate,
      key: 'x',
      offset: offsetLeft,
      position,
      reverseDirection,
      tooltipDimension: tooltipBox.width,
      viewBox,
      viewBoxDimension: viewBox.width
    });
    translateY = getTooltipTranslateXY({
      allowEscapeViewBox,
      coordinate,
      key: 'y',
      offset: offsetTop,
      position,
      reverseDirection,
      tooltipDimension: tooltipBox.height,
      viewBox,
      viewBoxDimension: viewBox.height
    });
    cssProperties = getTransformStyle({
      translateX,
      translateY,
      useTranslate3d
    });
  } else {
    cssProperties = TOOLTIP_HIDDEN;
  }
  return {
    cssProperties,
    cssClasses: getTooltipCSSClassName({
      translateX,
      translateY,
      coordinate
    })
  };
}