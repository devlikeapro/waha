"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAppDispatch = void 0;
exports.useAppSelector = useAppSelector;
var _withSelector = require("use-sync-external-store/shim/with-selector");
var _react = require("react");
var _RechartsReduxContext = require("./RechartsReduxContext");
var noopDispatch = a => a;
var useAppDispatch = () => {
  var context = (0, _react.useContext)(_RechartsReduxContext.RechartsReduxContext);
  if (context) {
    return context.store.dispatch;
  }
  return noopDispatch;
};
exports.useAppDispatch = useAppDispatch;
var noop = () => {};
var addNestedSubNoop = () => noop;
var refEquality = (a, b) => a === b;

/**
 * This is a recharts variant of `useSelector` from 'react-redux' package.
 *
 * The difference is that react-redux version will throw an Error when used outside of Redux context.
 *
 * This, recharts version, will return undefined instead.
 *
 * This is because we want to allow using our components outside the Chart wrapper,
 * and have people provide all props explicitly.
 *
 * If however they use the component inside a chart wrapper then those props become optional,
 * and we read them from Redux state instead.
 *
 * @param selector for pulling things out of Redux store; will not be called if the store is not accessible
 * @return whatever the selector returned; or undefined when outside of Redux store
 */
function useAppSelector(selector) {
  var context = (0, _react.useContext)(_RechartsReduxContext.RechartsReduxContext);
  var outOfContextSelector = (0, _react.useMemo)(() => {
    if (!context) {
      return noop;
    }
    return state => {
      if (state == null) {
        return undefined;
      }
      return selector(state);
    };
  }, [context, selector]);
  return (0, _withSelector.useSyncExternalStoreWithSelector)(context ? context.subscription.addNestedSub : addNestedSubNoop, context ? context.store.getState : noop, context ? context.store.getState : noop, outOfContextSelector, refEquality);
}