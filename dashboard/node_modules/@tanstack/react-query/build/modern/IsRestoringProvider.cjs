"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
let react = require("react");
react = require_rolldown_runtime.__toESM(react, 1);
//#region src/IsRestoringProvider.ts
const IsRestoringContext = react.createContext(false);
/**
* If you are using `PersistQueryClientProvider`, you can also use the `useIsRestoring` hook alongside it to
* check if a restore is currently in progress. `useQuery` and friends also check this internally to avoid
* race conditions between the restore and mounting queries.
*
* @returns `true` while a persisted client is being restored, `false` otherwise.
*/
const useIsRestoring = () => react.useContext(IsRestoringContext);
/**
* The Provider that `PersistQueryClientProvider` uses to signal whether a persisted client is currently
* being restored, read by `useIsRestoring`.
*/
const IsRestoringProvider = IsRestoringContext.Provider;
//#endregion
exports.IsRestoringProvider = IsRestoringProvider;
exports.useIsRestoring = useIsRestoring;

//# sourceMappingURL=IsRestoringProvider.cjs.map