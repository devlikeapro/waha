function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * This function mimics the behavior of the `defaultProps` static property in React.
 * Functional components do not have a defaultProps property, so this function is useful to resolve default props.
 *
 * The common recommendation is to use ES6 destructuring with default values in the function signature,
 * but you need to be careful there and make sure you destructure all the individual properties
 * and not the whole object. See the test file for example.
 *
 * And because destructuring all properties one by one is a faff, and it's easy to miss one property,
 * this function exists.
 *
 * @param realProps - the props object passed to the component by the user
 * @param defaultProps - the default props object defined in the component by Recharts
 * @returns - the props object with all the default props resolved. All `undefined` values are replaced with the default value.
 */
export function resolveDefaultProps(realProps, defaultProps) {
  /*
   * To avoid mutating the original `realProps` object passed to the function, create a shallow copy of it.
   * `resolvedProps` will be modified directly with the defaults.
   */
  var resolvedProps = _objectSpread({}, realProps);
  /*
   * Since the function guarantees `D extends Partial<T>`, this assignment is safe.
   * It allows TypeScript to work with the well-defined `Partial<T>` type inside the loop,
   * making subsequent type inference (especially for `dp[key]`) much more straightforward for the compiler.
   * This is a key step to improve type safety *without* value assertions later.
   */
  var dp = defaultProps;
  /*
   * `Object.keys` doesn't preserve strong key types - it always returns Array<string>.
   * However, due to the `D extends Partial<T>` constraint,
   * we know these keys *must* also be valid keys of `T`.
   * This assertion informs TypeScript of this relationship, avoiding type errors when using `key` to index `acc` (type T).
   *
   * Type assertions are not sound but in this case it's necessary
   * as `Object.keys` does not do what we want it to do.
   */
  var keys = Object.keys(defaultProps);
  var withDefaults = keys.reduce((acc, key) => {
    if (acc[key] === undefined && dp[key] !== undefined) {
      acc[key] = dp[key];
    }
    return acc;
  }, resolvedProps);
  /*
   * And again type assertions are not safe but here we have done the runtime work
   * so let's bypass the lack of static type safety and tell the compiler what happened.
   */
  return withDefaults;
}

/**
 * Helper type to extract the keys of T that are required.
 * It iterates through each key K in T. If Pick<T, K> cannot be assigned an empty object {},
 * it means K is required, so we keep K; otherwise, we discard it (never).
 * [keyof T] at the end creates a union of the kept keys.
 */

/**
 * Helper type to extract the keys of T that are optional.
 * It iterates through each key K in T. If Pick<T, K> can be assigned an empty object {},
 * it means K is optional (or potentially missing), so we keep K; otherwise, we discard it (never).
 * [keyof T] at the end creates a union of the kept keys.
 */

/**
 * Helper type to ensure keys of D exist in T.
 * For each key K in D, if K is also a key of T, keep the type D[K].
 * If K is NOT a key of T, map it to type `never`.
 * An object cannot have a property of type `never`, effectively disallowing extra keys.
 */

/**
 * This type will take a source type `Props` and a default type `Defaults` and will return a new type
 * where all properties that are optional in `Props` but required in `Defaults` are made required in the result.
 * Properties that are required in `Props` and optional in `Defaults` will remain required.
 * Properties that are optional in both `Props` and `Defaults` will remain optional.
 *
 * This is useful for creating a type that represents the resolved props of a component with default props.
 */