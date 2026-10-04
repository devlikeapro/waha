import * as React from 'react';
import { ReactElement } from 'react';
import { ActiveShape, ShapeAnimationProps } from './types';
/**
 * This is an abstraction for rendering a user defined prop for a customized shape in several forms.
 *
 * <Shape /> is the root and will handle taking in:
 *  - an object of svg properties
 *  - a boolean
 *  - a render prop(inline function that returns jsx)
 *  - a React element
 *
 * The concrete default shape is supplied by the caller so this helper does not
 * import unrelated shapes and accidentally couple bundles together.
 */
type ShapeRenderer<PropsType> = (props: PropsType) => React.ReactNode;
type ShapeOptionProps<PropsType extends object> = Partial<PropsType>;
type ShapeOptionElement<PropsType extends object> = ReactElement<ShapeOptionProps<PropsType>>;
export type ShapeProps<PropsType extends object, ElementType extends SVGElement = SVGElement> = {
    /**
     * Multi-value prop, decides either which component renders, or which props it receives, based on the value type:
     *
     * - If a React element, then it gets cloned with new props injected (this works but is counter-intuitive and impossible to type properly, please don't prefer this path)
     * - If a function, it gets called with props plus index (keep in mind: this will change in 4.0 where we will render it as JSX component instead)
     * - If an object, then it gets passed to the default shape as props
     * - Else it's ignored and the default shape is rendered with the props from this component
     */
    option: ActiveShape<PropsType, ElementType> | undefined;
    /**
     * This prop controls the default shape. If `option` is either a React element, or a function, then it's ignored.
     * If `option` is an object, then this shape is rendered with the props from `option`.
     * If `option` is anything else (e.g. boolean), then this shape is rendered with the props from this component.
     */
    DefaultShape: ShapeRenderer<PropsType>;
    /**
     * The props forwarded to the selected shape branch.
     *
     * Keeping these props grouped avoids generic object-rest widening. That lets this helper keep strong types
     * without relying on casts or `@ts-expect-error`.
     */
    shapeProps: PropsType;
    activeClassName?: string;
    inActiveClassName?: string;
};
export declare function getPropsFromShapeOption<PropsType extends object>(option: ShapeOptionElement<PropsType> | ShapeOptionProps<PropsType>): ShapeOptionProps<PropsType>;
/**
 * Renders the user-provided active shape option while keeping each runtime branch aligned with its TypeScript type.
 *
 * The `option` prop supports four shapes:
 * - React element: clone it and let its own props override the injected ones
 * - function: call it with the forwarded props and optional index
 * - plain object: merge it into the default shape props
 * - boolean / undefined: ignore it and render the default shape with the forwarded props
 */
export declare function Shape<PropsType extends ShapeAnimationProps, ElementType extends SVGElement = SVGElement>({ option, DefaultShape, shapeProps, activeClassName, inActiveClassName, }: ShapeProps<PropsType, ElementType>): React.JSX.Element;
export {};
