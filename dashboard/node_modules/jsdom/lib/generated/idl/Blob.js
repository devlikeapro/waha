"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const BlobPropertyBag = require("./BlobPropertyBag.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "Blob";

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
  throw new globalObject.TypeError(`${context} is not of type 'Blob'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["Blob"].prototype;
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

const exposed = new Set(["Window", "Worker"]);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some(globalName => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class Blob {
    constructor() {
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          if (!utils.isObject(curArg)) {
            throw new globalObject.TypeError("Failed to construct 'Blob': parameter 1" + " is not an iterable object.");
          } else {
            const V = [];
            const tmp = curArg;
            for (let nextItem of tmp) {
              if (exports.is(nextItem)) {
                nextItem = utils.implForWrapper(nextItem);
              } else if (utils.isArrayBuffer(nextItem)) {
                nextItem = conversions["ArrayBuffer"](nextItem, {
                  context: "Failed to construct 'Blob': parameter 1" + "'s element",
                  globals: globalObject
                });
              } else if (ArrayBuffer.isView(nextItem)) {
                nextItem = conversions["ArrayBufferView"](nextItem, {
                  context: "Failed to construct 'Blob': parameter 1" + "'s element",
                  globals: globalObject
                });
              } else {
                nextItem = conversions["USVString"](nextItem, {
                  context: "Failed to construct 'Blob': parameter 1" + "'s element",
                  globals: globalObject
                });
              }
              V.push(nextItem);
            }
            curArg = V;
          }
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = BlobPropertyBag.convert(globalObject, curArg, { context: "Failed to construct 'Blob': parameter 2" });
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    slice() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'slice' called on an object that is not a valid instance of Blob.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["long long"](curArg, {
            context: "Failed to execute 'slice' on 'Blob': parameter 1",
            globals: globalObject,
            clamp: true
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["long long"](curArg, {
            context: "Failed to execute 'slice' on 'Blob': parameter 2",
            globals: globalObject,
            clamp: true
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'slice' on 'Blob': parameter 3",
            globals: globalObject
          });
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.slice(...args));
    }

    text() {
      try {
        const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
        if ($impl === null) {
          throw new globalObject.TypeError("'text' called on an object that is not a valid instance of Blob.");
        }

        return utils.tryWrapperForImpl($impl.text());
      } catch (e) {
        return globalObject.Promise.reject(e);
      }
    }

    arrayBuffer() {
      try {
        const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
        if ($impl === null) {
          throw new globalObject.TypeError("'arrayBuffer' called on an object that is not a valid instance of Blob.");
        }

        return utils.tryWrapperForImpl($impl.arrayBuffer());
      } catch (e) {
        return globalObject.Promise.reject(e);
      }
    }

    bytes() {
      try {
        const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
        if ($impl === null) {
          throw new globalObject.TypeError("'bytes' called on an object that is not a valid instance of Blob.");
        }

        return utils.tryWrapperForImpl($impl.bytes());
      } catch (e) {
        return globalObject.Promise.reject(e);
      }
    }

    get size() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get size' called on an object that is not a valid instance of Blob.");
      }

      return $impl["size"];
    }

    get type() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get type' called on an object that is not a valid instance of Blob.");
      }

      return $impl["type"];
    }
  }
  Object.defineProperties(Blob.prototype, {
    slice: { enumerable: true },
    text: { enumerable: true },
    arrayBuffer: { enumerable: true },
    bytes: { enumerable: true },
    size: { enumerable: true },
    type: { enumerable: true },
    [Symbol.toStringTag]: { value: "Blob", configurable: true }
  });
  ctorRegistry[interfaceName] = Blob;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: Blob
  });
};

const Impl = require("../../jsdom/living/file-api/Blob-impl.js");
