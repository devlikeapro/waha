"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const Attr = require("./Attr.js");
const ceReactionsPreSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPreSteps;
const ceReactionsPostSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPostSteps;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "NamedNodeMap";

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
  throw new globalObject.TypeError(`${context} is not of type 'NamedNodeMap'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["NamedNodeMap"].prototype;
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
  class NamedNodeMap {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    item(index) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'item' called on an object that is not a valid instance of NamedNodeMap.");
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'item' on 'NamedNodeMap': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'item' on 'NamedNodeMap': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.item(...args));
    }

    getNamedItem(qualifiedName) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'getNamedItem' called on an object that is not a valid instance of NamedNodeMap."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'getNamedItem' on 'NamedNodeMap': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getNamedItem' on 'NamedNodeMap': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.getNamedItem(...args));
    }

    getNamedItemNS(namespace, localName) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'getNamedItemNS' called on an object that is not a valid instance of NamedNodeMap."
        );
      }

      if (arguments.length < 2) {
        throw new globalObject.TypeError(
          `Failed to execute 'getNamedItemNS' on 'NamedNodeMap': 2 arguments required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'getNamedItemNS' on 'NamedNodeMap': parameter 1",
            globals: globalObject
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getNamedItemNS' on 'NamedNodeMap': parameter 2",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.getNamedItemNS(...args));
    }

    setNamedItem(attr) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'setNamedItem' called on an object that is not a valid instance of NamedNodeMap."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'setNamedItem' on 'NamedNodeMap': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = Attr.convert(globalObject, curArg, {
          context: "Failed to execute 'setNamedItem' on 'NamedNodeMap': parameter 1"
        });
        args.push(curArg);
      }
      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return utils.tryWrapperForImpl($impl.setNamedItem(...args));
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    setNamedItemNS(attr) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'setNamedItemNS' called on an object that is not a valid instance of NamedNodeMap."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'setNamedItemNS' on 'NamedNodeMap': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = Attr.convert(globalObject, curArg, {
          context: "Failed to execute 'setNamedItemNS' on 'NamedNodeMap': parameter 1"
        });
        args.push(curArg);
      }
      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return utils.tryWrapperForImpl($impl.setNamedItemNS(...args));
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    removeNamedItem(qualifiedName) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'removeNamedItem' called on an object that is not a valid instance of NamedNodeMap."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'removeNamedItem' on 'NamedNodeMap': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'removeNamedItem' on 'NamedNodeMap': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return utils.tryWrapperForImpl($impl.removeNamedItem(...args));
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    removeNamedItemNS(namespace, localName) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'removeNamedItemNS' called on an object that is not a valid instance of NamedNodeMap."
        );
      }

      if (arguments.length < 2) {
        throw new globalObject.TypeError(
          `Failed to execute 'removeNamedItemNS' on 'NamedNodeMap': 2 arguments required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'removeNamedItemNS' on 'NamedNodeMap': parameter 1",
            globals: globalObject
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'removeNamedItemNS' on 'NamedNodeMap': parameter 2",
          globals: globalObject
        });
        args.push(curArg);
      }
      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return utils.tryWrapperForImpl($impl.removeNamedItemNS(...args));
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get length() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get length' called on an object that is not a valid instance of NamedNodeMap."
        );
      }

      return $impl["length"];
    }
  }
  Object.defineProperties(NamedNodeMap.prototype, {
    item: { enumerable: true },
    getNamedItem: { enumerable: true },
    getNamedItemNS: { enumerable: true },
    setNamedItem: { enumerable: true },
    setNamedItemNS: { enumerable: true },
    removeNamedItem: { enumerable: true },
    removeNamedItemNS: { enumerable: true },
    length: { enumerable: true },
    [Symbol.toStringTag]: { value: "NamedNodeMap", configurable: true },
    [Symbol.iterator]: { value: globalObject.Array.prototype[Symbol.iterator], configurable: true, writable: true }
  });
  ctorRegistry[interfaceName] = NamedNodeMap;

  // Only internally created wrappers have targets known to be ordinary objects. Caller-supplied
  // wrappers passed to `setup()` can be proxies, so their handlers must not probe the target's prototype.
  proxyHandlerCache.set(globalObject, {
    ordinary: new ProxyHandler(globalObject, NamedNodeMap.prototype),
    other: new ProxyHandler(globalObject, null)
  });

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: NamedNodeMap
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
    let ignoreNamedProps = false;

    if (utils.isArrayIndexPropName(P)) {
      const index = P >>> 0;

      const indexedValue = impl.item(index);
      if (indexedValue !== null) {
        return utils.tryWrapperForImpl(indexedValue);
      }

      ignoreNamedProps = true;
    }

    if (
      !ignoreNamedProps &&
      !(
        this._interfacePrototype !== null &&
        Object.getPrototypeOf(target) === this._interfacePrototype &&
        Object.hasOwn(this._interfacePrototype, P)
      )
    ) {
      const namedValue = impl.getNamedItem(P);
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

    if (
      !ignoreNamedProps &&
      !(
        this._interfacePrototype !== null &&
        Object.getPrototypeOf(target) === this._interfacePrototype &&
        Object.hasOwn(this._interfacePrototype, P)
      )
    ) {
      const namedValue = impl.getNamedItem(P);
      if (namedValue !== null && !(P in target)) {
        return {
          writable: false,
          enumerable: false,
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
      const creating = !(impl.getNamedItem(P) !== null);
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

    if (impl.getNamedItem(P) !== null && !(P in target)) {
      return false;
    }

    return Reflect.deleteProperty(target, P);
  }

  preventExtensions() {
    return false;
  }
}

const Impl = require("../../jsdom/living/attributes/NamedNodeMap-impl.js");
