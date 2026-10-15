"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "Storage";

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
  throw new globalObject.TypeError(`${context} is not of type 'Storage'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["Storage"].prototype;
  }

  return Object.create(proto);
}

function makeProxy(wrapper, impl, globalObject, isOrdinary) {
  const handlers = proxyHandlerCache.get(globalObject);
  const proxyHandler = isOrdinary ? handlers.ordinary : handlers.other;
  // The target needs an implementation for proxy traps, but only the final proxy gets the interface brand.
  utils.registerWrapper(wrapper, impl, undefined);
  return new Proxy(wrapper, proxyHandler);
}

exports.create = (globalObject, constructorArgs, privateData) => {
  const wrapper = makeWrapper(globalObject);
  return setup(wrapper, globalObject, constructorArgs, privateData, true);
};

exports.createImpl = (globalObject, constructorArgs, privateData) => {
  const wrapper = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(wrapper);
};

exports._internalSetup = (wrapper, globalObject) => {};

const setup = (wrapper, globalObject, constructorArgs = [], privateData = {}, isOrdinary = false) => {
  privateData.wrapper = wrapper;

  exports._internalSetup(wrapper, globalObject);
  const impl = new Impl.implementation(globalObject, constructorArgs, privateData);

  wrapper = makeProxy(wrapper, impl, globalObject, isOrdinary);

  utils.registerWrapper(wrapper, impl, $interfaceDescriptor);
  impl[utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(impl);
  }
  return wrapper;
};
exports.setup = setup;

exports.new = (globalObject, newTarget) => {
  let wrapper = makeWrapper(globalObject, newTarget);

  exports._internalSetup(wrapper, globalObject);
  const impl = Object.create(Impl.implementation.prototype);
  wrapper = makeProxy(wrapper, impl, globalObject, true);

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
  class Storage {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    key(index) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'key' called on an object that is not a valid instance of Storage.");
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'key' on 'Storage': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'key' on 'Storage': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return $impl.key(...args);
    }

    getItem(key) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'getItem' called on an object that is not a valid instance of Storage.");
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'getItem' on 'Storage': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getItem' on 'Storage': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return $impl.getItem(...args);
    }

    setItem(key, value) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'setItem' called on an object that is not a valid instance of Storage.");
      }

      if (arguments.length < 2) {
        throw new globalObject.TypeError(
          `Failed to execute 'setItem' on 'Storage': 2 arguments required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'setItem' on 'Storage': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'setItem' on 'Storage': parameter 2",
          globals: globalObject
        });
        args.push(curArg);
      }
      return $impl.setItem(...args);
    }

    removeItem(key) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'removeItem' called on an object that is not a valid instance of Storage.");
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'removeItem' on 'Storage': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'removeItem' on 'Storage': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return $impl.removeItem(...args);
    }

    clear() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'clear' called on an object that is not a valid instance of Storage.");
      }

      return $impl.clear();
    }

    get length() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get length' called on an object that is not a valid instance of Storage.");
      }

      return $impl["length"];
    }
  }
  Object.defineProperties(Storage.prototype, {
    key: { enumerable: true },
    getItem: { enumerable: true },
    setItem: { enumerable: true },
    removeItem: { enumerable: true },
    clear: { enumerable: true },
    length: { enumerable: true },
    [Symbol.toStringTag]: { value: "Storage", configurable: true }
  });
  ctorRegistry[interfaceName] = Storage;

  // Only internally created wrappers have targets known to be ordinary objects. Caller-supplied
  // wrappers passed to `setup()` can be proxies, so their handlers must not probe the target's prototype.
  proxyHandlerCache.set(globalObject, {
    ordinary: new ProxyHandler(globalObject, Storage.prototype),
    other: new ProxyHandler(globalObject, null)
  });

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: Storage
  });
};

const proxyHandlerCache = new WeakMap();
class ProxyHandler {
  constructor(globalObject, interfacePrototype) {
    this._globalObject = globalObject;
    this._interfacePrototype = interfacePrototype;
  }

