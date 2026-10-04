import { cloneState, hasOwn } from "../../utils.js";
import { table_syncExternalStateToBaseAtoms } from "./coreTablesFeature.utils.js";
import { coreFeatures } from "../coreFeatures.js";
import { atomToStore } from "../reactivity/coreReactivityFeature.utils.js";
import { shallow } from "@tanstack/store";

//#region src/core/table/constructTable.ts
/**
* Builds the initial table state from registered features and user initial state.
*
* Each feature contributes its default state before user-provided `initialState` values are merged in.
*/
function getInitialTableState(features, initialState = {}) {
	Object.values(features).forEach((feature) => {
		initialState = feature.getInitialState?.(initialState) ?? initialState;
	});
	return cloneState(initialState);
}
/**
* Constructs a table instance from normalized table internals.
*
* This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
*/
function constructTable(tableOptions) {
	const _reactivity = tableOptions.features.coreReactivityFeature;
	const { aggregationFns, columnMeta: _columnMeta, coreRowModel, expandedRowModel, facetedMinMaxValues, facetedRowModel, facetedUniqueValues, filterFns, filterMeta: _filterMeta, filteredRowModel, groupedRowModel, paginatedRowModel, sortFns, sortedRowModel, tableMeta: _tableMeta, ...features } = tableOptions.features;
	const table = {
		_cellInstanceInitFns: [],
		_columnInstanceInitFns: [],
		_features: {
			...coreFeatures,
			...features
		},
		_headerGroupInstanceInitFns: [],
		_headerInstanceInitFns: [],
		_reactivity,
		_rowInstanceInitFns: [],
		_rowModelFns: {
			aggregationFns,
			filterFns,
			sortFns
		},
		_rowModels: {},
		atoms: {},
		baseAtoms: {}
	};
	const featuresList = Object.values(table._features);
	const mergedOptions = {
		...featuresList.reduce((obj, feature) => {
			return Object.assign(obj, feature.getDefaultTableOptions?.(table));
		}, {}),
		...tableOptions
	};
	if (_reactivity.wrapExternalAtoms && mergedOptions.atoms) for (const [atomKey, _atom] of Object.entries(mergedOptions.atoms)) {
		const atom = _atom;
		const wrappedAtom = _reactivity.createWritableAtom(atom.get(), { debugName: `externalAtom/${atomKey}` });
		mergedOptions.atoms[atomKey] = wrappedAtom;
		let syncExternal = false;
		const syncAtomToWrappedSub = atom.subscribe((value) => {
			if (syncExternal) return;
			wrappedAtom.set(value);
		});
		const syncWrappedToAtomSub = wrappedAtom.subscribe((value) => {
			syncExternal = true;
			atom.set(value);
			syncExternal = false;
		});
		_reactivity.addSubscription(syncAtomToWrappedSub);
		_reactivity.addSubscription(syncWrappedToAtomSub);
	}
	if (_reactivity.createOptionsStore) {
		table.optionsStore = _reactivity.createWritableAtom(mergedOptions, { debugName: "table/optionsStore" });
		Object.defineProperty(table, "options", {
			configurable: true,
			enumerable: true,
			get() {
				return table.optionsStore.get();
			},
			set(value) {
				table.optionsStore.set(() => value);
			}
		});
	} else table.options = mergedOptions;
	table.initialState = getInitialTableState(table._features, table.options.initialState);
	const stateKeys = Object.keys(table.initialState);
	for (let i = 0; i < stateKeys.length; i++) {
		const key = stateKeys[i];
		table.baseAtoms[key] = _reactivity.createWritableAtom(table.initialState[key], { debugName: `table/baseAtoms/${key}` });
		table.atoms[key] = _reactivity.createReadonlyAtom(() => {
			const options = table.options;
			const externalAtom = options.atoms?.[key];
			const reactiveState = externalAtom ? externalAtom.get() : table.baseAtoms[key].get();
			if (externalAtom) return reactiveState;
			const controlledState = options.state;
			if (controlledState && hasOwn(controlledState, key)) {
				const controlledValue = controlledState[key];
				return controlledValue === void 0 ? table.initialState[key] : controlledValue;
			}
			return reactiveState;
		}, { debugName: `table/atoms/${key}` });
	}
	table_syncExternalStateToBaseAtoms(table);
	table.store = atomToStore(_reactivity.createReadonlyAtom(() => {
		const snapshot = {};
		for (let i = 0; i < stateKeys.length; i++) {
			const key = stateKeys[i];
			snapshot[key] = table.atoms[key].get();
		}
		return snapshot;
	}, {
		compare: shallow,
		debugName: "table/store"
	}));
	for (let i = 0; i < featuresList.length; i++) {
		const feature = featuresList[i];
		feature.initTableInstanceData?.(table);
		if (feature.initCellInstanceData) table._cellInstanceInitFns.push(feature.initCellInstanceData.bind(feature));
		if (feature.initColumnInstanceData) table._columnInstanceInitFns.push(feature.initColumnInstanceData.bind(feature));
		if (feature.initHeaderGroupInstanceData) table._headerGroupInstanceInitFns.push(feature.initHeaderGroupInstanceData.bind(feature));
		if (feature.initHeaderInstanceData) table._headerInstanceInitFns.push(feature.initHeaderInstanceData.bind(feature));
		if (feature.initRowInstanceData) table._rowInstanceInitFns.push(feature.initRowInstanceData.bind(feature));
		feature.constructTableAPIs?.(table);
	}
	if (process.env.NODE_ENV === "development" && (tableOptions.debugAll || tableOptions.debugTable)) {
		const features = Object.keys(table._features);
		const rowModels = Object.entries({
			coreRowModel,
			filteredRowModel,
			groupedRowModel,
			sortedRowModel,
			expandedRowModel,
			paginatedRowModel,
			facetedRowModel,
			facetedMinMaxValues,
			facetedUniqueValues
		}).filter(([, factory]) => factory).map(([key]) => key);
		const states = Object.keys(table.initialState);
		console.log(`Constructing Table Instance

  Features:   ${features.join("\n              ")}

  Row Models: ${rowModels.length ? rowModels.join("\n              ") : "(none)"}

  States:     ${states.join("\n              ")}\n`, { table });
	}
	return table;
}

//#endregion
export { constructTable, getInitialTableState };