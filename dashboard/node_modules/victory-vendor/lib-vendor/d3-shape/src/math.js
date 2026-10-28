"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abs = void 0;
exports.acos = acos;
exports.asin = asin;
exports.tau = exports.sqrt = exports.sin = exports.pi = exports.min = exports.max = exports.halfPi = exports.epsilon = exports.cos = exports.atan2 = void 0;
const abs = exports.abs = Math.abs;
const atan2 = exports.atan2 = Math.atan2;
const cos = exports.cos = Math.cos;
const max = exports.max = Math.max;
const min = exports.min = Math.min;
const sin = exports.sin = Math.sin;
const sqrt = exports.sqrt = Math.sqrt;
const epsilon = exports.epsilon = 1e-12;
const pi = exports.pi = Math.PI;
const halfPi = exports.halfPi = pi / 2;
const tau = exports.tau = 2 * pi;
function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}
function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}