import { RechartsTheme } from './RechartsTheme';
/**
 * Applies the provided theme to all charts in the children tree.
 *
 * @experimental
 */
export declare const RechartsThemeProvider: import("react").Provider<RechartsTheme>;
/**
 * Reads the currently active theme in the children tree.
 *
 * @experimental
 */
export declare const useRechartsTheme: () => RechartsTheme;
