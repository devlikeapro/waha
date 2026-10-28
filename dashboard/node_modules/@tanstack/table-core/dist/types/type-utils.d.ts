//#region src/types/type-utils.d.ts
type Updater<T> = T | ((old: T) => T);
type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void;
type RowData = Record<string, any> | Array<any>;
type CellData = unknown;
/**
 * Normalizes a row's value before a filter or sort comparator sees it.
 *
 * Attach as `resolveDataValue` on filter/sort functions built with
 * `constructFilterFn`/`constructSortFn` (e.g. to lowercase or strip diacritics).
 */
type TransformDataValueFn = (dataValue: any) => any;
type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends ((x: infer R) => any) ? R : never;
type ComputeRange<N extends number, Result extends Array<unknown> = []> = Result['length'] extends N ? Result : ComputeRange<N, [...Result, Result['length']]>;
type Index40 = ComputeRange<40>[number];
type IsTuple<T> = T extends ReadonlyArray<any> & {
  length: infer Length;
} ? Length extends Index40 ? T : never : never;
type AllowedIndexes<Tuple extends ReadonlyArray<any>, Keys extends number = never> = Tuple extends readonly [] ? Keys : Tuple extends readonly [infer _, ...infer Tail] ? AllowedIndexes<Tail, Keys | Tail['length']> : Keys;
type DeepKeys<T, TDepth extends Array<any> = []> = TDepth['length'] extends 5 ? never : unknown extends T ? string : T extends ReadonlyArray<any> & IsTuple<T> ? AllowedIndexes<T> | DeepKeysPrefix<T, AllowedIndexes<T>, TDepth> : T extends Array<any> ? DeepKeys<T[number], [...TDepth, any]> : T extends Date ? never : T extends object ? (keyof T & string) | DeepKeysPrefix<T, keyof T, TDepth> : never;
type DeepKeysPrefix<T, TPrefix, TDepth extends Array<any>> = TPrefix extends keyof T & (number | string) ? `${TPrefix}.${DeepKeys<T[TPrefix], [...TDepth, any]> & string}` : never;
type DeepValue<T, TProp> = T extends null | undefined ? undefined : T extends Record<string | number, any> ? TProp extends `${infer TBranch}.${infer TDeepProp}` ? DeepValue<T[TBranch], TDeepProp> : T[TProp & keyof T] : never;
type NoInfer<T> = [T][T extends any ? 0 : never];
type Getter<TValue> = <TTValue = TValue>() => NoInfer<TTValue>;
type Prettify<T> = { [K in keyof T]: T[K]; } & unknown;
//#endregion
export { CellData, DeepKeys, DeepValue, Getter, NoInfer, OnChangeFn, PartialKeys, Prettify, RequiredKeys, RowData, TransformDataValueFn, UnionToIntersection, Updater };