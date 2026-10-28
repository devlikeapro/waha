//#region src/helpers/columnHelper.ts
/**
* Creates helper functions for authoring column definitions with stronger value
* inference.
*
* `accessor` infers `TValue` from an accessor key or accessor function,
* `display` creates non-data columns, `group` creates parent columns, and
* `columns` preserves tuple-level value types for arrays. At runtime these
* helpers only return column definition objects.
*
* @example
* ```tsx
* const helper = createColumnHelper<typeof features, Person>() // features is the result of `tableFeatures({})` helper
* const columns = [
*  helper.display({ id: 'actions', header: 'Actions' }),
*  helper.accessor('firstName', {}),
*  helper.accessor((row) => row.lastName, { id: 'lastName' }),
* ]
* ```
*/
function createColumnHelper() {
	return {
		accessor: (accessor, column) => {
			return typeof accessor === "function" ? {
				...column,
				accessorFn: accessor
			} : {
				...column,
				accessorKey: accessor
			};
		},
		columns: (columns) => columns,
		display: (column) => column,
		group: (column) => column
	};
}

//#endregion
export { createColumnHelper };