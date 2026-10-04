Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_utils = require("./utils.cjs");
//#region src/environmentManager.ts
let isServerFn = () => require_utils.isServer;
/**
* Returns whether the current runtime should be treated as a server environment.
*/
const isServer = () => isServerFn();
/**
* Manages how TanStack Query detects whether the current runtime should be treated as
* server-side, which disables scheduling refetch timers and changes the default `retry` count
* and `gcTime`. By default, the detection treats a missing `window` (or the presence of a
* `Deno` global) as server.
*
* Override this for runtimes where that default detection would give the wrong answer — for
* example, a Service Worker, where `window` is undefined even though the environment should
* behave like a client.
*
* @example
* ```ts
* import { environmentManager } from '@tanstack/query-core'
*
* environmentManager.setIsServer(() => false)
* ```
*/
const environmentManager = {
	isServer,
	/**
	* Overrides the server check globally.
	*/
	setIsServer(isServerValue) {
		isServerFn = isServerValue;
	}
};
//#endregion
exports.environmentManager = environmentManager;
exports.isServer = isServer;

//# sourceMappingURL=environmentManager.cjs.map