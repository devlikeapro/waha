import { AxisId, BaseCartesianAxis, TicksSettings } from './cartesianAxisSlice';
export type RadiusAxisSettings = BaseCartesianAxis & TicksSettings;
export type AngleAxisSettings = BaseCartesianAxis & TicksSettings;
type PolarAxisState = {
    radiusAxis: Record<AxisId, RadiusAxisSettings>;
    angleAxis: Record<AxisId, AngleAxisSettings>;
};
export declare const addRadiusAxis: import("@reduxjs/toolkit").ActionCreatorWithPayload<RadiusAxisSettings, "polarAxis/addRadiusAxis">, removeRadiusAxis: import("@reduxjs/toolkit").ActionCreatorWithPayload<RadiusAxisSettings, "polarAxis/removeRadiusAxis">, addAngleAxis: import("@reduxjs/toolkit").ActionCreatorWithPayload<AngleAxisSettings, "polarAxis/addAngleAxis">, removeAngleAxis: import("@reduxjs/toolkit").ActionCreatorWithPayload<AngleAxisSettings, "polarAxis/removeAngleAxis">;
export declare const polarAxisReducer: import("redux").Reducer<PolarAxisState>;
export {};
