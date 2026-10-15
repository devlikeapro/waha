import { RechartsRootState } from './store';
import { HTMLMousePointer } from '../util/types';
export declare const mouseClickAction: import("@reduxjs/toolkit").ActionCreatorWithPayload<HTMLMousePointer, string>;
export declare const mouseClickMiddleware: import("@reduxjs/toolkit").ListenerMiddlewareInstance<RechartsRootState, import("redux-thunk").ThunkDispatch<RechartsRootState, unknown, import("redux").AnyAction>, unknown>;
export declare const mouseMoveAction: import("@reduxjs/toolkit").ActionCreatorWithPayload<HTMLMousePointer, string>;
export declare const mouseMoveMiddleware: import("@reduxjs/toolkit").ListenerMiddlewareInstance<RechartsRootState, import("redux-thunk").ThunkDispatch<RechartsRootState, unknown, import("redux").AnyAction>, unknown>;
