"use strict";
const borderBottomWidth = require("../jsdom/living/css/properties/borderBottomWidth.js");
const borderLeftWidth = require("../jsdom/living/css/properties/borderLeftWidth.js");
const borderRightWidth = require("../jsdom/living/css/properties/borderRightWidth.js");
const borderTopWidth = require("../jsdom/living/css/properties/borderTopWidth.js");

module.exports = new Map([
  ["border-bottom-width", borderBottomWidth.getResolvedValue],
  ["border-left-width", borderLeftWidth.getResolvedValue],
  ["border-right-width", borderRightWidth.getResolvedValue],
  ["border-top-width", borderTopWidth.getResolvedValue]
]);
