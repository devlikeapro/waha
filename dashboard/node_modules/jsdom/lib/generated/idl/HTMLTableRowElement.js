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

const interfaceName = "HTMLTableRowElement";

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
  throw new globalObject.TypeError(`${context} is not of type 'HTMLTableRowElement'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["HTMLTableRowElement"].prototype;
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
  class HTMLTableRowElement extends globalObject.HTMLElement {
    constructor() {
      return HTMLConstructor_jsdom_living_helpers_html_constructor(globalObject, interfaceName, new.target);
    }

    insertCell() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'insertCell' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["long"](curArg, {
            context: "Failed to execute 'insertCell' on 'HTMLTableRowElement': parameter 1",
            globals: globalObject
          });
        } else {
          curArg = -1;
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.insertCell(...args));
    }

    deleteCell(index) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'deleteCell' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'deleteCell' on 'HTMLTableRowElement': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["long"](curArg, {
          context: "Failed to execute 'deleteCell' on 'HTMLTableRowElement': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl.deleteCell(...args);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get rowIndex() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get rowIndex' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      return $impl["rowIndex"];
    }

    get sectionRowIndex() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get sectionRowIndex' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      return $impl["sectionRowIndex"];
    }

    get cells() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get cells' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      return utils.getSameObject(this, "cells", () => {
        return utils.tryWrapperForImpl($impl["cells"]);
      });
    }

    get align() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get align' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("align");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set align(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set align' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'align' property on 'HTMLTableRowElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("align", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get ch() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ch' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("char");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set ch(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ch' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'ch' property on 'HTMLTableRowElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("char", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get chOff() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get chOff' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("charoff");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set chOff(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set chOff' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'chOff' property on 'HTMLTableRowElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("charoff", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get vAlign() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get vAlign' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("valign");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set vAlign(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set vAlign' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'vAlign' property on 'HTMLTableRowElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("valign", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get bgColor() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get bgColor' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("bgcolor");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set bgColor(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set bgColor' called on an object that is not a valid instance of HTMLTableRowElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'bgColor' property on 'HTMLTableRowElement': The provided value",
        globals: globalObject,
        treatNullAsEmptyString: true
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("bgcolor", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }
  }
  Object.defineProperties(HTMLTableRowElement.prototype, {
    insertCell: { enumerable: true },
    deleteCell: { enumerable: true },
    rowIndex: { enumerable: true },
    sectionRowIndex: { enumerable: true },
    cells: { enumerable: true },
    align: { enumerable: true },
    ch: { enumerable: true },
    chOff: { enumerable: true },
    vAlign: { enumerable: true },
    bgColor: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLTableRowElement", configurable: true }
  });
  ctorRegistry[interfaceName] = HTMLTableRowElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HTMLTableRowElement
  });
};

const Impl = require("../../jsdom/living/nodes/HTMLTableRowElement-impl.js");
