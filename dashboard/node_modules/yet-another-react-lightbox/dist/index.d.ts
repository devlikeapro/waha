import * as React from 'react';
import { LightboxExternalProps, LightboxProps, ToolbarSettings, CarouselSettings, Slide, ContainerRect, LengthOrPercentage, SlideImage, Labels, Label, Component, Module, Node as Node$1, Plugin, Augmentation, EventTypes, ComponentProps, LightboxStateSwipeAction, LightboxStateUpdateAction, LightboxState, Render, ControllerSettings, ControllerRef, Callback, RenderFunction } from './types.js';
export { ACTION_CLOSE, ACTION_NEXT, ACTION_PREV, ACTION_SWIPE, ACTIVE_SLIDE_COMPLETE, ACTIVE_SLIDE_ERROR, ACTIVE_SLIDE_LOADING, ACTIVE_SLIDE_PLAYING, AnimationSettings, CLASS_FLEX_CENTER, CLASS_FULLSIZE, CLASS_NO_SCROLL, CLASS_NO_SCROLL_PADDING, CLASS_SLIDE, CLASS_SLIDE_WRAPPER, CLASS_SLIDE_WRAPPER_INTERACTIVE, Callbacks, ClickCallbackProps, DeepPartial, DeepPartialValue, ELEMENT_BUTTON, ELEMENT_ICON, EVENT_ON_KEY_DOWN, EVENT_ON_KEY_UP, EVENT_ON_POINTER_CANCEL, EVENT_ON_POINTER_DOWN, EVENT_ON_POINTER_LEAVE, EVENT_ON_POINTER_MOVE, EVENT_ON_POINTER_UP, EVENT_ON_WHEEL, GenericSlide, IMAGE_FIT_CONTAIN, IMAGE_FIT_COVER, ImageFit, ImageProps, ImageSource, MODULE_CAROUSEL, MODULE_CONTROLLER, MODULE_NAVIGATION, MODULE_NO_SCROLL, MODULE_PORTAL, MODULE_ROOT, MODULE_TOOLBAR, NavigationAction, NoScrollSettings, PLUGIN_CAPTIONS, PLUGIN_COUNTER, PLUGIN_DOWNLOAD, PLUGIN_FULLSCREEN, PLUGIN_INLINE, PLUGIN_SHARE, PLUGIN_SLIDESHOW, PLUGIN_THUMBNAILS, PLUGIN_ZOOM, PluginProps, PortalSettings, RenderSlideContainerProps, RenderSlideFooterProps, RenderSlideHeaderProps, RenderSlideProps, SLIDE_STATUS_COMPLETE, SLIDE_STATUS_ERROR, SLIDE_STATUS_LOADING, SLIDE_STATUS_PLACEHOLDER, SLIDE_STATUS_PLAYING, SlideStatus, SlideTypeKey, SlideTypes, Slot, SlotStyles, SlotType, ToolbarButtonKey, ToolbarButtonKeys, UNKNOWN_ACTION_TYPE, VK_ARROW_LEFT, VK_ARROW_RIGHT, VK_ESCAPE, ViewCallbackProps, activeSlideStatus } from './types.js';

/** Lightbox component */
declare function Lightbox({ carousel, animation, render, toolbar, controller, noScroll, on, plugins, slides, index, ...restProps }: LightboxExternalProps): React.JSX.Element | null;

declare const LightboxDefaultProps: LightboxProps;

