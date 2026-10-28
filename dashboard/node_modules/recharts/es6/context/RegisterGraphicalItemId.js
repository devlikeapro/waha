import * as React from 'react';
import { createContext, useContext } from 'react';
import { useUniqueId } from '../util/useUniqueId';
var GraphicalItemIdContext = /*#__PURE__*/createContext(undefined);
export var RegisterGraphicalItemId = _ref => {
  var id = _ref.id,
    type = _ref.type,
    children = _ref.children;
  var resolvedId = useUniqueId("recharts-".concat(type), id);
  return /*#__PURE__*/React.createElement(GraphicalItemIdContext.Provider, {
    value: resolvedId
  }, children(resolvedId));
};
export function useGraphicalItemId() {
  return useContext(GraphicalItemIdContext);
}