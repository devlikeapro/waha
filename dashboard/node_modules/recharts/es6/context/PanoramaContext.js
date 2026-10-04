import * as React from 'react';
import { createContext, useContext } from 'react';
var PanoramaContext = /*#__PURE__*/createContext(null);
export var useIsPanorama = () => useContext(PanoramaContext) != null;
export var PanoramaContextProvider = _ref => {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(PanoramaContext.Provider, {
    value: true
  }, children);
};