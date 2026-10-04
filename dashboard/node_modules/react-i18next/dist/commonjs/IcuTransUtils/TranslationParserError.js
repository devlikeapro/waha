"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranslationParserError = void 0;
class TranslationParserError extends Error {
  constructor(message, position, translationString) {
    super(message);
    this.name = 'TranslationParserError';
    this.position = position;
    this.translationString = translationString;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TranslationParserError);
    }
  }
}
exports.TranslationParserError = TranslationParserError;