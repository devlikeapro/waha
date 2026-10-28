export declare class Mapper {
    #private;
    constructor(context: import('./finder.js').Finder);
    correspond(selector: string): [Array<import('./processor.js').ProcessedASTNode>, Array<Array<Element>>, import('css-tree').CssNode];
}
