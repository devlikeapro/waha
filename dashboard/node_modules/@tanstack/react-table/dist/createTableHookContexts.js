'use client';

import { createContext, useContext } from "react";

//#region src/createTableHookContexts.tsx
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
function createTableHookContexts() {
	const tableContext = createContext(null);
	const cellContext = createContext(null);
	const headerContext = createContext(null);
	/**
	* Access the table instance from within an `AppTable` wrapper bound to these
	* scoped contexts. `TFeatures` is known; the registered component maps are not
	* (see {@link createTableHookContexts}).
	*/
	function useTableContext() {
		const table = useContext(tableContext);
		if (!table) throw new Error("`useTableContext` must be used within an `AppTable` component. Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.");
		return table;
	}
	/**
	* Access the cell instance from within an `AppCell` wrapper bound to these
	* scoped contexts.
	*/
	function useCellContext() {
		const cell = useContext(cellContext);
		if (!cell) throw new Error("`useCellContext` must be used within an `AppCell` component. Make sure your component is wrapped with `<table.AppCell cell={cell}>...</table.AppCell>`.");
		return cell;
	}
	/**
	* Access the header instance from within an `AppHeader` or `AppFooter` wrapper
	* bound to these scoped contexts.
	*/
	function useHeaderContext() {
		const header = useContext(headerContext);
		if (!header) throw new Error("`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.");
		return header;
	}
	return {
		tableContext,
		cellContext,
		headerContext,
		useTableContext,
		useCellContext,
		useHeaderContext
	};
}

//#endregion
export { createTableHookContexts };