import { AxisDomainTypeInput, AxisType, EvaluatedAxisDomainType, LayoutType } from './types';
/**
 * This function evaluates the "auto" axis domain type based on the chart layout and axis type.
 * It outputs a definitive axis domain type that can be used for further processing.
 */
export declare function getAxisTypeBasedOnLayout(layout: LayoutType | undefined, axisType: AxisType, axisDomainType: AxisDomainTypeInput): EvaluatedAxisDomainType | undefined;
