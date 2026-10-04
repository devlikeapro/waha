"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxDevtoolsJsonStringifyReplacer = reduxDevtoolsJsonStringifyReplacer;
function reduxDevtoolsJsonStringifyReplacer(key, value) {
  if (value instanceof HTMLElement) {
    return "HTMLElement <".concat(value.tagName, " class=\"").concat(value.className, "\">");
  }
  if (value === window) {
    return 'global.window';
  }
  if (key === 'children' && typeof value === 'object' && value !== null) {
    return '<<CHILDREN>>';
  }
  return value;
}