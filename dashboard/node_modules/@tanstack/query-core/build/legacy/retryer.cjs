Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_utils = require("./utils.cjs");
const require_environmentManager = require("./environmentManager.cjs");
const require_focusManager = require("./focusManager.cjs");
const require_onlineManager = require("./onlineManager.cjs");
//#region src/retryer.ts
function defaultRetryDelay(failureCount) {
	return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
	return (networkMode ?? "online") === "online" ? require_onlineManager.onlineManager.isOnline() : true;
}
/**
* The error thrown by a `Retryer` (and surfaced to `query.promise`/`mutation`) when a fetch is cancelled, e.g. via
* `query.cancel()`. `revert`, if `true`, tells the caller to restore the state the query was in before the fetch
* started instead of surfacing the error. `silent`, if `true`, tells the caller to suppress this error and instead
* resolve with the promise of the fetch that triggered the cancellation.
* @example
* ```ts
* query.cancel()
*
* try {
*   await query.promise
* } catch (error) {
*   if (error instanceof CancelledError) {
*     // the fetch was cancelled, e.g. via `query.cancel()`
*   }
* }
* ```
*/
var CancelledError = class extends Error {
	constructor(options) {
		super("CancelledError");
		this.revert = options === null || options === void 0 ? void 0 : options.revert;
		this.silent = options === null || options === void 0 ? void 0 : options.silent;
	}
};
/**
* @deprecated Use instanceof `CancelledError` instead.
*/
function isCancelledError(value) {
	return value instanceof CancelledError;
}
function createRetryer(config) {
	let isRetryCancelled = false;
	let failureCount = 0;
	let continueFn;
	let status = "pending";
	let promiseResolve;
	let promiseReject;
	const promise = new Promise((resolve, reject) => {
		promiseResolve = resolve;
		promiseReject = reject;
	});
	promise.catch(require_utils.noop);
	const isResolved = () => status !== "pending";
	const cancel = (cancelOptions) => {
		if (!isResolved()) {
			var _config$onCancel;
			const error = new CancelledError(cancelOptions);
			reject(error);
			(_config$onCancel = config.onCancel) === null || _config$onCancel === void 0 || _config$onCancel.call(config, error);
		}
	};
	const cancelRetry = () => {
		isRetryCancelled = true;
	};
	const continueRetry = () => {
		isRetryCancelled = false;
	};
	const canContinue = () => require_focusManager.focusManager.isFocused() && (config.networkMode === "always" || require_onlineManager.onlineManager.isOnline()) && config.canRun();
	const canStart = () => canFetch(config.networkMode) && config.canRun();
	const resolve = (value) => {
		if (!isResolved()) {
			continueFn === null || continueFn === void 0 || continueFn();
			status = "resolved";
			promiseResolve(value);
		}
	};
	const reject = (value) => {
		if (!isResolved()) {
			continueFn === null || continueFn === void 0 || continueFn();
			status = "rejected";
			promiseReject(value);
		}
	};
	const pause = () => {
		return new Promise((continueResolve) => {
			var _config$onPause;
			continueFn = (value) => {
				if (isResolved() || canContinue()) continueResolve(value);
			};
			(_config$onPause = config.onPause) === null || _config$onPause === void 0 || _config$onPause.call(config);
		}).then(() => {
			continueFn = void 0;
			if (!isResolved()) {
				var _config$onContinue;
				(_config$onContinue = config.onContinue) === null || _config$onContinue === void 0 || _config$onContinue.call(config);
			}
		});
	};
	const run = () => {
		if (isResolved()) return;
		let promiseOrValue;
		const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
		try {
			promiseOrValue = initialPromise ?? config.fn();
		} catch (error) {
			promiseOrValue = Promise.reject(error);
		}
		Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
			var _config$onFail;
			if (isResolved()) return;
			const retry = config.retry ?? (require_environmentManager.isServer() ? 0 : 3);
			const retryDelay = config.retryDelay ?? defaultRetryDelay;
			const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
			const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
			if (isRetryCancelled || !shouldRetry) {
				reject(error);
				return;
			}
			failureCount++;
			(_config$onFail = config.onFail) === null || _config$onFail === void 0 || _config$onFail.call(config, failureCount, error);
			require_utils.sleep(delay).then(() => {
				return canContinue() ? void 0 : pause();
			}).then(() => {
				if (isRetryCancelled) reject(error);
				else run();
			});
		});
	};
	return {
		promise,
		status: () => status,
		cancel,
		continue: () => {
			continueFn === null || continueFn === void 0 || continueFn();
			return promise;
		},
		cancelRetry,
		continueRetry,
		canStart,
		start: () => {
			if (canStart()) run();
			else pause().then(run);
			return promise;
		}
	};
}
//#endregion
exports.CancelledError = CancelledError;
exports.canFetch = canFetch;
exports.createRetryer = createRetryer;
exports.isCancelledError = isCancelledError;

//# sourceMappingURL=retryer.cjs.map