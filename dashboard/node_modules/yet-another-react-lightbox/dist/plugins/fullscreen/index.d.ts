import * as React from 'react';
import { PluginProps, PLUGIN_FULLSCREEN, Callback, RenderFunction } from '../../types.js';

/** Fullscreen plugin */
declare function Fullscreen({ augment, contains, addParent }: PluginProps): void;

declare module "yet-another-react-lightbox" {
    interface LightboxProps {
        /** Fullscreen plugin settings */
        fullscreen?: {
            /** Fullscreen plugin ref */
            ref?: React.ForwardedRef<FullscreenRef>;
            /** if `true`, enter fullscreen mode automatically when the lightbox opens */
            auto?: boolean;
        };
    }
    interface Render {
        /** render custom Enter/Exit Fullscreen button */
        buttonFullscreen?: RenderFunction<FullscreenRef>;
        /** render custom Enter Fullscreen icon */
        iconEnterFullscreen?: RenderFunction;
        /** render custom Exit Fullscreen icon */
        iconExitFullscreen?: RenderFunction;
    }
    interface Labels {
        /** `Enter Fullscreen` button title */
        "Enter Fullscreen"?: string;
        /** `Exit Fullscreen` button title */
        "Exit Fullscreen"?: string;
    }
    interface Callbacks {
        /** a callback called when the lightbox enters fullscreen mode */
        enterFullscreen?: Callback;
        /** a callback called when the lightbox exits fullscreen mode */
        exitFullscreen?: Callback;
    }
    interface ToolbarButtonKeys {
        [PLUGIN_FULLSCREEN]: null;
    }
    /** Fullscreen plugin ref */
    interface FullscreenRef {
        /** current fullscreen status */
        fullscreen: boolean;
        /** if `true`, fullscreen features are not available */
        disabled: boolean | undefined;
        /** enter fullscreen mode */
        enter: Callback;
        /** exit fullscreen mode */
        exit: Callback;
    }
}
declare global {
    interface Document {
        webkitFullscreenEnabled?: boolean;
        mozFullScreenEnabled?: boolean;
        msFullscreenEnabled?: boolean;
        webkitExitFullscreen?: () => void;
        mozCancelFullScreen?: () => void;
        msExitFullscreen?: () => void;
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
    }
    interface HTMLElement {
        webkitRequestFullscreen?: () => void;
        mozRequestFullScreen?: () => void;
        msRequestFullscreen?: () => void;
    }
}

export { Fullscreen as default };
