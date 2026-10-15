"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const CSSRule = require("./CSSRule.js");

const interfaceName = "CSSNamespaceRule";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => CSSRule.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'CSSNamespaceRule'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["CSSNamespaceRule"].prototype;
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
  CSSRule._internalSetup(wrapper, globalObject);
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
  class CSSNamespaceRule extends globalObject.CSSRule {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    get namespaceURI() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get namespaceURI' called on an object that is not a valid instance of CSSNamespaceRule."
        );
      }

      return $impl["namespaceURI"];
    }

    get prefix() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get prefix' called on an object that is not a valid instance of CSSNamespaceRule."
        );
      }

      return $impl["prefix"];
    }
  }
  Object.defineProperties(CSSNamespaceRule.prototype, {
    namespaceURI: { enumerable: true },
    prefix: { enumerable: true },
    [Symbol.toStringTag]: { value: "CSSNamespaceRule", configurable: true }
  });
  ctorRegistry[interfaceName] = CSSNamespaceRule;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: CSSNamespaceRule
  });
};

const Impl = require("../../jsdom/living/css/CSSNamespaceRule-impl.js");
