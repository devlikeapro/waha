import { NoInfer, RowData, Updater } from "./types/type-utils.js";
import { TableState, TableState_All } from "./types/TableState.js";
import { Table } from "./types/Table.js";
import { TableFeatures } from "./types/TableFeatures.js";
//#region src/utils.d.ts
/**
 * Applies a TanStack updater to a value.
 *
 * If the updater is a function it is called with the previous value; otherwise the updater value is returned directly.
 */
declare function functionalUpdate<T>(updater: Updater<T>, input: T): T;
/**
 * Clones table state values while preserving non-plain objects.
 *
 * Plain objects and arrays are copied recursively so state updates can avoid mutating existing references.
 */
declare function cloneState<T>(value: T): T;
/**
 * Copies prototype-instance own properties without carrying over lazy memo
 * closures or the per-row cell cache, both of which are bound to the source
 * instance (cached cells reference the source row).
 */
declare function copyInstancePropertiesWithoutMemos<TTarget extends Record<string, any>, TSource extends Record<string, any>>(target: TTarget, source: TSource): TTarget & TSource;
/**
 * Creates an object intended only for string-keyed dictionary lookups.
 *
 * The null prototype keeps user-controlled ids such as `__proto__` and
 * `hasOwnProperty` as plain data keys.
 */
declare function makeObjectMap<TValue = unknown>(): Record<string, TValue>;
/**
 * Checks whether an object owns a key, including null-prototype dictionaries.
 */
declare function hasOwn(obj: object, key: PropertyKey): boolean;
/**
 * Creates a table state updater for a single state slice.
 *
 * The updater writes through the table base atom for the slice and supports both value and functional updater forms.
 */
declare function makeStateUpdater<TFeatures extends TableFeatures, K extends (string & {}) | keyof TableState_All | keyof TableState<TFeatures>>(key: K, instance: {
  readonly options: {
    readonly atoms?: object | undefined;
  };
  readonly baseAtoms: object;
}): (updater: Updater<TableState<any>[K & keyof TableState<any>]>) => void;
/**
 * Structurally compares two state slice values as deeply as stock feature
 * state can nest and no deeper.
 *
 * Three container levels cover flat maps and arrays, arrays of state objects,
 * array-valued filter values, and `columnResizing.columnSizingStart` tuples.
 * Deeper containers and non-plain values compare by reference. A `false`
 * result is always safe: the state update simply proceeds.
 */
declare function stateSlicesEqual(a: unknown, b: unknown): boolean;
type StateSliceForKey<K extends string> = K extends keyof TableState<any> ? TableState<any>[K] : unknown;
type StateSliceEqualityFn<T> = (current: T, next: T) => boolean;
/**
 * Routes a state slice update through the slice's `on<State>Change` handler,
 * preserving the owner's current reference for structural no-ops.
 *
 * Equality is evaluated inside the updater received by the state owner, never
 * against the table's potentially stale controlled snapshot. This keeps
 * same-tick updates composable in queued host containers such as React state,
 * evaluates the original updater only when the owner applies it, and lets atom
 * owners suppress notifications by returning their existing reference.
 *
 * A user-provided change handler is still invoked for a no-op because only that
 * handler's state container can know its latest queued value. The guarded
 * updater returns that container's previous reference, preventing a state write
 * or render in state containers with identity bailout semantics.
 *
 * Hot-path slices that skip guarding entirely (selection maps that scale with
 * row count, pointer-frequency resize state) call their change handler
 * directly instead of routing through this util. Custom feature slices with a
 * cheaper or semantic-aware comparison can pass `isEqual` to override the
 * structural default.
 */
declare function setStateSlice<K extends (string & {}) | keyof TableState_All>(instance: {
  readonly options: object;
}, key: K, updater: Updater<StateSliceForKey<K>>, isEqual?: StateSliceEqualityFn<StateSliceForKey<K>>): void;
type AnyFunction = (...args: any) => any;
/**
 * Returns whether a value is a function.
 */
declare function isFunction<T extends AnyFunction>(d: any): d is T;
/**
 * Flattens a tree of nodes by recursively reading child nodes.
 *
 * The original nodes are preserved in depth-first order.
 */
declare function flattenBy<TNode>(arr: Array<TNode>, getChildren: (item: TNode) => Array<TNode>): TNode[];
interface MemoOptions<TDeps extends ReadonlyArray<any>, TDepArgs, TResult> {
  fn: (...args: NoInfer<TDeps>) => TResult;
  memoDeps?: (depArgs?: TDepArgs) => [...TDeps] | undefined;
  onAfterCompare?: (depsChanged: boolean) => void;
  onAfterUpdate?: (result: TResult) => void;
  onBeforeCompare?: () => void;
  onBeforeUpdate?: () => void;
}
/**
 * Creates a dependency-tracked memoized function for table internals.
 *
 * The memo recomputes only when its dependency tuple changes and can emit debug timing information.
 */
