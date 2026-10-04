"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const create_SVGAnimatedRect = require("./SVGAnimatedRect.js").create;
const create_SVGAnimatedPreserveAspectRatio = require("./SVGAnimatedPreserveAspectRatio.js").create;
const EventHandlerNonNull = require("./EventHandlerNonNull.js");
const OnBeforeUnloadEventHandlerNonNull = require("./OnBeforeUnloadEventHandlerNonNull.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const SVGGraphicsElement = require("./SVGGraphicsElement.js");

const interfaceName = "SVGSVGElement";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => SVGGraphicsElement.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'SVGSVGElement'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["SVGSVGElement"].prototype;
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
  SVGGraphicsElement._internalSetup(wrapper, globalObject);
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
  class SVGSVGElement extends globalObject.SVGGraphicsElement {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    createSVGNumber() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'createSVGNumber' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl.createSVGNumber());
    }

    createSVGRect() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'createSVGRect' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl.createSVGRect());
    }

    getElementById(elementId) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'getElementById' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'getElementById' on 'SVGSVGElement': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'getElementById' on 'SVGSVGElement': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.getElementById(...args));
    }

    suspendRedraw(maxWaitMilliseconds) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'suspendRedraw' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'suspendRedraw' on 'SVGSVGElement': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'suspendRedraw' on 'SVGSVGElement': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return $impl.suspendRedraw(...args);
    }

    unsuspendRedraw(suspendHandleID) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'unsuspendRedraw' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'unsuspendRedraw' on 'SVGSVGElement': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'unsuspendRedraw' on 'SVGSVGElement': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return $impl.unsuspendRedraw(...args);
    }

    unsuspendRedrawAll() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'unsuspendRedrawAll' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return $impl.unsuspendRedrawAll();
    }

    forceRedraw() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'forceRedraw' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return $impl.forceRedraw();
    }

    get viewBox() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get viewBox' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.getSameObject(this, "viewBox", () => {
        return create_SVGAnimatedRect(globalObject, [], {
          element: $impl,
          attribute: "viewBox"
        });
      });
    }

    get preserveAspectRatio() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get preserveAspectRatio' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.getSameObject(this, "preserveAspectRatio", () => {
        return create_SVGAnimatedPreserveAspectRatio(globalObject, [], {
          element: $impl
        });
      });
    }

    get onafterprint() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onafterprint' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onafterprint"]);
    }

    set onafterprint(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onafterprint' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onafterprint' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onafterprint"] = V;
    }

    get onbeforeprint() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onbeforeprint' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onbeforeprint"]);
    }

    set onbeforeprint(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onbeforeprint' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onbeforeprint' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onbeforeprint"] = V;
    }

    get onbeforeunload() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onbeforeunload' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onbeforeunload"]);
    }

    set onbeforeunload(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onbeforeunload' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = OnBeforeUnloadEventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onbeforeunload' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onbeforeunload"] = V;
    }

    get onhashchange() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onhashchange' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onhashchange"]);
    }

    set onhashchange(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onhashchange' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onhashchange' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onhashchange"] = V;
    }

    get onlanguagechange() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onlanguagechange' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onlanguagechange"]);
    }

    set onlanguagechange(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onlanguagechange' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onlanguagechange' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onlanguagechange"] = V;
    }

    get onmessage() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onmessage' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onmessage"]);
    }

    set onmessage(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onmessage' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmessage' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onmessage"] = V;
    }

    get onmessageerror() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onmessageerror' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onmessageerror"]);
    }

    set onmessageerror(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onmessageerror' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmessageerror' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onmessageerror"] = V;
    }

    get onoffline() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onoffline' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onoffline"]);
    }

    set onoffline(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onoffline' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onoffline' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onoffline"] = V;
    }

    get ononline() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ononline' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ononline"]);
    }

    set ononline(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ononline' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ononline' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["ononline"] = V;
    }

    get onpagehide() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpagehide' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpagehide"]);
    }

    set onpagehide(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpagehide' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpagehide' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onpagehide"] = V;
    }

    get onpageshow() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpageshow' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpageshow"]);
    }

    set onpageshow(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpageshow' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpageshow' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onpageshow"] = V;
    }

    get onpopstate() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpopstate' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpopstate"]);
    }

    set onpopstate(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpopstate' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpopstate' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onpopstate"] = V;
    }

    get onrejectionhandled() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onrejectionhandled' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onrejectionhandled"]);
    }

    set onrejectionhandled(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onrejectionhandled' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onrejectionhandled' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onrejectionhandled"] = V;
    }

    get onstorage() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onstorage' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onstorage"]);
    }

    set onstorage(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onstorage' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onstorage' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onstorage"] = V;
    }

    get onunhandledrejection() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onunhandledrejection' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onunhandledrejection"]);
    }

    set onunhandledrejection(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onunhandledrejection' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onunhandledrejection' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onunhandledrejection"] = V;
    }

    get onunload() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onunload' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onunload"]);
    }

    set onunload(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onunload' called on an object that is not a valid instance of SVGSVGElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onunload' property on 'SVGSVGElement': The provided value"
        });
      }
      $impl["onunload"] = V;
    }
  }
  Object.defineProperties(SVGSVGElement.prototype, {
    createSVGNumber: { enumerable: true },
    createSVGRect: { enumerable: true },
    getElementById: { enumerable: true },
    suspendRedraw: { enumerable: true },
    unsuspendRedraw: { enumerable: true },
    unsuspendRedrawAll: { enumerable: true },
    forceRedraw: { enumerable: true },
    viewBox: { enumerable: true },
    preserveAspectRatio: { enumerable: true },
    onafterprint: { enumerable: true },
    onbeforeprint: { enumerable: true },
    onbeforeunload: { enumerable: true },
    onhashchange: { enumerable: true },
    onlanguagechange: { enumerable: true },
    onmessage: { enumerable: true },
    onmessageerror: { enumerable: true },
    onoffline: { enumerable: true },
    ononline: { enumerable: true },
    onpagehide: { enumerable: true },
    onpageshow: { enumerable: true },
    onpopstate: { enumerable: true },
    onrejectionhandled: { enumerable: true },
    onstorage: { enumerable: true },
    onunhandledrejection: { enumerable: true },
    onunload: { enumerable: true },
    [Symbol.toStringTag]: { value: "SVGSVGElement", configurable: true }
  });
  ctorRegistry[interfaceName] = SVGSVGElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: SVGSVGElement
  });
};

const Impl = require("../../jsdom/living/nodes/SVGSVGElement-impl.js");
