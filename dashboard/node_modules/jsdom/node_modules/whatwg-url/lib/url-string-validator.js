"use strict";

const infra = require("./infra");
const {
  domainParser,
  endsInANumber,
  failure,
  forbiddenHostCodePoints,
  isPercentEncodedByteAt,
  isSpecialSchemeExceptFile,
  isURLCodePoint,
  p
} = require("./url-miscellaneous");
const { hasAnOpaquePath } = require("./url-state-machine");

const pathSegmentExcludedCodePoints = new Set([p("/"), p("?")]);
const opaquePathExcludedCodePoints = new Set([p("?")]);

function splitOffFragment(input) {
  const fragmentStart = input.indexOf("#");

  if (fragmentStart === -1) {
    return { beforeFragment: input, fragment: null };
  }

  return {
    beforeFragment: input.substring(0, fragmentStart),
    fragment: input.substring(fragmentStart + 1)
  };
}

function splitOffQuery(input) {
  const queryStart = input.indexOf("?");

  if (queryStart === -1) {
    return { beforeQuery: input, query: null };
  }

  return {
    beforeQuery: input.substring(0, queryStart),
    query: input.substring(queryStart + 1)
  };
}

function isValidURLString(input, options = {}) {
  const baseURL = options.baseURL ?? null;

  return isValidAbsoluteURLWithFragmentString(input) ||
    (baseURL !== null && isValidRelativeURLWithFragmentString(input, baseURL));
}

function isValidAbsoluteURLWithFragmentString(input) {
  const { beforeFragment, fragment } = splitOffFragment(input);

  return (fragment === null || isValidURLFragmentString(fragment)) && isValidAbsoluteURLString(beforeFragment);
}

function isValidAbsoluteURLString(input) {
  const { beforeQuery, query } = splitOffQuery(input);

  if (query !== null && !isValidURLQueryString(query)) {
    return false;
  }

  const schemeMatch = /^([A-Za-z][A-Za-z0-9+.-]*):/u.exec(beforeQuery);
  if (schemeMatch === null) {
    return false;
  }

  const scheme = schemeMatch[1].toLowerCase();
  const afterScheme = beforeQuery.substring(schemeMatch[0].length);

  if (isSpecialSchemeExceptFile(scheme)) {
    return isValidSchemeRelativeSpecialURLString(afterScheme);
  }
  if (scheme === "file") {
    return isValidSchemeRelativeFileURLString(afterScheme);
  }

  return isValidSchemeRelativeURLString(afterScheme) ||
    isValidPathAbsoluteNonAuthorityURLString(afterScheme) ||
    isValidOpaquePathURLString(afterScheme);
}

function isValidRelativeURLWithFragmentString(input, baseURL) {
  if (hasAnOpaquePath(baseURL)) {
    return input.startsWith("#") && isValidURLFragmentString(input.substring(1));
  }

  const { beforeFragment, fragment } = splitOffFragment(input);

  return isValidRelativeURLString(beforeFragment, baseURL) &&
    (fragment === null || isValidURLFragmentString(fragment));
}

function isValidRelativeURLString(input, baseURL) {
  const { beforeQuery, query } = splitOffQuery(input);
  const hasValidQuery = query === null || isValidURLQueryString(query);

  if (isValidPathAbsoluteNonAuthorityURLString(beforeQuery)) {
    return hasValidQuery;
  }

  if (isValidPathRelativeSchemeLessURLString(beforeQuery)) {
    return hasValidQuery;
  }

  if (isSpecialSchemeExceptFile(baseURL.scheme)) {
    return isValidSchemeRelativeSpecialURLString(beforeQuery) && hasValidQuery;
  }

  if (baseURL.scheme === "file") {
    return isValidSchemeRelativeFileURLString(beforeQuery) && hasValidQuery;
  }

  return isValidSchemeRelativeURLString(beforeQuery) && hasValidQuery;
}

function isValidSchemeRelativeSpecialURLString(input) {
  if (!input.startsWith("//")) {
    return false;
  }

  const { authority, path } = splitOffPath(input.substring(2));

  return isValidHostAndPortString(authority, isValidHostString) &&
    (path === null || isValidPathAbsoluteURLString(path));
}

