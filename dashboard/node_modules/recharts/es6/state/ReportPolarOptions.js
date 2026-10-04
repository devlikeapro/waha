import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { updatePolarOptions } from './polarOptionsSlice';
export function ReportPolarOptions(props) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(updatePolarOptions(props));
  }, [dispatch, props]);
  return null;
}