"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _TranslationParserError = require("./TranslationParserError.js");
Object.keys(_TranslationParserError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _TranslationParserError[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TranslationParserError[key];
    }
  });
});
var _htmlEntityDecoder = require("./htmlEntityDecoder.js");
Object.keys(_htmlEntityDecoder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _htmlEntityDecoder[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _htmlEntityDecoder[key];
    }
  });
});
var _tokenizer = require("./tokenizer.js");
Object.keys(_tokenizer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tokenizer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tokenizer[key];
    }
  });
});
var _renderTranslation = require("./renderTranslation.js");
Object.keys(_renderTranslation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _renderTranslation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _renderTranslation[key];
    }
  });
});