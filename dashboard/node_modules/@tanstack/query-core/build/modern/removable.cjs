Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_timeoutManager = require("./timeoutManager.cjs");
const require_utils = require("./utils.cjs");
const require_environmentManager = require("./environmentManager.cjs");
//#region src/removable.ts
var Removable = class {
	#gcTimeout;
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout();
		if (require_utils.isValidTimeout(this.gcTime)) this.#gcTimeout = require_timeoutManager.timeoutManager.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime);
	}
	updateGcTime(newGcTime) {
		this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (require_environmentManager.isServer() ? Infinity : 3e5));
	}
	clearGcTimeout() {
		if (this.#gcTimeout !== void 0) {
			require_timeoutManager.timeoutManager.clearTimeout(this.#gcTimeout);
			this.#gcTimeout = void 0;
		}
	}
};
//#endregion
exports.Removable = Removable;

//# sourceMappingURL=removable.cjs.map