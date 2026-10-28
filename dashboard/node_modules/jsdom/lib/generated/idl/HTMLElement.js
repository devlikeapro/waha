"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const HTMLConstructor_jsdom_living_helpers_html_constructor =
  require("../../jsdom/living/helpers/html-constructor.js").HTMLConstructor;
const ceReactionsPreSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPreSteps;
const ceReactionsPostSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPostSteps;
const EventHandlerNonNull = require("./EventHandlerNonNull.js");
const OnErrorEventHandlerNonNull = require("./OnErrorEventHandlerNonNull.js");
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const Element = require("./Element.js");

const interfaceName = "HTMLElement";

const $interfaceDescriptor = utils.createInterfaceDescriptor(() => Element.interfaceDescriptor);
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
  throw new globalObject.TypeError(`${context} is not of type 'HTMLElement'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["HTMLElement"].prototype;
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
  Element._internalSetup(wrapper, globalObject);
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
  class HTMLElement extends globalObject.Element {
    constructor() {
      return HTMLConstructor_jsdom_living_helpers_html_constructor(globalObject, interfaceName, new.target);
    }

    click() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'click' called on an object that is not a valid instance of HTMLElement.");
      }

      return $impl.click();
    }

    attachInternals() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'attachInternals' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl.attachInternals());
    }

    focus() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'focus' called on an object that is not a valid instance of HTMLElement.");
      }

      return $impl.focus();
    }

    blur() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'blur' called on an object that is not a valid instance of HTMLElement.");
      }

      return $impl.blur();
    }

    get title() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get title' called on an object that is not a valid instance of HTMLElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("title");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set title(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set title' called on an object that is not a valid instance of HTMLElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'title' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("title", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get lang() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get lang' called on an object that is not a valid instance of HTMLElement.");
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("lang");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set lang(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'set lang' called on an object that is not a valid instance of HTMLElement.");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'lang' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("lang", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get translate() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get translate' called on an object that is not a valid instance of HTMLElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl["translate"];
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set translate(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set translate' called on an object that is not a valid instance of HTMLElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'translate' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl["translate"] = V;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get dir() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'get dir' called on an object that is not a valid instance of HTMLElement.");
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl["dir"];
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set dir(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError("'set dir' called on an object that is not a valid instance of HTMLElement.");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'dir' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl["dir"] = V;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get hidden() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get hidden' called on an object that is not a valid instance of HTMLElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl._reflectGetTheContentAttribute("hidden") !== null;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set hidden(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set hidden' called on an object that is not a valid instance of HTMLElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'hidden' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        if (V) {
          $impl._reflectSetTheContentAttribute("hidden", "");
        } else {
          $impl._reflectDeleteTheContentAttribute("hidden");
        }
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get accessKey() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get accessKey' called on an object that is not a valid instance of HTMLElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("accesskey");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set accessKey(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set accessKey' called on an object that is not a valid instance of HTMLElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'accessKey' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("accesskey", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get draggable() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get draggable' called on an object that is not a valid instance of HTMLElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl["draggable"];
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set draggable(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set draggable' called on an object that is not a valid instance of HTMLElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'draggable' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl["draggable"] = V;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get offsetParent() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get offsetParent' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["offsetParent"]);
    }

    get offsetTop() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get offsetTop' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return $impl["offsetTop"];
    }

    get offsetLeft() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get offsetLeft' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return $impl["offsetLeft"];
    }

    get offsetWidth() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get offsetWidth' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return $impl["offsetWidth"];
    }

    get offsetHeight() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get offsetHeight' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return $impl["offsetHeight"];
    }

    get style() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get style' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.getSameObject(this, "style", () => {
        return utils.tryWrapperForImpl($impl["style"]);
      });
    }

    set style(V) {
      const esValue = this ?? globalObject;

      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set style' called on an object that is not a valid instance of HTMLElement."
        );
      }

      const Q = esValue["style"];
      if (!utils.isObject(Q)) {
        throw new globalObject.TypeError("Property 'style' is not an object");
      }
      Reflect.set(Q, "cssText", V);
    }

    get onabort() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onabort' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onabort"]);
    }

    set onabort(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onabort' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onabort' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onabort"] = V;
    }

    get onauxclick() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onauxclick' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onauxclick"]);
    }

    set onauxclick(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onauxclick' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onauxclick' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onauxclick"] = V;
    }

    get onbeforeinput() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onbeforeinput' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onbeforeinput"]);
    }

    set onbeforeinput(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onbeforeinput' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onbeforeinput' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onbeforeinput"] = V;
    }

    get onbeforematch() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onbeforematch' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onbeforematch"]);
    }

    set onbeforematch(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onbeforematch' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onbeforematch' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onbeforematch"] = V;
    }

    get onbeforetoggle() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onbeforetoggle' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onbeforetoggle"]);
    }

    set onbeforetoggle(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onbeforetoggle' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onbeforetoggle' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onbeforetoggle"] = V;
    }

    get onblur() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onblur' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onblur"]);
    }

    set onblur(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onblur' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onblur' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onblur"] = V;
    }

    get oncancel() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncancel' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncancel"]);
    }

    set oncancel(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncancel' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncancel' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncancel"] = V;
    }

    get oncanplay() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncanplay' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncanplay"]);
    }

    set oncanplay(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncanplay' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncanplay' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncanplay"] = V;
    }

    get oncanplaythrough() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncanplaythrough' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncanplaythrough"]);
    }

    set oncanplaythrough(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncanplaythrough' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncanplaythrough' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncanplaythrough"] = V;
    }

    get onchange() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onchange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onchange"]);
    }

    set onchange(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onchange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onchange' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onchange"] = V;
    }

    get onclick() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onclick' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onclick"]);
    }

    set onclick(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onclick' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onclick' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onclick"] = V;
    }

    get onclose() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onclose' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onclose"]);
    }

    set onclose(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onclose' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onclose' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onclose"] = V;
    }

    get oncontextlost() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncontextlost' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncontextlost"]);
    }

    set oncontextlost(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncontextlost' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncontextlost' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncontextlost"] = V;
    }

    get oncontextmenu() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncontextmenu' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncontextmenu"]);
    }

    set oncontextmenu(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncontextmenu' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncontextmenu' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncontextmenu"] = V;
    }

    get oncontextrestored() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncontextrestored' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncontextrestored"]);
    }

    set oncontextrestored(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncontextrestored' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncontextrestored' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncontextrestored"] = V;
    }

    get oncopy() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncopy' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncopy"]);
    }

    set oncopy(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncopy' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncopy' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncopy"] = V;
    }

    get oncuechange() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncuechange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncuechange"]);
    }

    set oncuechange(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncuechange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncuechange' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncuechange"] = V;
    }

    get oncut() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oncut' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oncut"]);
    }

    set oncut(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oncut' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oncut' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oncut"] = V;
    }

    get ondblclick() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondblclick' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondblclick"]);
    }

    set ondblclick(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondblclick' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondblclick' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondblclick"] = V;
    }

    get ondrag() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondrag' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondrag"]);
    }

    set ondrag(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondrag' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondrag' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondrag"] = V;
    }

    get ondragend() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondragend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondragend"]);
    }

    set ondragend(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondragend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondragend' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondragend"] = V;
    }

    get ondragenter() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondragenter' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondragenter"]);
    }

    set ondragenter(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondragenter' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondragenter' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondragenter"] = V;
    }

    get ondragleave() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondragleave' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondragleave"]);
    }

    set ondragleave(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondragleave' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondragleave' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondragleave"] = V;
    }

    get ondragover() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondragover' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondragover"]);
    }

    set ondragover(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondragover' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondragover' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondragover"] = V;
    }

    get ondragstart() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondragstart' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondragstart"]);
    }

    set ondragstart(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondragstart' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondragstart' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondragstart"] = V;
    }

    get ondrop() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondrop' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondrop"]);
    }

    set ondrop(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondrop' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondrop' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondrop"] = V;
    }

    get ondurationchange() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ondurationchange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ondurationchange"]);
    }

    set ondurationchange(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ondurationchange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ondurationchange' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ondurationchange"] = V;
    }

    get onemptied() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onemptied' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onemptied"]);
    }

    set onemptied(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onemptied' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onemptied' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onemptied"] = V;
    }

    get onended() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onended' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onended"]);
    }

    set onended(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onended' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onended' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onended"] = V;
    }

    get onerror() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onerror' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onerror"]);
    }

    set onerror(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onerror' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = OnErrorEventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onerror' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onerror"] = V;
    }

    get onfocus() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onfocus' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onfocus"]);
    }

    set onfocus(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onfocus' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onfocus' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onfocus"] = V;
    }

    get onformdata() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onformdata' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onformdata"]);
    }

    set onformdata(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onformdata' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onformdata' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onformdata"] = V;
    }

    get oninput() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oninput' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oninput"]);
    }

    set oninput(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oninput' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oninput' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oninput"] = V;
    }

    get oninvalid() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get oninvalid' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["oninvalid"]);
    }

    set oninvalid(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set oninvalid' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'oninvalid' property on 'HTMLElement': The provided value"
        });
      }
      $impl["oninvalid"] = V;
    }

    get onkeydown() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onkeydown' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onkeydown"]);
    }

    set onkeydown(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onkeydown' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onkeydown' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onkeydown"] = V;
    }

    get onkeypress() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onkeypress' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onkeypress"]);
    }

    set onkeypress(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onkeypress' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onkeypress' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onkeypress"] = V;
    }

    get onkeyup() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onkeyup' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onkeyup"]);
    }

    set onkeyup(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onkeyup' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onkeyup' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onkeyup"] = V;
    }

    get onload() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onload' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onload"]);
    }

    set onload(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onload' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onload' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onload"] = V;
    }

    get onloadeddata() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onloadeddata' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onloadeddata"]);
    }

    set onloadeddata(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onloadeddata' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onloadeddata' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onloadeddata"] = V;
    }

    get onloadedmetadata() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onloadedmetadata' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onloadedmetadata"]);
    }

    set onloadedmetadata(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onloadedmetadata' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onloadedmetadata' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onloadedmetadata"] = V;
    }

    get onloadstart() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onloadstart' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onloadstart"]);
    }

    set onloadstart(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onloadstart' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onloadstart' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onloadstart"] = V;
    }

    get onmousedown() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onmousedown' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onmousedown"]);
    }

    set onmousedown(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onmousedown' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmousedown' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onmousedown"] = V;
    }

    get onmouseenter() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        return;
      }

      return utils.tryWrapperForImpl($impl["onmouseenter"]);
    }

    set onmouseenter(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        return;
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmouseenter' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onmouseenter"] = V;
    }

    get onmouseleave() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        return;
      }

      return utils.tryWrapperForImpl($impl["onmouseleave"]);
    }

    set onmouseleave(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        return;
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmouseleave' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onmouseleave"] = V;
    }

    get onmousemove() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onmousemove' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onmousemove"]);
    }

    set onmousemove(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onmousemove' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmousemove' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onmousemove"] = V;
    }

    get onmouseout() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onmouseout' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onmouseout"]);
    }

    set onmouseout(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onmouseout' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmouseout' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onmouseout"] = V;
    }

    get onmouseover() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onmouseover' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onmouseover"]);
    }

    set onmouseover(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onmouseover' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmouseover' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onmouseover"] = V;
    }

    get onmouseup() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onmouseup' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onmouseup"]);
    }

    set onmouseup(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onmouseup' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onmouseup' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onmouseup"] = V;
    }

    get onpaste() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpaste' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpaste"]);
    }

    set onpaste(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpaste' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpaste' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpaste"] = V;
    }

    get onpause() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpause' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpause"]);
    }

    set onpause(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpause' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpause' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpause"] = V;
    }

    get onplay() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onplay' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onplay"]);
    }

    set onplay(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onplay' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onplay' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onplay"] = V;
    }

    get onplaying() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onplaying' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onplaying"]);
    }

    set onplaying(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onplaying' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onplaying' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onplaying"] = V;
    }

    get onprogress() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onprogress' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onprogress"]);
    }

    set onprogress(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onprogress' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onprogress' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onprogress"] = V;
    }

    get onratechange() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onratechange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onratechange"]);
    }

    set onratechange(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onratechange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onratechange' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onratechange"] = V;
    }

    get onreset() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onreset' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onreset"]);
    }

    set onreset(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onreset' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onreset' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onreset"] = V;
    }

    get onresize() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onresize' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onresize"]);
    }

    set onresize(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onresize' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onresize' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onresize"] = V;
    }

    get onscroll() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onscroll' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onscroll"]);
    }

    set onscroll(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onscroll' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onscroll' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onscroll"] = V;
    }

    get onscrollend() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onscrollend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onscrollend"]);
    }

    set onscrollend(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onscrollend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onscrollend' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onscrollend"] = V;
    }

    get onsecuritypolicyviolation() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onsecuritypolicyviolation' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onsecuritypolicyviolation"]);
    }

    set onsecuritypolicyviolation(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onsecuritypolicyviolation' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onsecuritypolicyviolation' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onsecuritypolicyviolation"] = V;
    }

    get onseeked() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onseeked' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onseeked"]);
    }

    set onseeked(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onseeked' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onseeked' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onseeked"] = V;
    }

    get onseeking() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onseeking' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onseeking"]);
    }

    set onseeking(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onseeking' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onseeking' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onseeking"] = V;
    }

    get onselect() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onselect' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onselect"]);
    }

    set onselect(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onselect' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onselect' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onselect"] = V;
    }

    get onslotchange() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onslotchange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onslotchange"]);
    }

    set onslotchange(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onslotchange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onslotchange' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onslotchange"] = V;
    }

    get onstalled() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onstalled' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onstalled"]);
    }

    set onstalled(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onstalled' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onstalled' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onstalled"] = V;
    }

    get onsubmit() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onsubmit' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onsubmit"]);
    }

    set onsubmit(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onsubmit' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onsubmit' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onsubmit"] = V;
    }

    get onsuspend() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onsuspend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onsuspend"]);
    }

    set onsuspend(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onsuspend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onsuspend' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onsuspend"] = V;
    }

    get ontimeupdate() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ontimeupdate' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ontimeupdate"]);
    }

    set ontimeupdate(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ontimeupdate' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ontimeupdate' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ontimeupdate"] = V;
    }

    get ontoggle() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ontoggle' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ontoggle"]);
    }

    set ontoggle(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ontoggle' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ontoggle' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ontoggle"] = V;
    }

    get onvolumechange() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onvolumechange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onvolumechange"]);
    }

    set onvolumechange(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onvolumechange' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onvolumechange' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onvolumechange"] = V;
    }

    get onwaiting() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onwaiting' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onwaiting"]);
    }

    set onwaiting(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onwaiting' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onwaiting' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onwaiting"] = V;
    }

    get onwebkitanimationend() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onwebkitanimationend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onwebkitanimationend"]);
    }

    set onwebkitanimationend(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onwebkitanimationend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onwebkitanimationend' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onwebkitanimationend"] = V;
    }

    get onwebkitanimationiteration() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onwebkitanimationiteration' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onwebkitanimationiteration"]);
    }

    set onwebkitanimationiteration(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onwebkitanimationiteration' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onwebkitanimationiteration' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onwebkitanimationiteration"] = V;
    }

    get onwebkitanimationstart() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onwebkitanimationstart' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onwebkitanimationstart"]);
    }

    set onwebkitanimationstart(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onwebkitanimationstart' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onwebkitanimationstart' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onwebkitanimationstart"] = V;
    }

    get onwebkittransitionend() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onwebkittransitionend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onwebkittransitionend"]);
    }

    set onwebkittransitionend(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onwebkittransitionend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onwebkittransitionend' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onwebkittransitionend"] = V;
    }

    get onwheel() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onwheel' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onwheel"]);
    }

    set onwheel(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onwheel' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onwheel' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onwheel"] = V;
    }

    get ontouchstart() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ontouchstart' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ontouchstart"]);
    }

    set ontouchstart(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ontouchstart' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ontouchstart' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ontouchstart"] = V;
    }

    get ontouchend() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ontouchend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ontouchend"]);
    }

    set ontouchend(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ontouchend' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ontouchend' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ontouchend"] = V;
    }

    get ontouchmove() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ontouchmove' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ontouchmove"]);
    }

    set ontouchmove(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ontouchmove' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ontouchmove' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ontouchmove"] = V;
    }

    get ontouchcancel() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ontouchcancel' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ontouchcancel"]);
    }

    set ontouchcancel(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ontouchcancel' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ontouchcancel' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ontouchcancel"] = V;
    }

    get onpointerover() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointerover' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointerover"]);
    }

    set onpointerover(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointerover' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointerover' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointerover"] = V;
    }

    get onpointerenter() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointerenter' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointerenter"]);
    }

    set onpointerenter(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointerenter' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointerenter' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointerenter"] = V;
    }

    get onpointerdown() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointerdown' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointerdown"]);
    }

    set onpointerdown(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointerdown' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointerdown' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointerdown"] = V;
    }

    get onpointermove() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointermove' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointermove"]);
    }

    set onpointermove(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointermove' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointermove' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointermove"] = V;
    }

    get onpointerrawupdate() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointerrawupdate' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointerrawupdate"]);
    }

    set onpointerrawupdate(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointerrawupdate' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointerrawupdate' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointerrawupdate"] = V;
    }

    get onpointerup() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointerup' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointerup"]);
    }

    set onpointerup(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointerup' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointerup' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointerup"] = V;
    }

    get onpointercancel() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointercancel' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointercancel"]);
    }

    set onpointercancel(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointercancel' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointercancel' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointercancel"] = V;
    }

    get onpointerout() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointerout' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointerout"]);
    }

    set onpointerout(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointerout' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointerout' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointerout"] = V;
    }

    get onpointerleave() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onpointerleave' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onpointerleave"]);
    }

    set onpointerleave(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onpointerleave' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onpointerleave' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onpointerleave"] = V;
    }

    get ongotpointercapture() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ongotpointercapture' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["ongotpointercapture"]);
    }

    set ongotpointercapture(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set ongotpointercapture' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'ongotpointercapture' property on 'HTMLElement': The provided value"
        });
      }
      $impl["ongotpointercapture"] = V;
    }

    get onlostpointercapture() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get onlostpointercapture' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.tryWrapperForImpl($impl["onlostpointercapture"]);
    }

    set onlostpointercapture(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set onlostpointercapture' called on an object that is not a valid instance of HTMLElement."
        );
      }

      if (!utils.isObject(V)) {
        V = null;
      } else {
        V = EventHandlerNonNull.convert(globalObject, V, {
          context: "Failed to set the 'onlostpointercapture' property on 'HTMLElement': The provided value"
        });
      }
      $impl["onlostpointercapture"] = V;
    }

    get dataset() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get dataset' called on an object that is not a valid instance of HTMLElement."
        );
      }

      return utils.getSameObject(this, "dataset", () => {
        return utils.tryWrapperForImpl($impl["dataset"]);
      });
    }

    get nonce() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get nonce' called on an object that is not a valid instance of HTMLElement."
        );
      }

      const value = $impl._reflectGetTheContentAttribute("nonce");
      return value === null ? "" : value;
    }

    set nonce(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set nonce' called on an object that is not a valid instance of HTMLElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'nonce' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      $impl._reflectSetTheContentAttribute("nonce", V);
    }

    get tabIndex() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get tabIndex' called on an object that is not a valid instance of HTMLElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl["tabIndex"];
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set tabIndex(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set tabIndex' called on an object that is not a valid instance of HTMLElement."
        );
      }

      V = conversions["long"](V, {
        context: "Failed to set the 'tabIndex' property on 'HTMLElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl["tabIndex"] = V;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }
  }
  Object.defineProperties(HTMLElement.prototype, {
    click: { enumerable: true },
    attachInternals: { enumerable: true },
    focus: { enumerable: true },
    blur: { enumerable: true },
    title: { enumerable: true },
    lang: { enumerable: true },
    translate: { enumerable: true },
    dir: { enumerable: true },
    hidden: { enumerable: true },
    accessKey: { enumerable: true },
    draggable: { enumerable: true },
    offsetParent: { enumerable: true },
    offsetTop: { enumerable: true },
    offsetLeft: { enumerable: true },
    offsetWidth: { enumerable: true },
    offsetHeight: { enumerable: true },
    style: { enumerable: true },
    onabort: { enumerable: true },
    onauxclick: { enumerable: true },
    onbeforeinput: { enumerable: true },
    onbeforematch: { enumerable: true },
    onbeforetoggle: { enumerable: true },
    onblur: { enumerable: true },
    oncancel: { enumerable: true },
    oncanplay: { enumerable: true },
    oncanplaythrough: { enumerable: true },
    onchange: { enumerable: true },
    onclick: { enumerable: true },
    onclose: { enumerable: true },
    oncontextlost: { enumerable: true },
    oncontextmenu: { enumerable: true },
    oncontextrestored: { enumerable: true },
    oncopy: { enumerable: true },
    oncuechange: { enumerable: true },
    oncut: { enumerable: true },
    ondblclick: { enumerable: true },
    ondrag: { enumerable: true },
    ondragend: { enumerable: true },
    ondragenter: { enumerable: true },
    ondragleave: { enumerable: true },
    ondragover: { enumerable: true },
    ondragstart: { enumerable: true },
    ondrop: { enumerable: true },
    ondurationchange: { enumerable: true },
    onemptied: { enumerable: true },
    onended: { enumerable: true },
    onerror: { enumerable: true },
    onfocus: { enumerable: true },
    onformdata: { enumerable: true },
    oninput: { enumerable: true },
    oninvalid: { enumerable: true },
    onkeydown: { enumerable: true },
    onkeypress: { enumerable: true },
    onkeyup: { enumerable: true },
    onload: { enumerable: true },
    onloadeddata: { enumerable: true },
    onloadedmetadata: { enumerable: true },
    onloadstart: { enumerable: true },
    onmousedown: { enumerable: true },
    onmouseenter: { enumerable: true },
    onmouseleave: { enumerable: true },
    onmousemove: { enumerable: true },
    onmouseout: { enumerable: true },
    onmouseover: { enumerable: true },
    onmouseup: { enumerable: true },
    onpaste: { enumerable: true },
    onpause: { enumerable: true },
    onplay: { enumerable: true },
    onplaying: { enumerable: true },
    onprogress: { enumerable: true },
    onratechange: { enumerable: true },
    onreset: { enumerable: true },
    onresize: { enumerable: true },
    onscroll: { enumerable: true },
    onscrollend: { enumerable: true },
    onsecuritypolicyviolation: { enumerable: true },
    onseeked: { enumerable: true },
    onseeking: { enumerable: true },
    onselect: { enumerable: true },
    onslotchange: { enumerable: true },
    onstalled: { enumerable: true },
    onsubmit: { enumerable: true },
    onsuspend: { enumerable: true },
    ontimeupdate: { enumerable: true },
    ontoggle: { enumerable: true },
    onvolumechange: { enumerable: true },
    onwaiting: { enumerable: true },
    onwebkitanimationend: { enumerable: true },
    onwebkitanimationiteration: { enumerable: true },
    onwebkitanimationstart: { enumerable: true },
    onwebkittransitionend: { enumerable: true },
    onwheel: { enumerable: true },
    ontouchstart: { enumerable: true },
    ontouchend: { enumerable: true },
    ontouchmove: { enumerable: true },
    ontouchcancel: { enumerable: true },
    onpointerover: { enumerable: true },
    onpointerenter: { enumerable: true },
    onpointerdown: { enumerable: true },
    onpointermove: { enumerable: true },
    onpointerrawupdate: { enumerable: true },
    onpointerup: { enumerable: true },
    onpointercancel: { enumerable: true },
    onpointerout: { enumerable: true },
    onpointerleave: { enumerable: true },
    ongotpointercapture: { enumerable: true },
    onlostpointercapture: { enumerable: true },
    dataset: { enumerable: true },
    nonce: { enumerable: true },
    tabIndex: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLElement", configurable: true }
  });
  ctorRegistry[interfaceName] = HTMLElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HTMLElement
  });
};

const Impl = require("../../jsdom/living/nodes/HTMLElement-impl.js");
