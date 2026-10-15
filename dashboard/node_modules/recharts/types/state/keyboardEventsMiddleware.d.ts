import { RechartsRootState } from './store';
export declare const keyDownAction: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, string>;
export declare const focusAction: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"focus">;
export declare const blurAction: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"blur">;
export declare const keyboardEventsMiddleware: import("@reduxjs/toolkit").ListenerMiddlewareInstance<RechartsRootState, import("redux-thunk").ThunkDispatch<RechartsRootState, unknown, import("redux").AnyAction>, unknown>;
