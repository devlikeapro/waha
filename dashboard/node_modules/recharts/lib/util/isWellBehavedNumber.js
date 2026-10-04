"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPositiveNumber = isPositiveNumber;
exports.isWellBehavedNumber = isWellBehavedNumber;
function isWellBehavedNumber(n) {
  return Number.isFinite(n);
}
function isPositiveNumber(n) {
  return typeof n === 'number' && n > 0 && Number.isFinite(n);
}