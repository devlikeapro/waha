import { EventHandler } from './event.js';
export declare class Evaluator {
    #private;
    window: Window;
    documentCache: WeakMap<WeakKey, any>;
    check: boolean | undefined;
    noexcept: boolean | undefined;
    warn: boolean | undefined;
    node: Document | DocumentFragment | Element | undefined;
    pseudoElements: any[] | undefined;
    invalidate: boolean | undefined;
    constructor(window: Window);
    get eventHandler(): EventHandler;
    get verifyShadowHost(): boolean;
    setup(selector: string, node: Document | DocumentFragment | Element, opt?: import('../index.js').FindOptions): Evaluator;
    onError(e: Error, opt?: import('../index.js').FindOptions): void;
    destroy(): void;
    clearResults(all?: boolean): void;
    matchSelector(ast: import('css-tree').CssNode, node: Document | DocumentFragment | Element, opt: import('../index.js').FindOptions): boolean;
    matchLeaves(leaves: Array<import('css-tree').CssNode>, node: Element, opt?: import('../index.js').FindOptions): boolean;
    getFilterLeaves(leaves: Array<import('css-tree').CssNode>): Array<object>;
    getUnescapedName(ast: import('css-tree').CssNode): string;
    evaluateShadowHost(ast: import('css-tree').CssNode, node: DocumentFragment): boolean;
    matchPseudoClassSelector(ast: import('css-tree').CssNode, node: Element, opt: import('../index.js').FindOptions): boolean;
    createTreeWalker(node: Document | DocumentFragment | Element, opt: object): TreeWalker;
    yieldCombinatorMatches(twig: import('./processor.js').ProcessedBranch, node: Element, opt: import('../index.js').FindOptions): Generator<any, void, unknown>;
    yieldFindDescendantNodes(leaves: Array<import('css-tree').CssNode>, baseNode: DocumentFragment | Element, opt: import('../index.js').FindOptions): Generator<any, void, unknown>;
    private #matchSelectorForElement;
}
