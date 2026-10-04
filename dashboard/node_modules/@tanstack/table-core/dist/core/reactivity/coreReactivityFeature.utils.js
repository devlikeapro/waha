//#region src/core/reactivity/coreReactivityFeature.utils.ts
/**
* Bridges atom instances to the `Store`/`ReadonlyStore` API by exposing
* a `state` getter backed by `atom.get()`, and wiring `setState` for
* writable atoms.
*
* @example
* ```ts
* const store = atomToStore(atom)
* ```
*/
function atomToStore(atom) {
	const store = atom;
	Object.defineProperty(atom, "state", { get() {
		return atom.get();
	} });
	if ("set" in atom) store.setState = atom.set.bind(atom);
	return store;
}

//#endregion
export { atomToStore };