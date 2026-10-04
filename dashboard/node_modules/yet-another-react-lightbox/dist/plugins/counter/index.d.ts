import * as React from 'react';
import { PluginProps } from '../../types.js';

/** Counter plugin */
declare function Counter({ augment, addChild }: PluginProps): void;

declare module "yet-another-react-lightbox" {
    interface LightboxProps {
        /** Counter plugin settings */
        counter?: React.HTMLAttributes<HTMLDivElement> & {
            /** custom separator */
            separator?: string;
            /** counter container HTML attributes */
            container?: React.HTMLAttributes<HTMLDivElement>;
        };
    }
}

export { Counter as default };
