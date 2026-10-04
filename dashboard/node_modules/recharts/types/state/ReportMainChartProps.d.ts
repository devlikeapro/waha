import { ReactNode } from 'react';
import { LayoutType, Margin } from '../util/types';
/**
 * "Main" props are props that are only accepted on the main chart,
 * as opposed to the small panorama chart inside a Brush.
 */
type MainChartProps = {
    layout: LayoutType;
    margin: Partial<Margin>;
};
declare function ReportMainChartPropsImpl({ layout, margin }: MainChartProps): ReactNode;
export declare const ReportMainChartProps: import("react").MemoExoticComponent<typeof ReportMainChartPropsImpl>;
export {};
