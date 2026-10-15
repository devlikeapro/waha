'use client';

import { FlexRender } from "./FlexRender.js";
import { useTable } from "./useTable.js";
import { createColumnHelper } from "@tanstack/table-core";
import React, { createContext, useContext, useMemo, useRef } from "react";

//#region src/createTableHook.tsx
const sharedTableContext = createContext(null);
const sharedCellContext = createContext(null);
const sharedHeaderContext = createContext(null);
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
function createTableHook({ tableComponents, cellComponents, headerComponents, tableContext = sharedTableContext, cellContext = sharedCellContext, headerContext = sharedHeaderContext, ...defaultTableOptions }) {
	const TableContext = tableContext;
	const CellContext = cellContext;
	const HeaderContext = headerContext;
	/**
	* Create a column helper pre-bound to the features and components configured in this table hook.
	* The cell, header, and footer contexts include pre-bound components (e.g., `cell.TextCell`).
	* @example
	* ```tsx
	* const columnHelper = createAppColumnHelper<Person>()
	*
	* const columns = [
	*   columnHelper.accessor('firstName', {
	*     header: 'First Name',
	*     cell: ({ cell }) => <cell.TextCell />, // cell has pre-bound components!
	*   }),
	*   columnHelper.accessor('age', {
	*     header: 'Age',
	*     cell: ({ cell }) => <cell.NumberCell />,
	*   }),
	* ]
	* ```
	*/
	function createAppColumnHelper() {
		return createColumnHelper();
	}
	/**
	* Access the table instance from within an `AppTable` wrapper.
	* Use this in custom `tableComponents` passed to `createTableHook`.
	* TFeatures is already known from the createTableHook call.
	*
	* @example
	* ```tsx
	* function PaginationControls() {
	*   const table = useTableContext()
	*   return (
	*     <table.Subscribe selector={(s) => s.pagination}>
	*       {(pagination) => (
	*         <div>
	*           <button onClick={() => table.previousPage()}>Prev</button>
	*           <span>Page {pagination.pageIndex + 1}</span>
	*           <button onClick={() => table.nextPage()}>Next</button>
	*         </div>
	*       )}
	*     </table.Subscribe>
	*   )
	* }
	* ```
	*/
	function useTableContext() {
		const table = useContext(TableContext);
		if (!table) throw new Error("`useTableContext` must be used within an `AppTable` component. Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.");
		return table;
	}
	/**
	* Access the cell instance from within an `AppCell` wrapper.
	* Use this in custom `cellComponents` passed to `createTableHook`.
	* TFeatures is already known from the createTableHook call.
	*
	* @example
	* ```tsx
	* function TextCell() {
	*   const cell = useCellContext<string>()
	*   return <span>{cell.getValue()}</span>
	* }
	*
	* function NumberCell({ format }: { format?: Intl.NumberFormatOptions }) {
	*   const cell = useCellContext<number>()
	*   return <span>{cell.getValue().toLocaleString(undefined, format)}</span>
	* }
	* ```
	*/
	function useCellContext() {
		const cell = useContext(CellContext);
		if (!cell) throw new Error("`useCellContext` must be used within an `AppCell` component. Make sure your component is wrapped with `<table.AppCell cell={cell}>...</table.AppCell>`.");
		return cell;
	}
	/**
	* Access the header instance from within an `AppHeader` or `AppFooter` wrapper.
	* Use this in custom `headerComponents` passed to `createTableHook`.
	* TFeatures is already known from the createTableHook call.
	*
	* @example
	* ```tsx
	* function SortIndicator() {
	*   const header = useHeaderContext()
	*   const sorted = header.column.getIsSorted()
	*   return sorted === 'asc' ? '🔼' : sorted === 'desc' ? '🔽' : null
	* }
	*
	* function ColumnFilter() {
	*   const header = useHeaderContext()
	*   if (!header.column.getCanFilter()) return null
	*   return (
	*     <input
	*       value={(header.column.getFilterValue() ?? '') as string}
	*       onChange={(e) => header.column.setFilterValue(e.target.value)}
	*       placeholder="Filter..."
	*     />
	*   )
	* }
	* ```
	*/
	function useHeaderContext() {
		const header = useContext(HeaderContext);
		if (!header) throw new Error("`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.");
		return header;
	}
	/**
	* Context-aware FlexRender component for cells.
	* Uses the cell from context, so no need to pass cell prop.
	*/
	function CellFlexRender() {
		const cell = useCellContext();
		return /* @__PURE__ */ React.createElement(FlexRender, { cell });
	}
	/**
	* Context-aware FlexRender component for headers.
	* Uses the header from context, so no need to pass header prop.
	*/
	function HeaderFlexRender() {
		const header = useHeaderContext();
		return /* @__PURE__ */ React.createElement(FlexRender, { header });
	}
	/**
	* Context-aware FlexRender component for footers.
	* Uses the header from context, so no need to pass footer prop.
	*/
	function FooterFlexRender() {
		const header = useHeaderContext();
		return /* @__PURE__ */ React.createElement(FlexRender, { footer: header });
	}
	/**
	* Enhanced useTable hook that returns a table with App wrapper components
	* and pre-bound tableComponents attached directly to the table object.
	*
	* Default options from createTableHook are automatically merged with
	* the options passed here. Options passed here take precedence.
	*
	* TFeatures is already known from the createTableHook call; TData is inferred from the data prop.
	*/
	function useAppTable(tableOptions, selector) {
		const table = useTable({
			...defaultTableOptions,
			...tableOptions
		}, selector);
		const tableRef = useRef(table);
		tableRef.current = table;
		const AppTable = useMemo(() => {
			function AppTableImpl(props) {
				const { children, selector: appTableSelector } = props;
				const currentTable = tableRef.current;
				return /* @__PURE__ */ React.createElement(TableContext.Provider, { value: currentTable }, appTableSelector ? /* @__PURE__ */ React.createElement(currentTable.Subscribe, { selector: appTableSelector }, (state) => children(state)) : children);
			}
			return AppTableImpl;
		}, []);
		const AppCell = useMemo(() => {
			function AppCellImpl(props) {
				const { cell, children, selector: appCellSelector } = props;
				const currentTable = tableRef.current;
				const extendedCell = Object.assign(cell, {
					FlexRender: CellFlexRender,
					...cellComponents
				});
				return /* @__PURE__ */ React.createElement(CellContext.Provider, { value: cell }, appCellSelector ? /* @__PURE__ */ React.createElement(currentTable.Subscribe, { selector: appCellSelector }, (state) => children(extendedCell, state)) : children(extendedCell));
			}
			return AppCellImpl;
		}, []);
		const AppHeader = useMemo(() => {
			function AppHeaderImpl(props) {
				const { header, children, selector: appHeaderSelector } = props;
				const currentTable = tableRef.current;
				const extendedHeader = Object.assign(header, {
					FlexRender: HeaderFlexRender,
					...headerComponents
				});
				return /* @__PURE__ */ React.createElement(HeaderContext.Provider, { value: header }, appHeaderSelector ? /* @__PURE__ */ React.createElement(currentTable.Subscribe, { selector: appHeaderSelector }, (state) => children(extendedHeader, state)) : children(extendedHeader));
			}
			return AppHeaderImpl;
		}, []);
		const AppFooter = useMemo(() => {
			function AppFooterImpl(props) {
				const { header, children, selector: appFooterSelector } = props;
				const currentTable = tableRef.current;
				const extendedHeader = Object.assign(header, {
					FlexRender: FooterFlexRender,
					...headerComponents
				});
				return /* @__PURE__ */ React.createElement(HeaderContext.Provider, { value: header }, appFooterSelector ? /* @__PURE__ */ React.createElement(currentTable.Subscribe, { selector: appFooterSelector }, (state) => children(extendedHeader, state)) : children(extendedHeader));
			}
			return AppFooterImpl;
		}, []);
		return useMemo(() => {
			return Object.assign(table, {
				AppTable,
				AppCell,
				AppHeader,
				AppFooter,
				...tableComponents
			});
		}, [
			table,
			AppTable,
			AppCell,
			AppHeader,
			AppFooter
		]);
	}
	return {
		appFeatures: defaultTableOptions.features,
		createAppColumnHelper,
		useAppTable,
		useTableContext,
		useCellContext,
		useHeaderContext
	};
}

//#endregion
export { createTableHook };