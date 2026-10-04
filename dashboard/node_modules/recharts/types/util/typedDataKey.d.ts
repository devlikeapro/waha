/**
 * Extracts values from data objects.
 * Has two generics:
 * - DataPointType: The type of the data object.
 * - DataValueType: The type of the value to extract.
 *
 * The wall of text below may be simplified to:
 * - string (must be a key of DataPointType)
 * - number (must be a key of DataPointType)
 * - function that takes DataPointType and returns DataValueType `(obj: DataPointType) => DataValueType)`
 *
 * The actual implementation is more complex to allow for better type inference and autocomplete.
 */
export type TypedDataKey<DataPointType = any, DataValueType = unknown> = unknown extends DataPointType ? string | number | ((obj: DataPointType) => DataValueType) : string extends keyof DataPointType ? string | number | ((obj: DataPointType) => DataValueType) : {
    [K in keyof DataPointType]: DataPointType[K] extends DataValueType ? K extends string | number ? K : never : never;
}[keyof DataPointType] | (DataPointType extends ReadonlyArray<infer E> ? (E extends DataValueType ? `${number}` : never) : never) | ((obj: DataPointType) => DataValueType);
