"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const EventHandlerNonNull = require("./EventHandlerNonNull.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const EventTarget = require("./EventTarget.js");

const interfaceName = "AbortSignal";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => EventTarget.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'AbortSignal'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["AbortSignal"].prototype;
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
  EventTarget._internalSetup(wrapper, globalObject);
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

const exposed = new Set(["Window", "Worker"]);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some(globalName => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class AbortSignal extends globalObject.EventTarget {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    throwIfAborted() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'throwIfAborted' called on an object that is not a valid instance of AbortSignal."
        );
      }

      return $impl.throwIfAborted();
    }

    get aborted() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get aborted' called on an object that is not a valid instance of AbortSignal."
        );
      }

      return $impl["aborted"];
    }

    get reason() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get reason' called on an object that is not a valid instance of AbortSignal."
        );
      }

      return $impl["reason"];
    }

    get onabort() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onabort' called on an object that is not a valid instance of AbortSignal."
        );
      }

      return utils.tryWrapperForImpl($impl["onabort"]);
    }

    set onabort(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onabort' called on an object that is not a valid instance of AbortSignal."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onabort' property on 'AbortSignal': The provided value"
        });
      }
      $impl["onabort"] = V;
    }

    static abort() {
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["any"](curArg, {
            context: "Failed to execute 'abort' on 'AbortSignal': parameter 1",
            globals: globalObject
          });
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(Impl.implementation.abort(globalObject, ...args));
    }

    static timeout(milliseconds) {
      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'timeout' on 'AbortSignal': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long long"](curArg, {
          context: "Failed to execute 'timeout' on 'AbortSignal': parameter 1",
          globals: globalObject,
          enforceRange: true
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(Impl.implementation.timeout(globalObject, ...args));
    }

    static any(signals) {
      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'any' on 'AbortSignal': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (!utils.isObject(curArg)) {
          throw new globalObject.TypeError(
            "Failed to execute 'any' on 'AbortSignal': parameter 1" + " is not an iterable object."
          );
        } else {
          const V = [];
          const tmp = curArg;
          for (let nextItem of tmp) {
            nextItem = exports.convert(globalObject, nextItem, {
              context: "Failed to execute 'any' on 'AbortSignal': parameter 1" + "'s element"
            });

            V.push(nextItem);
          }
          curArg = V;
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(Impl.implementation.any(globalObject, ...args));
    }
  }
  Object.defineProperties(AbortSignal.prototype, {
    throwIfAborted: { enumerable: true },
    aborted: { enumerable: true },
    reason: { enumerable: true },
    onabort: { enumerable: true },
    [Symbol.toStringTag]: { value: "AbortSignal", configurable: true }
  });
  Object.defineProperties(AbortSignal, {
    abort: { enumerable: true },
    timeout: { enumerable: true },
    any: { enumerable: true }
  });
  ctorRegistry[interfaceName] = AbortSignal;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: AbortSignal
  });
};

const Impl = require("../../jsdom/living/aborting/AbortSignal-impl.js");
