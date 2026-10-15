"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianScaleHelperImpl = void 0;
/**
 * Groups X and Y scale functions together and provides helper methods.
 */
class CartesianScaleHelperImpl {
  constructor(_ref) {
    var x = _ref.x,
      y = _ref.y;
    this.xAxisScale = x;
    this.yAxisScale = y;
  }
  map(value, _ref2) {
    var _this$xAxisScale$map, _this$yAxisScale$map;
    var position = _ref2.position;
    return {
      x: (_this$xAxisScale$map = this.xAxisScale.map(value.x, {
        position
      })) !== null && _this$xAxisScale$map !== void 0 ? _this$xAxisScale$map : 0,
      y: (_this$yAxisScale$map = this.yAxisScale.map(value.y, {
        position
      })) !== null && _this$yAxisScale$map !== void 0 ? _this$yAxisScale$map : 0
    };
  }
  mapWithFallback(value, _ref3) {
    var _this$xAxisScale$map2, _this$yAxisScale$map2;
    var position = _ref3.position,
      fallback = _ref3.fallback;
    var fallbackY, fallbackX;
    if (fallback === 'rangeMin') {
      fallbackY = this.yAxisScale.rangeMin();
    } else if (fallback === 'rangeMax') {
      fallbackY = this.yAxisScale.rangeMax();
    } else {
      fallbackY = 0;
    }
    if (fallback === 'rangeMin') {
      fallbackX = this.xAxisScale.rangeMin();
    } else if (fallback === 'rangeMax') {
      fallbackX = this.xAxisScale.rangeMax();
    } else {
      fallbackX = 0;
    }
    return {
      x: (_this$xAxisScale$map2 = this.xAxisScale.map(value.x, {
        position
      })) !== null && _this$xAxisScale$map2 !== void 0 ? _this$xAxisScale$map2 : fallbackX,
      y: (_this$yAxisScale$map2 = this.yAxisScale.map(value.y, {
        position
      })) !== null && _this$yAxisScale$map2 !== void 0 ? _this$yAxisScale$map2 : fallbackY
    };
  }
  isInRange(_ref4) {
    var x = _ref4.x,
      y = _ref4.y;
    var xInRange = x == null || this.xAxisScale.isInRange(x);
    var yInRange = y == null || this.yAxisScale.isInRange(y);
    return xInRange && yInRange;
  }
}
exports.CartesianScaleHelperImpl = CartesianScaleHelperImpl;