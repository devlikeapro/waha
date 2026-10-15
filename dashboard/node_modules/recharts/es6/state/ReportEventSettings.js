import { useEffect, memo } from 'react';
import { useAppDispatch } from './hooks';
import { setEventSettings } from './eventSettingsSlice';
import { propsAreEqual } from '../util/propsAreEqual';
var ReportEventSettingsImpl = props => {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setEventSettings(props));
  }, [dispatch, props]);
  return null;
};
export var ReportEventSettings = /*#__PURE__*/memo(ReportEventSettingsImpl, propsAreEqual);