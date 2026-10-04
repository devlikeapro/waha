import * as React from 'react';

declare const MODULE_CAROUSEL = "carousel";
declare const MODULE_CONTROLLER = "controller";
declare const MODULE_NAVIGATION = "navigation";
declare const MODULE_NO_SCROLL = "no-scroll";
declare const MODULE_PORTAL = "portal";
declare const MODULE_ROOT = "root";
declare const MODULE_TOOLBAR = "toolbar";
declare const PLUGIN_CAPTIONS = "captions";
declare const PLUGIN_COUNTER = "counter";
declare const PLUGIN_DOWNLOAD = "download";
declare const PLUGIN_FULLSCREEN = "fullscreen";
declare const PLUGIN_INLINE = "inline";
declare const PLUGIN_SHARE = "share";
declare const PLUGIN_SLIDESHOW = "slideshow";
declare const PLUGIN_THUMBNAILS = "thumbnails";
declare const PLUGIN_ZOOM = "zoom";
declare const SLIDE_STATUS_LOADING = "loading";
declare const SLIDE_STATUS_PLAYING = "playing";
declare const SLIDE_STATUS_ERROR = "error";
declare const SLIDE_STATUS_COMPLETE = "complete";
declare const SLIDE_STATUS_PLACEHOLDER = "placeholder";
type SlideStatus = typeof SLIDE_STATUS_LOADING | typeof SLIDE_STATUS_PLAYING | typeof SLIDE_STATUS_ERROR | typeof SLIDE_STATUS_COMPLETE;
declare const activeSlideStatus: (status: SlideStatus) => `active-slide-${SlideStatus}`;
declare const ACTIVE_SLIDE_LOADING: "active-slide-loading";
declare const ACTIVE_SLIDE_PLAYING: "active-slide-playing";
declare const ACTIVE_SLIDE_ERROR: "active-slide-error";
declare const ACTIVE_SLIDE_COMPLETE: "active-slide-complete";
declare const CLASS_FULLSIZE = "fullsize";
declare const CLASS_FLEX_CENTER = "flex_center";
declare const CLASS_NO_SCROLL = "no_scroll";
declare const CLASS_NO_SCROLL_PADDING = "no_scroll_padding";
declare const CLASS_SLIDE = "slide";
declare const CLASS_SLIDE_WRAPPER = "slide_wrapper";
declare const CLASS_SLIDE_WRAPPER_INTERACTIVE = "slide_wrapper_interactive";
declare const ACTION_PREV = "prev";
declare const ACTION_NEXT = "next";
declare const ACTION_SWIPE = "swipe";
declare const ACTION_CLOSE = "close";
declare const EVENT_ON_POINTER_DOWN = "onPointerDown";
declare const EVENT_ON_POINTER_MOVE = "onPointerMove";
declare const EVENT_ON_POINTER_UP = "onPointerUp";
declare const EVENT_ON_POINTER_LEAVE = "onPointerLeave";
declare const EVENT_ON_POINTER_CANCEL = "onPointerCancel";
declare const EVENT_ON_KEY_DOWN = "onKeyDown";
declare const EVENT_ON_KEY_UP = "onKeyUp";
declare const EVENT_ON_WHEEL = "onWheel";
declare const VK_ESCAPE = "Escape";
declare const VK_ARROW_LEFT = "ArrowLeft";
declare const VK_ARROW_RIGHT = "ArrowRight";
declare const ELEMENT_BUTTON = "button";
declare const ELEMENT_ICON = "icon";
declare const IMAGE_FIT_CONTAIN = "contain";
declare const IMAGE_FIT_COVER = "cover";
declare const UNKNOWN_ACTION_TYPE = "Unknown action type";

