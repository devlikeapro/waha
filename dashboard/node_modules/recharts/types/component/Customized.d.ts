/**
 * @fileOverview Customized
 */
import * as React from 'react';
import { Component, FunctionComponent, ReactElement } from 'react';
type Comp<P> = FunctionComponent<P> | Component<P> | ReactElement<P>;
export type Props<P, C extends Comp<P>> = P & {
    /**
     * Render your components directly, without Customized wrapper. Will be removed in 4.0
     * @deprecated
     * @example Before: `<Customized component={<MyCustomComponent />} />`
     * @example After: `<MyCustomComponent />`
     */
    component: C;
};
/**
 * Customized component used to be necessary to render custom elements in Recharts 2.x.
 * Starting from Recharts 3.x, all charts are able to render arbitrary elements anywhere,
 * and Customized is no longer needed.
 *
 * @example Before: `<Customized component={<MyCustomComponent />} />`
 * @example After: `<MyCustomComponent />`
 *
 * @deprecated Just render your components directly. Will be removed in 4.0
 */
export declare function Customized<P, C extends Comp<P>>({ component, ...props }: Props<P, C>): React.JSX.Element;
export declare namespace Customized {
    var displayName: string;
}
export {};
