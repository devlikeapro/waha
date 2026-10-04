/*!
 * DOM Selector - A CSS selector engine.
 * @license MIT
 * @copyright asamuzaK (Kazz)
 * @see {@link https://github.com/asamuzaK/domSelector/blob/main/LICENSE}
 */
export type CheckResult = {
    match: boolean;
    pseudoElement: string | null;
    ast: import('css-tree').CssNode | null;
};
export type UserOptions = {
    noexcept?: boolean;
    warn?: boolean;
};
export type FindOptions = {
    dir?: string;
    check?: boolean;
    forgive?: boolean;
    noexcept?: boolean;
    warn?: boolean;
    isShadowRoot?: boolean;
    globalObject?: object;
};
export declare class DOMSelector {
    #private;
    constructor(window: Window, document: Document, opt?: {
        cacheSize?: number;
        idlUtils?: object;
    });
    clear(clearAll?: boolean): void;
    extractSubjects(selector: string, caseSensitive?: boolean): Array<{
        id: string | null;
        className: string | null;
        tag: string | null;
    }>;
    supports(selector: string): boolean;
    check(selector: string, node: Element, opt?: {
        requireAst?: boolean;
    }): CheckResult | null;
    matches(selector: string, node: Element, opt?: UserOptions): boolean;
    closest(selector: string, node: Element, opt?: UserOptions): Element | null;
    querySelector(selector: string, node: Document | DocumentFragment | Element, opt?: UserOptions): Element | null;
    querySelectorAll(selector: string, node: Document | DocumentFragment | Element, opt?: UserOptions): Array<Element>;
    private #wrapNode;
    private #validateNodeType;
    private #tryNwsapi;
    private #findNodes;
}
