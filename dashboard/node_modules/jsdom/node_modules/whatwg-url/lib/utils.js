"use strict";

// Returns "Type(value) is Object" in ES terminology.
function isObject(value) {
  return (typeof value === "object" && value !== null) || typeof value === "function";
}

const call = Function.call.bind(Function.call);

// Like `Object.assign`, but using `[[GetOwnProperty]]` and `[[DefineOwnProperty]]`
// instead of `[[Get]]` and `[[Set]]` and only allowing objects
function define(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
    if (descriptor && !Reflect.defineProperty(target, key, descriptor)) {
      throw new TypeError(`Cannot redefine property: ${String(key)}`);
    }
  }
}

function newObjectInRealm(globalObject, object) {
  const ctorRegistry = initCtorRegistry(globalObject);
  return Object.defineProperties(
    Object.create(ctorRegistry["%Object.prototype%"]),
    Object.getOwnPropertyDescriptors(object)
  );
}

const wrapperSymbol = Symbol("wrapper");
const sameObjectCaches = Symbol("SameObject caches");
const ctorRegistrySymbol = Symbol.for("[webidl2js] constructor registry");

const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype);

function initCtorRegistry(globalObject) {
  if (Object.hasOwn(globalObject, ctorRegistrySymbol)) {
    return globalObject[ctorRegistrySymbol];
  }

  const ctorRegistry = Object.create(null);

  // In addition to registering all the WebIDL2JS-generated types in the constructor registry,
  // we also register a few intrinsics that we make use of in generated code, since they are not
  // easy to grab from the globalObject variable.
  ctorRegistry["%Object.prototype%"] = globalObject.Object.prototype;
  ctorRegistry["%IteratorPrototype%"] = Object.getPrototypeOf(
    Object.getPrototypeOf(new globalObject.Array()[Symbol.iterator]())
  );

  try {
    ctorRegistry["%AsyncIteratorPrototype%"] = Object.getPrototypeOf(
      Object.getPrototypeOf(
        globalObject.eval("(async function* () {})").prototype
      )
    );
  } catch {
    ctorRegistry["%AsyncIteratorPrototype%"] = AsyncIteratorPrototype;
  }

  globalObject[ctorRegistrySymbol] = ctorRegistry;
  return ctorRegistry;
}

function getSameObject(wrapper, prop, creator) {
  if (!wrapper[sameObjectCaches]) {
    wrapper[sameObjectCaches] = Object.create(null);
  }

  if (prop in wrapper[sameObjectCaches]) {
    return wrapper[sameObjectCaches][prop];
  }

  wrapper[sameObjectCaches][prop] = creator();
  return wrapper[sameObjectCaches][prop];
}

function createInterfaceDescriptor(getParent) {
  // A parent's module can import its child, so resolve ancestry only after the modules have loaded.
  const descriptor = {
    get inclusiveInheritedInterfaces() {
      const interfaces = getParent ? [...getParent().inclusiveInheritedInterfaces, descriptor] : [descriptor];
      Object.defineProperties(descriptor, {
        inclusiveInheritedInterfaces: { value: interfaces },
        inheritanceDepth: { value: interfaces.length - 1 }
      });
      return interfaces;
    },
    get inheritanceDepth() {
      return descriptor.inclusiveInheritedInterfaces.length - 1;
    }
  };
  return descriptor;
}

class ReturnValue {
  constructor(value) {
    // Returning `value` lets derived classes stamp private fields onto that object.
    // eslint-disable-next-line no-constructor-return
    return value;
  }
}

class WrapperData extends ReturnValue {
  #impl;
  #interfaceDescriptor;

  constructor(wrapper, impl, interfaceDescriptor) {
    super(wrapper);
    this.#impl = impl;
    this.#interfaceDescriptor = interfaceDescriptor;
  }

  static registerWrapper(wrapper, impl, interfaceDescriptor) {
    // Private fields make registration one-time: an existing object's brand cannot be replaced.
    return new WrapperData(wrapper, impl, interfaceDescriptor);
  }

