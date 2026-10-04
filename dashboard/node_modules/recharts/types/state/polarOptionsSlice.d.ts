export type PolarChartOptions = {
    cx: number | string;
    cy: number | string;
    startAngle: number;
    endAngle: number;
    innerRadius: number | string;
    outerRadius: number | string;
};
type PolarChartState = PolarChartOptions | null;
export declare const updatePolarOptions: import("@reduxjs/toolkit").ActionCreatorWithPayload<PolarChartOptions, `${string}/updatePolarOptions`>;
export declare const polarOptionsReducer: import("redux").Reducer<PolarChartState>;
export {};
