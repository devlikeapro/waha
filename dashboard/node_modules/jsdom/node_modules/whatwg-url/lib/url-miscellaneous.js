"use strict";

const tr46 = require("tr46");

const infra = require("./infra");

function p(char) {
  return char.codePointAt(0);
}

const failure = Symbol("failure");

const specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

const urlCodePoints = new Set([
  p("!"), p("$"), p("&"), p("'"), p("("), p(")"), p("*"), p("+"), p(","), p("-"), p("."), p("/"),
  p(":"), p(";"), p("="), p("?"), p("@"), p("_"), p("~")
]);

const forbiddenHostCodePoints = new Set([
  0x00, 0x09, 0x0A, 0x0D, 0x20, p("#"), p("/"), p(":"), p("<"), p(">"), p("?"), p("@"), p("["),
  p("\\"), p("]"), p("^"), p("|")
]);

function isURLCodePoint(c) {
  return infra.isASCIIAlphanumeric(c) ||
    urlCodePoints.has(c) ||
    (c >= 0xA0 && c <= 0x10FFFD && (c < 0xD800 || c > 0xDFFF) && !infra.isNoncharacter(c));
}

function isInvalidURLCodePoint(c) {
  return !isURLCodePoint(c) && c !== p("%");
}

function isPercentEncodedByteAt(input, index) {
  return index + 2 < input.length &&
    input[index] === "%" &&
    infra.isASCIIHex(input.charCodeAt(index + 1)) &&
    infra.isASCIIHex(input.charCodeAt(index + 2));
}

function containsPercentEncodedByte(input) {
  return /%[0-9A-Fa-f]{2}/u.test(input);
}

function containsForbiddenHostCodePoint(string) {
  return [...string].some(c => forbiddenHostCodePoints.has(c.codePointAt(0)));
}

function containsForbiddenDomainCodePoint(string) {
  return [...string].some(c => {
    const cp = c.codePointAt(0);
    return forbiddenHostCodePoints.has(cp) || (cp >= 0x00 && cp <= 0x1F) || cp === p("%") || cp === 0x7F;
  });
}

function domainParserToASCII(domain, beStrict) {
  return tr46.toASCII(domain, {
    checkHyphens: beStrict,
    checkBidi: true,
    checkJoiners: true,
    useSTD3ASCIIRules: beStrict,
    transitionalProcessing: false,
    verifyDNSLength: beStrict,
    ignoreInvalidPunycode: false
  });
}

function parseIPv4Number(input, validationErrors = null) {
  if (input === "") {
    return failure;
  }

  let validationErrorSeen = false;
  let R = 10;

  if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
    validationErrorSeen = true;
    input = input.substring(2);
    R = 16;
  } else if (input.length >= 2 && input.charAt(0) === "0") {
    validationErrorSeen = true;
    input = input.substring(1);
    R = 8;
  }

  if (input === "") {
    validationErrors?.push("IPv4-non-decimal-part");
    return 0;
  }

  let regex = /[^0-7]/u;
  if (R === 10) {
    regex = /[^0-9]/u;
  }
  if (R === 16) {
    regex = /[^0-9A-Fa-f]/u;
  }

  if (regex.test(input)) {
    return failure;
  }

  if (validationErrorSeen) {
    validationErrors?.push("IPv4-non-decimal-part");
  }

  return parseInt(input, R);
}

function endsInANumber(input) {
  const parts = input.split(".");
  if (parts[parts.length - 1] === "") {
    if (parts.length === 1) {
      return false;
    }
    parts.pop();
  }

  const last = parts[parts.length - 1];
  if (/^[0-9]+$/u.test(last)) {
    return true;
  }

  if (parseIPv4Number(last) !== failure) {
    return true;
  }

  return false;
}

function domainParser(domain, validationErrors = null, beStrict = false) {
  // A domain-to-ASCII validation error is reported whenever the strict Unicode ToASCII (CheckHyphens,
  // UseSTD3ASCIIRules, and VerifyDnsLength all true) fails, even when the relaxed parameters used
  // for non-strict parsing succeed. This step does not itself fail the algorithm.
  //
  // Spec divergence (performance): the URL Standard runs this strict pass unconditionally, but when
  // beStrict is false its only effect is that validation error, so we skip it when we are neither
  // being strict nor collecting validation errors.
  if (beStrict || validationErrors) {
    const strictResult = domainParserToASCII(domain, true);
    if (strictResult === null) {
      validationErrors?.push("domain-to-ASCII");
    }

    if (beStrict) {
      return strictResult === null ? failure : strictResult;
    }
  }

  let result;
  if (infra.isASCIIString(domain)) {
    // For web compatibility an ASCII domain is returned lowercased regardless of ToASCII's outcome.
    result = domain.toLowerCase();
  } else {
    result = domainParserToASCII(domain, false);
    if (result === null) {
      return failure;
    }
  }

  if (result === "") {
    return failure;
  }
  if (containsForbiddenDomainCodePoint(result)) {
    return failure;
  }

  return result;
}

function isSpecialScheme(scheme) {
  return specialSchemes[scheme.toLowerCase()] !== undefined;
}

function isSpecialSchemeExceptFile(scheme) {
  return isSpecialScheme(scheme) && scheme.toLowerCase() !== "file";
}

function defaultPort(scheme) {
  return specialSchemes[scheme.toLowerCase()];
}

function isWindowsDriveLetterCodePoints(cp1, cp2) {
  return infra.isASCIIAlpha(cp1) && (cp2 === p(":") || cp2 === p("|"));
}

function isWindowsDriveLetterString(string) {
  return string.length === 2 && infra.isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
}

function isNormalizedWindowsDriveLetterString(string) {
  return string.length === 2 && infra.isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
}

module.exports = {
  containsForbiddenHostCodePoint,
  containsPercentEncodedByte,
  defaultPort,
  domainParser,
  endsInANumber,
  failure,
  forbiddenHostCodePoints,
  isInvalidURLCodePoint,
  isNormalizedWindowsDriveLetterString,
  isPercentEncodedByteAt,
  parseIPv4Number,
  isSpecialScheme,
  isSpecialSchemeExceptFile,
  isURLCodePoint,
  isWindowsDriveLetterCodePoints,
  isWindowsDriveLetterString,
  p
};
