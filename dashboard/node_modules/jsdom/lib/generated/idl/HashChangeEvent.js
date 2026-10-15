"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const HashChangeEventInit = require("./HashChangeEventInit.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const Event = require("./Event.js");

const interfaceName = "HashChangeEvent";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => Event.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'HashChangeEvent'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["HashChangeEvent"].prototype;
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
  Event._internalSetup(wrapper, globalObject);
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
  class HashChangeEvent extends globalObject.Event {
    constructor(type) {
      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to construct 'HashChangeEvent': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to construct 'HashChangeEvent': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = HashChangeEventInit.convert(globalObject, curArg, {
          context: "Failed to construct 'HashChangeEvent': parameter 2"
        });
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    get oldURL() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oldURL' called on an object that is not a valid instance of HashChangeEvent."
        );
      }

      return $impl["oldURL"];
    }

    get newURL() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get newURL' called on an object that is not a valid instance of HashChangeEvent."
        );
      }

      return $impl["newURL"];
    }
  }
  Object.defineProperties(HashChangeEvent.prototype, {
    oldURL: { enumerable: true },
    newURL: { enumerable: true },
    [Symbol.toStringTag]: { value: "HashChangeEvent", configurable: true }
  });
  ctorRegistry[interfaceName] = HashChangeEvent;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HashChangeEvent
  });
};

const Impl = require("../../jsdom/living/events/HashChangeEvent-impl.js");
