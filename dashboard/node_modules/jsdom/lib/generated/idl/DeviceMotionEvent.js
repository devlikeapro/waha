"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const DeviceMotionEventInit = require("./DeviceMotionEventInit.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const Event = require("./Event.js");

const interfaceName = "DeviceMotionEvent";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => Event.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'DeviceMotionEvent'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["DeviceMotionEvent"].prototype;
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
  Event._internalSetup(wrapper, globalObject);
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
  class DeviceMotionEvent extends globalObject.Event {
    constructor(type) {
      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to construct 'DeviceMotionEvent': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to construct 'DeviceMotionEvent': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = DeviceMotionEventInit.convert(globalObject, curArg, {
          context: "Failed to construct 'DeviceMotionEvent': parameter 2"
        });
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    get acceleration() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get acceleration' called on an object that is not a valid instance of DeviceMotionEvent."
        );
      }

      return utils.tryWrapperForImpl($impl["acceleration"]);
    }

    get accelerationIncludingGravity() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get accelerationIncludingGravity' called on an object that is not a valid instance of DeviceMotionEvent."
        );
      }

      return utils.tryWrapperForImpl($impl["accelerationIncludingGravity"]);
    }

    get rotationRate() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get rotationRate' called on an object that is not a valid instance of DeviceMotionEvent."
        );
      }

      return utils.tryWrapperForImpl($impl["rotationRate"]);
    }

    get interval() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get interval' called on an object that is not a valid instance of DeviceMotionEvent."
        );
      }

      return $impl["interval"];
    }
  }
  Object.defineProperties(DeviceMotionEvent.prototype, {
    acceleration: { enumerable: true },
    accelerationIncludingGravity: { enumerable: true },
    rotationRate: { enumerable: true },
    interval: { enumerable: true },
    [Symbol.toStringTag]: { value: "DeviceMotionEvent", configurable: true }
  });
  ctorRegistry[interfaceName] = DeviceMotionEvent;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: DeviceMotionEvent
  });
};

const Impl = require("../../jsdom/living/events/DeviceMotionEvent-impl.js");