function isValidSchemeRelativeURLString(input) {
  if (!input.startsWith("//")) {
    return false;
  }

  const { authority, path } = splitOffPath(input.substring(2));

  return isValidOpaqueHostAndPortString(authority) &&
    (path === null || isValidPathAbsoluteURLString(path));
}

function isValidSchemeRelativeFileURLString(input) {
  if (!input.startsWith("//")) {
    return false;
  }

  const afterSlashes = input.substring(2);

  return afterSlashes === "" ||
    isValidHostAndPathAbsoluteURLString(afterSlashes) ||
    isValidPathAbsoluteURLString(afterSlashes);
}

function isValidHostAndPathAbsoluteURLString(input) {
  const { authority, path } = splitOffPath(input);

  return isValidHostString(authority) &&
    (path === null || isValidPathAbsoluteURLString(path));
}

function splitOffPath(input) {
  const pathStart = input.indexOf("/");

  if (pathStart === -1) {
    return { authority: input, path: null };
  }

  return {
    authority: input.substring(0, pathStart),
    path: input.substring(pathStart)
  };
}

function isValidHostAndPortString(input, isValidHost) {
  const parsed = splitHostAndPort(input);

  return parsed !== null &&
    parsed.host !== "" &&
    isValidHost(parsed.host) &&
    (parsed.port === null || isValidURLPortString(parsed.port));
}

function isValidOpaqueHostAndPortString(input) {
  if (input === "") {
    return true;
  }

  const parsed = splitHostAndPort(input);

  return parsed !== null &&
    parsed.host !== "" &&
    isValidOpaqueHostString(parsed.host) &&
    (parsed.port === null || isValidURLPortString(parsed.port));
}

function splitHostAndPort(input) {
  if (input.startsWith("[")) {
    const hostEnd = input.indexOf("]");
    if (hostEnd === -1) {
      return null;
    }

    const rest = input.substring(hostEnd + 1);
    if (rest !== "" && !rest.startsWith(":")) {
      return null;
    }

    return {
      host: input.substring(0, hostEnd + 1),
      port: rest === "" ? null : rest.substring(1)
    };
  }

  const portStart = input.indexOf(":");
  if (portStart === -1) {
    return { host: input, port: null };
  }

  return {
    host: input.substring(0, portStart),
    port: input.substring(portStart + 1)
  };
}

function isValidHostString(input) {
  return isValidDomainString(input) ||
    isValidIPv4AddressString(input) ||
    isValidBracketedIPv6AddressString(input);
}

function isValidDomainString(input) {
  const domain = domainParser(input, null, true);

  return domain !== failure && !endsInANumber(domain);
}

function isValidIPv4AddressString(input) {
  const pieces = input.split(".");

  return pieces.length === 4 && pieces.every(isValidIPv4AddressPieceString);
}

function isValidIPv4AddressPieceString(input) {
  if (input === "" || input.length > 3) {
    return false;
  }

  for (let i = 0; i < input.length; ++i) {
    if (!infra.isASCIIDigit(input.codePointAt(i))) {
      return false;
    }
  }

  if (input.length > 1 && input[0] === "0") {
    return false;
  }

  return Number(input) <= 255;
}

function isValidBracketedIPv6AddressString(input) {
  return input.startsWith("[") &&
    input.endsWith("]") &&
    isValidIPv6AddressString(input.substring(1, input.length - 1));
}

function isValidIPv6AddressString(input) {
  return getIPv6PiecesStringEffectiveLength(input) === 8 ||
    getIPv6PiecesAndIPv4StringEffectiveLength(input) === 8 ||
    isValidCompressedIPv6AddressString(input);
}

function isValidCompressedIPv6AddressString(input) {
  const compressionIndex = input.indexOf("::");
  if (compressionIndex === -1 || compressionIndex !== input.lastIndexOf("::")) {
    return false;
  }

  const preceding = input.substring(0, compressionIndex);
  const following = input.substring(compressionIndex + 2);

  const precedingLength = getOptionalIPv6PiecesStringEffectiveLength(preceding);
  const followingLength = getOptionalIPv6PiecesOrPiecesAndIPv4StringEffectiveLength(following);
  if (precedingLength === failure || followingLength === failure) {
    return false;
  }

  return precedingLength + followingLength <= 7;
}

function getOptionalIPv6PiecesStringEffectiveLength(input) {
  return input === "" ? 0 : getIPv6PiecesStringEffectiveLength(input);
}

