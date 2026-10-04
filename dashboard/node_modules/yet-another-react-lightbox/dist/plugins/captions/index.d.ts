import * as React from 'react';
import { PluginProps, PLUGIN_CAPTIONS, Callback, RenderFunction } from '../../types.js';

/** Captions plugin */
declare function Captions({ augment, addModule }: PluginProps): void;

declare module "yet-another-react-lightbox" {
    interface GenericSlide {
        /** slide title */
        title?: React.ReactNode;
        /** slide description */
        description?: React.ReactNode;
    }
    interface ToolbarButtonKeys {
        [PLUGIN_CAPTIONS]: null;
    }
    interface LightboxProps {
        /** Captions plugin settings */
        captions?: {
            /** Captions plugin ref */
            ref?: React.ForwardedRef<CaptionsRef>;
            /** if `true`, captions are hidden when the lightbox opens */
            hidden?: boolean;
            /** if `true`, show Captions Toggle button in the toolbar */
            showToggle?: boolean;
            /** description text alignment */
            descriptionTextAlign?: "start" | "end" | "center";
            /** maximum number of lines to display in the description section */
            descriptionMaxLines?: number;
        };
    }
    interface SlotType {
        /** captions title customization slot */
        captionsTitle: "captionsTitle";
        /** captions title container customization slot */
        captionsTitleContainer: "captionsTitleContainer";
        /** captions description customization slot */
        captionsDescription: "captionsDescription";
        /** captions description container customization slot */
        captionsDescriptionContainer: "captionsDescriptionContainer";
    }
    interface Render {
        /** render custom Captions Visible icon */
        iconCaptionsVisible?: RenderFunction;
        /** render custom Captions Hidden icon */
        iconCaptionsHidden?: RenderFunction;
        /** render custom Captions button */
        buttonCaptions?: RenderFunction<CaptionsRef>;
    }
    interface Labels {
        /** Slide description ARIA role description */
        Caption?: string;
        /** `Show captions` button title */
        "Show captions"?: string;
        /** `Hide captions` button title */
        "Hide captions"?: string;
    }
    /** Captions plugin ref */
    interface CaptionsRef {
        /** if `true`, captions are visible */
        visible: boolean;
        /** show captions */
        show: Callback;
        /** hide captions */
        hide: Callback;
    }
}

export { Captions as default };
