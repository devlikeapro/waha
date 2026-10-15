"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "SVGPreserveAspectRatio";

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
  throw new globalObject.TypeError(`${context} is not of type 'SVGPreserveAspectRatio'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["SVGPreserveAspectRatio"].prototype;
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
  class SVGPreserveAspectRatio {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    get align() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get align' called on an object that is not a valid instance of SVGPreserveAspectRatio."
        );
      }

      return $impl["align"];
    }

    set align(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set align' called on an object that is not a valid instance of SVGPreserveAspectRatio."
        );
      }

      V = conversions["unsigned short"](V, {
        context: "Failed to set the 'align' property on 'SVGPreserveAspectRatio': The provided value",
        globals: globalObject
      });

      $impl["align"] = V;
    }

    get meetOrSlice() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get meetOrSlice' called on an object that is not a valid instance of SVGPreserveAspectRatio."
        );
      }

      return $impl["meetOrSlice"];
    }

    set meetOrSlice(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set meetOrSlice' called on an object that is not a valid instance of SVGPreserveAspectRatio."
        );
      }

      V = conversions["unsigned short"](V, {
        context: "Failed to set the 'meetOrSlice' property on 'SVGPreserveAspectRatio': The provided value",
        globals: globalObject
      });

      $impl["meetOrSlice"] = V;
    }
  }
  Object.defineProperties(SVGPreserveAspectRatio.prototype, {
    align: { enumerable: true },
    meetOrSlice: { enumerable: true },
    [Symbol.toStringTag]: { value: "SVGPreserveAspectRatio", configurable: true },
    SVG_PRESERVEASPECTRATIO_UNKNOWN: { value: 0, enumerable: true },
    SVG_PRESERVEASPECTRATIO_NONE: { value: 1, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMINYMIN: { value: 2, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMIDYMIN: { value: 3, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMAXYMIN: { value: 4, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMINYMID: { value: 5, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMIDYMID: { value: 6, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMAXYMID: { value: 7, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMINYMAX: { value: 8, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMIDYMAX: { value: 9, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMAXYMAX: { value: 10, enumerable: true },
    SVG_MEETORSLICE_UNKNOWN: { value: 0, enumerable: true },
    SVG_MEETORSLICE_MEET: { value: 1, enumerable: true },
    SVG_MEETORSLICE_SLICE: { value: 2, enumerable: true }
  });
  Object.defineProperties(SVGPreserveAspectRatio, {
    SVG_PRESERVEASPECTRATIO_UNKNOWN: { value: 0, enumerable: true },
    SVG_PRESERVEASPECTRATIO_NONE: { value: 1, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMINYMIN: { value: 2, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMIDYMIN: { value: 3, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMAXYMIN: { value: 4, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMINYMID: { value: 5, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMIDYMID: { value: 6, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMAXYMID: { value: 7, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMINYMAX: { value: 8, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMIDYMAX: { value: 9, enumerable: true },
    SVG_PRESERVEASPECTRATIO_XMAXYMAX: { value: 10, enumerable: true },
    SVG_MEETORSLICE_UNKNOWN: { value: 0, enumerable: true },
    SVG_MEETORSLICE_MEET: { value: 1, enumerable: true },
    SVG_MEETORSLICE_SLICE: { value: 2, enumerable: true }
  });
  ctorRegistry[interfaceName] = SVGPreserveAspectRatio;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: SVGPreserveAspectRatio
  });
};

const Impl = require("../../jsdom/living/svg/SVGPreserveAspectRatio-impl.js");
