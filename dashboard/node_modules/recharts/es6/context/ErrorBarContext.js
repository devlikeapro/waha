var _excluded = ["children"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { addErrorBar, removeErrorBar, replaceErrorBar } from '../state/errorBarSlice';
import { useAppDispatch } from '../state/hooks';
import { useGraphicalItemId } from './RegisterGraphicalItemId';
var initialContextState = {
  data: [],
  xAxisId: 'xAxis-0',
  yAxisId: 'yAxis-0',
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
};
var ErrorBarContext = /*#__PURE__*/createContext(initialContextState);
export function SetErrorBarContext(props) {
  var children = props.children,
    rest = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement(ErrorBarContext.Provider, {
    value: rest
  }, children);
}
export var useErrorBarContext = () => useContext(ErrorBarContext);
export function ReportErrorBarSettings(props) {
  var dispatch = useAppDispatch();
  var graphicalItemId = useGraphicalItemId();
  var prevPropsRef = useRef(null);
  useEffect(() => {
    if (graphicalItemId == null) {
      // ErrorBar outside a graphical item context does not do anything.
      return;
    }
    if (prevPropsRef.current === null) {
      dispatch(addErrorBar({
        itemId: graphicalItemId,
        errorBar: props
      }));
    } else if (prevPropsRef.current !== props) {
      dispatch(replaceErrorBar({
        itemId: graphicalItemId,
        prev: prevPropsRef.current,
        next: props
      }));
    }
    prevPropsRef.current = props;
  }, [dispatch, graphicalItemId, props]);
  useEffect(() => {
    return () => {
      if (prevPropsRef.current != null && graphicalItemId != null) {
        dispatch(removeErrorBar({
          itemId: graphicalItemId,
          errorBar: prevPropsRef.current
        }));
        prevPropsRef.current = null;
      }
    };
  }, [dispatch, graphicalItemId]);
  return null;
}