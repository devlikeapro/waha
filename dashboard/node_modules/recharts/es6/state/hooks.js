import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import { useContext, useMemo } from 'react';
import { RechartsReduxContext } from './RechartsReduxContext';
var noopDispatch = a => a;
export var useAppDispatch = () => {
  var context = useContext(RechartsReduxContext);
  if (context) {
    return context.store.dispatch;
  }
  return noopDispatch;
};
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
export function useAppSelector(selector) {
  var context = useContext(RechartsReduxContext);
  var outOfContextSelector = useMemo(() => {
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
  return useSyncExternalStoreWithSelector(context ? context.subscription.addNestedSub : addNestedSubNoop, context ? context.store.getState : noop, context ? context.store.getState : noop, outOfContextSelector, refEquality);
}