export declare const findNestedHas: (leaf: object) => object | null;
export declare const findLogicalWithNestedHas: (leaf: object) => object | null;
export declare const validateHasNesting: (astChildren: Array<object>) => boolean;
export declare const createHasValidator: (globalObj: object) => (node: object) => void;
export declare const isInvalidCombinator: (type: string, prevType: string | null, isLast: boolean) => boolean;
export declare const isSupportedAST: (ast: import('css-tree').CssNode) => boolean;
export declare const extractSubjectsRegExp: (selector: string, caseSensitive: boolean) => Array<{
    id: string | null;
    className: string | null;
    tag: string | null;
}>;
export declare const filterSelector: (selector: string, target: string) => boolean;
