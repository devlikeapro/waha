const require_useSelector = require('./useSelector.cjs');

//#region src/useAtom.ts
/**
* Returns the current atom value together with a stable setter.
*
* This is the writable-atom convenience hook for components that need to both
* read and update the same atom.
*
* @example
* ```tsx
* const [count, setCount] = useAtom(countAtom)
* ```
*/
function useAtom(atom, options) {
	return [require_useSelector.useSelector(atom, void 0, options), atom.set];
}

//#endregion
exports.useAtom = useAtom;
//# sourceMappingURL=useAtom.cjs.map