  static implForWrapper(wrapper) {
    if (!isObject(wrapper) || !(#impl in wrapper)) {
      return null;
    }
    return wrapper.#impl;
  }

  static implForWrapperWithInterface(wrapper, interfaceDescriptor) {
    if (!isObject(wrapper) || !(#impl in wrapper)) {
      return null;
    }

    if (wrapper.#interfaceDescriptor?.inclusiveInheritedInterfaces[interfaceDescriptor.inheritanceDepth] !==
        interfaceDescriptor) {
      return null;
    }

    return wrapper.#impl;
  }
}

const { registerWrapper, implForWrapper, implForWrapperWithInterface } = WrapperData;

function wrapperForImpl(impl) {
  return impl?.[wrapperSymbol] ?? null;
}

function tryWrapperForImpl(impl) {
  const wrapper = wrapperForImpl(impl);
  return wrapper !== null ? wrapper : impl;
}

function tryImplForWrapper(wrapper) {
  const impl = implForWrapper(wrapper);
  return impl !== null ? impl : wrapper;
}

const iterInternalSymbol = Symbol("internal");

function isArrayIndexPropName(P) {
  if (typeof P !== "string") {
    return false;
  }
  const i = P >>> 0;
  if (i === 2 ** 32 - 1) {
    return false;
  }
  const s = `${i}`;
  if (P !== s) {
    return false;
  }
  return true;
}

const arrayBufferByteLengthGetter =
  Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
function isArrayBuffer(value) {
  try {
    arrayBufferByteLengthGetter.call(value);
    return true;
  } catch {
    return false;
  }
}

const sharedArrayBufferByteLengthGetter =
  Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get;
function isSharedArrayBuffer(value) {
  try {
    sharedArrayBufferByteLengthGetter.call(value);
    return true;
  } catch {
    return false;
  }
}

function iteratorResult([key, value], kind) {
  let result;
  switch (kind) {
    case "key":
      result = key;
      break;
    case "value":
      result = value;
      break;
    case "key+value":
      result = [key, value];
      break;
  }
  return { value: result, done: false };
}

function ordinarySetWithOwnDescriptor(target, property, value, receiver, ownDesc) {
  if (ownDesc === undefined) {
    const parent = Reflect.getPrototypeOf(target);
    if (parent !== null) {
      return Reflect.set(parent, property, value, receiver);
    }
    ownDesc = { writable: true, enumerable: true, configurable: true, value: undefined };
  }
  if (isDataDescriptor(ownDesc)) {
    if (!ownDesc.writable) {
      return false;
    }
    if (!isObject(receiver)) {
      return false;
    }
    const existingDesc = Reflect.getOwnPropertyDescriptor(receiver, property);
    if (existingDesc !== undefined) {
      if (isAccessorDescriptor(existingDesc)) {
        return false;
      }
      if (existingDesc.writable === false) {
        return false;
      }
      const valueDesc = { value };
      return Reflect.defineProperty(receiver, property, valueDesc);
    }

    return Reflect.defineProperty(
      receiver,
      property,
      { value, writable: true, enumerable: true, configurable: true }
    );
  }

  const setter = ownDesc.set;
  if (setter === undefined) {
    return false;
  }
  call(setter, receiver, value);
  return true;
}

function isDataDescriptor(desc) {
  return Object.hasOwn(desc, "value") || Object.hasOwn(desc, "writable");
}

function isAccessorDescriptor(desc) {
  return Object.hasOwn(desc, "get") || Object.hasOwn(desc, "set");
}

function getMethod(value, property, errPrefix = "The provided value") {
  const func = value[property];
  if (func === undefined || func === null) {
    return undefined;
  }
  if (typeof func !== "function") {
    throw new TypeError(`${errPrefix}'s ${property} property is not a function.`);
  }
  return func;
}

function createAsyncFromSyncIterator(syncIterator) {
  // Instead of re-implementing CreateAsyncFromSyncIterator and %AsyncFromSyncIteratorPrototype%,
  // we use yield* inside an async generator function to achieve the same result.

  // Wrap the sync iterator inside a sync iterable, so we can use it with yield*.
  const syncIterable = {
    [Symbol.iterator]: () => syncIterator
  };
  // Create an async generator function and immediately invoke it.
  const asyncIterator = (async function* () {
    return yield* syncIterable;
  })();
  // Return as an async iterator record.
  return asyncIterator;
}

function convertAsyncSequence(object, itemConverter, errPrefix = "The provided value") {
  if (!isObject(object)) {
    throw new TypeError(`${errPrefix} is not an object.`);
  }
  let method = getMethod(object, Symbol.asyncIterator, errPrefix);
  let type = "async";
  if (method === undefined) {
    method = getMethod(object, Symbol.iterator, errPrefix);
    if (method === undefined) {
      throw new TypeError(`${errPrefix} is not an async iterable object.`);
    }
    type = "sync";
  }

  return {
    object,
    method,
    type,
    // The wrapperSymbol ensures that if the async sequence is used as a return value,
    // that it exposes the original JavaScript value.
    // https://webidl.spec.whatwg.org/#js-async-iterable
    [wrapperSymbol]: object,
    // Implement the async iterator protocol, so users can iterate
    // the async sequence directly (e.g. with for await...of)
    // instead of needing to call a separate helper function to open the async sequence.
    // https://webidl.spec.whatwg.org/#async-sequence-open
    [Symbol.asyncIterator]() {
      return openAsyncSequence(object, method, type, itemConverter, `${errPrefix}'s iterator`);
    }
  };
}

function openAsyncSequence(object, method, type, itemConverter, errPrefix = "The provided value") {
  let iterator = call(method, object);
  if (!isObject(iterator)) {
    throw new TypeError(`${errPrefix}'s method must return an object`);
  }
  if (type === "sync") {
    iterator = createAsyncFromSyncIterator(iterator);
  }
  const nextMethod = iterator.next;
  return {
    async next() {
      const nextResult = await call(nextMethod, iterator);
      if (!isObject(nextResult)) {
        throw new TypeError(`${errPrefix}'s next method must return an object`);
      }
      const { done, value } = nextResult;
      if (done) {
        return { done: true, value: undefined };
      }
      return { done: false, value: itemConverter(value) };
    },
    async return(reason) {
      const returnMethod = getMethod(iterator, "return", errPrefix);
      if (returnMethod === undefined) {
        return { done: true, value: undefined };
      }
      const returnResult = await call(returnMethod, iterator, reason);
      if (!isObject(returnResult)) {
        throw new TypeError(`${errPrefix}'s return method must return an object`);
      }
      return { done: true, value: undefined };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}

const supportsPropertyIndex = Symbol("supports property index");
const supportedPropertyIndices = Symbol("supported property indices");
const supportsPropertyName = Symbol("supports property name");
const supportedPropertyNames = Symbol("supported property names");
const indexedGet = Symbol("indexed property get");
const indexedSetNew = Symbol("indexed property set new");
const indexedSetExisting = Symbol("indexed property set existing");
const namedGet = Symbol("named property get");
const namedSetNew = Symbol("named property set new");
const namedSetExisting = Symbol("named property set existing");
const namedDelete = Symbol("named property delete");

const asyncIteratorNext = Symbol("async iterator get the next iteration result");
const asyncIteratorReturn = Symbol("async iterator return steps");
const asyncIteratorInit = Symbol("async iterator initialization steps");
const asyncIteratorEOI = Symbol("async iterator end of iteration");

module.exports = exports = {
  isObject,
  define,
  newObjectInRealm,
  wrapperSymbol,
  createInterfaceDescriptor,
  registerWrapper,
  getSameObject,
  ctorRegistrySymbol,
  initCtorRegistry,
  wrapperForImpl,
  implForWrapper,
  implForWrapperWithInterface,
  tryWrapperForImpl,
  tryImplForWrapper,
  iterInternalSymbol,
  isArrayBuffer,
  isSharedArrayBuffer,
  isArrayIndexPropName,
  getMethod,
  convertAsyncSequence,
  supportsPropertyIndex,
  supportedPropertyIndices,
  supportsPropertyName,
  supportedPropertyNames,
  indexedGet,
  indexedSetNew,
  indexedSetExisting,
  namedGet,
  namedSetNew,
  namedSetExisting,
  namedDelete,
  asyncIteratorNext,
  asyncIteratorReturn,
  asyncIteratorInit,
  asyncIteratorEOI,
  iteratorResult,
  ordinarySetWithOwnDescriptor
};
