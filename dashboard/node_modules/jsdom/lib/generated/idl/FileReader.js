"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const Blob = require("./Blob.js");
const EventHandlerNonNull = require("./EventHandlerNonNull.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const EventTarget = require("./EventTarget.js");

const interfaceName = "FileReader";

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
  throw new globalObject.TypeError(`${context} is not of type 'FileReader'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["FileReader"].prototype;
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

const exposed = new Set(["Window", "Worker"]);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some(globalName => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class FileReader extends globalObject.EventTarget {
    constructor() {
      return exports.setup(Object.create(new.target.prototype), globalObject, undefined);
    }

    readAsArrayBuffer(blob) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'readAsArrayBuffer' called on an object that is not a valid instance of FileReader."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'readAsArrayBuffer' on 'FileReader': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = Blob.convert(globalObject, curArg, {
          context: "Failed to execute 'readAsArrayBuffer' on 'FileReader': parameter 1"
        });
        args.push(curArg);
      }
      return $impl.readAsArrayBuffer(...args);
    }

    readAsBinaryString(blob) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'readAsBinaryString' called on an object that is not a valid instance of FileReader."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'readAsBinaryString' on 'FileReader': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = Blob.convert(globalObject, curArg, {
          context: "Failed to execute 'readAsBinaryString' on 'FileReader': parameter 1"
        });
        args.push(curArg);
      }
      return $impl.readAsBinaryString(...args);
    }

    readAsText(blob) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'readAsText' called on an object that is not a valid instance of FileReader."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'readAsText' on 'FileReader': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = Blob.convert(globalObject, curArg, {
          context: "Failed to execute 'readAsText' on 'FileReader': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'readAsText' on 'FileReader': parameter 2",
            globals: globalObject
          });
        }
        args.push(curArg);
      }
      return $impl.readAsText(...args);
    }

    readAsDataURL(blob) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'readAsDataURL' called on an object that is not a valid instance of FileReader."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'readAsDataURL' on 'FileReader': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = Blob.convert(globalObject, curArg, {
          context: "Failed to execute 'readAsDataURL' on 'FileReader': parameter 1"
        });
        args.push(curArg);
      }
      return $impl.readAsDataURL(...args);
    }

    abort() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'abort' called on an object that is not a valid instance of FileReader.");
      }

      return $impl.abort();
    }

    get readyState() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get readyState' called on an object that is not a valid instance of FileReader."
        );
      }

      return $impl["readyState"];
    }

    get result() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get result' called on an object that is not a valid instance of FileReader."
        );
      }

      return utils.tryWrapperForImpl($impl["result"]);
    }

    get error() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get error' called on an object that is not a valid instance of FileReader.");
      }

      return utils.tryWrapperForImpl($impl["error"]);
    }

    get onloadstart() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onloadstart' called on an object that is not a valid instance of FileReader."
        );
      }

      return utils.tryWrapperForImpl($impl["onloadstart"]);
    }

    set onloadstart(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onloadstart' called on an object that is not a valid instance of FileReader."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onloadstart' property on 'FileReader': The provided value"
        });
      }
      $impl["onloadstart"] = V;
    }

    get onprogress() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onprogress' called on an object that is not a valid instance of FileReader."
        );
      }

      return utils.tryWrapperForImpl($impl["onprogress"]);
    }

    set onprogress(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onprogress' called on an object that is not a valid instance of FileReader."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onprogress' property on 'FileReader': The provided value"
        });
      }
      $impl["onprogress"] = V;
    }

    get onload() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onload' called on an object that is not a valid instance of FileReader."
        );
      }

      return utils.tryWrapperForImpl($impl["onload"]);
    }

    set onload(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onload' called on an object that is not a valid instance of FileReader."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onload' property on 'FileReader': The provided value"
        });
      }
      $impl["onload"] = V;
    }

    get onabort() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onabort' called on an object that is not a valid instance of FileReader."
        );
      }

      return utils.tryWrapperForImpl($impl["onabort"]);
    }

    set onabort(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onabort' called on an object that is not a valid instance of FileReader."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onabort' property on 'FileReader': The provided value"
        });
      }
      $impl["onabort"] = V;
    }

    get onerror() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onerror' called on an object that is not a valid instance of FileReader."
        );
      }

      return utils.tryWrapperForImpl($impl["onerror"]);
    }

    set onerror(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onerror' called on an object that is not a valid instance of FileReader."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onerror' property on 'FileReader': The provided value"
        });
      }
      $impl["onerror"] = V;
    }

    get onloadend() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onloadend' called on an object that is not a valid instance of FileReader."
        );
      }

      return utils.tryWrapperForImpl($impl["onloadend"]);
    }

    set onloadend(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onloadend' called on an object that is not a valid instance of FileReader."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onloadend' property on 'FileReader': The provided value"
        });
      }
      $impl["onloadend"] = V;
    }
  }
  Object.defineProperties(FileReader.prototype, {
    readAsArrayBuffer: { enumerable: true },
    readAsBinaryString: { enumerable: true },
    readAsText: { enumerable: true },
    readAsDataURL: { enumerable: true },
    abort: { enumerable: true },
    readyState: { enumerable: true },
    result: { enumerable: true },
    error: { enumerable: true },
    onloadstart: { enumerable: true },
    onprogress: { enumerable: true },
    onload: { enumerable: true },
    onabort: { enumerable: true },
    onerror: { enumerable: true },
    onloadend: { enumerable: true },
    [Symbol.toStringTag]: { value: "FileReader", configurable: true },
    EMPTY: { value: 0, enumerable: true },
    LOADING: { value: 1, enumerable: true },
    DONE: { value: 2, enumerable: true }
  });
  Object.defineProperties(FileReader, {
    EMPTY: { value: 0, enumerable: true },
    LOADING: { value: 1, enumerable: true },
    DONE: { value: 2, enumerable: true }
  });
  ctorRegistry[interfaceName] = FileReader;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: FileReader
  });
};

const Impl = require("../../jsdom/living/file-api/FileReader-impl.js");
