"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Global = void 0;
var parseIsSsrByDefault = () => !(typeof window !== 'undefined' && window.document && Boolean(window.document.createElement) && window.setTimeout);
var Global = exports.Global = {
  devToolsEnabled: true,
  isSsr: parseIsSsrByDefault()
};