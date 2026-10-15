"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const TextDecoderOptions = require("./TextDecoderOptions.js");
const TextDecodeOptions = require("./TextDecodeOptions.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "TextDecoder";

const $interfaceDescriptor = utils.createInterfaceDescriptor();
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
  throw new globalObject.TypeError(`${context} is not of type 'TextDecoder'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["TextDecoder"].prototype;
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

exports._internalSetup = (wrapper, globalObject) => {};

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
  class TextDecoder {
    constructor() {
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to construct 'TextDecoder': parameter 1",
            globals: globalObject
          });
        } else {
          curArg = "utf-8";
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = TextDecoderOptions.convert(globalObject, curArg, {
          context: "Failed to construct 'TextDecoder': parameter 2"
        });
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    decode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'decode' called on an object that is not a valid instance of TextDecoder.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          if (utils.isArrayBuffer(curArg)) {
            curArg = conversions["ArrayBuffer"](curArg, {
              context: "Failed to execute 'decode' on 'TextDecoder': parameter 1",
              globals: globalObject
            });
          } else if (utils.isSharedArrayBuffer(curArg)) {
            curArg = conversions["SharedArrayBuffer"](curArg, {
              context: "Failed to execute 'decode' on 'TextDecoder': parameter 1",
              globals: globalObject
            });
          } else if (ArrayBuffer.isView(curArg)) {
            curArg = conversions["ArrayBufferView"](curArg, {
              context: "Failed to execute 'decode' on 'TextDecoder': parameter 1",
              globals: globalObject,
              allowShared: true
            });
          } else {
            throw new globalObject.TypeError(
              "Failed to execute 'decode' on 'TextDecoder': parameter 1" + " is not of any supported type."
            );
          }
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = TextDecodeOptions.convert(globalObject, curArg, {
          context: "Failed to execute 'decode' on 'TextDecoder': parameter 2"
        });
        args.push(curArg);
      }
      return $impl.decode(...args);
    }

    get encoding() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get encoding' called on an object that is not a valid instance of TextDecoder."
        );
      }

      return $impl["encoding"];
    }

    get fatal() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get fatal' called on an object that is not a valid instance of TextDecoder."
        );
      }

      return $impl["fatal"];
    }

    get ignoreBOM() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ignoreBOM' called on an object that is not a valid instance of TextDecoder."
        );
      }

      return $impl["ignoreBOM"];
    }
  }
  Object.defineProperties(TextDecoder.prototype, {
    decode: { enumerable: true },
    encoding: { enumerable: true },
    fatal: { enumerable: true },
    ignoreBOM: { enumerable: true },
    [Symbol.toStringTag]: { value: "TextDecoder", configurable: true }
  });
  ctorRegistry[interfaceName] = TextDecoder;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: TextDecoder
  });
};

const Impl = require("../../jsdom/living/encoding/TextDecoder-impl.js");
