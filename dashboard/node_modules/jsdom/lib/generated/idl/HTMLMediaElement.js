"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const TextTrackKind = require("./TextTrackKind.js");
const serializeURLwhatwg_url = require("whatwg-url").serializeURL;
const ceReactionsPreSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPreSteps;
const ceReactionsPostSteps_jsdom_living_helpers_custom_elements =
  require("../../jsdom/living/helpers/custom-elements.js").ceReactionsPostSteps;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;
const HTMLElement = require("./HTMLElement.js");

const interfaceName = "HTMLMediaElement";

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
  throw new globalObject.TypeError(`${context} is not of type 'HTMLMediaElement'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["HTMLMediaElement"].prototype;
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
  class HTMLMediaElement extends globalObject.HTMLElement {
    constructor() {
      throw new globalObject.TypeError("Illegal constructor");
    }

    load() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'load' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl.load();
    }

    canPlayType(type) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'canPlayType' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'canPlayType' on 'HTMLMediaElement': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'canPlayType' on 'HTMLMediaElement': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.canPlayType(...args));
    }

    play() {
      try {
        const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
        if ($impl === null) {
          throw new globalObject.TypeError(
            "'play' called on an object that is not a valid instance of HTMLMediaElement."
          );
        }

        return utils.tryWrapperForImpl($impl.play());
      } catch (e) {
        return globalObject.Promise.reject(e);
      }
    }

    pause() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'pause' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl.pause();
    }

    addTextTrack(kind) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'addTextTrack' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'addTextTrack' on 'HTMLMediaElement': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = TextTrackKind.convert(globalObject, curArg, {
          context: "Failed to execute 'addTextTrack' on 'HTMLMediaElement': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'addTextTrack' on 'HTMLMediaElement': parameter 2",
            globals: globalObject
          });
        } else {
          curArg = "";
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'addTextTrack' on 'HTMLMediaElement': parameter 3",
            globals: globalObject
          });
        } else {
          curArg = "";
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl($impl.addTextTrack(...args));
    }

    get src() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get src' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const impl = $impl;
        const value = impl._reflectGetTheContentAttribute("src");
        if (value === null) {
          return "";
        }

        const document = impl._ownerDocument;
        if (this._srcURLCacheKey === value && this._baseURLCache === document._baseURLCache) {
          return this._srcURLCache;
        }

        this._srcURLCacheKey = value;
        this._baseURLCache = document._baseURLCache;

        const urlRecord = document.encodingParseAURL(value);
        if (urlRecord !== null) {
          this._srcURLCache = serializeURLwhatwg_url(urlRecord);
          return this._srcURLCache;
        }
        this._srcURLCache = conversions.USVString(value);
        return this._srcURLCache;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set src(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set src' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'src' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("src", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get currentSrc() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get currentSrc' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["currentSrc"];
    }

    get crossOrigin() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get crossOrigin' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl._reflectGetTheContentAttribute("crossorigin");
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set crossOrigin(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set crossOrigin' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      if (V === null || V === undefined) {
        V = null;
      } else {
        V = conversions["DOMString"](V, {
          context: "Failed to set the 'crossOrigin' property on 'HTMLMediaElement': The provided value",
          globals: globalObject
        });
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        if (V === null) {
          $impl._reflectDeleteTheContentAttribute("crossorigin");
        } else {
          $impl._reflectSetTheContentAttribute("crossorigin", V);
        }
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get networkState() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get networkState' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["networkState"];
    }

    get preload() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get preload' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        const value = $impl._reflectGetTheContentAttribute("preload");
        return value === null ? "" : value;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set preload(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set preload' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'preload' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        $impl._reflectSetTheContentAttribute("preload", V);
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get buffered() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get buffered' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return utils.tryWrapperForImpl($impl["buffered"]);
    }

    get readyState() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get readyState' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["readyState"];
    }

    get seeking() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get seeking' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["seeking"];
    }

    get currentTime() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get currentTime' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["currentTime"];
    }

    set currentTime(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set currentTime' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["double"](V, {
        context: "Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      $impl["currentTime"] = V;
    }

    get duration() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get duration' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["duration"];
    }

    get paused() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get paused' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["paused"];
    }

    get defaultPlaybackRate() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get defaultPlaybackRate' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["defaultPlaybackRate"];
    }

    set defaultPlaybackRate(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set defaultPlaybackRate' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["double"](V, {
        context: "Failed to set the 'defaultPlaybackRate' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      $impl["defaultPlaybackRate"] = V;
    }

    get playbackRate() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get playbackRate' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["playbackRate"];
    }

    set playbackRate(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set playbackRate' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["double"](V, {
        context: "Failed to set the 'playbackRate' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      $impl["playbackRate"] = V;
    }

    get played() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get played' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return utils.tryWrapperForImpl($impl["played"]);
    }

    get seekable() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get seekable' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return utils.tryWrapperForImpl($impl["seekable"]);
    }

    get ended() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get ended' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["ended"];
    }

    get autoplay() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get autoplay' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl._reflectGetTheContentAttribute("autoplay") !== null;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set autoplay(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set autoplay' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'autoplay' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        if (V) {
          $impl._reflectSetTheContentAttribute("autoplay", "");
        } else {
          $impl._reflectDeleteTheContentAttribute("autoplay");
        }
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get loop() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get loop' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl._reflectGetTheContentAttribute("loop") !== null;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set loop(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set loop' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'loop' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        if (V) {
          $impl._reflectSetTheContentAttribute("loop", "");
        } else {
          $impl._reflectDeleteTheContentAttribute("loop");
        }
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get controls() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get controls' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl._reflectGetTheContentAttribute("controls") !== null;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set controls(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set controls' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'controls' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        if (V) {
          $impl._reflectSetTheContentAttribute("controls", "");
        } else {
          $impl._reflectDeleteTheContentAttribute("controls");
        }
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get volume() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get volume' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["volume"];
    }

    set volume(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set volume' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["double"](V, {
        context: "Failed to set the 'volume' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      $impl["volume"] = V;
    }

    get muted() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get muted' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return $impl["muted"];
    }

    set muted(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set muted' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'muted' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      $impl["muted"] = V;
    }

    get defaultMuted() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get defaultMuted' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        return $impl._reflectGetTheContentAttribute("muted") !== null;
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    set defaultMuted(V) {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'set defaultMuted' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'defaultMuted' property on 'HTMLMediaElement': The provided value",
        globals: globalObject
      });

      ceReactionsPreSteps_jsdom_living_helpers_custom_elements(globalObject);
      try {
        if (V) {
          $impl._reflectSetTheContentAttribute("muted", "");
        } else {
          $impl._reflectDeleteTheContentAttribute("muted");
        }
      } finally {
        ceReactionsPostSteps_jsdom_living_helpers_custom_elements(globalObject);
      }
    }

    get audioTracks() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get audioTracks' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return utils.getSameObject(this, "audioTracks", () => {
        return utils.tryWrapperForImpl($impl["audioTracks"]);
      });
    }

    get videoTracks() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get videoTracks' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return utils.getSameObject(this, "videoTracks", () => {
        return utils.tryWrapperForImpl($impl["videoTracks"]);
      });
    }

    get textTracks() {
      const $impl = utils.implForWrapperWithInterface(this ?? globalObject, $interfaceDescriptor);
      if ($impl === null) {
        throw new globalObject.TypeError(
          "'get textTracks' called on an object that is not a valid instance of HTMLMediaElement."
        );
      }

      return utils.getSameObject(this, "textTracks", () => {
        return utils.tryWrapperForImpl($impl["textTracks"]);
      });
    }
  }
  Object.defineProperties(HTMLMediaElement.prototype, {
    load: { enumerable: true },
    canPlayType: { enumerable: true },
    play: { enumerable: true },
    pause: { enumerable: true },
    addTextTrack: { enumerable: true },
    src: { enumerable: true },
    currentSrc: { enumerable: true },
    crossOrigin: { enumerable: true },
    networkState: { enumerable: true },
    preload: { enumerable: true },
    buffered: { enumerable: true },
    readyState: { enumerable: true },
    seeking: { enumerable: true },
    currentTime: { enumerable: true },
    duration: { enumerable: true },
    paused: { enumerable: true },
    defaultPlaybackRate: { enumerable: true },
    playbackRate: { enumerable: true },
    played: { enumerable: true },
    seekable: { enumerable: true },
    ended: { enumerable: true },
    autoplay: { enumerable: true },
    loop: { enumerable: true },
    controls: { enumerable: true },
    volume: { enumerable: true },
    muted: { enumerable: true },
    defaultMuted: { enumerable: true },
    audioTracks: { enumerable: true },
    videoTracks: { enumerable: true },
    textTracks: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLMediaElement", configurable: true },
    NETWORK_EMPTY: { value: 0, enumerable: true },
    NETWORK_IDLE: { value: 1, enumerable: true },
    NETWORK_LOADING: { value: 2, enumerable: true },
    NETWORK_NO_SOURCE: { value: 3, enumerable: true },
    HAVE_NOTHING: { value: 0, enumerable: true },
    HAVE_METADATA: { value: 1, enumerable: true },
    HAVE_CURRENT_DATA: { value: 2, enumerable: true },
    HAVE_FUTURE_DATA: { value: 3, enumerable: true },
    HAVE_ENOUGH_DATA: { value: 4, enumerable: true }
  });
  Object.defineProperties(HTMLMediaElement, {
    NETWORK_EMPTY: { value: 0, enumerable: true },
    NETWORK_IDLE: { value: 1, enumerable: true },
    NETWORK_LOADING: { value: 2, enumerable: true },
    NETWORK_NO_SOURCE: { value: 3, enumerable: true },
    HAVE_NOTHING: { value: 0, enumerable: true },
    HAVE_METADATA: { value: 1, enumerable: true },
    HAVE_CURRENT_DATA: { value: 2, enumerable: true },
    HAVE_FUTURE_DATA: { value: 3, enumerable: true },
    HAVE_ENOUGH_DATA: { value: 4, enumerable: true }
  });
  ctorRegistry[interfaceName] = HTMLMediaElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HTMLMediaElement
  });
};

const Impl = require("../../jsdom/living/nodes/HTMLMediaElement-impl.js");
