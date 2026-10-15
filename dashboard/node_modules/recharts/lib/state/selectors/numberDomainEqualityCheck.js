"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberDomainEqualityCheck = void 0;
var numberDomainEqualityCheck = (a, b) => {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  return a[0] === b[0] && a[1] === b[1];
};
exports.numberDomainEqualityCheck = numberDomainEqualityCheck;