import { PluginProps, PLUGIN_SHARE, Callback, RenderFunction, Slide } from '../../types.js';

declare function Share({ augment }: PluginProps): void;

declare function isShareSupported(): boolean;

declare module "yet-another-react-lightbox" {
    interface GenericSlide {
        /** share url or share props */
        share?: boolean | string | {
            /** share url  */
            url?: string;
            /** share text  */
            text?: string;
            /** share title  */
            title?: string;
        };
    }
    interface LightboxProps {
        /** Share plugin settings */
        share?: {
            /** custom share function */
            share?: ({ slide }: ShareFunctionProps) => void;
        };
    }
    interface Render {
        /** render custom Share button */
        buttonShare?: RenderFunction;
        /** render custom Share icon */
        iconShare?: RenderFunction;
    }
    interface Labels {
        /** `Share` button title */
        Share?: string;
    }
    interface Callbacks {
        /** a callback called on slide share */
        share?: Callback<ShareCallbackProps>;
    }
    interface ToolbarButtonKeys {
        [PLUGIN_SHARE]: null;
    }
    interface ShareCallbackProps {
        index: number;
    }
    interface ShareFunctionProps {
        slide: Slide;
    }
}

export { Share as default, isShareSupported };
