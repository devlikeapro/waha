"use strict";

// Note that we take code points as JS numbers, not JS strings.

function isASCIIDigit(c) {
  return c >= 0x30 && c <= 0x39;
}

function isASCIIAlpha(c) {
  return (c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A);
}

function isASCIIAlphanumeric(c) {
  return isASCIIAlpha(c) || isASCIIDigit(c);
}

function isASCIIHex(c) {
  return isASCIIDigit(c) || (c >= 0x41 && c <= 0x46) || (c >= 0x61 && c <= 0x66);
}

function isASCIIString(string) {
  return !/[^\u0000-\u007F]/u.test(string);
}

function isNoncharacter(c) {
  return (c >= 0xFDD0 && c <= 0xFDEF) || (c & 0xFFFE) === 0xFFFE;
}

module.exports = {
  isASCIIDigit,
  isASCIIAlpha,
  isASCIIAlphanumeric,
  isASCIIHex,
  isASCIIString,
  isNoncharacter
};
