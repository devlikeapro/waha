import React from "react";

//#region src/FlexRender.tsx
function isReactComponent(component) {
	return isClassComponent(component) || typeof component === "function" || isExoticComponent(component);
}
function isClassComponent(component) {
	return typeof component === "function" && (() => {
		const proto = Object.getPrototypeOf(component);
		return proto.prototype && proto.prototype.isReactComponent;
	})();
}
function isExoticComponent(component) {
	return typeof component === "object" && typeof component.$$typeof === "symbol" && ["react.memo", "react.forward_ref"].includes(component.$$typeof.description);
}
/**
* If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
* @example flexRender(cell.column.columnDef.cell, cell.getContext())
*/
function flexRender(Comp, props) {
	if (Comp === null || Comp === void 0) return null;
	return isReactComponent(Comp) ? /* @__PURE__ */ React.createElement(Comp, props) : Comp;
}
/**
* Simplified component wrapper of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.
* Only one prop (`cell`, `header`, or `footer`) may be passed.
* @example
* ```tsx
* <FlexRender cell={cell} />
* <FlexRender header={header} />
* <FlexRender footer={footer} />
* ```
*
* This replaces calling `flexRender` directly like this:
* ```tsx
* flexRender(cell.column.columnDef.cell, cell.getContext())
* flexRender(header.column.columnDef.header, header.getContext())
* flexRender(footer.column.columnDef.footer, footer.getContext())
* ```
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