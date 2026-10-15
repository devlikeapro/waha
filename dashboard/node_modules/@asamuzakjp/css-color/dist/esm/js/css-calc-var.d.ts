/**
 * css-calc-var
 */
import { CSSToken } from '@csstools/css-tokenizer';
import { Options } from './typedef';
/**
 * Calclator
 */
export declare class Calculator {
    #private;
    /**
     * constructor
     */
    constructor();
    get hasNum(): boolean;
    set hasNum(value: boolean);
    get numSum(): number[];
    get numMul(): number[];
    get hasPct(): boolean;
    set hasPct(value: boolean);
    get pctSum(): number[];
    get pctMul(): number[];
    get hasDim(): boolean;
    set hasDim(value: boolean);
    get dimSum(): string[];
    get dimSub(): string[];
    get dimMul(): string[];
    get dimDiv(): string[];
    get hasEtc(): boolean;
    set hasEtc(value: boolean);
    get etcSum(): string[];
    get etcSub(): string[];
    get etcMul(): string[];
    get etcDiv(): string[];
    /**
     * clear values
     * @returns void
     */
    clear(): void;
    /**
     * sort values
     * @param values - values
     * @returns sorted values
     */
    sort(values?: string[]): string[];
    /**
     * multiply values
     * @returns resolved value
     */
    multiply(): string;
    /**
     * sum values
     * @returns resolved value
     */
    sum(): string;
}
/**
 * sort calc values
 * @param values - values to sort
 * @param [finalize] - finalize values
 * @returns sorted values
 */
export declare const sortCalcValues: (values?: (number | string)[], finalize?: boolean) => string;
/**
 * sort math function terms
 * @param expr - unwrapped calc expression
 * @returns sorted expression
 */
export declare const sortMathFnTerms: (expr: string) => string;
/**
 * serialize calc
 * @param value - CSS value
 * @param [opt] - options
 * @returns serialized value
 */
export declare const serializeCalc: (value: string, opt?: Options) => string;
/**
 * resolve dimension
 * @param token - CSS token
 * @param [opt] - options
 * @returns resolved value
 */
export declare const resolveDimension: (token: CSSToken, opt?: Options) => string | null;
/**
 * parse CSS calc() tokens
 * @param tokens - CSS tokens
 * @param [opt] - options
 * @returns parsed tokens
 */
export declare const parseCalcTokens: (tokens: CSSToken[], opt?: Options) => string[];
/**
 * CSS calc()
 * @param value - CSS value including calc()
 * @param [opt] - options
 * @returns resolved value
 */
export declare const cssCalc: (value: string, opt?: Options) => string;
/**
 * resolve custom property
 * @param tokens - CSS tokens
 * @param [opt] - options
 * @returns result - [tokens, resolvedValue]
 */
export declare function resolveCustomProperty(tokens: CSSToken[], opt?: Options): [CSSToken[], string];
/**
 * parse CSS var() tokens
 * @param tokens - CSS tokens
 * @param [opt] - options
 * @returns parsed tokens
 */
export declare function parseVarTokens(tokens: CSSToken[], opt?: Options): string[] | null;
/**
 * resolve CSS var()
 * @param value - CSS value including var()
 * @param [opt] - options
 * @returns resolved value
 */
export declare function resolveVar(value: string, opt?: Options): string | null;
/**
 * CSS var()
 * @param value - CSS value including var()
 * @param [opt] - options
 * @returns resolved value
 */
export declare const cssVar: (value: string, opt?: Options) => string;
