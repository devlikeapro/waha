import { ReactTable } from "./useTable.js";
import { AccessorFn, AccessorFnColumnDef, AccessorKeyColumnDef, Cell, CellContext, CellData, Column, ColumnDef, DeepKeys, DeepValue, DisplayColumnDef, GroupColumnDef, Header, IdentifiedColumnDef, NoInfer, Row, RowData, Table, TableFeatures, TableOptions, TableState } from "@tanstack/table-core";
import { ComponentType, Context, ReactNode } from "react";
//#region src/createTableHook.d.ts
/**
 * Enhanced CellContext with pre-bound cell components.
 * The `cell` property includes the registered cellComponents.
 */
type AppCellContext<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData, TCellComponents extends Record<string, ComponentType<any>>> = {
  cell: Cell<TFeatures, TData, TValue> & TCellComponents & {
    FlexRender: () => ReactNode;
  };
  column: Column<TFeatures, TData, TValue>;
  getValue: CellContext<TFeatures, TData, TValue>['getValue'];
  renderValue: CellContext<TFeatures, TData, TValue>['renderValue'];
  row: Row<TFeatures, TData>;
  table: Table<TFeatures, TData>;
};
/**
 * Enhanced HeaderContext with pre-bound header components.
 * The `header` property includes the registered headerComponents.
 */
type AppHeaderContext<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData, THeaderComponents extends Record<string, ComponentType<any>>> = {
  column: Column<TFeatures, TData, TValue>;
  header: Header<TFeatures, TData, TValue> & THeaderComponents & {
    FlexRender: () => ReactNode;
  };
  table: Table<TFeatures, TData>;
};
/**
 * Template type for column definitions that can be a string or a function.
 */
type AppColumnDefTemplate<TProps extends object> = string | ((props: TProps) => any);
/**
 * Enhanced column definition base with pre-bound components in cell/header/footer contexts.
 */
type AppColumnDefBase<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData, TCellComponents extends Record<string, ComponentType<any>>, THeaderComponents extends Record<string, ComponentType<any>>> = Omit<IdentifiedColumnDef<TFeatures, TData, TValue>, 'cell' | 'header' | 'footer'> & {
  cell?: AppColumnDefTemplate<AppCellContext<TFeatures, TData, TValue, TCellComponents>>;
  header?: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, TValue, THeaderComponents>>;
  footer?: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, TValue, THeaderComponents>>;
};
/**
 * Enhanced display column definition with pre-bound components.
 */
type AppDisplayColumnDef<TFeatures extends TableFeatures, TData extends RowData, TCellComponents extends Record<string, ComponentType<any>>, THeaderComponents extends Record<string, ComponentType<any>>> = Omit<DisplayColumnDef<TFeatures, TData, unknown>, 'cell' | 'header' | 'footer'> & {
  cell?: AppColumnDefTemplate<AppCellContext<TFeatures, TData, unknown, TCellComponents>>;
  header?: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>>;
  footer?: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>>;
};
/**
 * Enhanced group column definition with pre-bound components.
 */
type AppGroupColumnDef<TFeatures extends TableFeatures, TData extends RowData, TCellComponents extends Record<string, ComponentType<any>>, THeaderComponents extends Record<string, ComponentType<any>>> = Omit<GroupColumnDef<TFeatures, TData, unknown>, 'cell' | 'header' | 'footer' | 'columns'> & {
  cell?: AppColumnDefTemplate<AppCellContext<TFeatures, TData, unknown, TCellComponents>>;
  header?: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>>;
  footer?: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>>;
  columns?: ReadonlyArray<ColumnDef<TFeatures, TData, unknown>>;
};
/**
 * Enhanced column helper with pre-bound components in cell/header/footer contexts.
 * This enables TypeScript to know about the registered components when defining columns.
 */
