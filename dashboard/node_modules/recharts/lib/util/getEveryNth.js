"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEveryNth = getEveryNth;
/**
 * Given an array and a number N, return a new array which contains every nTh
 * element of the input array. For n below 1, an empty array is returned.
 * For n equal to 1, the input array is returned as is.
 * For n greater than the length of the array, an array containing the first element
 * and every nTh element after that (if any) is returned.
 *
 * @param array An input array.
 * @param n A number specifying which elements to take.
 * @returns The result array of the same type as the input array.
 */
function getEveryNth(array, n) {
  if (n < 1) {
    return [];
  }
  if (n === 1) {
    return array;
  }
  var result = [];
  for (var i = 0; i < array.length; i += n) {
    var item = array[i];
    if (item !== undefined) {
      result.push(item);
    }
  }
  return result;
}