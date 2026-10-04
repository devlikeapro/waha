"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const EventHandlerNonNull = require("./EventHandlerNonNull.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const EventTarget = require("./EventTarget.js");

const interfaceName = "XMLHttpRequestEventTarget";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => EventTarget.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'XMLHttpRequestEventTarget'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["XMLHttpRequestEventTarget"].prototype;
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
  EventTarget._internalSetup(wrapper, globalObject);
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

const exposed = new Set(["Window", "DedicatedWorker", "SharedWorker"]);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some(globalName => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class XMLHttpRequestEventTarget extends globalObject.EventTarget {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    get onloadstart() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onloadstart' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      return utils.tryWrapperForImpl($impl["onloadstart"]);
    }

    set onloadstart(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onloadstart' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onloadstart' property on 'XMLHttpRequestEventTarget': The provided value"
        });
      }
      $impl["onloadstart"] = V;
    }

    get onprogress() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onprogress' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      return utils.tryWrapperForImpl($impl["onprogress"]);
    }

    set onprogress(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onprogress' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onprogress' property on 'XMLHttpRequestEventTarget': The provided value"
        });
      }
      $impl["onprogress"] = V;
    }

    get onabort() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onabort' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      return utils.tryWrapperForImpl($impl["onabort"]);
    }

    set onabort(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onabort' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onabort' property on 'XMLHttpRequestEventTarget': The provided value"
        });
      }
      $impl["onabort"] = V;
    }

    get onerror() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onerror' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      return utils.tryWrapperForImpl($impl["onerror"]);
    }

    set onerror(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onerror' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onerror' property on 'XMLHttpRequestEventTarget': The provided value"
        });
      }
      $impl["onerror"] = V;
    }

    get onload() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onload' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      return utils.tryWrapperForImpl($impl["onload"]);
    }

    set onload(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onload' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onload' property on 'XMLHttpRequestEventTarget': The provided value"
        });
      }
      $impl["onload"] = V;
    }

    get ontimeout() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ontimeout' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      return utils.tryWrapperForImpl($impl["ontimeout"]);
    }

    set ontimeout(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ontimeout' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ontimeout' property on 'XMLHttpRequestEventTarget': The provided value"
        });
      }
      $impl["ontimeout"] = V;
    }

    get onloadend() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onloadend' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      return utils.tryWrapperForImpl($impl["onloadend"]);
    }

    set onloadend(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onloadend' called on an object that is not a valid instance of XMLHttpRequestEventTarget."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onloadend' property on 'XMLHttpRequestEventTarget': The provided value"
        });
      }
      $impl["onloadend"] = V;
    }
  }
  Object.defineProperties(XMLHttpRequestEventTarget.prototype, {
    onloadstart: { enumerable: true },
    onprogress: { enumerable: true },
    onabort: { enumerable: true },
    onerror: { enumerable: true },
    onload: { enumerable: true },
    ontimeout: { enumerable: true },
    onloadend: { enumerable: true },
    [Symbol.toStringTag]: { value: "XMLHttpRequestEventTarget", configurable: true }
  });
  ctorRegistry[interfaceName] = XMLHttpRequestEventTarget;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: XMLHttpRequestEventTarget
  });
};

const Impl = require("../../jsdom/living/xhr/XMLHttpRequestEventTarget-impl.js");
