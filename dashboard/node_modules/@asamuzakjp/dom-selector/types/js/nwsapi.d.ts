export type ResolverFactory = (c: Element | Array<Element> | NodeList, f?: ((element: Element) => boolean | void), x?: Element | Document | null, r?: boolean | Array<Element>) => boolean | Array<Element>;
export declare const concatCall: (nodes: Array<Element> | NodeList, callback?: ((element: Element) => boolean | void) | undefined) => Array<Element>;
export declare const isHTML: (node: Element | Document) => boolean;
export declare const isTarget: (node: Element) => boolean;
export declare const isIndeterminate: (node: Element) => boolean;
export declare const optimize: (selector: string, tokens: Array<string>) => string;
export declare const matchAssert: (factory: Array<ResolverFactory>, element: Element, callback?: ((element: Element) => boolean | void) | undefined) => boolean;
export declare const solveNth: (element: Element, dir: boolean | number, state: object, isOfType: boolean) => number;
export declare class Nwsapi {
    #private;
    hasDupes: boolean | undefined;
    constructor(window: Window, document: Document, cacheSize?: number);
    private #documentOrder;
    private #unique;
    byId(id: string, context: Element | Document): Array<Element>;
    byTag(tag: string, context: Element | Document | DocumentFragment): Array<Element>;
    byClass(cls: string, context: Element | Document | DocumentFragment): Array<Element>;
    private #emit;
    private #switchContext;
    compileSelector(expression: string, source: string, mode: boolean): string;
    compileUniversal(selector: string, source: string): {
        source: string;
        selector: string;
    };
    compileId(selector: string, source: string): {
        source: string;
        selector: string;
    };
    compileClass(selector: string, source: string): {
        source: string;
        selector: string;
    };
    compileTag(selector: string, source: string): {
        source: string;
        selector: string;
    };
    compileAttribute(selector: string, source: string): {
        source: string;
        selector: string;
    };
    compileCombinator(symbol: string, selector: string, source: string): {
        source: string;
        selector: string;
    };
    compilePseudo(selector: string, source: string, selectorString: string): {
        source: string;
        selector: string;
    };
    compilePseudoStructural(match: Array<string>, source: string): string;
    compilePseudoTreeStruct(match: Array<string>, source: string, selectorString: string): string;
    compilePseudoLogical(match: Array<string>, source: string): string;
    compilePseudoLocation(match: Array<string>, source: string): string;
    compilePseudoInputState(match: Array<string>, source: string): string;
    compilePseudoInputValue(match: Array<string>, source: string): string;
    compile(selector: string, mode: boolean): ResolverFactory;
    collect(selectors: Array<string>, context: Element | Document, callback?: ((element: Element) => boolean | void) | undefined): object;
    private #matchCollect;
    private #parseSelector;
    match(selectors: string, element: Element, callback?: ((element: Element) => boolean | void) | undefined): boolean;
    closest(selectors: string, element: Element, callback?: ((element: Element) => boolean | void) | undefined): Element | null;
    select(selectors: string, context: Element | Document, callback?: ((element: Element) => boolean | void) | undefined): Array<Element>;
    first(selectors: string, context: Element | Document, callback?: ((element: Element) => boolean | void) | undefined): Element | null;
    clear(clearAll?: boolean): void;
}
