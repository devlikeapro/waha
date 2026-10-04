Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_classPrivateFieldSet2 = require("./classPrivateFieldSet2-Bo0ZyOIv.cjs");
const require_timeoutManager = require("./timeoutManager.cjs");
const require_utils = require("./utils.cjs");
const require_environmentManager = require("./environmentManager.cjs");
//#region src/removable.ts
var _gcTimeout = /* @__PURE__ */ new WeakMap();
var Removable = class {
	constructor() {
		require_classPrivateFieldSet2._classPrivateFieldInitSpec(this, _gcTimeout, void 0);
	}
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout();
		if (require_utils.isValidTimeout(this.gcTime)) require_classPrivateFieldSet2._classPrivateFieldSet2(_gcTimeout, this, require_timeoutManager.timeoutManager.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime));
	}
	updateGcTime(newGcTime) {
		this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (require_environmentManager.isServer() ? Infinity : 3e5));
	}
	clearGcTimeout() {
		if (require_classPrivateFieldSet2._classPrivateFieldGet2(_gcTimeout, this) !== void 0) {
			require_timeoutManager.timeoutManager.clearTimeout(require_classPrivateFieldSet2._classPrivateFieldGet2(_gcTimeout, this));
			require_classPrivateFieldSet2._classPrivateFieldSet2(_gcTimeout, this, void 0);
		}
	}
};
//#endregion
exports.Removable = Removable;

//# sourceMappingURL=removable.cjs.map