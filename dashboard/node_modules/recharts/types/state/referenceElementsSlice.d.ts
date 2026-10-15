import { PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { AxisId } from './cartesianAxisSlice';
import { IfOverflow } from '../util/IfOverflow';
import { ReferenceLineSegment } from '../cartesian/ReferenceLine';
export type ReferenceElementSettings = {
    yAxisId: AxisId;
    xAxisId: AxisId;
    ifOverflow: IfOverflow;
};
export type ReferenceDotSettings = ReferenceElementSettings & {
    x: unknown;
    y: unknown;
    r: number;
};
export type ReferenceAreaSettings = ReferenceElementSettings & {
    x1: unknown;
    x2: unknown;
    y1: unknown;
    y2: unknown;
};
export type ReferenceLineSettings = ReferenceElementSettings & {
    x: unknown;
    y: unknown;
    segment: ReferenceLineSegment | undefined;
};
type ReferenceElementState = {
    dots: ReadonlyArray<ReferenceDotSettings>;
    areas: ReadonlyArray<ReferenceAreaSettings>;
    lines: ReadonlyArray<ReferenceLineSettings>;
};
export declare const referenceElementsSlice: import("@reduxjs/toolkit").Slice<ReferenceElementState, {
    addDot: (state: WritableDraft<ReferenceElementState>, action: PayloadAction<ReferenceDotSettings>) => void;
    removeDot: (state: WritableDraft<ReferenceElementState>, action: PayloadAction<ReferenceDotSettings>) => void;
    addArea: (state: WritableDraft<ReferenceElementState>, action: PayloadAction<ReferenceAreaSettings>) => void;
    removeArea: (state: WritableDraft<ReferenceElementState>, action: PayloadAction<ReferenceAreaSettings>) => void;
    addLine: (state: WritableDraft<ReferenceElementState>, action: PayloadAction<ReferenceLineSettings>) => void;
    removeLine: (state: WritableDraft<ReferenceElementState>, action: PayloadAction<ReferenceLineSettings>) => void;
}, "referenceElements">;
export declare const addDot: import("@reduxjs/toolkit").ActionCreatorWithPayload<ReferenceDotSettings, "referenceElements/addDot">, removeDot: import("@reduxjs/toolkit").ActionCreatorWithPayload<ReferenceDotSettings, "referenceElements/removeDot">, addArea: import("@reduxjs/toolkit").ActionCreatorWithPayload<ReferenceAreaSettings, "referenceElements/addArea">, removeArea: import("@reduxjs/toolkit").ActionCreatorWithPayload<ReferenceAreaSettings, "referenceElements/removeArea">, addLine: import("@reduxjs/toolkit").ActionCreatorWithPayload<ReferenceLineSettings, "referenceElements/addLine">, removeLine: import("@reduxjs/toolkit").ActionCreatorWithPayload<ReferenceLineSettings, "referenceElements/removeLine">;
export declare const referenceElementsReducer: import("redux").Reducer<ReferenceElementState>;
export {};
