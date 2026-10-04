"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const CustomElementConstructor = require("./CustomElementConstructor.js");
const ElementDefinitionOptions = require("./ElementDefinitionOptions.js");
const ceReactionsPreSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPreSteps;
const ceReactionsPostSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPostSteps;
const Node = require("./Node.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "CustomElementRegistry";

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
  throw new globalObject.TypeError(`${context} is not of type 'CustomElementRegistry'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["CustomElementRegistry"].prototype;
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
  class CustomElementRegistry {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    define(name, constructor) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'define' called on an object that is not a valid instance of CustomElementRegistry."
        );
      }

      if (arguments.length < 2) {
        throw new globalObject.TypeError(
          `Failed to execute 'define' on 'CustomElementRegistry': 2 arguments required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'define' on 'CustomElementRegistry': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = CustomElementConstructor.convert(globalObject, curArg, {
          context: "Failed to execute 'define' on 'CustomElementRegistry': parameter 2"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        curArg = ElementDefinitionOptions.convert(globalObject, curArg, {
          context: "Failed to execute 'define' on 'CustomElementRegistry': parameter 3"
        });
        args.push(curArg);
      }
      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl.define(...args);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get(name) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get' called on an object that is not a valid instance of CustomElementRegistry."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'get' on 'CustomElementRegistry': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'get' on 'CustomElementRegistry': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return $impl.get(...args);
    }

    getName(constructor) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'getName' called on an object that is not a valid instance of CustomElementRegistry."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'getName' on 'CustomElementRegistry': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = CustomElementConstructor.convert(globalObject, curArg, {
          context: "Failed to execute 'getName' on 'CustomElementRegistry': parameter 1"
        });
        args.push(curArg);
      }
      return $impl.getName(...args);
    }

    whenDefined(name) {
      try {
        const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
        if ($impl === null) {
          throw new globalObject.TypeError(
            "'whenDefined' called on an object that is not a valid instance of CustomElementRegistry."
          );
        }

        if (arguments.length < 1) {
          throw new globalObject.TypeError(
            `Failed to execute 'whenDefined' on 'CustomElementRegistry': 1 argument required, but only ${arguments.length} present.`
          );
        }
        const args = [];
        {
          let curArg = arguments[0];
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'whenDefined' on 'CustomElementRegistry': parameter 1",
            globals: globalObject
          });
          args.push(curArg);
        }
        return utils.tryWrapperForImpl($impl.whenDefined(...args));
      } catch (e) {
        return globalObject.Promise.reject(e);
      }
    }

    upgrade(root) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'upgrade' called on an object that is not a valid instance of CustomElementRegistry."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'upgrade' on 'CustomElementRegistry': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = Node.convert(globalObject, curArg, {
          context: "Failed to execute 'upgrade' on 'CustomElementRegistry': parameter 1"
        });
        args.push(curArg);
      }
      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl.upgrade(...args);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }
  }
  Object.defineProperties(CustomElementRegistry.prototype, {
    define: { enumerable: true },
    get: { enumerable: true },
    getName: { enumerable: true },
    whenDefined: { enumerable: true },
    upgrade: { enumerable: true },
    [Symbol.toStringTag]: { value: "CustomElementRegistry", configurable: true }
  });
  ctorRegistry[interfaceName] = CustomElementRegistry;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: CustomElementRegistry
  });
};

const Impl = require("../../jsdom/living/custom-elements/CustomElementRegistry-impl.js");
