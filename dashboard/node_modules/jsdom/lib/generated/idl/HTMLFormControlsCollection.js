"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const HTMLCollection = require("./HTMLCollection.js");

const interfaceName = "HTMLFormControlsCollection";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => HTMLCollection.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'HTMLFormControlsCollection'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["HTMLFormControlsCollection"].prototype;
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

exports._internalSetup = (wrapper, globalObject) => {
  HTMLCollection._internalSetup(wrapper, globalObject);
};

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
  class HTMLFormControlsCollection extends globalObject.HTMLCollection {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    namedItem(name) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'namedItem' called on an object that is not a valid instance of HTMLFormControlsCollection."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'namedItem' on 'HTMLFormControlsCollection': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'namedItem' on 'HTMLFormControlsCollection': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.namedItem(...args));
    }
  }
  Object.defineProperties(HTMLFormControlsCollection.prototype, {
    namedItem: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLFormControlsCollection", configurable: true },
    [Symbol.iterator]: { value: globalObject.Array.prototype[Symbol.iterator], configurable: true, writable: true }
  });
  ctorRegistry[interfaceName] = HTMLFormControlsCollection;

  // Only internally created wrappers have targets known to be ordinary objects. Caller-supplied
  // wrappers passed to `setup()` can be proxies, so their handlers must not probe the target's prototype.
  proxyHandlerCache.set(globalObject, {
    ordinary: new ProxyHandler(globalObject, [
      ctorRegistry["HTMLFormControlsCollection"].prototype,
      ctorRegistry["HTMLCollection"].prototype
    ]),
    other: new ProxyHandler(globalObject, [])
  });

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HTMLFormControlsCollection
  });
};

const proxyHandlerCache = new WeakMap();
class ProxyHandler {
  constructor(globalObject, interfacePrototypes) {
    this._globalObject = globalObject;
    this._interfacePrototypes = interfacePrototypes;
  }

  _hasPrototypeProperty(target, P) {
    // The prototypes captured during installation are ordinary. Check each live link before
    // inspecting the next prototype so later changes cannot introduce observable Proxy traps.
    for (let i = 0; i < this._interfacePrototypes.length; ++i) {
      const prototype = this._interfacePrototypes[i];
      if (Object.getPrototypeOf(target) !== prototype) {
        return false;
      }
      if (Object.hasOwn(prototype, P)) {
        return true;
      }
      target = prototype;
    }
    return false;
  }

  get(target, P, receiver) {
    if (typeof P === "symbol") {
      return Reflect.get(target, P, receiver);
    }
    const impl = utils.implForWrapper(target);
    let ignoreNamedProps = false;

    if (utils.isArrayIndexPropName(P)) {
      const index = P >>> 0;

      const indexedValue = impl.item(index);
      if (indexedValue !== null) {
        return utils.tryWrapperForImpl(indexedValue);
      }

      ignoreNamedProps = true;
    }

    if (!ignoreNamedProps && !this._hasPrototypeProperty(target, P)) {
      const namedValue = impl.namedItem(P);
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

    for (const key of impl[utils.supportedPropertyIndices]) {
      keys.add(`${key}`);
    }

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
    let ignoreNamedProps = false;

    if (utils.isArrayIndexPropName(P)) {
      const index = P >>> 0;

      const indexedValue = impl.item(index);
      if (indexedValue !== null) {
        return {
          writable: false,
          enumerable: true,
          configurable: true,
          value: utils.tryWrapperForImpl(indexedValue)
        };
      }

      ignoreNamedProps = true;
    }

    if (!ignoreNamedProps && !this._hasPrototypeProperty(target, P)) {
      const namedValue = impl.namedItem(P);
      if (namedValue !== null && !(P in target)) {
        return {
          writable: false,
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
    }
    let ownDesc;

    if (utils.isArrayIndexPropName(P)) {
      const index = P >>> 0;
      const indexedValue = impl.item(index);
      if (indexedValue !== null) {
        ownDesc = {
          writable: false,
          enumerable: true,
          configurable: true,
          value: utils.tryWrapperForImpl(indexedValue)
        };
      }
    }

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

    if (utils.isArrayIndexPropName(P)) {
      return false;
    }
    if (!Object.hasOwn(target, P)) {
      const creating = !(impl.namedItem(P) !== null);
      if (!creating) {
        return false;
      }
    }
    return Reflect.defineProperty(target, P, desc);
  }

  deleteProperty(target, P) {
    if (typeof P === "symbol") {
      return Reflect.deleteProperty(target, P);
    }
    const impl = utils.implForWrapper(target);

    const globalObject = this._globalObject;

    if (utils.isArrayIndexPropName(P)) {
      const index = P >>> 0;
      return !(impl.item(index) !== null);
    }

    if (impl.namedItem(P) !== null && !(P in target)) {
      return false;
    }

    return Reflect.deleteProperty(target, P);
  }

  preventExtensions() {
    return false;
  }
}

const Impl = require("../../jsdom/living/nodes/HTMLFormControlsCollection-impl.js");
