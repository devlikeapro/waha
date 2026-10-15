import { SyntheticEvent } from 'react';
import { CategoricalChartFunc } from '../chart/types';
import { RechartsRootState } from './store';
type ExternalEventActionPayload<E = SyntheticEvent> = {
    reactEvent: E;
    handler: CategoricalChartFunc<E> | undefined;
};
export declare const externalEventAction: import("@reduxjs/toolkit").ActionCreatorWithPayload<ExternalEventActionPayload<any>, string>;
export declare const externalEventsMiddleware: import("@reduxjs/toolkit").ListenerMiddlewareInstance<RechartsRootState, import("redux-thunk").ThunkDispatch<RechartsRootState, unknown, import("redux").AnyAction>, unknown>;
export {};
