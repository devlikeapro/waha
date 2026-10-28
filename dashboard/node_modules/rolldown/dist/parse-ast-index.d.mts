import { H as ParserOptions$1, V as ParseResult$1 } from "./shared/binding-DZuNHVw4.mjs";
import { Program } from "@oxc-project/types";
//#region src/parse-ast-index.d.ts
/**
 * @hidden
 */
export type ParseResult = ParseResult$1;
/**
 * @hidden
 */
export type ParserOptions = ParserOptions$1;
/**
 * Parse code synchronously and return the AST.
 *
 * This function is similar to Rollup's `parseAst` function.
 * Prefer using {@linkcode parseSync} instead of this function as it has more information in the return value.
 *
 * @category Utilities
 */
export declare function parseAst(sourceText: string, options?: ParserOptions | null, filename?: string): Program;
/**
 * Parse code asynchronously and return the AST.
 *
 * This function is similar to Rollup's `parseAstAsync` function.
 * Prefer using {@linkcode parseAsync} instead of this function as it has more information in the return value.
 *
 * @category Utilities
 */
export declare function parseAstAsync(sourceText: string, options?: ParserOptions | null, filename?: string): Promise<Program>;
//#endregion