import { TableReactivityBindings } from "./core/reactivity/coreReactivityFeature.types.js";
//#region src/store-reactivity-bindings.d.ts
/**
 * TanStack Store–based reactivity for vanilla / non-framework use of `constructTable`,
 * with `createOptionsStore: true` so `table.optionsStore` is available for subscriptions.
 *
 * @example
 * ```ts
 * import { constructTable, tableFeatures } from '@tanstack/table-core'
 * import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
 *
 * const table = constructTable({
 *   features: tableFeatures({ coreReactivityFeature: storeReactivityBindings() }),
 *   // ...
 * })
 * ```
 */
declare function storeReactivityBindings(): TableReactivityBindings;
//#endregion
export { storeReactivityBindings };