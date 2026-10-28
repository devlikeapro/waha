"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "StyleSheet";

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
  throw new globalObject.TypeError(`${context} is not of type 'StyleSheet'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["StyleSheet"].prototype;
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
  class StyleSheet {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    get type() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get type' called on an object that is not a valid instance of StyleSheet.");
      }

      return utils.tryWrapperForImpl($impl["type"]);
    }

    get href() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get href' called on an object that is not a valid instance of StyleSheet.");
      }

      return $impl["href"];
    }

    get ownerNode() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ownerNode' called on an object that is not a valid instance of StyleSheet."
        );
      }

      return utils.tryWrapperForImpl($impl["ownerNode"]);
    }

    get parentStyleSheet() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get parentStyleSheet' called on an object that is not a valid instance of StyleSheet."
        );
      }

      return utils.tryWrapperForImpl($impl["parentStyleSheet"]);
    }

    get title() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get title' called on an object that is not a valid instance of StyleSheet.");
      }

      return $impl["title"];
    }

    get media() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get media' called on an object that is not a valid instance of StyleSheet.");
      }

      return utils.getSameObject(this, "media", () => {
        return utils.tryWrapperForImpl($impl["media"]);
      });
    }

    set media(V) {
      const esValue = this ?? globalObject;

      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'set media' called on an object that is not a valid instance of StyleSheet.");
      }

      const Q = esValue["media"];
      if (!utils.isObject(Q)) {
        throw new globalObject.TypeError("Property 'media' is not an object");
      }
      Reflect.set(Q, "mediaText", V);
    }

    get disabled() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get disabled' called on an object that is not a valid instance of StyleSheet."
        );
      }

      return $impl["disabled"];
    }

    set disabled(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set disabled' called on an object that is not a valid instance of StyleSheet."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'disabled' property on 'StyleSheet': The provided value",
        globals: globalObject
      });

      $impl["disabled"] = V;
    }
  }
  Object.defineProperties(StyleSheet.prototype, {
    type: { enumerable: true },
    href: { enumerable: true },
    ownerNode: { enumerable: true },
    parentStyleSheet: { enumerable: true },
    title: { enumerable: true },
    media: { enumerable: true },
    disabled: { enumerable: true },
    [Symbol.toStringTag]: { value: "StyleSheet", configurable: true }
  });
  ctorRegistry[interfaceName] = StyleSheet;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: StyleSheet
  });
};

const Impl = require("../../jsdom/living/css/StyleSheet-impl.js");
