let _tanstack_store = require("@tanstack/store");
let react = require("react");

//#region src/useCreateStore.ts
function useCreateStore(valueOrFn, actions) {
	const [store] = (0, react.useState)(() => {
		if (typeof valueOrFn === "function") return (0, _tanstack_store.createStore)(valueOrFn);
		if (actions) return (0, _tanstack_store.createStore)(valueOrFn, actions);
		return (0, _tanstack_store.createStore)(valueOrFn);
	});
	return store;
}

//#endregion
exports.useCreateStore = useCreateStore;
//# sourceMappingURL=useCreateStore.cjs.map