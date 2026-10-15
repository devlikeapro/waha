import { createContext, useContext } from 'react';
import { legacyTheme } from './legacyTheme';
var RechartsThemeContext = /*#__PURE__*/createContext(legacyTheme);

/**
 * Applies the provided theme to all charts in the children tree.
 *
 * @experimental
 */
export var RechartsThemeProvider = RechartsThemeContext.Provider;

/**
 * Reads the currently active theme in the children tree.
 *
 * @experimental
 */
export var useRechartsTheme = () => useContext(RechartsThemeContext);