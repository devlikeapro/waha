export declare class DOMTraverser {
    #private;
    constructor(evaluator: import('./evaluator.js').Evaluator);
    reset(): void;
    createTreeWalker(node: Document | DocumentFragment | Element, opt?: {
        force?: boolean;
        whatToShow?: number;
    }): TreeWalker;
    yieldCombinatorMatches(twig: import('./processor.js').ProcessedBranch, node: Element, opt?: import('../index.js').FindOptions): Generator<any, void, unknown>;
    yieldFindDescendantNodes(leaves: Array<object>, baseNode: DocumentFragment | Element, opt: import('../index.js').FindOptions): Generator<any, void, unknown>;
    yieldTraverseAllDescendants(baseNode: DocumentFragment | Element, leaves: Array<object>, opt: import('../index.js').FindOptions): Generator<Node, void, unknown>;
}
