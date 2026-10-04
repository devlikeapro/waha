export declare const unescapeSelector: (selector?: string) => string;
export declare const preprocess: (value: string) => string;
export declare const parseSelector: (sel: string, context?: string) => import('css-tree').CssNode;
export declare const walkAST: (ast?: import('css-tree').CssNode, toObject?: boolean, callback?: (node: import('css-tree').CssNode) => void) => {
    branches: Array<Array<import('css-tree').CssNode>>;
    info: object;
};
export declare const compareASTNodes: (a: import('css-tree').CssNode, b: import('css-tree').CssNode) => number;
export declare const sortAST: (asts: Array<import('css-tree').CssNode>) => Array<import('css-tree').CssNode>;
export declare const parseAstName: (selector: string) => {
    prefix: string;
    localName: string;
};
export declare const extractSubjectsAst: (ast: import('css-tree').CssNode) => Array<{
    id: string | null;
    className: string | null;
    tag: string | null;
}>;
export { find as findAST, generate as generateCSS } from 'css-tree';
