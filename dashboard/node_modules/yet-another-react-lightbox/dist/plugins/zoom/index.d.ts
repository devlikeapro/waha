import * as React from 'react';
import { Plugin, PLUGIN_ZOOM, Callback, RenderFunction } from '../../types.js';

/** Zoom plugin */
declare const Zoom: Plugin;

declare module "yet-another-react-lightbox" {
    interface LightboxProps {
        /** Zoom plugin settings */
        zoom?: {
            /** Zoom plugin ref */
            ref?: React.ForwardedRef<ZoomRef>;
            /** override minimum zoom level (default: 1.0) */
            minZoom?: number;
            /** ratio of image pixels to physical pixels at maximum zoom level */
            maxZoomPixelRatio?: number;
            /** zoom-in multiplier */
            zoomInMultiplier?: number;
            /** @deprecated - double-tap maximum time delay */
            doubleTapDelay?: number;
            /** @deprecated - double-click maximum time delay */
            doubleClickDelay?: number;
            /** maximum number of zoom-in stops via double-click or double-tap */
            doubleClickMaxStops?: number;
            /** keyboard move distance */
            keyboardMoveDistance?: number;
            /** wheel zoom distance factor */
            wheelZoomDistanceFactor?: number;
            /** @deprecated - pinch zoom distance factor */
            pinchZoomDistanceFactor?: number;
            /** if `true`, enables the experimental pinch zoom implementation slated for v4 */
            pinchZoomV4?: boolean;
            /** if `true`, enables image zoom via scroll gestures for mouse and trackpad users */
            scrollToZoom?: boolean;
            /** custom slide types that support zoom */
            supports?: readonly SlideTypeKey[];
            /** maximum zoom level for custom slide types; when a function, return `undefined` to use the default (default: 8) */
            maxZoom?: number | ((slide: Slide) => number | undefined);
        };
    }
    interface AnimationSettings {
        /** zoom animation duration */
        zoom?: number;
    }
    interface Render {
        /** render custom Zoom control in the toolbar */
        buttonZoom?: RenderFunction<ZoomRef>;
        /** render custom Zoom In icon */
        iconZoomIn?: RenderFunction;
        /** render custom Zoom Out icon */
        iconZoomOut?: RenderFunction;
    }
    interface Labels {
        /** `Zoom in` button title */
        "Zoom in"?: string;
        /** `Zoom out` button title */
        "Zoom out"?: string;
    }
    interface RenderSlideProps {
        /** current zoom level */
        zoom?: number;
        /** maximum zoom level */
        maxZoom?: number;
    }
    interface Callbacks {
        /** zoom callback */
        zoom?: Callback<ZoomCallbackProps>;
    }
    /** Zoom callback props */
    interface ZoomCallbackProps {
        /** current zoom level */
        zoom: number;
    }
    interface ToolbarButtonKeys {
        [PLUGIN_ZOOM]: null;
    }
    /** Zoom plugin ref */
    interface ZoomRef {
        /** current zoom level */
        zoom: number;
        /** minimum zoom level */
        minZoom: number;
        /** maximum zoom level */
        maxZoom: number;
        /** horizontal offset */
        offsetX: number;
        /** vertical offset */
        offsetY: number;
        /** if `true`, zoom is unavailable for the current slide */
        disabled: boolean;
        /** increase zoom level using `zoomInMultiplier` */
        zoomIn: Callback;
        /** decrease zoom level using `zoomInMultiplier` */
        zoomOut: Callback;
        /** change zoom level */
        changeZoom: (targetZoom: number, rapid?: boolean, dx?: number, dy?: number) => void;
    }
}

export { Zoom as default };
