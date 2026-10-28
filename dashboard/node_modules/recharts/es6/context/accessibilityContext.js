import { useAppSelector } from '../state/hooks';
export var useAccessibilityLayer = () => {
  var _useAppSelector;
  return (_useAppSelector = useAppSelector(state => state.rootProps.accessibilityLayer)) !== null && _useAppSelector !== void 0 ? _useAppSelector : true;
};