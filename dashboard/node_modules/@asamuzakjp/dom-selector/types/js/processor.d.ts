export type ProcessedBranch = {
    combo: import('css-tree').CssNode | null;
    leaves: Array<import('css-tree').CssNode>;
};
export type ProcessedASTNode = {
    branch: Array<ProcessedBranch>;
    dir: string | null;
    filtered: boolean;
    find: boolean;
};
export declare class SelectorProcessor {
    #private;
    constructor(context: import('./finder.js').Finder);
    process(branches: Array<Array<import('css-tree').CssNode>>, selector: string): {
        ast: Array<ProcessedASTNode>;
        descendant: boolean;
        invalidate?: boolean;
    };
}
