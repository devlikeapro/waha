export declare function round(num: number, roundPrecision?: number): number;
/**
 * This function will accept a string template literal and for each
 * variable placeholder, it will round the value to avoid long float numbers in
 * the SVG path which might cause rendering issues in some browsers.
 */
export declare function roundTemplateLiteral(strings: TemplateStringsArray, ...values: ReadonlyArray<number | string>): string;
