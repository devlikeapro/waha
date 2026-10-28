"use strict";
require("@exodus/bytes/encoding.js"); // for legacy multi-byte encodings
const { percentEncodeAfterEncoding } = require("@exodus/bytes/whatwg.js");

const infra = require("./infra");
const { utf8DecodeWithoutBOM } = require("./encoding");
const {
  containsForbiddenHostCodePoint,
  containsPercentEncodedByte,
  defaultPort,
  domainParser,
  endsInANumber,
  failure,
  isInvalidURLCodePoint,
  isNormalizedWindowsDriveLetterString,
  isSpecialScheme,
  isWindowsDriveLetterCodePoints,
  isWindowsDriveLetterString,
  parseIPv4Number,
  p
} = require("./url-miscellaneous");
const { percentDecodeString, utf8PercentEncodeCodePoint, utf8PercentEncodeString,
  isC0ControlPercentEncode, isFragmentPercentEncode,
  extraQueryPercentEncodeChars, extraSpecialQueryPercentEncodeChars,
  isPathPercentEncode, isUserinfoPercentEncode } = require("./percent-encoding");

function countSymbols(str) {
  return [...str].length;
}

function at(input, idx) {
  const c = input[idx];
  return isNaN(c) ? undefined : String.fromCodePoint(c);
}

function isSingleDot(buffer) {
  return buffer === "." || buffer.toLowerCase() === "%2e";
}

function isDoubleDot(buffer) {
  buffer = buffer.toLowerCase();
  return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
}

function isInvalidPercentEncoding(input, pointer) {
  return input[pointer] === p("%") &&
    (!infra.isASCIIHex(input[pointer + 1]) || !infra.isASCIIHex(input[pointer + 2]));
}

function validateURLUnits(input, validationErrors = null) {
  if (validationErrors === null) {
    return;
  }

  const codePoints = Array.from(input, c => c.codePointAt(0));
  if (codePoints.some(isInvalidURLCodePoint)) {
    validationErrors.push("invalid-URL-unit");
  }
  if (codePoints.some((_, i) => isInvalidPercentEncoding(codePoints, i))) {
    validationErrors.push("invalid-URL-unit");
  }
}

function isSpecial(url) {
  return isSpecialScheme(url.scheme);
}

function isNotSpecial(url) {
  return !isSpecialScheme(url.scheme);
}

function parseIPv4(input, validationErrors = null) {
  const parts = input.split(".");
  if (parts[parts.length - 1] === "") {
    validationErrors?.push("IPv4-empty-part");
    if (parts.length > 1) {
      parts.pop();
    }
  }

  if (parts.length > 4) {
    validationErrors?.push("IPv4-too-many-parts");
    return failure;
  }

  if (parts.length < 4) {
    validationErrors?.push("IPv4-too-few-parts");
  }

  const numbers = [];
  for (const part of parts) {
    const n = parseIPv4Number(part, validationErrors);
    if (n === failure) {
      validationErrors?.push("IPv4-non-numeric-part");
      return failure;
    }

    numbers.push(n);
  }

  if (validationErrors !== null && numbers.some(n => n > 255)) {
    validationErrors.push("IPv4-out-of-range-part");
  }
  for (let i = 0; i < numbers.length - 1; ++i) {
    if (numbers[i] > 255) {
      return failure;
    }
  }
  if (numbers[numbers.length - 1] >= 256 ** (5 - numbers.length)) {
    return failure;
  }

  let ipv4 = numbers.pop();
  let counter = 0;

  for (const n of numbers) {
    ipv4 += n * 256 ** (3 - counter);
    ++counter;
  }

  return ipv4;
}

function serializeIPv4(address) {
  let output = "";
  let n = address;

  for (let i = 1; i <= 4; ++i) {
    output = String(n % 256) + output;
    if (i !== 4) {
      output = `.${output}`;
    }
    n = Math.floor(n / 256);
  }

  return output;
}

