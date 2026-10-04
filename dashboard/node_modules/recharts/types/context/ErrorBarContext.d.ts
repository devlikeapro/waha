import * as React from 'react';
import { AxisId } from '../state/cartesianAxisSlice';
import { ErrorBarDataPointFormatter } from '../cartesian/ErrorBar';
import { ErrorBarsSettings } from '../state/errorBarSlice';
import { BarRectangleItem } from '../cartesian/Bar';
import { LinePointItem } from '../cartesian/Line';
import { ScatterPointItem } from '../cartesian/Scatter';
type ErrorBarContextType<T extends BarRectangleItem | LinePointItem | ScatterPointItem> = {
    data: ReadonlyArray<any> | undefined;
    xAxisId: AxisId;
    yAxisId: AxisId;
    dataPointFormatter: ErrorBarDataPointFormatter<T>;
    errorBarOffset: number;
};
export declare function SetErrorBarContext<T extends BarRectangleItem | LinePointItem | ScatterPointItem>(props: ErrorBarContextType<T> & {
    children: React.ReactNode;
}): React.JSX.Element;
export declare const useErrorBarContext: () => ErrorBarContextType<any>;
export declare function ReportErrorBarSettings(props: ErrorBarsSettings): null;
export {};
