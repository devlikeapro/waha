import { createAtom } from "@tanstack/store";
import { useState } from "react";

//#region src/useCreateAtom.ts
function useCreateAtom(valueOrFn, options) {
	const [atom] = useState(() => {
		if (typeof valueOrFn === "function") return createAtom(valueOrFn, options);
		return createAtom(valueOrFn, options);
	});
	return atom;
}

//#endregion
export { useCreateAtom };
//# sourceMappingURL=useCreateAtom.js.map