type AppColumnHelper<TFeatures extends TableFeatures, TData extends RowData, TCellComponents extends Record<string, ComponentType<any>>, THeaderComponents extends Record<string, ComponentType<any>>> = {
  /**
   * Creates a data column definition with an accessor key or function.
   * The cell, header, and footer contexts include pre-bound components.
   */
  accessor: <TAccessor extends AccessorFn<TData> | DeepKeys<TData>, TValue extends (TAccessor extends AccessorFn<TData, infer TReturn> ? TReturn : TAccessor extends DeepKeys<TData> ? DeepValue<TData, TAccessor> : never)>(accessor: TAccessor, column: TAccessor extends AccessorFn<TData> ? AppColumnDefBase<TFeatures, TData, TValue, TCellComponents, THeaderComponents> & {
    id: string;
  } : AppColumnDefBase<TFeatures, TData, TValue, TCellComponents, THeaderComponents>) => TAccessor extends AccessorFn<TData> ? AccessorFnColumnDef<TFeatures, TData, TValue> : AccessorKeyColumnDef<TFeatures, TData, TValue>;
  /**
   * Wraps an array of column definitions to preserve each column's individual TValue type.
   */
  columns: <TColumns extends ReadonlyArray<ColumnDef<TFeatures, TData, any>>>(columns: [...TColumns]) => Array<ColumnDef<TFeatures, TData, any>> & [...TColumns];
  /**
   * Creates a display column definition for non-data columns.
   * The cell, header, and footer contexts include pre-bound components.
   */
  display: (column: AppDisplayColumnDef<TFeatures, TData, TCellComponents, THeaderComponents>) => DisplayColumnDef<TFeatures, TData, unknown>;
  /**
   * Creates a group column definition with nested child columns.
   * The cell, header, and footer contexts include pre-bound components.
   */
  group: (column: AppGroupColumnDef<TFeatures, TData, TCellComponents, THeaderComponents>) => GroupColumnDef<TFeatures, TData, unknown>;
};
/**
 * Options for creating a table hook with pre-bound components and default table options.
 * Extends all TableOptions except 'columns' | 'data' | 'store' | 'state' | 'initialState'.
 */
type CreateTableHookOptions<TFeatures extends TableFeatures, TTableComponents extends Record<string, ComponentType<any>>, TCellComponents extends Record<string, ComponentType<any>>, THeaderComponents extends Record<string, ComponentType<any>>> = Omit<TableOptions<TFeatures, any>, 'columns' | 'data' | 'store' | 'state' | 'initialState'> & {
  /**
   * Table-level components that need access to the table instance.
   * These are available directly on the table object returned by useAppTable.
   * Use `useTableContext()` inside these components.
   * @example { PaginationControls, GlobalFilter, RowCount }
   */
  tableComponents?: TTableComponents;
  /**
   * Cell-level components that need access to the cell instance.
   * These are available on the cell object passed to AppCell's children.
   * Use `useCellContext()` inside these components.
   * @example { TextCell, NumberCell, DateCell, CurrencyCell }
   */
  cellComponents?: TCellComponents;
  /**
   * Header-level components that need access to the header instance.
   * These are available on the header object passed to AppHeader/AppFooter's children.
   * Use `useHeaderContext()` inside these components.
   * @example { SortIndicator, ColumnFilter, ResizeHandle }
   */
  headerComponents?: THeaderComponents;
  /**
   * A custom React context for the table instance (read with `useContext` inside
   * your `tableComponents`). Optional: defaults to a shared module-scoped context.
   * Only pass your own (created via `createContext`) when you need to isolate this
   * table's context from other tables, e.g. when nesting one table inside another.
   */
  tableContext?: Context<ReactTable<any, any>>;
  /**
   * A custom React context for the cell instance, used inside your `cellComponents`.
   * @see {@link CreateTableHookOptions.tableContext}
   */
  cellContext?: Context<Cell<any, any, any>>;
  /**
   * A custom React context for the header instance, used inside your
   * `headerComponents` (and footer components).
   * @see {@link CreateTableHookOptions.tableContext}
   */
  headerContext?: Context<Header<any, any, any>>;
};
interface CreateTableHookResult<TFeatures extends TableFeatures, TTableComponents extends Record<string, ComponentType<any>>, TCellComponents extends Record<string, ComponentType<any>>, THeaderComponents extends Record<string, ComponentType<any>>> {
  /** The features object that was passed to `createTableHook`. */
  appFeatures: TFeatures;
  /**
   * A column helper pre-bound to `TFeatures` and the registered components, so
   * the cell/header/footer render props expose the bound components.
   */
  createAppColumnHelper: <TData extends RowData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
  /**
   * Creates a table with the `App*` wrapper components and registered
   * `tableComponents` attached. `TData` is inferred from the `data` option.
   */
  useAppTable: <TData extends RowData, TSelected = TableState<TFeatures>>(tableOptions: Omit<TableOptions<TFeatures, TData>, 'features'>, selector?: (state: TableState<TFeatures>) => TSelected) => AppReactTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
  /**
   * Reads the table provided by the nearest `<table.AppTable>`. This is the same
   * extended instance `useAppTable` returns, so the `App*` components and your
   * `tableComponents` are available on it.
   *
   * Pass `TSelected` to match the selector you gave `useAppTable`, so
   * `table.state` is typed as the selected slice. It cannot be inferred
   * automatically (React context does not carry the provider's generics), so it
   * defaults to the full table state, which is correct for the common case of
   * `useAppTable` without a selector.
   */
  useTableContext: <TData extends RowData = RowData, TSelected = TableState<TFeatures>>() => AppReactTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
  /**
   * Reads the cell provided by the nearest `<table.AppCell>`, extended with your
   * `cellComponents` and a context-bound `FlexRender`.
   */
  useCellContext: <TValue extends CellData = CellData>() => Cell<TFeatures, any, TValue> & TCellComponents & {
    FlexRender: () => ReactNode;
  };
  /**
   * Reads the header provided by the nearest `<table.AppHeader>` /
   * `<table.AppFooter>`, extended with your `headerComponents` and a
   * context-bound `FlexRender`.
   */
  useHeaderContext: <TValue extends CellData = CellData>() => Header<TFeatures, any, TValue> & THeaderComponents & {
    FlexRender: () => ReactNode;
  };
}
/**
 * Props for AppTable component - without selector
 */
