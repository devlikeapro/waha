"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const PointerEventInit = require("./PointerEventInit.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const MouseEvent = require("./MouseEvent.js");

const interfaceName = "PointerEvent";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => MouseEvent.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'PointerEvent'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["PointerEvent"].prototype;
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
  MouseEvent._internalSetup(wrapper, globalObject);
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
  class PointerEvent extends globalObject.MouseEvent {
    constructor(type) {
      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to construct 'PointerEvent': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to construct 'PointerEvent': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = PointerEventInit.convert(globalObject, curArg, {
          context: "Failed to construct 'PointerEvent': parameter 2"
        });
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    getCoalescedEvents() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'getCoalescedEvents' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return utils.tryWrapperForImpl($impl.getCoalescedEvents());
    }

    getPredictedEvents() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'getPredictedEvents' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return utils.tryWrapperForImpl($impl.getPredictedEvents());
    }

    get pointerId() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get pointerId' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["pointerId"];
    }

    get width() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get width' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["width"];
    }

    get height() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get height' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["height"];
    }

    get pressure() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get pressure' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["pressure"];
    }

    get tangentialPressure() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get tangentialPressure' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["tangentialPressure"];
    }

    get tiltX() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get tiltX' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["tiltX"];
    }

    get tiltY() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get tiltY' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["tiltY"];
    }

    get twist() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get twist' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["twist"];
    }

    get altitudeAngle() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get altitudeAngle' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["altitudeAngle"];
    }

    get azimuthAngle() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get azimuthAngle' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["azimuthAngle"];
    }

    get pointerType() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get pointerType' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["pointerType"];
    }

    get isPrimary() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get isPrimary' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["isPrimary"];
    }

    get persistentDeviceId() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get persistentDeviceId' called on an object that is not a valid instance of PointerEvent."
        );
      }

      return $impl["persistentDeviceId"];
    }
  }
  Object.defineProperties(PointerEvent.prototype, {
    getCoalescedEvents: { enumerable: true },
    getPredictedEvents: { enumerable: true },
    pointerId: { enumerable: true },
    width: { enumerable: true },
    height: { enumerable: true },
    pressure: { enumerable: true },
    tangentialPressure: { enumerable: true },
    tiltX: { enumerable: true },
    tiltY: { enumerable: true },
    twist: { enumerable: true },
    altitudeAngle: { enumerable: true },
    azimuthAngle: { enumerable: true },
    pointerType: { enumerable: true },
    isPrimary: { enumerable: true },
    persistentDeviceId: { enumerable: true },
    [Symbol.toStringTag]: { value: "PointerEvent", configurable: true }
  });
  ctorRegistry[interfaceName] = PointerEvent;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: PointerEvent
  });
};

const Impl = require("../../jsdom/living/events/PointerEvent-impl.js");
