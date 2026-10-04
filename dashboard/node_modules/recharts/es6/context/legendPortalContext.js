import { createContext, useContext } from 'react';
export var LegendPortalContext = /*#__PURE__*/createContext(null);
export var useLegendPortal = () => useContext(LegendPortalContext);