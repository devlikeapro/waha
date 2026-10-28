//#region src/flex-render.ts
/**
* Renders a static value or render function with the provided props.
*
* Framework adapters use this helper to support column definitions that contain either plain values or template functions.
*/
function flexRender(comp, props) {
	if (comp == null) return null;
	if (typeof comp === "function") return comp(props);
	return comp;
}
/**
* Renders a static value or render function with the provided props.
*
* Framework adapters use this helper to support column definitions that contain either plain values or template functions.
*/
function FlexRender(props) {
	if ("cell" in props && props.cell) {
		const cell = props.cell;
		const def = cell.column.columnDef;
		const groupingCell = cell;
		const groupingDef = def;
		if (groupingCell.getIsAggregated?.()) return flexRender(groupingDef.aggregatedCell ?? def.cell, cell.getContext());
		if (groupingCell.getIsPlaceholder?.()) return null;
		return flexRender(def.cell, cell.getContext());
	}
	if ("header" in props && props.header) return flexRender(props.header.column.columnDef.header, props.header.getContext());
	if ("footer" in props && props.footer) return flexRender(props.footer.column.columnDef.footer, props.footer.getContext());
	return null;
}

//#endregion
export { FlexRender, flexRender };