declare const memo: <TDeps extends ReadonlyArray<any>, TDepArgs, TResult>({ fn, memoDeps, onAfterCompare, onAfterUpdate, onBeforeCompare, onBeforeUpdate }: MemoOptions<TDeps, TDepArgs, TResult>) => ((depArgs?: TDepArgs) => TResult);
/**
 * Wraps a callback so that its first invocation is skipped.
 *
 * Row-model `onAfterUpdate` hooks schedule auto-resets when their inputs
 * change. The initial computation of a row model is not a change, so state
 * resets must not fire for it — otherwise merely reading a row model on mount
 * would wipe initial or controlled state.
 */
declare function skipFirstRun(fn: () => void): () => void;
interface TableMemoOptions<TFeatures extends TableFeatures, TDeps extends ReadonlyArray<any>, TDepArgs, TResult> extends MemoOptions<TDeps, TDepArgs, TResult> {
  feature?: keyof TFeatures & string;
  fnName: string;
  objectId?: string;
  onAfterUpdate?: () => void;
  table: Table<TFeatures, any>;
}
/**
 * Creates a table-aware memoized function.
 *
 * This wraps `memo` with table debug options and feature metadata so row models and derived APIs can share consistent diagnostics.
 */
declare function tableMemo<TFeatures extends TableFeatures, TDeps extends ReadonlyArray<any>, TDepArgs, TResult>({ feature, fnName, objectId, onAfterUpdate, table, ...memoOptions }: TableMemoOptions<TFeatures, TDeps, TDepArgs, TResult>): (depArgs?: TDepArgs | undefined) => TResult;
interface API<_TDeps extends ReadonlyArray<any>, _TDepArgs> {
  fn: (...args: any) => any;
  memoDeps?: (depArgs?: any) => [...any] | undefined;
}
type APIObject<TDeps extends ReadonlyArray<any>, TDepArgs> = Record<string, API<TDeps, TDepArgs>>;
/**
 * Assumes that a function name is in the format of `parentName_fnKey` and returns the `fnKey` and `fnName` in the format of `parentName.fnKey`.
 */
declare function getFunctionNameInfo(staticFnName: string, splitBy?: '_' | '.'): {
  fnKey: string;
  fnName: string;
  parentName: string;
};
/**
 * Assigns Table API methods directly to the table instance.
 * Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.
 */
declare function assignTableAPIs<TFeatures extends TableFeatures, TData extends RowData, TDeps extends ReadonlyArray<any>, TDepArgs>(feature: keyof TFeatures & string, table: Table<TFeatures, TData>, apis: APIObject<TDeps, NoInfer<TDepArgs>>): void;
interface PrototypeAPI<_TDeps extends ReadonlyArray<any>, _TDepArgs> {
  fn: (self: any, ...args: any) => any;
  memoDeps?: (self: any, depArgs?: any) => [...any] | undefined;
}
type PrototypeAPIObject<TDeps extends ReadonlyArray<any>, TDepArgs> = Record<string, PrototypeAPI<TDeps, TDepArgs>>;
/**
 * Assigns API methods to a prototype object for memory-efficient method sharing.
 * All instances created with this prototype will share the same method references.
 *
 * For memoized methods, the memo state is lazily created and stored on each instance.
 * This provides the best of both worlds: shared method code + per-instance caching.
 */
declare function assignPrototypeAPIs<TFeatures extends TableFeatures, TData extends RowData, TDeps extends ReadonlyArray<any>, TDepArgs>(feature: keyof TFeatures & string, prototype: Record<string, any>, table: Table<TFeatures, TData>, apis: PrototypeAPIObject<TDeps, NoInfer<TDepArgs>>): void;
/**
 * Looks to run the memoized function with the builder pattern on the object if it exists, otherwise fall back to the static method passed in.
 */
declare function callMemoOrStaticFn<TObject extends Record<string, any>, TArgs extends Array<any>, TReturn>(obj: TObject, fnKey: string, staticFn: (obj: TObject, ...args: TArgs) => TReturn, ...args: TArgs): TReturn;
//#endregion
export { API, APIObject, PrototypeAPI, PrototypeAPIObject, StateSliceEqualityFn, assignPrototypeAPIs, assignTableAPIs, callMemoOrStaticFn, cloneState, copyInstancePropertiesWithoutMemos, flattenBy, functionalUpdate, getFunctionNameInfo, hasOwn, isFunction, makeObjectMap, makeStateUpdater, memo, setStateSlice, skipFirstRun, stateSlicesEqual, tableMemo };