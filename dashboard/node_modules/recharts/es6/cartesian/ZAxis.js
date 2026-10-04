import * as React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { addZAxis, removeZAxis, replaceZAxis } from '../state/cartesianAxisSlice';
import { useAppDispatch } from '../state/hooks';
import { implicitZAxis } from '../state/selectors/axisSelectors';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
function SetZAxisSettings(settings) {
  var dispatch = useAppDispatch();
  var prevSettingsRef = useRef(null);
  useLayoutEffect(() => {
    if (prevSettingsRef.current === null) {
      dispatch(addZAxis(settings));
    } else if (prevSettingsRef.current !== settings) {
      dispatch(replaceZAxis({
        prev: prevSettingsRef.current,
        next: settings
      }));
    }
    prevSettingsRef.current = settings;
  }, [settings, dispatch]);
  useLayoutEffect(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch(removeZAxis(prevSettingsRef.current));
        prevSettingsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
export var zAxisDefaultProps = {
  zAxisId: 0,
  range: implicitZAxis.range,
  scale: implicitZAxis.scale,
  type: implicitZAxis.type
};

/**
 * Virtual axis, does not render anything itself. Has no ticks, grid lines, or labels.
 * Useful for dynamically setting Scatter point size, based on data.
 *
 * @consumes CartesianViewBoxContext
 */
export function ZAxis(outsideProps) {
  var props = resolveDefaultProps(outsideProps, zAxisDefaultProps);
  return /*#__PURE__*/React.createElement(SetZAxisSettings, {
    domain: props.domain,
    id: props.zAxisId,
    dataKey: props.dataKey,
    name: props.name,
    unit: props.unit,
    range: props.range,
    scale: props.scale,
    type: props.type,
    allowDuplicatedCategory: implicitZAxis.allowDuplicatedCategory,
    allowDataOverflow: implicitZAxis.allowDataOverflow,
    reversed: implicitZAxis.reversed,
    includeHidden: implicitZAxis.includeHidden
  });
}
ZAxis.displayName = 'ZAxis';