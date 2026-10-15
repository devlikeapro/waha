import { ReactTable } from "./useTable.js";
import { Cell, CellData, Header, RowData, TableFeatures } from "@tanstack/table-core";
import { Context } from "react";
//#region src/createTableHookContexts.d.ts
/**
 * The object returned by {@link createTableHookContexts}: three scoped React
 * contexts plus matching context hooks.
 */
interface TableHookContexts<TFeatures extends TableFeatures, TData extends RowData> {
  tableContext: Context<ReactTable<any, any>>;
  cellContext: Context<Cell<any, any, any>>;
  headerContext: Context<Header<any, any, any>>;
  useTableContext: <TTableData extends RowData = TData>() => ReactTable<TFeatures, TTableData>;
  useCellContext: <TValue extends CellData = CellData>() => Cell<TFeatures, any, TValue>;
  useHeaderContext: <TValue extends CellData = CellData>() => Header<TFeatures, any, TValue>;
}
/**
 * Creates a fresh, scoped set of table/cell/header contexts (plus matching
 * context hooks) that you can pass into {@link createTableHook}. This mirrors
 * TanStack Form's `createFormHookContexts`.
 *
 * You usually do NOT need this: by default `createTableHook` wires its
 * `AppTable`/`AppCell`/`AppHeader` providers to a shared module-scoped context,
 * and you read it with the `useTableContext`/`useCellContext`/`useHeaderContext`
 * hooks returned from `createTableHook`. Reach for `createTableHookContexts`
 * when you need an *isolated* context, e.g. when nesting one table inside
 * another and a consumer would otherwise read the wrong (nearest) provider.
 *
 * Type-safety note: the hooks returned here are typed with `TFeatures` only.
 * They do NOT know the component maps you register in `createTableHook`
 * (`tableComponents`/`cellComponents`/`headerComponents`), because those are
 * defined later. For the richest types (the `App*` components and your
 * registered components attached), prefer the `use*Context` hooks returned from
 * your `createTableHook` call. The hooks here are the escape hatch for reading
 * context from a module that does not / cannot import the `createTableHook`
 * result.
 *
 * @example
 * ```tsx
 * // scoped-table-context.ts
 * export const {
 *   tableContext,
 *   cellContext,
 *   headerContext,
 *   useTableContext,
 *   useCellContext,
 *   useHeaderContext,
 * } = createTableHookContexts<typeof features>()
 *
 * // table.ts
 * export const { useAppTable } = createTableHook({
 *   features,
 *   tableContext, // <- pass the scoped contexts so the providers use them
 *   cellContext,
 *   headerContext,
 *   tableComponents: { PaginationControls },
 * })
 * ```
 */
declare function createTableHookContexts<TFeatures extends TableFeatures, TData extends RowData = RowData>(): TableHookContexts<TFeatures, TData>;
//#endregion
export { TableHookContexts, createTableHookContexts };