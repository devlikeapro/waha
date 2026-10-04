/*!
 * CSS color - Resolve, parse, convert CSS color.
 * @license MIT
 * @copyright asamuzaK (Kazz)
 * @see {@link https://github.com/asamuzaK/cssColor/blob/main/LICENSE}
 */
export { convert } from './js/convert';
export { resolve } from './js/resolve';
export declare const utils: {
    cssCalc: (value: string, opt?: import("./js/typedef").Options) => string;
    cssVar: (value: string, opt?: import("./js/typedef").Options) => string;
    extractDashedIdent: (value: string) => string[];
    isColor: (value: unknown, opt?: import("./js/typedef").Options) => boolean;
    isGradient: (value: string, opt?: import("./js/typedef").Options) => boolean;
    resolveGradient: (value: string, opt?: import("./js/typedef").Options) => string;
    resolveLengthInPixels: (value: number | string, unit: string | undefined, opt?: import("./js/typedef").Options) => number;
    splitValue: (value: string, opt?: import("./js/typedef").Options) => string[];
};
