import * as React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { registerZIndexPortalElement, unregisterZIndexPortalElement } from '../state/zIndexSlice';
import { selectAllRegisteredZIndexes } from './zIndexSelectors';
function ZIndexSvgPortal(_ref) {
  var zIndex = _ref.zIndex,
    isPanorama = _ref.isPanorama;
  var ref = useRef(null);
  var dispatch = useAppDispatch();
  useLayoutEffect(() => {
    if (ref.current) {
      dispatch(registerZIndexPortalElement({
        zIndex,
        element: ref.current,
        isPanorama
      }));
    }
    return () => {
      dispatch(unregisterZIndexPortalElement({
        zIndex,
        isPanorama
      }));
    };
  }, [dispatch, zIndex, isPanorama]);
  // these g elements should not be tabbable
  return /*#__PURE__*/React.createElement("g", {
    tabIndex: -1,
    ref: ref,
    className: "recharts-zIndex-layer_".concat(zIndex)
  });
}
export function AllZIndexPortals(_ref2) {
  var children = _ref2.children,
    isPanorama = _ref2.isPanorama;
  var allRegisteredZIndexes = useAppSelector(selectAllRegisteredZIndexes);
  if (!allRegisteredZIndexes || allRegisteredZIndexes.length === 0) {
    return children;
  }
  var allNegativeZIndexes = allRegisteredZIndexes.filter(zIndex => zIndex < 0);
  // We exclude zero on purpose - that is the default layer, and it doesn't need a portal.
  var allPositiveZIndexes = allRegisteredZIndexes.filter(zIndex => zIndex > 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, allNegativeZIndexes.map(zIndex => /*#__PURE__*/React.createElement(ZIndexSvgPortal, {
    key: zIndex,
    zIndex: zIndex,
    isPanorama: isPanorama
  })), children, allPositiveZIndexes.map(zIndex => /*#__PURE__*/React.createElement(ZIndexSvgPortal, {
    key: zIndex,
    zIndex: zIndex,
    isPanorama: isPanorama
  })));
}