/** Lightbox external props */
type LightboxExternalProps = DeepPartial<DeepPartial<DeepPartial<LightboxProps, "animation" | "toolbar" | "noScroll">, "carousel", "imageProps">, "controller", "ref">;
/** Lightbox properties */
interface LightboxProps {
    /** if `true`, the lightbox is open */
    open: boolean;
    /** a callback to close the lightbox */
    close: Callback;
    /** starting slide index */
    index: number;
    /** slides to display in the lightbox */
    slides: readonly Slide[];
    /** custom render functions */
    render: Render;
    /** custom UI labels / translations */
    labels: Labels;
    /** enabled plugins */
    plugins: readonly Plugin[];
    /** toolbar settings */
    toolbar: ToolbarSettings;
    /** carousel settings */
    carousel: CarouselSettings;
    /** animation settings */
    animation: AnimationSettings;
    /** controller settings */
    controller: ControllerSettings;
    /** portal settings */
    portal: PortalSettings;
    /** NoScroll module settings */
    noScroll: NoScrollSettings;
    /** lifecycle callbacks */
    on: Callbacks;
    /** customization styles */
    styles: SlotStyles;
    /** CSS class of the lightbox root element */
    className: string;
}
/** Slide */
type Slide = SlideTypes[SlideTypeKey];
/** Supported slide types */
interface SlideTypes {
    /** image slide type */
    image: SlideImage;
}
/** Slide type key */
type SlideTypeKey = keyof SlideTypes;
/** Generic slide */
interface GenericSlide {
    type?: SlideTypeKey;
}
/** Image slide properties */
interface SlideImage extends GenericSlide {
    /** image slide type */
    type?: "image";
    /** image URL */
    src: string;
    /** image 'alt' attribute */
    alt?: string;
    /** image width in pixels */
    width?: number;
    /** image height in pixels */
    height?: number;
    /** `object-fit` setting */
    imageFit?: ImageFit;
    /** alternative images to be passed to the 'srcSet' */
    srcSet?: readonly ImageSource[];
}
/** Image source */
interface ImageSource {
    /** image URL */
    src: string;
    /** image width in pixels */
    width: number;
    /** image height in pixels */
    height: number;
}
/** Image fit setting */
type ImageFit = "contain" | "cover";
/** Lightbox component */
type Component = React.ComponentType<ComponentProps>;
/** Lightbox component properties */
type ComponentProps = React.PropsWithChildren<Omit<LightboxProps, "slides" | "index" | "plugins">>;
/** Lightbox component tree node */
type Node = {
    /** module */
    module: Module;
    /** module child nodes */
    children?: Node[];
};
/** Lightbox module */
type Module = {
    /** module name */
    name: string;
    /** module component */
    component: Component;
};
/** Lightbox props augmentation */
type Augmentation = (props: ComponentProps) => ComponentProps;
/** Container rect */
type ContainerRect = {
    width: number;
    height: number;
};
/** Customization slots */
type Slot = SlotType[keyof SlotType];
/** Supported customization slots */
interface SlotType {
    /** lightbox root customization slot */
    root: "root";
    /** lightbox container customization slot */
    container: "container";
    /** lightbox slide customization slot */
    slide: "slide";
    /** lightbox button customization slot */
    button: "button";
    /** lightbox icon customization slot */
    icon: "icon";
    /** lightbox toolbar customization slot */
    toolbar: "toolbar";
    /** lightbox Prev navigation button customization slot */
    navigationPrev: "navigationPrev";
    /** lightbox Next navigation button customization slot */
    navigationNext: "navigationNext";
}
/** Customization slot CSS properties */
interface SlotCSSProperties extends React.CSSProperties {
    [key: `--yarl__${string}`]: string | number;
}
/** Customization slots styles */
type SlotStyles = {
    [key in Slot]?: SlotCSSProperties;
};
/** Carousel settings */
interface CarouselSettings {
    /** if `true`, the lightbox carousel doesn't wrap around */
    finite: boolean;
    /** the lightbox preloads (2 * preload + 1) slides */
    preload: number;
    /** padding around each slide (e.g., "16px", "10%" or 0) */
    padding: LengthOrPercentage;
    /** spacing between slides (e.g., "100px", "50%" or 0) */
    spacing: LengthOrPercentage;
    /** `object-fit` setting for image slides */
    imageFit: ImageFit;
    /** custom image attributes */
    imageProps: ImageProps | ((slide: Slide) => ImageProps);
}
type LengthOrPercentage = `${number}px` | `${number}%` | number;
type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "sizes" | "srcSet" | "onLoad" | "onError" | "onClick">;
/** Animation settings */
interface AnimationSettings {
    /** fade-in / fade-out animation settings */
    fade: number;
    /** swipe animation settings */
    swipe: number;
    /** override for `swipe` animation settings when using keyboard navigation or navigation buttons */
    navigation?: number;
    /** animation timing function settings */
    easing: {
        /** fade-in / fade-out animation timing function */
        fade: string;
        /** slide swipe animation timing function */
        swipe: string;
        /** slide navigation animation timing function (when using keyboard navigation or navigation buttons) */
        navigation: string;
    };
}
/** Controller settings */
interface ControllerSettings {
    /** controller ref */
    ref: React.ForwardedRef<ControllerRef>;
    /** @deprecated for internal use only */
    focus: boolean;
    /** @deprecated for internal use only */
    touchAction: "none" | "pan-y";
    /** @deprecated for internal use only */
    aria: boolean;
    /** if `true`, close the lightbox on pull-up gesture */
    closeOnPullUp: boolean;
    /** if `true`, close the lightbox on pull-down gesture */
    closeOnPullDown: boolean;
    /** if `true`, close the lightbox when the backdrop is clicked */
    closeOnBackdropClick: boolean;
    /** if `true`, close the lightbox on Escape key press (default: `true`) */
    closeOnEscape: boolean;
    /** if `true`, prevent default for horizontal wheel scroll events (for internal use only) */
    preventDefaultWheelX: boolean;
    /** if `true`, prevent default for vertical wheel scroll events (for internal use only) */
    preventDefaultWheelY: boolean;
    /** if `true`, disable slide change on pointer swipe / drag */
    disableSwipeNavigation: boolean;
}
/** Lightbox controller ref */
interface ControllerRef {
    /** navigate to the previous slide */
    prev: Callback<NavigationAction | void>;
    /** navigate to the next slide */
    next: Callback<NavigationAction | void>;
    /** close the lightbox */
    close: Callback;
    /** transfer focus to the lightbox controller */
    focus: Callback;
    /** get lightbox props */
    getLightboxProps: () => ComponentProps;
    /** get lightbox state */
    getLightboxState: () => LightboxState;
}
/** Portal settings */
interface PortalSettings {
    /** portal mount point */
    root?: (() => DocumentFragment | Element | null) | DocumentFragment | Element | null;
    /** HTML attributes for the portal container */
    container?: React.HTMLAttributes<HTMLDivElement>;
}
/** NoScroll module settings */
interface NoScrollSettings {
    /** if `true`, the NoScroll module functionality is disabled */
    disabled: boolean;
}
/** Lightbox navigation action */
interface NavigationAction {
    /** navigate through the specified number of slides */
    count?: number;
}
/** Lightbox state swipe action */
type LightboxStateSwipeAction = {
    type: "swipe";
    increment: number;
    duration?: number;
    easing?: string;
};
/** Lightbox state update action */
type LightboxStateUpdateAction = {
    type: "update";
    slides: readonly Slide[];
    index: number;
};
/** Lightbox state */
interface LightboxState {
    /** lightbox slides */
    slides: readonly Slide[];
    /** current slide index */
    currentIndex: number;
    /** current slide index in the (-∞, +∞) range */
    globalIndex: number;
    /** current slide */
    currentSlide: Slide | undefined;
    /** current animation */
    animation?: {
        increment?: number;
        duration?: number;
        easing?: string;
    };
}
/** Render function */
type RenderFunction<T = void> = [T] extends [void] ? () => React.ReactNode : (props: T) => React.ReactNode;
/** `render.slide` render function props */
interface RenderSlideProps<S extends Slide = Slide> {
    /** slide */
    slide: S;
    /** slide offset (`0` - current slide, `1` - next slide, `-1` - previous slide, etc.) */
    offset: number;
    /** container rect */
    rect: ContainerRect;
}
/** `render.slideHeader` render function props */
interface RenderSlideHeaderProps {
    slide: Slide;
}
/** `render.slideFooter` render function props */
interface RenderSlideFooterProps {
    slide: Slide;
}
/** `render.slideContainer` render function props */
interface RenderSlideContainerProps extends React.PropsWithChildren {
    slide: Slide;
}
/** Custom render functions. */
interface Render {
    /** render custom slide type, or override the default image slide */
    slide?: RenderFunction<RenderSlideProps>;
    /** render custom slide header (use absolute positioning) */
    slideHeader?: RenderFunction<RenderSlideHeaderProps>;
    /** render custom slide footer (use absolute positioning) */
    slideFooter?: RenderFunction<RenderSlideFooterProps>;
    /** render custom slide container */
    slideContainer?: RenderFunction<RenderSlideContainerProps>;
    /** render custom controls or additional elements in the lightbox (use absolute positioning) */
    controls?: RenderFunction;
    /** render custom Prev icon */
    iconPrev?: RenderFunction;
    /** render custom Next icon */
    iconNext?: RenderFunction;
    /** render custom Close icon */
    iconClose?: RenderFunction;
    /** render custom Loading icon */
    iconLoading?: RenderFunction;
    /** render custom Error icon */
    iconError?: RenderFunction;
    /** render custom Prev button */
    buttonPrev?: RenderFunction;
    /** render custom Next button */
    buttonNext?: RenderFunction;
    /** render custom Close button */
    buttonClose?: RenderFunction;
}
type Callback<T = void> = [T] extends [void] ? () => void : (props: T) => void;
interface ViewCallbackProps {
    index: number;
}
interface ClickCallbackProps {
    index: number;
}
/** Lifecycle callbacks */
interface Callbacks {
    /** a callback called when a slide becomes active */
    view?: Callback<ViewCallbackProps>;
    /** a callback called when a slide is clicked */
    click?: Callback<ClickCallbackProps>;
    /** a callback called when the portal starts opening */
    entering?: Callback;
    /** a callback called when the portal opens */
    entered?: Callback;
    /** a callback called when the portal starts closing */
    exiting?: Callback;
    /** a callback called when the portal closes */
    exited?: Callback;
}
/** Custom UI labels / translations / localization */
interface Labels {
    /** `Previous` button title */
    Previous?: string;
    /** `Next` button title */
    Next?: string;
    /** `Close` button title */
    Close?: string;
    /** Slide ARIA role description */
    Slide?: string;
    /** Carousel ARIA role description */
    Carousel?: string;
    /** Lightbox ARIA label */
    Lightbox?: string;
    /** Carousel ARIA label */
    "Photo gallery"?: string;
    /**
     * Slide ARIA label
     *
     * The value is a template string supporting the following placeholders:
     * - {index} - current slide index
     * - {total} - total number of slides
     */
    "{index} of {total}"?: string;
}
type Label = keyof Labels;
/** Toolbar settings */
interface ToolbarSettings {
    /** buttons to render in the toolbar */
    buttons: readonly (ToolbarButtonKey | React.ReactNode)[];
}
type ToolbarButtonKey = keyof ToolbarButtonKeys;
interface ToolbarButtonKeys {
    close: null;
}
interface EventTypes {
    [ACTION_PREV]: NavigationAction | void;
    [ACTION_NEXT]: NavigationAction | void;
    [ACTION_SWIPE]: LightboxStateSwipeAction;
    [ACTION_CLOSE]: void;
    [ACTIVE_SLIDE_LOADING]: void;
    [ACTIVE_SLIDE_PLAYING]: void;
    [ACTIVE_SLIDE_COMPLETE]: void;
    [ACTIVE_SLIDE_ERROR]: void;
}
/** Plugin methods */
interface PluginProps {
    /** test if a target module is present */
    contains: (target: string) => boolean;
    /** add module as a parent */
    addParent: (target: string, module: Module) => void;
    /** add module as a child */
    addChild: (target: string, module: Module, precede?: boolean) => void;
    /** add module as a sibling */
    addSibling: (target: string, module: Module, precede?: boolean) => void;
    /** append module to the Controller module */
    addModule: (module: Module) => void;
    /** replace module */
    replace: (target: string, module: Module) => void;
    /** add module as a child and inherit all existing children */
    append: (target: string, module: Module) => void;
    /** remove module */
    remove: (target: string) => void;
    /** augment lightbox props */
    augment: (augmentation: Augmentation) => void;
}
/** Lightbox plugin */
type Plugin = (props: PluginProps) => void;
/** Deep partial utility type */
type DeepPartial<T extends object, K extends keyof T = keyof T, E extends string = never> = Omit<Partial<T>, K> & {
    [P in K]?: DeepPartialValue<T[P], E>;
};
type DeepPartialValue<T, E extends string = never> = T extends readonly any[] ? T : T extends (...props: any[]) => any ? T : T extends object ? {
    [P in keyof T]?: P extends E ? T[P] : DeepPartialValue<T[P], E>;
} : T;