function getOptionalIPv6PiecesOrPiecesAndIPv4StringEffectiveLength(input) {
  return input === "" ? 0 : getIPv6PiecesOrPiecesAndIPv4StringEffectiveLength(input);
}

function getIPv6PiecesOrPiecesAndIPv4StringEffectiveLength(input) {
  if (isValidIPv6PiecesString(input)) {
    return getIPv6PiecesStringEffectiveLength(input);
  }

  if (isValidIPv6PiecesAndIPv4String(input)) {
    return getIPv6PiecesAndIPv4StringEffectiveLength(input);
  }

  return failure;
}

function isValidIPv6PiecesAndIPv4String(input) {
  if (isValidIPv4AddressString(input)) {
    return true;
  }

  const ipv4SeparatorIndex = input.lastIndexOf(":");
  if (ipv4SeparatorIndex === -1) {
    return false;
  }

  return isValidIPv6PiecesString(input.substring(0, ipv4SeparatorIndex)) &&
    isValidIPv4AddressString(input.substring(ipv4SeparatorIndex + 1));
}

function getIPv6PiecesAndIPv4StringEffectiveLength(input) {
  if (!isValidIPv6PiecesAndIPv4String(input)) {
    return failure;
  }

  const ipv4SeparatorIndex = input.lastIndexOf(":");
  if (ipv4SeparatorIndex === -1) {
    return 2;
  }

  const piecesLength = getIPv6PiecesStringEffectiveLength(input.substring(0, ipv4SeparatorIndex));
  return piecesLength + 2;
}

function isValidIPv6PiecesString(input) {
  if (input === "") {
    return false;
  }

  const pieces = input.split(":");
  return pieces.every(isValidIPv6PieceString);
}

function getIPv6PiecesStringEffectiveLength(input) {
  return isValidIPv6PiecesString(input) ? input.split(":").length : failure;
}

function isValidIPv6PieceString(input) {
  if (input === "" || input.length > 4) {
    return false;
  }

  for (let i = 0; i < input.length; ++i) {
    if (!infra.isASCIIHex(input.codePointAt(i))) {
      return false;
    }
  }

  const value = parseInt(input, 16);
  return value <= 0xFFFF && (input.length === 1 || input[0] !== "0");
}

function isValidOpaqueHostString(input) {
  return isValidBracketedIPv6AddressString(input) ||
    (input !== "" && isValidURLUnits(input, forbiddenHostCodePoints));
}

function isValidURLPortString(input) {
  if (input === "") {
    return true;
  }
  if (!/^[0-9]+$/u.test(input)) {
    return false;
  }

  return Number(input) <= 65535;
}

function isValidPathAbsoluteURLString(input) {
  return input.startsWith("/") && input.substring(1).split("/").every(isValidURLPathSegmentString);
}

function isValidPathAbsoluteNonAuthorityURLString(input) {
  return isValidPathAbsoluteURLString(input) && !input.startsWith("//");
}

function isValidPathRelativeURLString(input) {
  return !input.startsWith("/") && input.split("/").every(isValidURLPathSegmentString);
}

function isValidURLPathSegmentString(input) {
  return isValidURLUnits(input, pathSegmentExcludedCodePoints);
}

function isValidPathRelativeSchemeLessURLString(input) {
  return isValidPathRelativeURLString(input) && !/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(input);
}

function isValidOpaquePathURLString(input) {
  return (input === "" || input[0] !== "/") && isValidURLUnits(input, opaquePathExcludedCodePoints);
}

function isValidURLQueryString(input) {
  return isValidURLUnits(input);
}

function isValidURLFragmentString(input) {
  return isValidURLUnits(input);
}

function isValidURLUnits(input, excludedCodePoints = new Set()) {
  for (let i = 0; i < input.length;) {
    if (input[i] === "%") {
      if (!isPercentEncodedByteAt(input, i)) {
        return false;
      }

      i += 3;
      continue;
    }

    const codePoint = input.codePointAt(i);
    if (!isURLCodePoint(codePoint) || excludedCodePoints.has(codePoint)) {
      return false;
    }

    i += codePoint > 0xFFFF ? 2 : 1;
  }

  return true;
}

module.exports = {
  isValidURLString
};
