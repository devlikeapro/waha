import { createStore } from "@tanstack/store";
import { useState } from "react";

//#region src/useCreateStore.ts
function useCreateStore(valueOrFn, actions) {
	const [store] = useState(() => {
		if (typeof valueOrFn === "function") return createStore(valueOrFn);
		if (actions) return createStore(valueOrFn, actions);
		return createStore(valueOrFn);
	});
	return store;
}

//#endregion
export { useCreateStore };
//# sourceMappingURL=useCreateStore.js.map