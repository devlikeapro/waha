//#region src/utils.ts
/**
* Applies a TanStack updater to a value.
*
* If the updater is a function it is called with the previous value; otherwise the updater value is returned directly.
*/
function functionalUpdate(updater, input) {
	return typeof updater === "function" ? updater(input) : updater;
}
/**
* Clones table state values while preserving non-plain objects.
*
* Plain objects and arrays are copied recursively so state updates can avoid mutating existing references.
*/
function cloneState(value) {
	if (Array.isArray(value)) return value.map(cloneState);
	if (value && typeof value === "object") {
		const proto = Object.getPrototypeOf(value);
		if (proto !== Object.prototype && proto !== null) return value;
		const copy = proto === null ? makeObjectMap() : {};
		const keys = Object.keys(value);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			Object.defineProperty(copy, key, {
				configurable: true,
				enumerable: true,
				value: cloneState(value[key]),
				writable: true
			});
		}
		return copy;
	}
	return value;
}
/**
* Copies prototype-instance own properties without carrying over lazy memo
* closures or the per-row cell cache, both of which are bound to the source
* instance (cached cells reference the source row).
*/
function copyInstancePropertiesWithoutMemos(target, source) {
	const keys = Object.keys(source);
	const targetRecord = target;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (!key.startsWith("_memo_") && key !== "_cellsCache") targetRecord[key] = source[key];
	}
	return target;
}
/**
* Creates an object intended only for string-keyed dictionary lookups.
*
* The null prototype keeps user-controlled ids such as `__proto__` and
* `hasOwnProperty` as plain data keys.
*/
function makeObjectMap() {
	return Object.create(null);
}
/**
* Checks whether an object owns a key, including null-prototype dictionaries.
*/
function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
/**
* Creates a table state updater for a single state slice.
*
* The updater writes through the table base atom for the slice and supports both value and functional updater forms.
*/
function makeStateUpdater(key, instance) {
	return (updater) => {
		(instance.options.atoms?.[key] ?? instance.baseAtoms[key]).set((old) => functionalUpdate(updater, old));
	};
}
/**
* Checks whether a value is an array or a plain (or null-prototype) object.
* Class instances, dates, and other exotic values compare by reference only,
* mirroring the `cloneState` plain-object policy.
*/
function isPlainContainer(value) {
	if (typeof value !== "object" || value === null) return false;
	if (Array.isArray(value)) return true;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
/**
* Returns every enumerable own key, including symbols and non-index array
* properties. Keeping key presence explicit distinguishes sparse array holes
* from entries whose value is `undefined`.
*/
function getEnumerableOwnKeys(value) {
	return Reflect.ownKeys(value).filter((key) => Object.prototype.propertyIsEnumerable.call(value, key));
}
const MAX_STATE_COMPARE_DEPTH = 3;
/**
* Structurally compares two state slice values as deeply as stock feature
* state can nest and no deeper.
*
* Three container levels cover flat maps and arrays, arrays of state objects,
* array-valued filter values, and `columnResizing.columnSizingStart` tuples.
* Deeper containers and non-plain values compare by reference. A `false`
* result is always safe: the state update simply proceeds.
*/
function stateSlicesEqual(a, b) {
	return stateSlicesEqualAtDepth(a, b, MAX_STATE_COMPARE_DEPTH);
}
function stateSlicesEqualAtDepth(a, b, depth) {
	if (Object.is(a, b)) return true;
	if (depth <= 0 || !isPlainContainer(a) || !isPlainContainer(b)) return false;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
	}
	const keysA = getEnumerableOwnKeys(a);
	const keysB = getEnumerableOwnKeys(b);
	if (keysA.length !== keysB.length) return false;
	const recordA = a;
	const recordB = b;
	for (let i = 0; i < keysA.length; i++) {
		const key = keysA[i];
		if (!Object.prototype.propertyIsEnumerable.call(b, key)) return false;
		if (!stateSlicesEqualAtDepth(recordA[key], recordB[key], depth - 1)) return false;
	}
	return true;
}
/**
* Routes a state slice update through the slice's `on<State>Change` handler,
* preserving the owner's current reference for structural no-ops.
*
* Equality is evaluated inside the updater received by the state owner, never
* against the table's potentially stale controlled snapshot. This keeps
* same-tick updates composable in queued host containers such as React state,
* evaluates the original updater only when the owner applies it, and lets atom
* owners suppress notifications by returning their existing reference.
*
* A user-provided change handler is still invoked for a no-op because only that
* handler's state container can know its latest queued value. The guarded
* updater returns that container's previous reference, preventing a state write
* or render in state containers with identity bailout semantics.
*
* Hot-path slices that skip guarding entirely (selection maps that scale with
* row count, pointer-frequency resize state) call their change handler
* directly instead of routing through this util. Custom feature slices with a
* cheaper or semantic-aware comparison can pass `isEqual` to override the
* structural default.
*/
function setStateSlice(instance, key, updater, isEqual = stateSlicesEqual) {
	const onChangeKey = `on${key.charAt(0).toUpperCase()}${key.slice(1)}Change`;
	const onChange = instance.options[onChangeKey];
	if (!onChange) return;
	onChange((current) => {
		const next = functionalUpdate(updater, current);
		return isEqual(current, next) ? current : next;
	});
}
/**
* Returns whether a value is a function.
*/
function isFunction(d) {
	return d instanceof Function;
}
/**
* Flattens a tree of nodes by recursively reading child nodes.
*
* The original nodes are preserved in depth-first order.
*/
function flattenBy(arr, getChildren) {
	const flat = [];
	const recurse = (subArr) => {
		subArr.forEach((item) => {
			flat.push(item);
			const children = getChildren(item);
			if (children.length) recurse(children);
		});
	};
	recurse(arr);
	return flat;
}
/**
* Creates a dependency-tracked memoized function for table internals.
*
* The memo recomputes only when its dependency tuple changes and can emit debug timing information.
*/
const memo = ({ fn, memoDeps, onAfterCompare, onAfterUpdate, onBeforeCompare, onBeforeUpdate }) => {
	let deps = [];
	let result;
	const memoizedFn = (depArgs) => {
		onBeforeCompare?.();
		const newDeps = memoDeps?.(depArgs);
		let depsChanged = !newDeps || newDeps.length !== deps?.length;
		if (!depsChanged && newDeps) {
			for (let i = 0; i < newDeps.length; i++) if (newDeps[i] !== deps[i]) {
				depsChanged = true;
				break;
			}
		}
		onAfterCompare?.(depsChanged);
		if (!depsChanged) return result;
		deps = newDeps;
		onBeforeUpdate?.();
		result = fn(...newDeps ?? []);
		onAfterUpdate?.(result);
		return result;
	};
	return memoizedFn;
};
/**
* Wraps a callback so that its first invocation is skipped.
*
* Row-model `onAfterUpdate` hooks schedule auto-resets when their inputs
* change. The initial computation of a row model is not a change, so state
* resets must not fire for it — otherwise merely reading a row model on mount
* would wipe initial or controlled state.
*/
function skipFirstRun(fn) {
	let hasRun = false;
	return () => {
		if (!hasRun) {
			hasRun = true;
			return;
		}
		fn();
	};
}
const pad = (str, num) => {
	str = String(str);
	while (str.length < num) str = " " + str;
	return str;
};
/**
* Creates a table-aware memoized function.
*
* This wraps `memo` with table debug options and feature metadata so row models and derived APIs can share consistent diagnostics.
*/
function tableMemo({ feature, fnName, objectId, onAfterUpdate, table, ...memoOptions }) {
	let startCalcTime;
	let endCalcTime;
	let runCount = 0;
	let debug;
	if (process.env.NODE_ENV === "development") {
		const { debugAll } = table.options;
		const { parentName } = getFunctionNameInfo(fnName, ".");
		const debugByParent = table.options[`debug${(parentName != "table" ? parentName + "s" : parentName).replace(parentName, parentName.charAt(0).toUpperCase() + parentName.slice(1))}`];
		const debugByFeature = feature ? table.options[`debug${feature.charAt(0).toUpperCase() + feature.slice(1)}`] : false;
		debug = debugAll || debugByParent || debugByFeature;
	}
	function logTime(time, depsChanged) {
		const runType = runCount === 0 ? "(1st run)" : depsChanged ? "(rerun #" + runCount + ")" : "(cache)";
		runCount++;
		console.groupCollapsed(`%c⏱ ${pad(`${time.toFixed(1)} ms`, 12)} %c${runType}%c ${fnName}%c ${objectId ? `(${fnName.split(".")[0]}Id: ${objectId})` : ""}`, `font-size: .6rem; font-weight: bold; ${depsChanged ? `color: hsl(
        ${Math.max(0, Math.min(120 - Math.log10(time) * 60, 120))}deg 100% 31%);` : ""} `, `color: ${runCount < 2 ? "#FF00FF" : "#FF1493"}`, "color: #666", "color: #87CEEB");
		console.info({
			feature,
			state: table.store.state,
			deps: memoOptions.memoDeps?.toString()
		});
		console.trace();
		console.groupEnd();
	}
	const onAfterUpdateHandler = () => {
		if (!onAfterUpdate) return;
		const { schedule, untrack } = table._reactivity;
		schedule(() => untrack(() => onAfterUpdate()));
	};
	const debugOptions = process.env.NODE_ENV === "development" ? {
		onBeforeCompare: () => {},
		onAfterCompare: (depsChanged) => {},
		onBeforeUpdate: () => {
			if (debug) startCalcTime = performance.now();
		},
		onAfterUpdate: () => {
			if (debug) {
				endCalcTime = performance.now();
				logTime(Math.round((endCalcTime - startCalcTime) * 100) / 100, true);
			}
			onAfterUpdateHandler();
		}
	} : { onAfterUpdate: () => {
		onAfterUpdateHandler();
	} };
	return memo({
		...memoOptions,
		...debugOptions
	});
}
/**
* Assumes that a function name is in the format of `parentName_fnKey` and returns the `fnKey` and `fnName` in the format of `parentName.fnKey`.
*/
function getFunctionNameInfo(staticFnName, splitBy = "_") {
	const [parentName, fnKey] = staticFnName.split(splitBy);
	return {
		fnKey,
		fnName: `${parentName}.${fnKey}`,
		parentName
	};
}
/**
* Assigns Table API methods directly to the table instance.
* Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.
*/
function assignTableAPIs(feature, table, apis) {
	for (const [staticFnName, { fn, memoDeps }] of Object.entries(apis)) {
		const { fnKey, fnName } = getFunctionNameInfo(staticFnName);
		table[fnKey] = memoDeps ? tableMemo({
			memoDeps,
			fn,
			fnName,
			table,
			feature
		}) : fn;
	}
}
/**
* Assigns API methods to a prototype object for memory-efficient method sharing.
* All instances created with this prototype will share the same method references.
*
* For memoized methods, the memo state is lazily created and stored on each instance.
* This provides the best of both worlds: shared method code + per-instance caching.
*/
function assignPrototypeAPIs(feature, prototype, table, apis) {
	for (const [staticFnName, { fn, memoDeps }] of Object.entries(apis)) {
		const { fnKey, fnName } = getFunctionNameInfo(staticFnName);
		if (memoDeps) {
			const memoKey = `_memo_${fnKey}`;
			prototype[fnKey] = function(...args) {
				if (!this[memoKey]) {
					const self = this;
					this[memoKey] = tableMemo({
						memoDeps: (depArgs) => memoDeps(self, depArgs),
						fn: (...deps) => fn(self, ...deps),
						fnName,
						objectId: self.id,
						table,
						feature
					});
				}
				return this[memoKey](...args);
			};
		} else prototype[fnKey] = function(...args) {
			return fn(this, ...args);
		};
	}
}
/**
* Looks to run the memoized function with the builder pattern on the object if it exists, otherwise fall back to the static method passed in.
*/
function callMemoOrStaticFn(obj, fnKey, staticFn, ...args) {
	return obj[fnKey]?.(...args) ?? staticFn(obj, ...args);
}

//#endregion
export { assignPrototypeAPIs, assignTableAPIs, callMemoOrStaticFn, cloneState, copyInstancePropertiesWithoutMemos, flattenBy, functionalUpdate, getFunctionNameInfo, hasOwn, isFunction, makeObjectMap, makeStateUpdater, memo, setStateSlice, skipFirstRun, stateSlicesEqual, tableMemo };