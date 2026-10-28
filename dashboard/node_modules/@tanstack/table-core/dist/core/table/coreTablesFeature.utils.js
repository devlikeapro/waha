import { cloneState, functionalUpdate } from "../../utils.js";

//#region src/core/table/coreTablesFeature.utils.ts
/**
* Synchronizes externally controlled state slices into the table's base atoms.
*
* This keeps `options.state` values mirrored in the atom graph so derived
* atoms, stores, and table APIs read a consistent snapshot.
*
* Adapters that update options during their host's render phase pass the
* state snapshot captured by the committed render as `capturedState` — the
* shared options object may already hold values from a newer render that
* never commits. Pass `null` to publish nothing (a captured "no controlled
* state"); omitting the argument reads the current `table.options.state`
* instead. An optional `compare` suppresses semantically unchanged slice
* writes; the default remains reference equality.
*
* @example
* ```ts
* table_syncExternalStateToBaseAtoms(table)
* table_syncExternalStateToBaseAtoms(table, capturedState ?? null, shallow)
* ```
*/
function table_syncExternalStateToBaseAtoms(table, capturedState, compare = (currentState, externalState) => currentState === externalState) {
	const state = capturedState === void 0 ? table.options.state : capturedState;
	table._reactivity.batch(() => {
		if (state) for (const key in state) {
			const baseAtom = table.baseAtoms[key];
			if (!baseAtom) continue;
			const rawExternalState = state[key];
			const externalState = rawExternalState === void 0 ? table.initialState[key] : rawExternalState;
			if (!compare(table._reactivity.untrack(() => baseAtom.get()), externalState)) baseAtom.set(() => externalState);
		}
	});
}
/**
* Publishes captured controlled state after a host framework commits.
*
* Render-phase adapters stage options without synchronizing base atoms, then
* pass the state captured by the committed render here. The commit signal also
* invalidates ownership changes when no base atom was written.
*/
function table_publishExternalState(table, state, compare = (currentState, externalState) => currentState === externalState) {
	table._reactivity.batch(() => {
		table_syncExternalStateToBaseAtoms(table, state, compare);
		table._reactivity.commit?.();
	});
}
/**
* Resets all internal table base atoms to `table.initialState`, then clears
* transient instance data through registered feature reset hooks.
*
* This resets internally owned state slices in a single reactivity batch. Use
* feature-specific reset APIs when a slice may be externally owned.
*
* @example
* ```ts
* table_reset(table)
* ```
*/
function table_reset(table) {
	const snap = cloneState(table.initialState);
	table._reactivity.batch(() => {
		const keys = Object.keys(snap);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			table.baseAtoms[key].set(snap[key]);
		}
	});
	const features = Object.values(table._features);
	for (let i = 0; i < features.length; i++) features[i].resetTableInstanceData?.(table);
}
/**
* Merges new table options with the current resolved options.
*
* If `options.mergeOptions` is provided, it owns the merge behavior; otherwise
* options are shallow-merged. Static options that should never change after
* initialization are restored on a fresh object so framework merge helpers may
* return readonly getter/proxy objects.
*
* @example
* ```ts
* const options = table_mergeOptions(table, nextOptions)
* ```
*/
function table_mergeOptions(table, newOptions) {
	const { features, atoms, initialState } = table.options;
	if (!table.options.mergeOptions) return {
		...table.options,
		...newOptions,
		features,
		atoms,
		initialState
	};
	const mergedOptions = table.options.mergeOptions(table.options, newOptions);
	const descriptors = { ...Object.getOwnPropertyDescriptors(mergedOptions) };
	return Object.defineProperties(Object.create(Object.getPrototypeOf(mergedOptions)), {
		...descriptors,
		features: {
			value: features,
			enumerable: true,
			configurable: true,
			writable: true
		},
		atoms: {
			value: atoms,
			enumerable: true,
			configurable: true,
			writable: true
		},
		initialState: {
			value: initialState,
			enumerable: true,
			configurable: true,
			writable: true
		}
	});
}
/**
* Updates the table options object.
*
* The updater receives the current resolved options and the merged result is
* immediately assigned to the table instance.
*
* @example
* ```ts
* table_setOptions(table, (old) => old)
* table_setOptions(table, (old) => old, { syncExternalState: false })
* ```
*/
function table_setOptions(table, updater, options) {
	const mergedOptions = table_mergeOptions(table, functionalUpdate(updater, table.options));
	if (table.optionsStore) table.optionsStore.set(() => mergedOptions);
	else table.options = mergedOptions;
	if (options?.syncExternalState !== false) table_publishExternalState(table, mergedOptions.state ?? null);
}

//#endregion
export { table_mergeOptions, table_publishExternalState, table_reset, table_setOptions, table_syncExternalStateToBaseAtoms };