import { createContext, useContext } from 'react';
export var TooltipPortalContext = /*#__PURE__*/createContext(null);
export var useTooltipPortal = () => useContext(TooltipPortalContext);