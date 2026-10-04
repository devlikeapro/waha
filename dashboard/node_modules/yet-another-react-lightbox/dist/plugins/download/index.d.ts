import { PluginProps, PLUGIN_DOWNLOAD, Callback, RenderFunction, Slide } from '../../types.js';

declare function Download({ augment }: PluginProps): void;

declare module "yet-another-react-lightbox" {
    interface GenericSlide {
        /** @deprecated - use `download` instead */
        downloadUrl?: string;
        /** @deprecated - use `download` instead */
        downloadFilename?: string;
        /** download url or download props */
        download?: boolean | string | {
            /** download url */
            url: string;
            /** download filename override */
            filename: string;
        };
    }
    interface LightboxProps {
        /** Download plugin settings */
        download?: {
            /** Custom download function */
            download?: ({ slide, saveAs }: DownloadFunctionProps) => void;
        };
    }
    interface Render {
        /** render custom Download button */
        buttonDownload?: RenderFunction;
        /** render custom Download icon */
        iconDownload?: RenderFunction;
    }
    interface Labels {
        /** `Download` button title */
        Download?: string;
    }
    interface Callbacks {
        /** a callback called on slide download */
        download?: Callback<DownloadCallbackProps>;
    }
    interface ToolbarButtonKeys {
        [PLUGIN_DOWNLOAD]: null;
    }
    interface DownloadCallbackProps {
        index: number;
    }
    interface DownloadFunctionProps {
        slide: Slide;
        saveAs: (source: string | Blob, name?: string) => void;
    }
}

export { Download as default };