declare function clsx(...classes: (string | boolean | undefined)[]): string;
declare function cssClass(name: string): string;
declare function cssVar(name: string): string;
declare function composePrefix(base: string, prefix?: string): string;
declare function makeComposePrefix(base: string): (prefix?: string) => string;
declare function translateLabel(labels: Labels | undefined, defaultLabel: Label): string;
/** @deprecated - use `translateLabel` instead */
declare function label(labels: Labels | undefined, defaultLabel: Label): string;
declare function translateSlideCounter(labels: Labels | undefined, slides: readonly Slide[], index: number): string;
declare function cleanup(...cleaners: (() => void)[]): () => void;
declare function makeUseContext<T>(name: string, contextName: string, context: React.Context<T | null>): () => NonNullable<T>;
declare function hasWindow(): boolean;
declare function round(value: number, decimals?: number): number;
declare function isImageSlide(slide: Slide): slide is SlideImage;
declare function isImageFitCover(image: SlideImage, imageFit?: LightboxProps["carousel"]["imageFit"]): boolean;
declare function parseInt(value: string | number): number;
declare function parseLengthPercentage(input: LengthOrPercentage): {
    pixel: number;
    percent?: undefined;
} | {
    percent: number;
    pixel?: undefined;
};
declare function computeSlideRect(containerRect: ContainerRect, padding: LengthOrPercentage): {
    width: number;
    height: number;
};
declare function devicePixelRatio(): number;
declare function getSlideIndex(index: number, slidesCount: number): number;
declare function hasSlides(slides: readonly Slide[]): slides is [Slide, ...Slide[]];
declare function getSlide(slides: [Slide, ...Slide[]], index: number): SlideImage;
declare function getSlideIfPresent(slides: readonly Slide[], index: number): SlideImage | undefined;
declare function getSlideKey(slide: Slide): string | undefined;
declare function addToolbarButton(toolbar: ToolbarSettings, key: string, button: React.ReactNode): ToolbarSettings;
declare function stopNavigationEventsPropagation(): {
    onPointerDown: (event: React.PointerEvent | React.KeyboardEvent | React.WheelEvent) => void;
    onKeyDown: (event: React.PointerEvent | React.KeyboardEvent | React.WheelEvent) => void;
    onWheel: (event: React.PointerEvent | React.KeyboardEvent | React.WheelEvent) => void;
};
declare function calculatePreload(carousel: CarouselSettings, slides: readonly Slide[], minimum?: number): number;
declare function makeInertWhen(condition: boolean): {
    inert: boolean;
};
declare function reflow(node: HTMLElement): void;

declare function createModule(name: string, component: Component): Module;
declare function createNode(module: Module, children?: Node$1[]): Node$1;
declare function withPlugins(root: Node$1[], plugins?: readonly Plugin[], augmentations?: Augmentation[]): {
    config: Node$1[];
    augmentation: Augmentation;
};

type ComputeAnimation<T> = (snapshot: T, rect: DOMRect, translate: {
    x: number;
    y: number;
    z: number;
}) => {
    keyframes: Keyframe[];
    duration: number;
    easing?: string;
    onfinish?: () => void;
} | undefined;
declare function useAnimation<T>(nodeRef: React.RefObject<HTMLElement | null>, computeAnimation: ComputeAnimation<T>): {
    prepareAnimation: (currentSnapshot: T | undefined) => void;
    isAnimationPlaying: () => boolean;
};

declare function useContainerRect<T extends HTMLElement = HTMLElement>(): {
    setContainerRef: (node: T | null) => void;
    containerRef: React.RefObject<T | null>;
    containerRect: ContainerRect | undefined;
};

declare function useDelay(): (callback: () => void, delay: number) => void;

declare function useEventCallback<Args extends unknown[], Return>(fn: (...args: Args) => Return): (...args: Args) => Return;

declare function setRef<T>(ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined, value: T | null): void;
declare function useForkRef<InstanceA, InstanceB>(refA: React.Ref<InstanceA> | null | undefined, refB: React.Ref<InstanceB> | null | undefined): React.Ref<InstanceA & InstanceB> | null;

declare const useLayoutEffect: typeof React.useLayoutEffect;

declare function useLoseFocus(focus: () => void, disabled?: boolean): {
    onFocus: () => void;
    onBlur: () => void;
};

declare function useMotionPreference(): boolean;

declare function useRTL(): boolean;

type PointerEventType = "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerLeave" | "onPointerCancel";
type KeyboardEventType = "onKeyDown" | "onKeyUp";
type WheelEventType = "onWheel";
type SupportedEventType = PointerEventType | KeyboardEventType | WheelEventType;
type ReactEventType<T, K> = K extends KeyboardEventType ? React.KeyboardEvent<T> : K extends WheelEventType ? React.WheelEvent<T> : K extends PointerEventType ? React.PointerEvent<T> : never;
type SensorCallback<T extends Element, P extends React.PointerEvent<T> | React.KeyboardEvent<T> | React.WheelEvent<T>> = (event: P) => void;
type SubscribeSensors<T extends Element> = <ET extends SupportedEventType>(type: ET, callback: SensorCallback<T, ReactEventType<T, ET>>) => () => void;
type RegisterSensors<T extends Element> = Required<Pick<React.HTMLAttributes<T>, PointerEventType>> & Required<Pick<React.HTMLAttributes<T>, KeyboardEventType>> & Required<Pick<React.HTMLAttributes<T>, WheelEventType>>;
type UseSensors<T extends Element> = {
    registerSensors: RegisterSensors<T>;
    subscribeSensors: SubscribeSensors<T>;
};
declare function useSensors<T extends Element>(): UseSensors<T>;

