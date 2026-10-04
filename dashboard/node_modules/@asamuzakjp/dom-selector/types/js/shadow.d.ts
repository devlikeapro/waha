export declare class ShadowDOMEvaluator {
    #private;
    constructor(evaluator: import('./evaluator.js').Evaluator);
    get verifyShadowHost(): boolean;
    reset(): void;
    matchSelectorForShadowRoot(ast: import('css-tree').CssNode, node: DocumentFragment, opt?: object): boolean;
    evaluateShadowHost(ast: import('css-tree').CssNode, node: DocumentFragment): boolean;
    private #evaluateHostPseudo;
    private #evaluateHostContextPseudo;
}
