import { useLayoutEffect, useRef } from 'react';
import { useIsPanorama } from '../context/PanoramaContext';
import { selectChartLayout } from '../context/chartLayoutContext';
import { useAppDispatch, useAppSelector } from './hooks';
import { addLegendPayload, replaceLegendPayload, removeLegendPayload } from './legendSlice';
export function SetLegendPayload(_ref) {
  var legendPayload = _ref.legendPayload;
  var dispatch = useAppDispatch();
  var isPanorama = useIsPanorama();
  var prevPayloadRef = useRef(null);
  useLayoutEffect(() => {
    if (isPanorama) {
      return;
    }
    if (prevPayloadRef.current === null) {
      dispatch(addLegendPayload(legendPayload));
    } else if (prevPayloadRef.current !== legendPayload) {
      dispatch(replaceLegendPayload({
        prev: prevPayloadRef.current,
        next: legendPayload
      }));
    }
    prevPayloadRef.current = legendPayload;
  }, [dispatch, isPanorama, legendPayload]);
  useLayoutEffect(() => {
    return () => {
      if (prevPayloadRef.current) {
        dispatch(removeLegendPayload(prevPayloadRef.current));
        prevPayloadRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
export function SetPolarLegendPayload(_ref2) {
  var legendPayload = _ref2.legendPayload;
  var dispatch = useAppDispatch();
  var layout = useAppSelector(selectChartLayout);
  var prevPayloadRef = useRef(null);
  useLayoutEffect(() => {
    if (layout !== 'centric' && layout !== 'radial') {
      return;
    }
    if (prevPayloadRef.current === null) {
      dispatch(addLegendPayload(legendPayload));
    } else if (prevPayloadRef.current !== legendPayload) {
      dispatch(replaceLegendPayload({
        prev: prevPayloadRef.current,
        next: legendPayload
      }));
    }
    prevPayloadRef.current = legendPayload;
  }, [dispatch, layout, legendPayload]);
  useLayoutEffect(() => {
    return () => {
      if (prevPayloadRef.current) {
        dispatch(removeLegendPayload(prevPayloadRef.current));
        prevPayloadRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}