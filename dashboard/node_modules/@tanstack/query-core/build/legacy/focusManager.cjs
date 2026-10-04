Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_classPrivateFieldSet2 = require("./classPrivateFieldSet2-Bo0ZyOIv.cjs");
const require_subscribable = require("./subscribable.cjs");
//#region src/focusManager.ts
var _focused = /* @__PURE__ */ new WeakMap();
var _cleanup = /* @__PURE__ */ new WeakMap();
var _setup = /* @__PURE__ */ new WeakMap();
/**
* The `FocusManager` manages the focus state within TanStack Query.
*
* It can be used to change the default event listeners or to manually change the focus state.
*/
var FocusManager = class extends require_subscribable.Subscribable {
	constructor() {
		super();
		require_classPrivateFieldSet2._classPrivateFieldInitSpec(this, _focused, void 0);
		require_classPrivateFieldSet2._classPrivateFieldInitSpec(this, _cleanup, void 0);
		require_classPrivateFieldSet2._classPrivateFieldInitSpec(this, _setup, void 0);
		require_classPrivateFieldSet2._classPrivateFieldSet2(_setup, this, (onFocus) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const listener = () => onFocus();
				window.addEventListener("visibilitychange", listener, false);
				return () => {
					window.removeEventListener("visibilitychange", listener);
				};
			}
		});
	}
	onSubscribe() {
		if (!require_classPrivateFieldSet2._classPrivateFieldGet2(_cleanup, this)) this.setEventListener(require_classPrivateFieldSet2._classPrivateFieldGet2(_setup, this));
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			var _classPrivateFieldGet2$1;
			(_classPrivateFieldGet2$1 = require_classPrivateFieldSet2._classPrivateFieldGet2(_cleanup, this)) === null || _classPrivateFieldGet2$1 === void 0 || _classPrivateFieldGet2$1.call(this);
			require_classPrivateFieldSet2._classPrivateFieldSet2(_cleanup, this, void 0);
		}
	}
	/**
	* `setEventListener` can be used to set a custom event listener that will
	* be used to determine the focus state. The provided `setup` function
	* receives a `setFocused` callback: call it with a `boolean` to manually
	* set the focus state, or with no arguments to re-evaluate the current
	* focus state and notify subscribers.
	*
	* @example
	* ```ts
	* import { focusManager } from '@tanstack/query-core'
	*
	* focusManager.setEventListener((handleFocus) => {
	*   const listener = () => handleFocus()
	*   // Listen to visibilitychange
	*   if (typeof window !== 'undefined' && window.addEventListener) {
	*     window.addEventListener('visibilitychange', listener, false)
	*   }
	*
	*   return () => {
	*     // Be sure to unsubscribe if a new handler is set
	*     window.removeEventListener('visibilitychange', listener)
	*   }
	* })
	* ```
	*/
	setEventListener(setup) {
		var _classPrivateFieldGet3;
		require_classPrivateFieldSet2._classPrivateFieldSet2(_setup, this, setup);
		(_classPrivateFieldGet3 = require_classPrivateFieldSet2._classPrivateFieldGet2(_cleanup, this)) === null || _classPrivateFieldGet3 === void 0 || _classPrivateFieldGet3.call(this);
		require_classPrivateFieldSet2._classPrivateFieldSet2(_cleanup, this, setup((focused) => {
			if (typeof focused === "boolean") this.setFocused(focused);
			else this.onFocus();
		}));
	}
	/**
	* `setFocused` can be used to manually set the focus state. Set `undefined`
	* to fall back to the default focus check.
	*
	* @example
	* ```ts
	* import { focusManager } from '@tanstack/query-core'
	*
	* // Set focused
	* focusManager.setFocused(true)
	*
	* // Set unfocused
	* focusManager.setFocused(false)
	*
	* // Fallback to the default focus check
	* focusManager.setFocused(undefined)
	* ```
	*/
	setFocused(focused) {
		if (require_classPrivateFieldSet2._classPrivateFieldGet2(_focused, this) !== focused) {
			require_classPrivateFieldSet2._classPrivateFieldSet2(_focused, this, focused);
			this.onFocus();
		}
	}
	/**
	* `onFocus` notifies all subscribed listeners with the current focus state.
	*/
	onFocus() {
		const isFocused = this.isFocused();
		this.listeners.forEach((listener) => {
			listener(isFocused);
		});
	}
	/**
	* `isFocused` can be used to get the current focus state.
	*/
	isFocused() {
		var _globalThis$document;
		if (typeof require_classPrivateFieldSet2._classPrivateFieldGet2(_focused, this) === "boolean") return require_classPrivateFieldSet2._classPrivateFieldGet2(_focused, this);
		return ((_globalThis$document = globalThis.document) === null || _globalThis$document === void 0 ? void 0 : _globalThis$document.visibilityState) !== "hidden";
	}
};
/**
* Singleton instance of {@link FocusManager}, used to manage and observe the focus state within TanStack Query.
*/
const focusManager = new FocusManager();
//#endregion
exports.FocusManager = FocusManager;
exports.focusManager = focusManager;

//# sourceMappingURL=focusManager.cjs.map