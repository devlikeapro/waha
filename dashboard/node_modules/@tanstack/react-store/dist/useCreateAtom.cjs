let _tanstack_store = require("@tanstack/store");
let react = require("react");

//#region src/useCreateAtom.ts
function useCreateAtom(valueOrFn, options) {
	const [atom] = (0, react.useState)(() => {
		if (typeof valueOrFn === "function") return (0, _tanstack_store.createAtom)(valueOrFn, options);
		return (0, _tanstack_store.createAtom)(valueOrFn, options);
	});
	return atom;
}

//#endregion
exports.useCreateAtom = useCreateAtom;
//# sourceMappingURL=useCreateAtom.cjs.map