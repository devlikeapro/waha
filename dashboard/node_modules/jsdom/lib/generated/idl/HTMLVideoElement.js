"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const HTMLConstructor_jsdom_living_helpers_html_constructor =
  require("../../jsdom/living/helpers/html-constructor.js").HTMLConstructor;
const parseNonNegativeInteger_jsdom_living_helpers_strings =
  require("../../jsdom/living/helpers/strings.js").parseNonNegativeInteger;
const ceReactionsPreSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPreSteps;
const ceReactionsPostSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPostSteps;
const serializeURLwhatwg_url = require("whatwg-url").serializeURL;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const HTMLMediaElement = require("./HTMLMediaElement.js");

const interfaceName = "HTMLVideoElement";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => HTMLMediaElement.interfaceDescriptor);
exports.interfaceDescriptor = $interfaceDescriptor;

exports.is = value => {
  return utils.implForWrapperWithInterface(value, $interfaceDescriptor) !== null;
};
exports.isImpl = value => {
  return utils.isObject(value) && value instanceof Impl.implementation;
};
exports.convert = (globalObject, value, { context = "The provided value" } = {}) => {
  const impl = utils.implForWrapperWithInterface(value, $interfaceDescriptor);
  if (impl !== null) {
    return impl;
  }
  throw new globalObject.TypeError(`${context} is not of type 'HTMLVideoElement'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["HTMLVideoElement"].prototype;
  }

  return Object.create(proto);
}

exports.create = (globalObject, constructorArgs, privateData) => {
  const wrapper = makeWrapper(globalObject);
  return exports.setup(wrapper, globalObject, constructorArgs, privateData);
};

exports.createImpl = (globalObject, constructorArgs, privateData) => {
  const wrapper = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(wrapper);
};

exports._internalSetup = (wrapper, globalObject) => {
  HTMLMediaElement._internalSetup(wrapper, globalObject);
};

exports.setup = (wrapper, globalObject, constructorArgs = [], privateData = {}) => {
  privateData.wrapper = wrapper;

  exports._internalSetup(wrapper, globalObject);
  const impl = new Impl.implementation(globalObject, constructorArgs, privateData);

  utils.registerWrapper(wrapper, impl, $interfaceDescriptor);
  impl[utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(impl);
  }
  return wrapper;
};

exports.new = (globalObject, newTarget) => {
  const wrapper = makeWrapper(globalObject, newTarget);

  exports._internalSetup(wrapper, globalObject);
  const impl = Object.create(Impl.implementation.prototype);

  utils.registerWrapper(wrapper, impl, $interfaceDescriptor);
  impl[utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(impl);
  }
  return impl;
};

const exposed = new Set(["Window"]);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some(globalName => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class HTMLVideoElement extends globalObject.HTMLMediaElement {
    constructor() {
      return HTMLConstructor_jsdom_living_helpers_html_constructor(globalObject, interfaceName, new.target);
    }

    get width() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get width' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        let value = $impl._reflectGetTheContentAttribute("width");
        if (value !== null) {
          value = parseNonNegativeInteger_jsdom_living_helpers_strings(value);
          if (value !== null && value >= 0 && value <= 2147483647) {
            return value;
          }
        }
        return 0;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set width(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set width' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'width' property on 'HTMLVideoElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const newValue = V <= 2147483647 && V >= 0 ? V : 0;
        $impl._reflectSetTheContentAttribute("width", String(newValue));
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get height() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get height' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        let value = $impl._reflectGetTheContentAttribute("height");
        if (value !== null) {
          value = parseNonNegativeInteger_jsdom_living_helpers_strings(value);
          if (value !== null && value >= 0 && value <= 2147483647) {
            return value;
          }
        }
        return 0;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set height(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set height' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'height' property on 'HTMLVideoElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const newValue = V <= 2147483647 && V >= 0 ? V : 0;
        $impl._reflectSetTheContentAttribute("height", String(newValue));
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get videoWidth() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get videoWidth' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      return $impl["videoWidth"];
    }

    get videoHeight() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get videoHeight' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      return $impl["videoHeight"];
    }

    get poster() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get poster' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const impl = $impl;
        const value = impl._reflectGetTheContentAttribute("poster");
        if (value === null) {
          return "";
        }

        const document = impl._ownerDocument;
        if (this._posterURLCacheKey === value && this._baseURLCache === document._baseURLCache) {
          return this._posterURLCache;
        }

        this._posterURLCacheKey = value;
        this._baseURLCache = document._baseURLCache;

        const urlRecord = document.encodingParseAURL(value);
        if (urlRecord !== null) {
          this._posterURLCache = serializeURLwhatwg_url(urlRecord);
          return this._posterURLCache;
        }
        this._posterURLCache = conversions.USVString(value);
        return this._posterURLCache;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set poster(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set poster' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'poster' property on 'HTMLVideoElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("poster", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get playsInline() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get playsInline' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl._reflectGetTheContentAttribute("playsinline") !== null;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set playsInline(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set playsInline' called on an object that is not a valid instance of HTMLVideoElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'playsInline' property on 'HTMLVideoElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        if (V) {
          $impl._reflectSetTheContentAttribute("playsinline", "");
        } else {
          $impl._reflectDeleteTheContentAttribute("playsinline");
        }
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }
  }
  Object.defineProperties(HTMLVideoElement.prototype, {
    width: { enumerable: true },
    height: { enumerable: true },
    videoWidth: { enumerable: true },
    videoHeight: { enumerable: true },
    poster: { enumerable: true },
    playsInline: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLVideoElement", configurable: true }
  });
  ctorRegistry[interfaceName] = HTMLVideoElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HTMLVideoElement
  });
};

const Impl = require("../../jsdom/living/nodes/HTMLVideoElement-impl.js");
