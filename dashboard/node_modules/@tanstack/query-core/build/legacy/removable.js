import { i as _classPrivateFieldInitSpec, n as _classPrivateFieldGet2, t as _classPrivateFieldSet2 } from "./classPrivateFieldSet2-CV7wyte-.js";
import { timeoutManager } from "./timeoutManager.js";
import { isValidTimeout } from "./utils.js";
import { isServer } from "./environmentManager.js";
//#region src/removable.ts
var _gcTimeout = /* @__PURE__ */ new WeakMap();
var Removable = class {
	constructor() {
		_classPrivateFieldInitSpec(this, _gcTimeout, void 0);
	}
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout();
		if (isValidTimeout(this.gcTime)) _classPrivateFieldSet2(_gcTimeout, this, timeoutManager.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime));
	}
	updateGcTime(newGcTime) {
		this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (isServer() ? Infinity : 3e5));
	}
	clearGcTimeout() {
		if (_classPrivateFieldGet2(_gcTimeout, this) !== void 0) {
			timeoutManager.clearTimeout(_classPrivateFieldGet2(_gcTimeout, this));
			_classPrivateFieldSet2(_gcTimeout, this, void 0);
		}
	}
};
//#endregion
export { Removable };

//# sourceMappingURL=removable.js.map