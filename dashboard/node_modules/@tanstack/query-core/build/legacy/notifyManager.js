import { systemSetTimeoutZero } from "./timeoutManager.js";
//#region src/notifyManager.ts
/**
* Default scheduling function used by the notify manager.
* Schedules the callback with the system's `setTimeout(callback, 0)`.
*/
const defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
	let queue = [];
	let transactions = 0;
	let notifyFn = (callback) => {
		callback();
	};
	let batchNotifyFn = (callback) => {
		callback();
	};
	let scheduleFn = defaultScheduler;
	const schedule = (callback) => {
		if (transactions) queue.push(callback);
		else scheduleFn(() => {
			notifyFn(callback);
		});
	};
	const flush = () => {
		const originalQueue = queue;
		queue = [];
		if (originalQueue.length) scheduleFn(() => {
			batchNotifyFn(() => {
				originalQueue.forEach((callback) => {
					notifyFn(callback);
				});
			});
		});
	};
	return {
		/**
		* Batches all updates scheduled inside the passed callback.
		* This is mainly used internally to optimize query client updating.
		* Batches can be nested; the queue is only flushed once the outermost `batch` call finishes.
		* The return value of `callback` is passed through.
		*/
		batch: (callback) => {
			let result;
			transactions++;
			try {
				result = callback();
			} finally {
				transactions--;
				if (!transactions) flush();
			}
			return result;
		},
		/**
		* All calls to the wrapped function will be batched.
		*/
		batchCalls: (callback) => {
			return (...args) => {
				schedule(() => {
					callback(...args);
				});
			};
		},
		/**
		* Schedules a function to be run on the next batch.
		* By default, the batch is run with a `setTimeout`, but this can be configured via `setScheduler`.
		*/
		schedule,
		/**
		* Use this method to set a custom notify function.
		* This can be used to for example wrap notifications with `React.act` while running tests.
		*/
		setNotifyFunction: (fn) => {
			notifyFn = fn;
		},
		/**
		* Use this method to set a custom function to batch notifications together into a single tick.
		* Framework adapters use this to plug in their own batching primitive, so that a single query
		* update only triggers one re-render instead of one per subscriber.
		*
		* @example
		* ```ts
		* import { notifyManager } from '@tanstack/query-core'
		* import { batch } from 'solid-js'
		*
		* notifyManager.setBatchNotifyFunction(batch)
		* ```
		*/
		setBatchNotifyFunction: (fn) => {
			batchNotifyFn = fn;
		},
		/**
		* Configures a custom callback that schedules when the next batch runs.
		* The default behavior is `setTimeout(callback, 0)`.
		*
		* @example
		* ```ts
		* import { notifyManager } from '@tanstack/query-core'
		*
		* // Schedule batches in the next microtask
		* notifyManager.setScheduler(queueMicrotask)
		*
		* // Schedule batches before the next frame is rendered
		* notifyManager.setScheduler(requestAnimationFrame)
		*
		* // Schedule batches some time in the future
		* notifyManager.setScheduler((cb) => setTimeout(cb, 10))
		* ```
		*/
		setScheduler: (fn) => {
			scheduleFn = fn;
		}
	};
}
/**
* Handles scheduling and batching callbacks in TanStack Query.
*/
const notifyManager = createNotifyManager();
//#endregion
export { createNotifyManager, defaultScheduler, notifyManager };

//# sourceMappingURL=notifyManager.js.map