function parseIPv6(input, validationErrors = null) {
  const address = [0, 0, 0, 0, 0, 0, 0, 0];
  let pieceIndex = 0;
  let compress = null;
  let pointer = 0;

  input = Array.from(input, c => c.codePointAt(0));

  if (input[pointer] === p(":")) {
    if (input[pointer + 1] !== p(":")) {
      validationErrors?.push("IPv6-invalid-compression");
      return failure;
    }

    pointer += 2;
    ++pieceIndex;
    compress = pieceIndex;
  }

  while (pointer < input.length) {
    if (pieceIndex === 8) {
      validationErrors?.push("IPv6-too-many-pieces");
      return failure;
    }

    if (input[pointer] === p(":")) {
      if (compress !== null) {
        validationErrors?.push("IPv6-multiple-compression");
        return failure;
      }
      ++pointer;
      ++pieceIndex;
      compress = pieceIndex;
      continue;
    }

    let value = 0;
    let length = 0;

    while (length < 4 && infra.isASCIIHex(input[pointer])) {
      value = value * 0x10 + parseInt(at(input, pointer), 16);
      ++pointer;
      ++length;
    }

    if (input[pointer] === p(".")) {
      if (length === 0) {
        validationErrors?.push("IPv4-in-IPv6-invalid-code-point");
        return failure;
      }

      pointer -= length;

      if (pieceIndex > 6) {
        validationErrors?.push("IPv4-in-IPv6-too-many-pieces");
        return failure;
      }

      let numbersSeen = 0;

      while (input[pointer] !== undefined) {
        let ipv4Piece = null;

        if (numbersSeen > 0) {
          if (input[pointer] === p(".") && numbersSeen < 4) {
            ++pointer;
          } else {
            validationErrors?.push("IPv4-in-IPv6-invalid-code-point");
            return failure;
          }
        }

        if (!infra.isASCIIDigit(input[pointer])) {
          validationErrors?.push("IPv4-in-IPv6-invalid-code-point");
          return failure;
        }

        while (infra.isASCIIDigit(input[pointer])) {
          const number = parseInt(at(input, pointer), 10);
          if (ipv4Piece === null) {
            ipv4Piece = number;
          } else if (ipv4Piece === 0) {
            validationErrors?.push("IPv4-in-IPv6-invalid-code-point");
            return failure;
          } else {
            ipv4Piece = ipv4Piece * 10 + number;
          }
          if (ipv4Piece > 255) {
            validationErrors?.push("IPv4-in-IPv6-out-of-range-part");
            return failure;
          }
          ++pointer;
        }

        address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;

        ++numbersSeen;

        if (numbersSeen === 2 || numbersSeen === 4) {
          ++pieceIndex;
        }
      }

      if (numbersSeen !== 4) {
        validationErrors?.push("IPv4-in-IPv6-too-few-parts");
        return failure;
      }

      break;
    } else if (input[pointer] === p(":")) {
      ++pointer;
      if (input[pointer] === undefined) {
        validationErrors?.push("IPv6-invalid-code-point");
        return failure;
      }
    } else if (input[pointer] !== undefined) {
      validationErrors?.push("IPv6-invalid-code-point");
      return failure;
    }

    if (length > 1 && value < 0x10 ** (length - 1)) {
      validationErrors?.push("IPv6-piece-leading-zero");
    }

    address[pieceIndex] = value;
    ++pieceIndex;
  }

  if (compress !== null) {
    let swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex !== 0 && swaps > 0) {
      const temp = address[compress + swaps - 1];
      address[compress + swaps - 1] = address[pieceIndex];
      address[pieceIndex] = temp;
      --pieceIndex;
      --swaps;
    }
  } else if (compress === null && pieceIndex !== 8) {
    validationErrors?.push("IPv6-too-few-pieces");
    return failure;
  }

  return address;
}

function serializeIPv6(address) {
  let output = "";
  const compress = findTheIPv6AddressCompressedPieceIndex(address);
  let ignore0 = false;

  for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
    if (ignore0 && address[pieceIndex] === 0) {
      continue;
    } else if (ignore0) {
      ignore0 = false;
    }

    if (compress === pieceIndex) {
      const separator = pieceIndex === 0 ? "::" : ":";
      output += separator;
      ignore0 = true;
      continue;
    }

    output += address[pieceIndex].toString(16);

    if (pieceIndex !== 7) {
      output += ":";
    }
  }

  return output;
}

