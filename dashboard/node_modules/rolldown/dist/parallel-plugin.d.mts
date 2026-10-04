import { T as Plugin, Wt as MaybePromise } from "./shared/define-config-DjHYbH6S.mjs";
//#region src/plugin/parallel-plugin-implementation.d.ts
type ParallelPluginImplementation = Plugin;
type Context = {
  /**
   * Thread number
   */
  threadNumber: number;
};
export declare function defineParallelPluginImplementation<Options>(plugin: (Options: Options, context: Context) => MaybePromise<ParallelPluginImplementation>): (Options: Options, context: Context) => MaybePromise<ParallelPluginImplementation>;
//#endregion
export type { Context, ParallelPluginImplementation };