  get(target, P, receiver) {
    if (typeof P === "symbol") {
      return Reflect.get(target, P, receiver);
    }
    const impl = utils.implForWrapper(target);

    if (
      !(
        this._interfacePrototype !== null &&
        Object.getPrototypeOf(target) === this._interfacePrototype &&
        Object.hasOwn(this._interfacePrototype, P)
      )
    ) {
      const namedValue = impl.getItem(P);
      if (namedValue !== null && !(P in target)) {
        return utils.tryWrapperForImpl(namedValue);
      }
    }

    return Reflect.get(target, P, receiver);
  }

  has(target, P) {
    if (typeof P === "symbol") {
      return Reflect.has(target, P);
    }
    const desc = this.getOwnPropertyDescriptor(target, P);
    if (desc !== undefined) {
      return true;
    }
    const parent = Object.getPrototypeOf(target);
    if (parent !== null) {
      return Reflect.has(parent, P);
    }
    return false;
  }

  ownKeys(target) {
    const impl = utils.implForWrapper(target);
    const keys = new Set();

    for (const key of impl[utils.supportedPropertyNames]) {
      if (!(key in target)) {
        keys.add(`${key}`);
      }
    }

    for (const key of Reflect.ownKeys(target)) {
      keys.add(key);
    }
    return [...keys];
  }

  getOwnPropertyDescriptor(target, P) {
    if (typeof P === "symbol") {
      return Reflect.getOwnPropertyDescriptor(target, P);
    }
    const impl = utils.implForWrapper(target);

    if (
      !(
        this._interfacePrototype !== null &&
        Object.getPrototypeOf(target) === this._interfacePrototype &&
        Object.hasOwn(this._interfacePrototype, P)
      )
    ) {
      const namedValue = impl.getItem(P);
      if (namedValue !== null && !(P in target)) {
        return {
          writable: true,
          enumerable: true,
          configurable: true,
          value: utils.tryWrapperForImpl(namedValue)
        };
      }
    }

    return Reflect.getOwnPropertyDescriptor(target, P);
  }

  set(target, P, V, receiver) {
    if (typeof P === "symbol") {
      return Reflect.set(target, P, V, receiver);
    }
    const impl = utils.implForWrapper(target);
    // The `receiver` argument refers to the Proxy exotic object or an object
    // that inherits from it, whereas `target` refers to the Proxy target:
    if (utils.wrapperForImpl(impl) === receiver) {
      const globalObject = this._globalObject;

      if (typeof P === "string") {
        let namedValue = V;

        namedValue = conversions["DOMString"](namedValue, {
          context: "Failed to set the '" + P + "' property on 'Storage': The provided value",
          globals: globalObject
        });

        impl.setItem(P, namedValue);

        return true;
      }
    }
    let ownDesc;

    if (ownDesc === undefined) {
      ownDesc = Reflect.getOwnPropertyDescriptor(target, P);
    }
    return utils.ordinarySetWithOwnDescriptor(target, P, V, receiver, ownDesc);
  }

  defineProperty(target, P, desc) {
    if (typeof P === "symbol") {
      return Reflect.defineProperty(target, P, desc);
    }
    const impl = utils.implForWrapper(target);

    const globalObject = this._globalObject;
    if (!Object.hasOwn(target, P)) {
      if (desc.get || desc.set) {
        return false;
      }

      let namedValue = desc.value;

      namedValue = conversions["DOMString"](namedValue, {
        context: "Failed to set the '" + P + "' property on 'Storage': The provided value",
        globals: globalObject
      });

      impl.setItem(P, namedValue);

      return true;
    }
    return Reflect.defineProperty(target, P, desc);
  }

  deleteProperty(target, P) {
    if (typeof P === "symbol") {
      return Reflect.deleteProperty(target, P);
    }
    const impl = utils.implForWrapper(target);

    const globalObject = this._globalObject;

    if (impl.getItem(P) !== null && !(P in target)) {
      impl.removeItem(P);
      return true;
    }

    return Reflect.deleteProperty(target, P);
  }

  preventExtensions() {
    return false;
  }
}

const Impl = require("../../jsdom/living/webstorage/Storage-impl.js");
