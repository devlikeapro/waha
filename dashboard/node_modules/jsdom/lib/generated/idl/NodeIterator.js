"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "NodeIterator";

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
  throw new globalObject.TypeError(`${context} is not of type 'NodeIterator'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["NodeIterator"].prototype;
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
  class NodeIterator {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    nextNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'nextNode' called on an object that is not a valid instance of NodeIterator."
        );
      }

      return utils.tryWrapperForImpl($impl.nextNode());
    }

    previousNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'previousNode' called on an object that is not a valid instance of NodeIterator."
        );
      }

      return utils.tryWrapperForImpl($impl.previousNode());
    }

    detach() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'detach' called on an object that is not a valid instance of NodeIterator.");
      }

      return $impl.detach();
    }

    get root() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get root' called on an object that is not a valid instance of NodeIterator."
        );
      }

      return utils.getSameObject(this, "root", () => {
        return utils.tryWrapperForImpl($impl["root"]);
      });
    }

    get referenceNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get referenceNode' called on an object that is not a valid instance of NodeIterator."
        );
      }

      return utils.tryWrapperForImpl($impl["referenceNode"]);
    }

    get pointerBeforeReferenceNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get pointerBeforeReferenceNode' called on an object that is not a valid instance of NodeIterator."
        );
      }

      return $impl["pointerBeforeReferenceNode"];
    }

    get whatToShow() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get whatToShow' called on an object that is not a valid instance of NodeIterator."
        );
      }

      return $impl["whatToShow"];
    }

    get filter() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get filter' called on an object that is not a valid instance of NodeIterator."
        );
      }

      return utils.tryWrapperForImpl($impl["filter"]);
    }
  }
  Object.defineProperties(NodeIterator.prototype, {
    nextNode: { enumerable: true },
    previousNode: { enumerable: true },
    detach: { enumerable: true },
    root: { enumerable: true },
    referenceNode: { enumerable: true },
    pointerBeforeReferenceNode: { enumerable: true },
    whatToShow: { enumerable: true },
    filter: { enumerable: true },
    [Symbol.toStringTag]: { value: "NodeIterator", configurable: true }
  });
  ctorRegistry[interfaceName] = NodeIterator;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: NodeIterator
  });
};

const Impl = require("../../jsdom/living/traversal/NodeIterator-impl.js");
