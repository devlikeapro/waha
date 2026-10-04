import { CSSProperties } from 'react';
import { Size } from './types';
export interface TextMeasurementConfig {
    /** Maximum number of items to cache */
    cacheSize: number;
    /** Whether to enable caching */
    enableCache: boolean;
}
export declare const getStringSize: (text: string | number, style?: CSSProperties) => Size;
/**
 * Configure text measurement behavior
 * @param config - Partial configuration to apply
 * @returns void
 */
export declare const configureTextMeasurement: (config: Partial<TextMeasurementConfig>) => void;
/**
 * Get current text measurement configuration
 * @returns Current configuration
 */
export declare const getTextMeasurementConfig: () => TextMeasurementConfig;
/**
 * Clear the string size cache. Useful for testing or memory management.
 * @returns void
 */
export declare const clearStringCache: () => void;
/**
 * Get cache statistics for debugging purposes.
 * @returns Cache statistics including size and max size
 */
export declare const getStringCacheStats: () => {
    size: number;
    maxSize: number;
};
