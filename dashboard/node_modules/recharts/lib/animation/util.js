"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransitionVal = exports.getDashCase = void 0;
/*
 * @description: convert camel case to dash case
 * string => string
 */
var getDashCase = name => name.replace(/([A-Z])/g, v => "-".concat(v.toLowerCase()));
exports.getDashCase = getDashCase;
var getTransitionVal = (props, duration, easing) => props.map(prop => "".concat(getDashCase(prop), " ").concat(duration, "ms ").concat(easing)).join(',');
exports.getTransitionVal = getTransitionVal;