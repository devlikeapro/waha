"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const Node = require("./Node.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "TreeWalker";

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
  throw new globalObject.TypeError(`${context} is not of type 'TreeWalker'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["TreeWalker"].prototype;
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
  class TreeWalker {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    parentNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'parentNode' called on an object that is not a valid instance of TreeWalker."
        );
      }

      return utils.tryWrapperForImpl($impl.parentNode());
    }

    firstChild() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'firstChild' called on an object that is not a valid instance of TreeWalker."
        );
      }

      return utils.tryWrapperForImpl($impl.firstChild());
    }

    lastChild() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'lastChild' called on an object that is not a valid instance of TreeWalker.");
      }

      return utils.tryWrapperForImpl($impl.lastChild());
    }

    previousSibling() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'previousSibling' called on an object that is not a valid instance of TreeWalker."
        );
      }

      return utils.tryWrapperForImpl($impl.previousSibling());
    }

    nextSibling() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'nextSibling' called on an object that is not a valid instance of TreeWalker."
        );
      }

      return utils.tryWrapperForImpl($impl.nextSibling());
    }

    previousNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'previousNode' called on an object that is not a valid instance of TreeWalker."
        );
      }

      return utils.tryWrapperForImpl($impl.previousNode());
    }

    nextNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'nextNode' called on an object that is not a valid instance of TreeWalker.");
      }

      return utils.tryWrapperForImpl($impl.nextNode());
    }

    get root() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get root' called on an object that is not a valid instance of TreeWalker.");
      }

      return utils.getSameObject(this, "root", () => {
        return utils.tryWrapperForImpl($impl["root"]);
      });
    }

    get whatToShow() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get whatToShow' called on an object that is not a valid instance of TreeWalker."
        );
      }

      return $impl["whatToShow"];
    }

    get filter() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get filter' called on an object that is not a valid instance of TreeWalker."
        );
      }

      return utils.tryWrapperForImpl($impl["filter"]);
    }

    get currentNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get currentNode' called on an object that is not a valid instance of TreeWalker."
        );
      }

      return utils.tryWrapperForImpl($impl["currentNode"]);
    }

    set currentNode(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set currentNode' called on an object that is not a valid instance of TreeWalker."
        );
      }

      V = Node.convert(globalObject, V, {
        context: "Failed to set the 'currentNode' property on 'TreeWalker': The provided value"
      });

      $impl["currentNode"] = V;
    }
  }
  Object.defineProperties(TreeWalker.prototype, {
    parentNode: { enumerable: true },
    firstChild: { enumerable: true },
    lastChild: { enumerable: true },
    previousSibling: { enumerable: true },
    nextSibling: { enumerable: true },
    previousNode: { enumerable: true },
    nextNode: { enumerable: true },
    root: { enumerable: true },
    whatToShow: { enumerable: true },
    filter: { enumerable: true },
    currentNode: { enumerable: true },
    [Symbol.toStringTag]: { value: "TreeWalker", configurable: true }
  });
  ctorRegistry[interfaceName] = TreeWalker;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: TreeWalker
  });
};

const Impl = require("../../jsdom/living/traversal/TreeWalker-impl.js");
