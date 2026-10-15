"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.slice = void 0;
var slice = exports.slice = Array.prototype.slice;
function _default(x) {
  return typeof x === "object" && "length" in x ? x // Array, TypedArray, NodeList, array-like
  : Array.from(x); // Map, Set, iterable, string, or anything else
}