interface AppTablePropsWithoutSelector {
  children: ReactNode;
  selector?: never;
}
/**
 * Props for AppTable component - with selector
 */
interface AppTablePropsWithSelector<TFeatures extends TableFeatures, TSelected> {
  children: (state: TSelected) => ReactNode;
  selector: (state: TableState<TFeatures>) => TSelected;
}
/**
 * Props for AppCell component - without selector
 */
interface AppCellPropsWithoutSelector<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData, TCellComponents extends Record<string, ComponentType<any>>> {
  cell: Cell<TFeatures, TData, TValue>;
  children: (cell: Cell<TFeatures, TData, TValue> & TCellComponents & {
    FlexRender: () => ReactNode;
  }) => ReactNode;
  selector?: never;
}
/**
 * Props for AppCell component - with selector
 */
interface AppCellPropsWithSelector<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData, TCellComponents extends Record<string, ComponentType<any>>, TSelected> {
  cell: Cell<TFeatures, TData, TValue>;
  children: (cell: Cell<TFeatures, TData, TValue> & TCellComponents & {
    FlexRender: () => ReactNode;
  }, state: TSelected) => ReactNode;
  selector: (state: TableState<TFeatures>) => TSelected;
}
/**
 * Props for AppHeader/AppFooter component - without selector
 */
interface AppHeaderPropsWithoutSelector<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData, THeaderComponents extends Record<string, ComponentType<any>>> {
  header: Header<TFeatures, TData, TValue>;
  children: (header: Header<TFeatures, TData, TValue> & THeaderComponents & {
    FlexRender: () => ReactNode;
  }) => ReactNode;
  selector?: never;
}
/**
 * Props for AppHeader/AppFooter component - with selector
 */
interface AppHeaderPropsWithSelector<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData, THeaderComponents extends Record<string, ComponentType<any>>, TSelected> {
  header: Header<TFeatures, TData, TValue>;
  children: (header: Header<TFeatures, TData, TValue> & THeaderComponents & {
    FlexRender: () => ReactNode;
  }, state: TSelected) => ReactNode;
  selector: (state: TableState<TFeatures>) => TSelected;
}
/**
 * Component type for AppCell - wraps a cell and provides cell context with optional Subscribe
 */
