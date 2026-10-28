import { TableFeatures, TableState } from "@tanstack/table-core";
import { FunctionComponent, ReactNode } from "react";
import { Atom, ReadonlyAtom, ReadonlyStore, Store } from "@tanstack/react-store";
//#region src/Subscribe.d.ts
type SubscribeSource<TValue> = Atom<TValue> | ReadonlyAtom<TValue> | Store<TValue> | ReadonlyStore<TValue>;
/**
 * Subscribe to `table.store` (full table state). The selector receives the full
 * {@link TableState}.
 */
type SubscribePropsWithStore<TFeatures extends TableFeatures, TSelected> = {
  source: SubscribeSource<TableState<TFeatures>>;
  /**
   * Select from full table state. Re-renders when the selected value changes
   * (shallow compare).
   *
   * Required in store mode so you never accidentally subscribe to the whole
   * store without an explicit projection.
   */
  selector: (state: TableState<TFeatures>) => TSelected;
  children: ((state: TSelected) => ReactNode) | ReactNode;
};
/**
 * Subscribe to the full value of a source (e.g. `table.atoms.rowSelection` or
 * `table.optionsStore`). Omitting `selector` is equivalent to the identity
 * selector — children receive `TSourceValue`.
 */
type SubscribePropsWithSourceIdentity<TSourceValue> = {
  source: SubscribeSource<TSourceValue>;
  selector?: undefined;
  children: ((state: TSourceValue) => ReactNode) | ReactNode;
};
/**
 * Subscribe to a projected value from a source (atom or store). The selector
 * receives the source value; children receive the projected `TSelected`.
 */
type SubscribePropsWithSourceWithSelector<TSourceValue, TSelected> = {
  source: SubscribeSource<TSourceValue>;
  selector: (state: TSourceValue) => TSelected;
  children: ((state: TSelected) => ReactNode) | ReactNode;
};
/**
 * Subscribe to a single source — atom or store (identity or projected). Prefer
 * {@link SubscribePropsWithSourceIdentity} or {@link SubscribePropsWithSourceWithSelector}
 * for clearer inference when `selector` is omitted.
 */
type SubscribePropsWithSource<TSourceValue, TSelected = TSourceValue> = SubscribePropsWithSourceIdentity<TSourceValue> | SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>;
type SubscribeProps<TFeatures extends TableFeatures, TSelected = unknown, TSourceValue = unknown> = SubscribePropsWithStore<TFeatures, TSelected> | SubscribePropsWithSourceIdentity<TSourceValue> | SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>;
/**
 * A React component that allows you to subscribe to the table state.
 *
 * This is useful for opting into state re-renders for specific parts of the table state.
 *
 * For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
 * contextual typing works. This standalone component uses a union `props` type.
 *
 * @example
 * ```tsx
 * // As a standalone component — full store
 * <Subscribe source={table.store} selector={(state) => ({ rowSelection: state.rowSelection })}>
 *   {({ rowSelection }) => (
 *     <div>Selected rows: {Object.keys(rowSelection).length}</div>
 *   )}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // Entire source (atom or store) — no selector
 * <Subscribe source={table.atoms.rowSelection}>
 *   {(rowSelection) => <div>...</div>}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // Project source value (e.g. one row’s selection)
 * <Subscribe
 *   source={table.atoms.rowSelection}
 *   selector={(rowSelection) => rowSelection?.[row.id]}
 * >
 *   {(selected) => <tr data-selected={!!selected}>...</tr>}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // As table.Subscribe (table instance method)
 * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
 *   {({ rowSelection }) => (
 *     <div>Selected rows: {Object.keys(rowSelection).length}</div>
 *   )}
 * </table.Subscribe>
 * ```
 */
declare function Subscribe<TSourceValue>(props: SubscribePropsWithSourceIdentity<TSourceValue>): ReturnType<FunctionComponent>;
declare function Subscribe<TSourceValue, TSelected>(props: SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>): ReturnType<FunctionComponent>;
declare function Subscribe<TFeatures extends TableFeatures, TSelected>(props: SubscribePropsWithStore<TFeatures, TSelected>): ReturnType<FunctionComponent>;
//#endregion
export { Subscribe, SubscribeProps, SubscribePropsWithSource, SubscribePropsWithSourceIdentity, SubscribePropsWithSourceWithSelector, SubscribePropsWithStore, SubscribeSource };