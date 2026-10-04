import { Evaluator } from './evaluator.js';
export type StrategyOptions = {
    complex?: boolean;
    precede?: boolean;
    dir?: string;
    filterLeaves?: Array<import('css-tree').CssNode>;
};
export type TraversalOptions = {
    force?: boolean;
    precede?: boolean;
    boundaryNode?: Element;
    startNode?: Element;
    targetType?: string;
};
export declare class Finder extends Evaluator {
    #private;
    setup(selector: string, node: Document | DocumentFragment | Element, opt: import('../index.js').FindOptions): Finder;
    find(targetType: string): Set<Element> | import('../index.js').CheckResult;
    private #collectNodes;
    private #findEntryNodes;
    private #findEntryNodesForPseudoElement;
    private #findEntryNodesForId;
    private #findEntryNodesForClass;
    private #findEntryNodesForType;
    private #findEntryNodesForOther;
    private #processPendingItems;
    private #processComplexBranchAll;
    private #dfsComplexBranchNext;
    private #processComplexBranchFirst;
    private #processComplexBranchFirstNext;
    private #matchNodeNext;
    private #processComplexBranchFirstPrev;
    private #hasValidPathPrev;
    private #checkSelfOrLinealTarget;
    private #matchSelf;
    private #findLineal;
    private #filterAndFormatCollection;
    private #fallbackToWalkerResult;
    private #findNodeWalker;
    private #findPrecede;
    private #traverseAndCollectNodes;
}