interface AppCellComponent<TFeatures extends TableFeatures, TData extends RowData, TCellComponents extends Record<string, ComponentType<any>>> {
  <TValue extends CellData = CellData>(props: AppCellPropsWithoutSelector<TFeatures, TData, TValue, TCellComponents>): ReactNode;
  <TValue extends CellData = CellData, TSelected = unknown>(props: AppCellPropsWithSelector<TFeatures, TData, TValue, TCellComponents, TSelected>): ReactNode;
}
/**
 * Component type for AppHeader/AppFooter - wraps a header and provides header context with optional Subscribe
 */
interface AppHeaderComponent<TFeatures extends TableFeatures, TData extends RowData, THeaderComponents extends Record<string, ComponentType<any>>> {
  <TValue extends CellData = CellData>(props: AppHeaderPropsWithoutSelector<TFeatures, TData, TValue, THeaderComponents>): ReactNode;
  <TValue extends CellData = CellData, TSelected = unknown>(props: AppHeaderPropsWithSelector<TFeatures, TData, TValue, THeaderComponents, TSelected>): ReactNode;
}
/**
 * Component type for AppTable - root wrapper with optional Subscribe
 */
interface AppTableComponent<TFeatures extends TableFeatures> {
  (props: AppTablePropsWithoutSelector): ReactNode;
  <TSelected>(props: AppTablePropsWithSelector<TFeatures, TSelected>): ReactNode;
}
/**
 * Extended table API returned by useAppTable with all App wrapper components
 */