function parseHost(input, validationErrors = null, isOpaque = false) {
  if (input[0] === "[") {
    if (input[input.length - 1] !== "]") {
      validationErrors?.push("IPv6-unclosed");
      return failure;
    }

    return parseIPv6(input.substring(1, input.length - 1), validationErrors);
  }

  if (isOpaque) {
    return parseOpaqueHost(input, validationErrors);
  }

  if (validationErrors && containsPercentEncodedByte(input)) {
    validationErrors.push("domain-percent-encoded");
  }

  const domain = utf8DecodeWithoutBOM(percentDecodeString(input));
  const asciiDomain = domainParser(domain, validationErrors);
  if (asciiDomain === failure) {
    return failure;
  }

  if (endsInANumber(asciiDomain)) {
    if (!infra.isASCIIString(domain)) {
      validationErrors?.push("IPv4-non-ASCII-input");
    }
    return parseIPv4(asciiDomain, validationErrors);
  }

  return asciiDomain;
}

function parseOpaqueHost(input, validationErrors) {
  if (containsForbiddenHostCodePoint(input)) {
    validationErrors?.push("host-invalid-code-point");
    return failure;
  }

  validateURLUnits(input, validationErrors);

  return utf8PercentEncodeString(input, isC0ControlPercentEncode);
}

function findTheIPv6AddressCompressedPieceIndex(address) {
  let longestIndex = null;
  let longestSize = 1; // only find elements > 1
  let foundIndex = null;
  let foundSize = 0;

  for (let pieceIndex = 0; pieceIndex < address.length; ++pieceIndex) {
    if (address[pieceIndex] !== 0) {
      if (foundSize > longestSize) {
        longestIndex = foundIndex;
        longestSize = foundSize;
      }

      foundIndex = null;
      foundSize = 0;
    } else {
      if (foundIndex === null) {
        foundIndex = pieceIndex;
      }
      ++foundSize;
    }
  }

  if (foundSize > longestSize) {
    return foundIndex;
  }

  return longestIndex;
}

function serializeHost(host) {
  if (typeof host === "number") {
    return serializeIPv4(host);
  }

  // IPv6 serializer
  if (host instanceof Array) {
    return `[${serializeIPv6(host)}]`;
  }

  return host;
}

function trimControlChars(string) {
  // Avoid using regexp because of this V8 bug: https://issues.chromium.org/issues/42204424

  let start = 0;
  let end = string.length;
  for (; start < end; ++start) {
    if (string.charCodeAt(start) > 0x20) {
      break;
    }
  }
  for (; end > start; --end) {
    if (string.charCodeAt(end - 1) > 0x20) {
      break;
    }
  }
  return string.substring(start, end);
}

function trimTabAndNewline(url) {
  return url.replace(/\u0009|\u000A|\u000D/ug, "");
}

function shortenPath(url) {
  const { path } = url;
  if (path.length === 0) {
    return;
  }
  if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetterString(path[0])) {
    return;
  }

  path.pop();
}

function includesCredentials(url) {
  return url.username !== "" || url.password !== "";
}

function cannotHaveAUsernamePasswordPort(url) {
  return url.host === null || url.host === "" || url.scheme === "file";
}

function hasAnOpaquePath(url) {
  return typeof url.path === "string";
}

function URLStateMachine(input, base, encoding, url, stateOverride, validationErrors = null) {
  this.pointer = 0;
  this.input = input;
  this.base = base || null;
  this.encoding = encoding || "utf-8";
  this.stateOverride = stateOverride;
  this.url = url;
  this.failure = false;
  this.validationErrors = validationErrors;

  if (!this.url) {
    this.url = {
      scheme: "",
      username: "",
      password: "",
      host: null,
      port: null,
      path: [],
      query: null,
      fragment: null
    };

    const res = trimControlChars(this.input);
    if (res !== this.input) {
      this.validationErrors?.push("invalid-URL-unit");
    }
    this.input = res;
  }

  const res = trimTabAndNewline(this.input);
  if (res !== this.input) {
    this.validationErrors?.push("invalid-URL-unit");
  }
  this.input = res;

  this.state = stateOverride || "scheme start";

  this.buffer = "";
  this.atSignSeen = false;
  this.insideBrackets = false;
  this.passwordTokenSeen = false;

  this.input = Array.from(this.input, c => c.codePointAt(0));

  for (; this.pointer <= this.input.length; ++this.pointer) {
    const c = this.input[this.pointer];
    const cStr = isNaN(c) ? undefined : String.fromCodePoint(c);

    // exec state machine
    const ret = this[`parse ${this.state}`](c, cStr);
    if (!ret) {
      break; // terminate algorithm
    } else if (ret === failure) {
      this.failure = true;
      break;
    }
  }
}

