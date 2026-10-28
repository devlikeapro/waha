'use client';

import { FlexRender } from "./FlexRender.js";
import { Subscribe } from "./Subscribe.js";
import { reactReactivity } from "./reactivity.js";
import { constructTable } from "@tanstack/table-core";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { shallow, useSelector } from "@tanstack/react-store";
import { createRenderPhaseSource } from "@tanstack/table-core/reactivity";
import { table_publishExternalState, table_setOptions } from "@tanstack/table-core/static-functions";

//#region src/useTable.ts
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
/**
* Creates a React table instance backed by TanStack Store atoms.
*
* The optional selector projects from `table.store`; the selected value is
* exposed on `table.state` and compared shallowly for React re-renders. Omit
* the selector to subscribe to every registered table state slice, or pass a
* narrower selector and use `table.Subscribe` lower in the tree for targeted
* subscriptions.
*
* @example
* ```tsx
* const table = useTable(
*   {
*     features,
*     columns,
*     data,
*   },
*   (state) => ({ pagination: state.pagination }),
* )
*
* table.state.pagination
* ```
*/
function useTable(tableOptions, selector) {
	const [{ table, rootSource }] = useState(() => {
		const tableInstance = constructTable({
			...tableOptions,
			features: {
				coreReactivityFeature: reactReactivity(),
				...tableOptions.features
			}
		});
		tableInstance.Subscribe = ((props) => {
			return Subscribe({
				...props,
				source: props.source ?? tableInstance.store
			});
		});
		tableInstance.FlexRender = FlexRender;
		return {
			table: tableInstance,
			rootSource: createRenderPhaseSource(tableInstance.store, shallow)
		};
	});
	const coreTable = table;
	table_setOptions(coreTable, (prev) => ({
		...prev,
		...tableOptions
	}), { syncExternalState: false });
	const controlledState = coreTable.options.state;
	const renderSnapshot = rootSource.get();
	const state = useSelector(rootSource, selector, { compare: shallow });
	useIsomorphicLayoutEffect(() => {
		rootSource.markCommitted(renderSnapshot);
		table_publishExternalState(coreTable, controlledState ?? null, shallow);
	});
	return useMemo(() => ({
		...table,
		options: tableOptions,
		state
	}), [
		table,
		tableOptions,
		state
	]);
}

//#endregion
export { useTable };