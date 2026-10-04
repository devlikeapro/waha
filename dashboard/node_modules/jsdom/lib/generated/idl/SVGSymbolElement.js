"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const create_SVGAnimatedRect = require("./SVGAnimatedRect.js").create;
const create_SVGAnimatedPreserveAspectRatio = require("./SVGAnimatedPreserveAspectRatio.js").create;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const SVGGraphicsElement = require("./SVGGraphicsElement.js");

const interfaceName = "SVGSymbolElement";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => SVGGraphicsElement.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'SVGSymbolElement'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["SVGSymbolElement"].prototype;
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
  SVGGraphicsElement._internalSetup(wrapper, globalObject);
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
  class SVGSymbolElement extends globalObject.SVGGraphicsElement {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    get viewBox() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get viewBox' called on an object that is not a valid instance of SVGSymbolElement."
        );
      }

      return utils.getSameObject(this, "viewBox", () => {
        return create_SVGAnimatedRect(globalObject, [], {
          element: $impl,
          attribute: "viewBox"
        });
      });
    }

    get preserveAspectRatio() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get preserveAspectRatio' called on an object that is not a valid instance of SVGSymbolElement."
        );
      }

      return utils.getSameObject(this, "preserveAspectRatio", () => {
        return create_SVGAnimatedPreserveAspectRatio(globalObject, [], {
          element: $impl
        });
      });
    }
  }
  Object.defineProperties(SVGSymbolElement.prototype, {
    viewBox: { enumerable: true },
    preserveAspectRatio: { enumerable: true },
    [Symbol.toStringTag]: { value: "SVGSymbolElement", configurable: true }
  });
  ctorRegistry[interfaceName] = SVGSymbolElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: SVGSymbolElement
  });
};

const Impl = require("../../jsdom/living/nodes/SVGSymbolElement-impl.js");
