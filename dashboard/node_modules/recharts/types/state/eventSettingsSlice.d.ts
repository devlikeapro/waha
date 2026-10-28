import { EventThrottlingProps } from '../util/types';
export type EventSettingsState = Required<EventThrottlingProps>;
export declare const initialEventSettingsState: EventSettingsState;
export declare const setEventSettings: import("@reduxjs/toolkit").ActionCreatorWithPayload<EventThrottlingProps, "eventSettings/setEventSettings">;
export declare const eventSettingsReducer: import("redux").Reducer<Required<EventThrottlingProps>>;