type AppReactTable<TFeatures extends TableFeatures, TData extends RowData, TSelected, TTableComponents extends Record<string, ComponentType<any>>, TCellComponents extends Record<string, ComponentType<any>>, THeaderComponents extends Record<string, ComponentType<any>>> = ReactTable<TFeatures, TData, TSelected> & NoInfer<TTableComponents> & {
  /**
   * Root wrapper component that provides table context with optional Subscribe.
   * @example
   * ```tsx
   * // Without selector - children is ReactNode
   * <table.AppTable>
   *   <table>...</table>
   * </table.AppTable>
   *
   * // With selector - children receives selected state
   * <table.AppTable selector={(s) => s.pagination}>
   *   {(pagination) => <div>Page {pagination.pageIndex}</div>}
   * </table.AppTable>
   * ```
   */
  AppTable: AppTableComponent<TFeatures>;
  /**
   * Wraps a cell and provides cell context with pre-bound cellComponents.
   * Optionally accepts a selector for Subscribe functionality.
   * @example
   * ```tsx
   * // Without selector
   * <table.AppCell cell={cell}>
   *   {(c) => <td><c.TextCell /></td>}
   * </table.AppCell>
   *
   * // With selector - children receives cell and selected state
   * <table.AppCell cell={cell} selector={(s) => s.columnFilters}>
   *   {(c, filters) => <td>{filters.length}</td>}
   * </table.AppCell>
   * ```
   */
  AppCell: AppCellComponent<TFeatures, TData, NoInfer<TCellComponents>>;
  /**
   * Wraps a header and provides header context with pre-bound headerComponents.
   * Optionally accepts a selector for Subscribe functionality.
   * @example
   * ```tsx
   * // Without selector
   * <table.AppHeader header={header}>
   *   {(h) => <th><h.SortIndicator /></th>}
   * </table.AppHeader>
   *
   * // With selector
   * <table.AppHeader header={header} selector={(s) => s.sorting}>
   *   {(h, sorting) => <th>{sorting.length} sorted</th>}
   * </table.AppHeader>
   * ```
   */
  AppHeader: AppHeaderComponent<TFeatures, TData, NoInfer<THeaderComponents>>;
  /**
   * Wraps a footer and provides header context with pre-bound headerComponents.
   * Optionally accepts a selector for Subscribe functionality.
   * @example
   * ```tsx
   * <table.AppFooter header={footer}>
   *   {(f) => <td><table.FlexRender footer={footer} /></td>}
   * </table.AppFooter>
   * ```
   */
  AppFooter: AppHeaderComponent<TFeatures, TData, NoInfer<THeaderComponents>>;
};
/**
 * Creates a custom table hook with pre-bound components for composition.
 *
 * This is the table equivalent of TanStack Form's `createFormHook`. It allows you to:
 * - Define features, row models, and default options once, shared across all tables
 * - Register reusable table, cell, and header components
 * - Access table/cell/header instances via context in those components
 * - Get a `useAppTable` hook that returns an extended table with App wrapper components
 * - Get a `createAppColumnHelper` function pre-bound to your features
 *
 * @example
 * ```tsx
 * // hooks/table.ts
 * export const {
 *   useAppTable,
 *   createAppColumnHelper,
 *   useTableContext,
 *   useCellContext,
 *   useHeaderContext,
 * } = createTableHook({
 *   features: tableFeatures({
 *     rowPaginationFeature,
 *     rowSortingFeature,
 *     columnFilteringFeature,
 *     paginatedRowModel: createPaginatedRowModel(),
 *     sortedRowModel: createSortedRowModel(),
 *     filteredRowModel: createFilteredRowModel(),
 *     sortFns,
 *     filterFns,
 *   }),
 *   tableComponents: { PaginationControls, RowCount },
 *   cellComponents: { TextCell, NumberCell },
 *   headerComponents: { SortIndicator, ColumnFilter },
 * })
 *
 * // Create column helper with TFeatures already bound
 * const columnHelper = createAppColumnHelper<Person>()
 *
 * // components/table-components.tsx
 * function PaginationControls() {
 *   const table = useTableContext() // TFeatures already known!
 *   return <table.Subscribe selector={(s) => s.pagination}>...</table.Subscribe>
 * }
 *
 * // features/users.tsx
 * function UsersTable({ data }: { data: Person[] }) {
 *   const table = useAppTable({
 *     columns,
 *     data, // TData inferred from Person[]
 *   })
 *
 *   return (
 *     <table.AppTable>
 *       <table>
 *         <thead>
 *           {table.getHeaderGroups().map(headerGroup => (
 *             <tr key={headerGroup.id}>
 *               {headerGroup.headers.map(h => (
 *                 <table.AppHeader header={h} key={h.id}>
 *                   {(header) => (
 *                     <th>
 *                       <table.FlexRender header={h} />
 *                       <header.SortIndicator />
 *                     </th>
 *                   )}
 *                 </table.AppHeader>
 *               ))}
 *             </tr>
 *           ))}
 *         </thead>
 *         <tbody>
 *           {table.getRowModel().rows.map(row => (
 *             <tr key={row.id}>
 *               {row.getAllCells().map(c => (
 *                 <table.AppCell cell={c} key={c.id}>
 *                   {(cell) => <td><cell.TextCell /></td>}
 *                 </table.AppCell>
 *               ))}
 *             </tr>
 *           ))}
 *         </tbody>
 *       </table>
 *       <table.PaginationControls />
 *     </table.AppTable>
 *   )
 * }
 * ```
 */
declare function createTableHook<TFeatures extends TableFeatures, const TTableComponents extends Record<string, ComponentType<any>>, const TCellComponents extends Record<string, ComponentType<any>>, const THeaderComponents extends Record<string, ComponentType<any>>>({ tableComponents, cellComponents, headerComponents, tableContext, cellContext, headerContext, ...defaultTableOptions }: CreateTableHookOptions<TFeatures, TTableComponents, TCellComponents, THeaderComponents>): CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents>;
//#endregion
export { AppCellComponent, AppCellContext, AppCellPropsWithSelector, AppCellPropsWithoutSelector, AppColumnDefBase, AppColumnDefTemplate, AppColumnHelper, AppDisplayColumnDef, AppGroupColumnDef, AppHeaderComponent, AppHeaderContext, AppHeaderPropsWithSelector, AppHeaderPropsWithoutSelector, AppReactTable, AppTableComponent, AppTablePropsWithSelector, AppTablePropsWithoutSelector, CreateTableHookOptions, CreateTableHookResult, createTableHook };