import { useEffect } from 'react';
import { updateOptions } from './rootPropsSlice';
import { useAppDispatch } from './hooks';
export function ReportChartProps(props) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(updateOptions(props));
  }, [dispatch, props]);
  return null;
}