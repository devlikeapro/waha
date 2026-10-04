/**
 * @fileOverview this stores actually rendered ticks.
 *
 * What we do is that we have the domain -> ticks mapping in the cartesianSlice,
 * which is fine but the result then goes to CartesianAxis where we use DOM measurement
 * to decide which ticks to actually render.
 *
 * This renderedTickSlice stores those actually rendered ticks so that we can return them from a hook later.
 */
import { PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { TickItem } from '../util/types';
import { AxisId } from './cartesianAxisSlice';
type RenderedTicksAxisState = {
    [axisId: AxisId]: ReadonlyArray<TickItem>;
};
type RenderedTicksState = {
    xAxis: RenderedTicksAxisState;
    yAxis: RenderedTicksAxisState;
};
export declare const renderedTicksSlice: import("@reduxjs/toolkit").Slice<RenderedTicksState, {
    setRenderedTicks: (state: WritableDraft<RenderedTicksState>, action: PayloadAction<{
        axisType: "xAxis" | "yAxis";
        axisId: AxisId;
        ticks: ReadonlyArray<TickItem>;
    }>) => void;
    removeRenderedTicks: (state: WritableDraft<RenderedTicksState>, action: PayloadAction<{
        axisType: "xAxis" | "yAxis";
        axisId: AxisId;
    }>) => void;
}, "renderedTicks">;
export declare const setRenderedTicks: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    axisType: "xAxis" | "yAxis";
    axisId: AxisId;
    ticks: ReadonlyArray<TickItem>;
}, "renderedTicks/setRenderedTicks">, removeRenderedTicks: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    axisType: "xAxis" | "yAxis";
    axisId: AxisId;
}, "renderedTicks/removeRenderedTicks">;
export declare const renderedTicksReducer: import("redux").Reducer<RenderedTicksState>;
export {};
