export class TranslationParserError extends Error {
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