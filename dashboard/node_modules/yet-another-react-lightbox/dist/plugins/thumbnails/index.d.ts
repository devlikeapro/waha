import * as React from 'react';
import { PluginProps, PLUGIN_THUMBNAILS, Callback, ContainerRect, ImageFit, RenderFunction, Slide } from '../../types.js';

/** Thumbnails plugin */
declare function Thumbnails({ augment, contains, append, addParent }: PluginProps): void;

declare module "yet-another-react-lightbox" {
    interface GenericSlide {
        /** thumbnail image */
        thumbnail?: string;
    }
    interface LightboxProps {
        /** Thumbnails plugin settings */
        thumbnails?: {
            /** Thumbnails plugin ref */
            ref?: React.ForwardedRef<ThumbnailsRef>;
            /** thumbnails position */
            position?: "top" | "bottom" | "start" | "end";
            /** thumbnail width */
            width?: number;
            /** thumbnail height */
            height?: number;
            /** thumbnail border width */
            border?: number;
            /** thumbnail border style */
            borderStyle?: string;
            /** thumbnail border color */
            borderColor?: string;
            /** thumbnail border radius */
            borderRadius?: number;
            /** thumbnail inner padding */
            padding?: number;
            /** gap between thumbnails */
            gap?: number;
            /** `object-fit` setting */
            imageFit?: ImageFit;
            /** if `true`, show the vignette effect on the edges of the thumbnails track */
            vignette?: boolean;
            /** if `true`, thumbnails are hidden when the lightbox opens */
            hidden?: boolean;
            /** if `true`, show the Toggle Thumbnails button in the toolbar */
            showToggle?: boolean;
        };
    }
    interface Render {
        /** render custom thumbnail */
        thumbnail?: RenderFunction<RenderThumbnailProps>;
        /** render custom Thumbnails Visible icon */
        iconThumbnailsVisible?: RenderFunction;
        /** render custom Thumbnails Hidden icon */
        iconThumbnailsHidden?: RenderFunction;
        /** render custom Thumbnails button */
        buttonThumbnails?: RenderFunction<ThumbnailsRef>;
    }
    interface Labels {
        /** Thumbnails ARIA label */
        Thumbnails?: string;
        /** `Show thumbnails` button title */
        "Show thumbnails"?: string;
        /** `Hide thumbnails` button title */
        "Hide thumbnails"?: string;
    }
    /** `render.thumbnail` render function props */
    type RenderThumbnailProps = {
        slide: Slide;
        rect: ContainerRect;
        render: Render;
        imageFit: ImageFit;
    };
    interface SlotType {
        /** thumbnail customization slot */
        thumbnail: "thumbnail";
        /** thumbnails track customization slot */
        thumbnailsTrack: "thumbnailsTrack";
        /** thumbnails container customization slot */
        thumbnailsContainer: "thumbnailsContainer";
    }
    interface ToolbarButtonKeys {
        [PLUGIN_THUMBNAILS]: null;
    }
    /** Thumbnails plugin ref */
    interface ThumbnailsRef {
        /** if `true`, thumbnails are visible */
        visible: boolean;
        /** show thumbnails */
        show: Callback;
        /** hide thumbnails */
        hide: Callback;
    }
}

export { Thumbnails as default };