URLStateMachine.prototype.validateURLUnit = function (c) {
  if (this.validationErrors === null) {
    return;
  }

  if (isInvalidURLCodePoint(c)) {
    this.validationErrors.push("invalid-URL-unit");
  }
  if (isInvalidPercentEncoding(this.input, this.pointer)) {
    this.validationErrors.push("invalid-URL-unit");
  }
};

URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
  if (infra.isASCIIAlpha(c)) {
    this.buffer += cStr.toLowerCase();
    this.state = "scheme";
  } else if (!this.stateOverride) {
    this.state = "no scheme";
    --this.pointer;
  } else {
    return failure;
  }

  return true;
};

URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
  if (infra.isASCIIAlphanumeric(c) || c === p("+") || c === p("-") || c === p(".")) {
    this.buffer += cStr.toLowerCase();
  } else if (c === p(":")) {
    if (this.stateOverride) {
      if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
        return false;
      }

      if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
        return false;
      }

      if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
        return false;
      }

      if (this.url.scheme === "file" && this.url.host === "") {
        return false;
      }
    }
    this.url.scheme = this.buffer;
    if (this.stateOverride) {
      if (this.url.port === defaultPort(this.url.scheme)) {
        this.url.port = null;
      }
      return false;
    }
    this.buffer = "";
    if (this.url.scheme === "file") {
      if (this.input[this.pointer + 1] !== p("/") || this.input[this.pointer + 2] !== p("/")) {
        this.validationErrors?.push("special-scheme-missing-following-solidus");
      }
      this.state = "file";
    } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
      this.state = "special relative or authority";
    } else if (isSpecial(this.url)) {
      this.state = "special authority slashes";
    } else if (this.input[this.pointer + 1] === p("/")) {
      this.state = "path or authority";
      ++this.pointer;
    } else {
      this.url.path = "";
      this.state = "opaque path";
    }
  } else if (!this.stateOverride) {
    this.buffer = "";
    this.state = "no scheme";
    this.pointer = -1;
  } else {
    return failure;
  }

  return true;
};

URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
  if (this.base === null || (hasAnOpaquePath(this.base) && c !== p("#"))) {
    this.validationErrors?.push("missing-scheme-non-relative-URL");
    return failure;
  } else if (hasAnOpaquePath(this.base) && c === p("#")) {
    this.url.scheme = this.base.scheme;
    this.url.path = this.base.path;
    this.url.query = this.base.query;
    this.url.fragment = "";
    this.state = "fragment";
  } else if (this.base.scheme === "file") {
    this.state = "file";
    --this.pointer;
  } else {
    this.state = "relative";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
  if (c === p("/") && this.input[this.pointer + 1] === p("/")) {
    this.state = "special authority ignore slashes";
    ++this.pointer;
  } else {
    this.validationErrors?.push("special-scheme-missing-following-solidus");
    this.state = "relative";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
  if (c === p("/")) {
    this.state = "authority";
  } else {
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
  this.url.scheme = this.base.scheme;
  if (c === p("/")) {
    this.state = "relative slash";
  } else if (isSpecial(this.url) && c === p("\\")) {
    this.validationErrors?.push("invalid-reverse-solidus");
    this.state = "relative slash";
  } else {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    if (c === p("?")) {
      this.url.query = "";
      this.state = "query";
    } else if (c === p("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    } else if (!isNaN(c)) {
      this.url.query = null;
      this.url.path.pop();
      this.state = "path";
      --this.pointer;
    }
  }

  return true;
};

URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
  if (isSpecial(this.url) && (c === p("/") || c === p("\\"))) {
    if (c === p("\\")) {
      this.validationErrors?.push("invalid-reverse-solidus");
    }
    this.state = "special authority ignore slashes";
  } else if (c === p("/")) {
    this.state = "authority";
  } else {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
  if (c === p("/") && this.input[this.pointer + 1] === p("/")) {
    this.state = "special authority ignore slashes";
    ++this.pointer;
  } else {
    this.validationErrors?.push("special-scheme-missing-following-solidus");
    this.state = "special authority ignore slashes";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
  if (c !== p("/") && c !== p("\\")) {
    this.state = "authority";
    --this.pointer;
  } else {
    this.validationErrors?.push("special-scheme-missing-following-solidus");
  }

  return true;
};

URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
  if (c === p("@")) {
    this.validationErrors?.push("invalid-credentials");
    if (this.atSignSeen) {
      this.buffer = `%40${this.buffer}`;
    }
    this.atSignSeen = true;

    // careful, this iterates over the buffer's code points, independently of this.pointer
    for (const codePointStr of this.buffer) {
      const codePoint = codePointStr.codePointAt(0);

      if (codePoint === p(":") && !this.passwordTokenSeen) {
        this.passwordTokenSeen = true;
        continue;
      }
      const encodedCodePoints = utf8PercentEncodeCodePoint(codePoint, isUserinfoPercentEncode);
      if (this.passwordTokenSeen) {
        this.url.password += encodedCodePoints;
      } else {
        this.url.username += encodedCodePoints;
      }
    }
    this.buffer = "";
  } else if (isNaN(c) || c === p("/") || c === p("?") || c === p("#") ||
             (isSpecial(this.url) && c === p("\\"))) {
    if (this.atSignSeen && this.buffer === "") {
      this.validationErrors?.push("host-missing");
      return failure;
    }
    this.pointer -= countSymbols(this.buffer) + 1;
    this.buffer = "";
    this.state = "host";
  } else {
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse hostname"] =
URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
  if (this.stateOverride && this.url.scheme === "file") {
    --this.pointer;
    this.state = "file host";
  } else if (c === p(":") && !this.insideBrackets) {
    if (this.buffer === "") {
      this.validationErrors?.push("host-missing");
      return failure;
    }

    if (this.stateOverride === "hostname") {
      return failure;
    }

    const host = parseHost(this.buffer, this.validationErrors, isNotSpecial(this.url));
    if (host === failure) {
      return failure;
    }

    this.url.host = host;
    this.buffer = "";
    this.state = "port";
  } else if (isNaN(c) || c === p("/") || c === p("?") || c === p("#") ||
             (isSpecial(this.url) && c === p("\\"))) {
    --this.pointer;
    if (isSpecial(this.url) && this.buffer === "") {
      this.validationErrors?.push("host-missing");
      return failure;
    } else if (this.stateOverride && this.buffer === "" &&
               (includesCredentials(this.url) || this.url.port !== null)) {
      return failure;
    }

    const host = parseHost(this.buffer, this.validationErrors, isNotSpecial(this.url));
    if (host === failure) {
      return failure;
    }

    this.url.host = host;
    this.buffer = "";
    this.state = "path start";
    if (this.stateOverride) {
      return false;
    }
  } else {
    if (c === p("[")) {
      this.insideBrackets = true;
    } else if (c === p("]")) {
      this.insideBrackets = false;
    }
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
  if (infra.isASCIIDigit(c)) {
    this.buffer += cStr;
  } else if (isNaN(c) || c === p("/") || c === p("?") || c === p("#") ||
             (isSpecial(this.url) && c === p("\\")) ||
             this.stateOverride) {
    if (this.buffer !== "") {
      const port = parseInt(this.buffer, 10);
      if (port > 2 ** 16 - 1) {
        this.validationErrors?.push("port-out-of-range");
        return failure;
      }
      this.url.port = port === defaultPort(this.url.scheme) ? null : port;
      this.buffer = "";
      if (this.stateOverride) {
        return false;
      }
    }
    if (this.stateOverride) {
      return failure;
    }
    this.state = "path start";
    --this.pointer;
  } else {
    this.validationErrors?.push("port-invalid");
    return failure;
  }

  return true;
};

const fileOtherwiseCodePoints = new Set([p("/"), p("\\"), p("?"), p("#")]);

function startsWithWindowsDriveLetter(input, pointer) {
  const length = input.length - pointer;
  return length >= 2 &&
    isWindowsDriveLetterCodePoints(input[pointer], input[pointer + 1]) &&
    (length === 2 || fileOtherwiseCodePoints.has(input[pointer + 2]));
}

URLStateMachine.prototype["parse file"] = function parseFile(c) {
  this.url.scheme = "file";
  this.url.host = "";

  if (c === p("/") || c === p("\\")) {
    if (c === p("\\")) {
      this.validationErrors?.push("invalid-reverse-solidus");
    }
    this.state = "file slash";
  } else if (this.base !== null && this.base.scheme === "file") {
    this.url.host = this.base.host;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    if (c === p("?")) {
      this.url.query = "";
      this.state = "query";
    } else if (c === p("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    } else if (!isNaN(c)) {
      this.url.query = null;
      if (!startsWithWindowsDriveLetter(this.input, this.pointer)) {
        shortenPath(this.url);
      } else {
        this.validationErrors?.push("file-invalid-Windows-drive-letter");
        this.url.path = [];
      }

      this.state = "path";
      --this.pointer;
    }
  } else {
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
  if (c === p("/") || c === p("\\")) {
    if (c === p("\\")) {
      this.validationErrors?.push("invalid-reverse-solidus");
    }
    this.state = "file host";
  } else {
    if (this.base !== null && this.base.scheme === "file") {
      if (!startsWithWindowsDriveLetter(this.input, this.pointer) &&
          isNormalizedWindowsDriveLetterString(this.base.path[0])) {
        this.url.path.push(this.base.path[0]);
      }
      this.url.host = this.base.host;
    }
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
  if (isNaN(c) || c === p("/") || c === p("\\") || c === p("?") || c === p("#")) {
    --this.pointer;
    if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
      this.validationErrors?.push("file-invalid-Windows-drive-letter-host");
      this.state = "path";
    } else if (this.buffer === "") {
      this.url.host = "";
      if (this.stateOverride) {
        return false;
      }
      this.state = "path start";
    } else {
      let host = parseHost(this.buffer, this.validationErrors, isNotSpecial(this.url));
      if (host === failure) {
        return failure;
      }
      if (host === "localhost") {
        host = "";
      }
      this.url.host = host;

      if (this.stateOverride) {
        return false;
      }

      this.buffer = "";
      this.state = "path start";
    }
  } else {
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
  if (isSpecial(this.url)) {
    if (c === p("\\")) {
      this.validationErrors?.push("invalid-reverse-solidus");
    }
    this.state = "path";

    if (c !== p("/") && c !== p("\\")) {
      --this.pointer;
    }
  } else if (!this.stateOverride && c === p("?")) {
    this.url.query = "";
    this.state = "query";
  } else if (!this.stateOverride && c === p("#")) {
    this.url.fragment = "";
    this.state = "fragment";
  } else if (c !== undefined) {
    this.state = "path";
    if (c !== p("/")) {
      --this.pointer;
    }
  } else if (this.stateOverride && this.url.host === null) {
    this.url.path.push("");
  }

  return true;
};

URLStateMachine.prototype["parse path"] = function parsePath(c) {
  if (isNaN(c) || c === p("/") || (isSpecial(this.url) && c === p("\\")) ||
      (!this.stateOverride && (c === p("?") || c === p("#")))) {
    if (isSpecial(this.url) && c === p("\\")) {
      this.validationErrors?.push("invalid-reverse-solidus");
    }

    if (isDoubleDot(this.buffer)) {
      shortenPath(this.url);
      if (c !== p("/") && !(isSpecial(this.url) && c === p("\\"))) {
        this.url.path.push("");
      }
    } else if (isSingleDot(this.buffer) && c !== p("/") &&
               !(isSpecial(this.url) && c === p("\\"))) {
      this.url.path.push("");
    } else if (!isSingleDot(this.buffer)) {
      if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
        this.buffer = `${this.buffer[0]}:`;
      }
      this.url.path.push(this.buffer);
    }
    this.buffer = "";
    if (c === p("?")) {
      this.url.query = "";
      this.state = "query";
    }
    if (c === p("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    }
  } else {
    this.validateURLUnit(c);

    this.buffer += utf8PercentEncodeCodePoint(c, isPathPercentEncode);
  }

  return true;
};

URLStateMachine.prototype["parse opaque path"] = function parseOpaquePath(c) {
  if (c === p("?")) {
    this.url.query = "";
    this.state = "query";
  } else if (c === p("#")) {
    this.url.fragment = "";
    this.state = "fragment";
  } else if (c === p(" ")) {
    this.validationErrors?.push("invalid-URL-unit");

    const remaining = this.input[this.pointer + 1];
    if (remaining === p("?") || remaining === p("#")) {
      this.url.path += "%20";
    } else {
      this.url.path += " ";
    }
  } else if (!isNaN(c)) {
    this.validateURLUnit(c);

    this.url.path += utf8PercentEncodeCodePoint(c, isC0ControlPercentEncode);
  }

  return true;
};

URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
  if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
    this.encoding = "utf-8";
  }

  if ((!this.stateOverride && c === p("#")) || isNaN(c)) {
    const percentEncodeSet = isSpecial(this.url) ? extraSpecialQueryPercentEncodeChars : extraQueryPercentEncodeChars;
    this.url.query += percentEncodeAfterEncoding(
      this.encoding,
      this.buffer,
      percentEncodeSet
    );

    this.buffer = "";

    if (c === p("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    }
  } else if (!isNaN(c)) {
    this.validateURLUnit(c);

    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
  if (!isNaN(c)) {
    this.validateURLUnit(c);

    this.url.fragment += utf8PercentEncodeCodePoint(c, isFragmentPercentEncode);
  }

  return true;
};

function serializeURL(url, excludeFragment) {
  let output = `${url.scheme}:`;
  if (url.host !== null) {
    output += "//";

    if (url.username !== "" || url.password !== "") {
      output += url.username;
      if (url.password !== "") {
        output += `:${url.password}`;
      }
      output += "@";
    }

    output += serializeHost(url.host);

    if (url.port !== null) {
      output += `:${url.port}`;
    }
  }

  if (url.host === null && !hasAnOpaquePath(url) && url.path.length > 1 && url.path[0] === "") {
    output += "/.";
  }
  output += serializePath(url);

  if (url.query !== null) {
    output += `?${url.query}`;
  }

  if (!excludeFragment && url.fragment !== null) {
    output += `#${url.fragment}`;
  }

  return output;
}

function serializeOrigin(tuple) {
  let result = `${tuple.scheme}://`;
  result += serializeHost(tuple.host);

  if (tuple.port !== null) {
    result += `:${tuple.port}`;
  }

  return result;
}

function serializePath(url) {
  if (hasAnOpaquePath(url)) {
    return url.path;
  }

  let output = "";
  for (const segment of url.path) {
    output += `/${segment}`;
  }
  return output;
}

module.exports.serializeURL = serializeURL;

module.exports.serializePath = serializePath;

module.exports.serializeURLOrigin = function (url) {
  // https://url.spec.whatwg.org/#concept-url-origin
  switch (url.scheme) {
    case "blob": {
      const pathURL = module.exports.parseURL(serializePath(url));
      if (pathURL === null) {
        return "null";
      }
      if (pathURL.scheme !== "http" && pathURL.scheme !== "https") {
        return "null";
      }
      return module.exports.serializeURLOrigin(pathURL);
    }
    case "ftp":
    case "http":
    case "https":
    case "ws":
    case "wss":
      return serializeOrigin({
        scheme: url.scheme,
        host: url.host,
        port: url.port
      });
    case "file":
      // The spec says:
      // > Unfortunate as it is, this is left as an exercise to the reader. When in doubt, return a new opaque origin.
      // Browsers tested so far:
      // - Chrome says "file://", but treats file: URLs as cross-origin for most (all?) purposes; see e.g.
      //   https://bugs.chromium.org/p/chromium/issues/detail?id=37586
      // - Firefox says "null", but treats file: URLs as same-origin sometimes based on directory stuff; see
      //   https://developer.mozilla.org/en-US/docs/Archive/Misc_top_level/Same-origin_policy_for_file:_URIs
      return "null";
    default:
      // serializing an opaque origin returns "null"
      return "null";
  }
};

function basicURLParse(input, options = {}, validationErrors = null) {
  const usm = new URLStateMachine(
    input,
    options.baseURL,
    options.encoding,
    options.url,
    options.stateOverride,
    validationErrors
  );
  if (usm.failure) {
    return null;
  }

  return usm.url;
}

module.exports.basicURLParse = function (input, options = {}) {
  return basicURLParse(input, options);
};

module.exports.setTheUsername = function (url, username) {
  url.username = utf8PercentEncodeString(username, isUserinfoPercentEncode);
};

module.exports.setThePassword = function (url, password) {
  url.password = utf8PercentEncodeString(password, isUserinfoPercentEncode);
};

module.exports.serializeHost = serializeHost;

module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;

module.exports.hasAnOpaquePath = hasAnOpaquePath;

module.exports.serializeInteger = function (integer) {
  return String(integer);
};

module.exports.parseURL = function (input, options = {}) {
  // We don't handle blobs, so this just delegates:
  return module.exports.basicURLParse(input, {
    baseURL: options.baseURL,
    encoding: options.encoding
  });
};

module.exports.parseURLWithValidationErrors = function (input, options = {}) {
  const validationErrors = [];

  // We don't handle blobs, so this just delegates:
  const url = basicURLParse(input, {
    baseURL: options.baseURL,
    encoding: options.encoding
  }, validationErrors);

  return { url, validationErrors };
};