declare function useThrottle(callback: (...args: unknown[]) => void, delay: number): (...args: unknown[]) => void;

type A11yContextType = {
    focusWithin: boolean;
    trackFocusWithin: (onFocus?: React.FocusEventHandler, onBlur?: React.FocusEventHandler) => {
        onFocus: React.FocusEventHandler;
        onBlur: React.FocusEventHandler;
    };
    autoPlaying: boolean;
    setAutoPlaying: (value: boolean) => void;
};
declare const A11yContext: React.Context<A11yContextType | null>;
declare const useA11yContext: () => A11yContextType;
declare function A11yContextProvider({ children }: React.PropsWithChildren): React.JSX.Element;

type DocumentContextType = {
    getOwnerDocument: (node?: Node | null) => Document;
    getOwnerWindow: (node?: Node | null) => Window;
};
declare const DocumentContext: React.Context<DocumentContextType | null>;
declare const useDocumentContext: () => DocumentContextType;
type DocumentContextProviderProps = React.PropsWithChildren & {
    nodeRef: React.RefObject<Node | null>;
};
declare function DocumentContextProvider({ nodeRef, children }: DocumentContextProviderProps): React.JSX.Element;

type Topic = keyof EventTypes;
type Event<T extends Topic> = EventTypes[T];
type EventCallback<T extends Topic> = (...args: Event<T> extends void ? [] : [event: Event<T>]) => void;
type Subscribe = <T extends Topic>(topic: T, callback: EventCallback<T>) => () => void;
type Unsubscribe = <T extends Topic>(topic: T, callback: EventCallback<T>) => void;
type Publish = <T extends Topic>(...args: Event<T> extends void ? [topic: T] : [topic: T, event: Event<T>]) => void;
type EventsContextType = {
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
    publish: Publish;
};
declare const EventsContext: React.Context<EventsContextType | null>;
declare const useEvents: () => EventsContextType;
declare function EventsProvider({ children }: React.PropsWithChildren): React.JSX.Element;

type LightboxPropsContextType = Omit<ComponentProps, "children">;
declare const LightboxPropsContext: React.Context<LightboxPropsContextType | null>;
declare const useLightboxProps: () => LightboxPropsContextType;
declare function LightboxPropsProvider({ children, ...props }: ComponentProps): React.JSX.Element;

type LightboxStateAction = LightboxStateSwipeAction | LightboxStateUpdateAction;
type LightboxStateContextType = LightboxState & {
    /** @deprecated - use `useLightboxState` props directly */
    state: LightboxState;
    /** @deprecated - use `useLightboxDispatch` instead */
    dispatch: React.Dispatch<LightboxStateAction>;
};
declare const LightboxStateContext: React.Context<LightboxStateContextType | null>;
declare const useLightboxState: () => NonNullable<LightboxStateContextType>;
type LightboxDispatchContextType = React.Dispatch<LightboxStateAction>;
declare const LightboxDispatchContext: React.Context<LightboxDispatchContextType | null>;
declare const useLightboxDispatch: () => LightboxDispatchContextType;
type LightboxStateProviderProps = React.PropsWithChildren<Pick<LightboxProps, "slides" | "index">>;
declare function LightboxStateProvider({ slides, index, children }: LightboxStateProviderProps): React.JSX.Element;

type RTLContextType = {
    isRTL: boolean;
};
declare const RTLContext: React.Context<RTLContextType | null>;
declare const useRTLContext: () => RTLContextType;
type RTLContextProviderProps = React.PropsWithChildren & {
    isRTL: boolean;
};
declare function RTLContextProvider({ isRTL, children }: RTLContextProviderProps): React.JSX.Element;

