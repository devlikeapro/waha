"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const MutationCallback = require("./MutationCallback.js");
const Node = require("./Node.js");
const MutationObserverInit = require("./MutationObserverInit.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "MutationObserver";

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
  throw new globalObject.TypeError(`${context} is not of type 'MutationObserver'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["MutationObserver"].prototype;
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
  class MutationObserver {
    constructor(callback) {
      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to construct 'MutationObserver': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = MutationCallback.convert(globalObject, curArg, {
          context: "Failed to construct 'MutationObserver': parameter 1"
        });
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    observe(target) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'observe' called on an object that is not a valid instance of MutationObserver."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'observe' on 'MutationObserver': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = Node.convert(globalObject, curArg, {
          context: "Failed to execute 'observe' on 'MutationObserver': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = MutationObserverInit.convert(globalObject, curArg, {
          context: "Failed to execute 'observe' on 'MutationObserver': parameter 2"
        });
        args.push(curArg);
      }
      return $impl.observe(...args);
    }

    disconnect() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'disconnect' called on an object that is not a valid instance of MutationObserver."
        );
      }

      return $impl.disconnect();
    }

    takeRecords() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'takeRecords' called on an object that is not a valid instance of MutationObserver."
        );
      }

      return utils.tryWrapperForImpl($impl.takeRecords());
    }
  }
  Object.defineProperties(MutationObserver.prototype, {
    observe: { enumerable: true },
    disconnect: { enumerable: true },
    takeRecords: { enumerable: true },
    [Symbol.toStringTag]: { value: "MutationObserver", configurable: true }
  });
  ctorRegistry[interfaceName] = MutationObserver;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: MutationObserver
  });
};

const Impl = require("../../jsdom/living/mutation-observer/MutationObserver-impl.js");
