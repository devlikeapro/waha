import * as React from 'react';
import { PluginProps, PLUGIN_SLIDESHOW, Callback, RenderFunction } from '../../types.js';

/** Slideshow plugin */
declare function Slideshow({ augment, addModule }: PluginProps): void;

declare module "yet-another-react-lightbox" {
    interface LightboxProps {
        /** Slideshow plugin settings */
        slideshow?: {
            /** Slideshow plugin ref */
            ref?: React.ForwardedRef<SlideshowRef>;
            /** if `true`, slideshow is turned on automatically when the lightbox opens */
            autoplay?: boolean;
            /** slideshow delay in milliseconds */
            delay?: number;
        };
    }
    interface Render {
        /** render custom Slideshow Play icon */
        iconSlideshowPlay?: RenderFunction;
        /** render custom Slideshow Pause icon */
        iconSlideshowPause?: RenderFunction;
        /** render custom Slideshow button */
        buttonSlideshow?: RenderFunction<SlideshowRef>;
    }
    interface Labels {
        /** `Play` button title */
        Play?: string;
        /** `Pause` button title */
        Pause?: string;
    }
    interface Callbacks {
        /** a callback called on slideshow playback start */
        slideshowStart?: Callback;
        /** a callback called on slideshow playback stop */
        slideshowStop?: Callback;
    }
    interface ToolbarButtonKeys {
        [PLUGIN_SLIDESHOW]: null;
    }
    /** Slideshow plugin ref */
    interface SlideshowRef {
        /** current slideshow playback status */
        playing: boolean;
        /** if `true`, the slideshow playback is disabled */
        disabled: boolean;
        /** start the slideshow playback */
        play: Callback;
        /** pause the slideshow playback */
        pause: Callback;
    }
}

export { Slideshow as default };
