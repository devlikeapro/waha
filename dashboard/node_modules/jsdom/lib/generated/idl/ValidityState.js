"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "ValidityState";

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
  throw new globalObject.TypeError(`${context} is not of type 'ValidityState'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["ValidityState"].prototype;
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
  class ValidityState {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    get valueMissing() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get valueMissing' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["valueMissing"];
    }

    get typeMismatch() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get typeMismatch' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["typeMismatch"];
    }

    get patternMismatch() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get patternMismatch' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["patternMismatch"];
    }

    get tooLong() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get tooLong' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["tooLong"];
    }

    get tooShort() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get tooShort' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["tooShort"];
    }

    get rangeUnderflow() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get rangeUnderflow' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["rangeUnderflow"];
    }

    get rangeOverflow() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get rangeOverflow' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["rangeOverflow"];
    }

    get stepMismatch() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get stepMismatch' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["stepMismatch"];
    }

    get badInput() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get badInput' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["badInput"];
    }

    get customError() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get customError' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["customError"];
    }

    get valid() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get valid' called on an object that is not a valid instance of ValidityState."
        );
      }

      return $impl["valid"];
    }
  }
  Object.defineProperties(ValidityState.prototype, {
    valueMissing: { enumerable: true },
    typeMismatch: { enumerable: true },
    patternMismatch: { enumerable: true },
    tooLong: { enumerable: true },
    tooShort: { enumerable: true },
    rangeUnderflow: { enumerable: true },
    rangeOverflow: { enumerable: true },
    stepMismatch: { enumerable: true },
    badInput: { enumerable: true },
    customError: { enumerable: true },
    valid: { enumerable: true },
    [Symbol.toStringTag]: { value: "ValidityState", configurable: true }
  });
  ctorRegistry[interfaceName] = ValidityState;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: ValidityState
  });
};

const Impl = require("../../jsdom/living/constraint-validation/ValidityState-impl.js");