export { ACTION_CLOSE, ACTION_NEXT, ACTION_PREV, ACTION_SWIPE, ACTIVE_SLIDE_COMPLETE, ACTIVE_SLIDE_ERROR, ACTIVE_SLIDE_LOADING, ACTIVE_SLIDE_PLAYING, CLASS_FLEX_CENTER, CLASS_FULLSIZE, CLASS_NO_SCROLL, CLASS_NO_SCROLL_PADDING, CLASS_SLIDE, CLASS_SLIDE_WRAPPER, CLASS_SLIDE_WRAPPER_INTERACTIVE, ELEMENT_BUTTON, ELEMENT_ICON, EVENT_ON_KEY_DOWN, EVENT_ON_KEY_UP, EVENT_ON_POINTER_CANCEL, EVENT_ON_POINTER_DOWN, EVENT_ON_POINTER_LEAVE, EVENT_ON_POINTER_MOVE, EVENT_ON_POINTER_UP, EVENT_ON_WHEEL, IMAGE_FIT_CONTAIN, IMAGE_FIT_COVER, MODULE_CAROUSEL, MODULE_CONTROLLER, MODULE_NAVIGATION, MODULE_NO_SCROLL, MODULE_PORTAL, MODULE_ROOT, MODULE_TOOLBAR, PLUGIN_CAPTIONS, PLUGIN_COUNTER, PLUGIN_DOWNLOAD, PLUGIN_FULLSCREEN, PLUGIN_INLINE, PLUGIN_SHARE, PLUGIN_SLIDESHOW, PLUGIN_THUMBNAILS, PLUGIN_ZOOM, SLIDE_STATUS_COMPLETE, SLIDE_STATUS_ERROR, SLIDE_STATUS_LOADING, SLIDE_STATUS_PLACEHOLDER, SLIDE_STATUS_PLAYING, UNKNOWN_ACTION_TYPE, VK_ARROW_LEFT, VK_ARROW_RIGHT, VK_ESCAPE, activeSlideStatus };
export type { AnimationSettings, Augmentation, Callback, Callbacks, CarouselSettings, ClickCallbackProps, Component, ComponentProps, ContainerRect, ControllerRef, ControllerSettings, DeepPartial, DeepPartialValue, EventTypes, GenericSlide, ImageFit, ImageProps, ImageSource, Label, Labels, LengthOrPercentage, LightboxExternalProps, LightboxProps, LightboxState, LightboxStateSwipeAction, LightboxStateUpdateAction, Module, NavigationAction, NoScrollSettings, Node, Plugin, PluginProps, PortalSettings, Render, RenderFunction, RenderSlideContainerProps, RenderSlideFooterProps, RenderSlideHeaderProps, RenderSlideProps, Slide, SlideImage, SlideStatus, SlideTypeKey, SlideTypes, Slot, SlotStyles, SlotType, ToolbarButtonKey, ToolbarButtonKeys, ToolbarSettings, ViewCallbackProps };
