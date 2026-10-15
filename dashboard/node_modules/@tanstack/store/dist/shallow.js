//#region src/shallow.ts
function shallow(objA, objB) {
	if (Object.is(objA, objB)) return true;
	if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
	if (objA instanceof Map && objB instanceof Map) {
		if (objA.size !== objB.size) return false;
		for (const [k, v] of objA) if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
		return true;
	}
	if (objA instanceof Set && objB instanceof Set) {
		if (objA.size !== objB.size) return false;
		for (const v of objA) if (!objB.has(v)) return false;
		return true;
	}
	if (objA instanceof Date && objB instanceof Date) {
		if (objA.getTime() !== objB.getTime()) return false;
		return true;
	}
	const keysA = getOwnKeys(objA);
	if (keysA.length !== getOwnKeys(objB).length) return false;
	for (let i = 0; i < keysA.length; i++) if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) return false;
	return true;
}
function getOwnKeys(obj) {
	return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
}

//#endregion
export { shallow };
//# sourceMappingURL=shallow.js.map