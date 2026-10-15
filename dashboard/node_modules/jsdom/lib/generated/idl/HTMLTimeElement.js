"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const HTMLConstructor_jsdom_living_helpers_html_constructor =
  require("../../jsdom/living/helpers/html-constructor.js").HTMLConstructor;
const ceReactionsPreSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPreSteps;
const ceReactionsPostSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPostSteps;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const HTMLElement = require("./HTMLElement.js");

const interfaceName = "HTMLTimeElement";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => HTMLElement.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'HTMLTimeElement'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["HTMLTimeElement"].prototype;
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
  HTMLElement._internalSetup(wrapper, globalObject);
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
  class HTMLTimeElement extends globalObject.HTMLElement {
    constructor() {
      return HTMLConstructor_jsdom_living_helpers_html_constructor(globalObject, interfaceName, new.target);
    }

    get dateTime() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get dateTime' called on an object that is not a valid instance of HTMLTimeElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("datetime");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set dateTime(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set dateTime' called on an object that is not a valid instance of HTMLTimeElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'dateTime' property on 'HTMLTimeElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("datetime", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }
  }
  Object.defineProperties(HTMLTimeElement.prototype, {
    dateTime: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLTimeElement", configurable: true }
  });
  ctorRegistry[interfaceName] = HTMLTimeElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HTMLTimeElement
  });
};

const Impl = require("../../jsdom/living/nodes/HTMLTimeElement-impl.js");
