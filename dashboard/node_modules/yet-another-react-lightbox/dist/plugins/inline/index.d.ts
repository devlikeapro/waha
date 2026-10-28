import * as React from 'react';
import { PluginProps } from '../../types.js';

/** Inline plugin */
declare function Inline({ augment, replace, remove }: PluginProps): void;

declare module "yet-another-react-lightbox" {
    interface LightboxProps {
        /** HTML div element attributes to be passed to the Inline plugin container */
        inline?: React.HTMLAttributes<HTMLDivElement>;
    }
}

export { Inline as default };
