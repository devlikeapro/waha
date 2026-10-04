"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqPayload = getUniqPayload;
var _uniqBy = _interopRequireDefault(require("es-toolkit/compat/uniqBy"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * This is configuration option that decides how to filter for unique values only:
 *
 * - `false` means "no filter"
 * - `true` means "use recharts default filter"
 * - function means "use return of this function as the default key"
 */

function getUniqPayload(payload, option, defaultUniqBy) {
  if (option === true) {
    return (0, _uniqBy.default)(payload, defaultUniqBy);
  }
  if (typeof option === 'function') {
    return (0, _uniqBy.default)(payload, option);
  }
  return payload;
}