type TimeoutsContextType = {
    setTimeout: (fn: () => void, delay?: number) => number;
    clearTimeout: (id?: number) => void;
};
declare const TimeoutsContext: React.Context<TimeoutsContextType | null>;
declare const useTimeouts: () => TimeoutsContextType;
declare function TimeoutsProvider({ children }: React.PropsWithChildren): React.JSX.Element;

type IconButtonProps = React.ComponentProps<"button"> & {
    label: Label;
    icon: React.ElementType;
    renderIcon?: () => React.ReactNode;
};
declare const IconButton: React.ForwardRefExoticComponent<Omit<IconButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

declare function createIcon(name: string, glyph: React.ReactNode): {
    (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
    displayName: string;
};
declare function createIconDisabled(name: string, glyph: React.ReactNode): {
    (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
    displayName: string;
};
declare const CloseIcon: {
    (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
    displayName: string;
};
declare const PreviousIcon: {
    (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
    displayName: string;
};
declare const NextIcon: {
    (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
    displayName: string;
};
declare const LoadingIcon: {
    (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
    displayName: string;
};
declare const ErrorIcon: {
    (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
    displayName: string;
};

type ImageSlideProps = Partial<Pick<CarouselSettings, "imageFit" | "imageProps">> & {
    slide: SlideImage;
    offset?: number;
    render?: Render;
    rect?: ContainerRect;
    onClick?: () => void;
    onLoad?: (image: HTMLImageElement) => void;
    onError?: () => void;
    style?: React.CSSProperties;
};
declare function ImageSlide({ slide: image, offset, render, rect, imageFit, imageProps, onClick, onLoad, onError, style, }: ImageSlideProps): React.JSX.Element;

declare const LightboxRoot: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

declare function Carousel({ carousel, labels }: ComponentProps): React.JSX.Element;
declare const CarouselModule: Module;

declare enum SwipeState {
    NONE = 0,
    SWIPE = 1,
    PULL = 2,
    ANIMATION = 3
}

declare function usePointerSwipe<T extends Element = Element>({ disableSwipeNavigation, closeOnBackdropClick }: ControllerSettings, subscribeSensors: UseSensors<T>["subscribeSensors"], isSwipeValid: (offset: number) => boolean, containerWidth: number, swipeAnimationDuration: number, onSwipeStart: () => void, onSwipeProgress: (offset: number) => void, onSwipeFinish: (offset: number, duration: number) => void, onSwipeCancel: (offset: number) => void, pullUpEnabled: boolean, pullDownEnabled: boolean, onPullStart: () => void, onPullProgress: (offset: number) => void, onPullFinish: (offset: number, duration: number) => void, onPullCancel: (offset: number) => void, onClose: () => void): void;

/**
 * Prevent default effects of the wheel events:
 * - prevent browser back/forward navigation on touchpad left/right swipe (especially noticeable in Safari)
 * - prevent vertical scroll in inline mode when `scrollToZoom` option is enabled
 * - prevent page zoom when Zoom plugin is enabled
 */
declare function usePreventWheelDefaults<T extends HTMLElement = HTMLElement>({ preventDefaultWheelX, preventDefaultWheelY, }: Pick<ControllerSettings, "preventDefaultWheelX" | "preventDefaultWheelY">): (node: T | null) => void;

declare function useWheelSwipe<T extends Element = Element>(swipeState: SwipeState, subscribeSensors: UseSensors<T>["subscribeSensors"], isSwipeValid: (offset: number) => boolean, containerWidth: number, swipeAnimationDuration: number, onSwipeStart: () => void, onSwipeProgress: (offset: number) => void, onSwipeFinish: (offset: number, duration: number) => void, onSwipeCancel: (offset: number) => void): void;

type ControllerContextType = Pick<ControllerRef, "prev" | "next" | "close"> & {
    focus: Callback;
    slideRect: ContainerRect;
    containerRect: ContainerRect;
    subscribeSensors: SubscribeSensors<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    setCarouselRef: React.Ref<HTMLDivElement>;
    toolbarWidth: number | undefined;
    setToolbarWidth: (width: number | undefined) => void;
};
declare const ControllerContext: React.Context<ControllerContextType | null>;
declare const useController: () => NonNullable<ControllerContextType>;
declare function Controller({ children, ...props }: ComponentProps): React.JSX.Element;
declare const ControllerModule: Module;

type NavigationButtonProps = {
    label: Label;
    icon: React.ElementType;
    renderIcon?: RenderFunction;
    action: "prev" | "next";
    onClick: () => void;
    disabled?: boolean;
    style?: React.CSSProperties;
};
declare function NavigationButton({ label, icon, renderIcon, action, onClick, disabled, style }: NavigationButtonProps): React.JSX.Element;
declare function Navigation({ render: { buttonPrev, buttonNext, iconPrev, iconNext }, styles }: ComponentProps): React.JSX.Element;
declare const NavigationModule: Module;

declare function useKeyboardNavigation<T extends Element>(subscribeSensors: UseSensors<T>["subscribeSensors"]): void;

declare function useNavigationState(): {
    prevDisabled: boolean;
    nextDisabled: boolean;
};

declare function NoScroll({ noScroll: { disabled }, children }: ComponentProps): React.JSX.Element;
declare const NoScrollModule: Module;

declare function Portal({ portal: { root, container: { className: containerClassName, style: containerStyle, ...containerRest } }, animation, styles, className, on, close, labels, children, }: ComponentProps): React.ReactPortal | null;
declare const PortalModule: Module;

declare function Root({ children }: ComponentProps): React.JSX.Element;
declare const RootModule: Module;

declare function Toolbar({ toolbar: { buttons }, render: { buttonClose, iconClose }, styles }: ComponentProps): React.JSX.Element;
declare const ToolbarModule: Module;

export { A11yContext, A11yContextProvider, Augmentation, Callback, Carousel, CarouselModule, CarouselSettings, CloseIcon, Component, ComponentProps, ContainerRect, Controller, ControllerContext, ControllerModule, ControllerRef, ControllerSettings, DocumentContext, DocumentContextProvider, ErrorIcon, EventTypes, EventsContext, EventsProvider, IconButton, ImageSlide, Label, Labels, LengthOrPercentage, Lightbox, LightboxDefaultProps, LightboxDispatchContext, LightboxExternalProps, LightboxProps, LightboxPropsContext, LightboxPropsProvider, LightboxRoot, LightboxState, LightboxStateContext, LightboxStateProvider, LightboxStateSwipeAction, LightboxStateUpdateAction, LoadingIcon, Module, Navigation, NavigationButton, NavigationModule, NextIcon, NoScroll, NoScrollModule, Node$1 as Node, Plugin, Portal, PortalModule, PreviousIcon, RTLContext, RTLContextProvider, Render, RenderFunction, Root, RootModule, Slide, SlideImage, SwipeState, TimeoutsContext, TimeoutsProvider, Toolbar, ToolbarModule, ToolbarSettings, addToolbarButton, calculatePreload, cleanup, clsx, composePrefix, computeSlideRect, createIcon, createIconDisabled, createModule, createNode, cssClass, cssVar, Lightbox as default, devicePixelRatio, getSlide, getSlideIfPresent, getSlideIndex, getSlideKey, hasSlides, hasWindow, isImageFitCover, isImageSlide, label, makeComposePrefix, makeInertWhen, makeUseContext, parseInt, parseLengthPercentage, reflow, round, setRef, stopNavigationEventsPropagation, translateLabel, translateSlideCounter, useA11yContext, useAnimation, useContainerRect, useController, useDelay, useDocumentContext, useEventCallback, useEvents, useForkRef, useKeyboardNavigation, useLayoutEffect, useLightboxDispatch, useLightboxProps, useLightboxState, useLoseFocus, useMotionPreference, useNavigationState, usePointerSwipe, usePreventWheelDefaults, useRTL, useRTLContext, useSensors, useThrottle, useTimeouts, useWheelSwipe, withPlugins };
export type { A11yContextType, ComputeAnimation, ControllerContextType, DocumentContextProviderProps, DocumentContextType, Event, EventCallback, EventsContextType, IconButtonProps, ImageSlideProps, KeyboardEventType, LightboxDispatchContextType, LightboxPropsContextType, LightboxStateAction, LightboxStateContextType, LightboxStateProviderProps, NavigationButtonProps, PointerEventType, Publish, RTLContextProviderProps, RTLContextType, ReactEventType, RegisterSensors, SensorCallback, Subscribe, SubscribeSensors, SupportedEventType, TimeoutsContextType, Topic, Unsubscribe, UseSensors, WheelEventType };
