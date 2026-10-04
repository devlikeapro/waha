"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineCheckedDomain = void 0;
var _isDomainSpecifiedByUser = require("../../../util/isDomainSpecifiedByUser");
var _isWellBehavedNumber = require("../../../util/isWellBehavedNumber");
/**
 * This function validates and transforms the axis domain so that it is safe to use in the provided scale.
 */
var combineCheckedDomain = (realScaleType, axisDomain) => {
  if (axisDomain == null) {
    return undefined;
  }
  switch (realScaleType) {
    case 'linear':
      {
        /*
         * linear scale only reads the first two numbers in the domain, and ignores everything else.
         * So if it happens that someone somehow gave us a bigger domain,
         * let's pick the min and max from it.
         */
        if (!(0, _isDomainSpecifiedByUser.isWellFormedNumberDomain)(axisDomain)) {
          var min, max;
          for (var i = 0; i < axisDomain.length; i++) {
            var value = axisDomain[i];
            if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(value)) {
              continue;
            }
            if (min === undefined || value < min) {
              min = value;
            }
            if (max === undefined || value > max) {
              max = value;
            }
          }
          if (min !== undefined && max !== undefined) {
            return [min, max];
          }
          return undefined;
        }
        return axisDomain;
      }
    default:
      return axisDomain;
  }
};
exports.combineCheckedDomain = combineCheckedDomain;