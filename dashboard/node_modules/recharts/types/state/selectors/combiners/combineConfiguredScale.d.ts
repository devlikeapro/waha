import { BaseCartesianAxis } from '../../cartesianAxisSlice';
import { CategoricalDomain, CategoricalDomainItem, D3ScaleType, NumberDomain, RechartsScaleType } from '../../../util/types';
import { CustomScaleDefinition } from '../../../util/scale/CustomScaleDefinition';
import { AxisRange } from '../axisSelectors';
/**
 * Converts external scale definition into internal RechartsScale definition.
 * @param scale custom function scale - if you have the `string` from outside, use `combineRealScaleType` first which will validate it and return RechartsScaleType or undefined
 * @param axisDomain
 * @param axisRange
 */
export declare function combineConfiguredScaleInternal(scale: CustomScaleDefinition | CustomScaleDefinition<string> | CustomScaleDefinition<number> | CustomScaleDefinition<Date>, axisDomain: ReadonlyArray<CategoricalDomainItem>, axisRange: AxisRange): CustomScaleDefinition;
export declare function combineConfiguredScaleInternal(scale: D3ScaleType | RechartsScaleType, axisDomain: ReadonlyArray<CategoricalDomainItem>, axisRange: AxisRange): CustomScaleDefinition;
export declare function combineConfiguredScaleInternal(scale: D3ScaleType | RechartsScaleType | undefined, axisDomain: ReadonlyArray<CategoricalDomainItem>, axisRange: AxisRange): CustomScaleDefinition | undefined;
export declare function combineConfiguredScaleInternal(scale: undefined, axisDomain: ReadonlyArray<CategoricalDomainItem>, axisRange: AxisRange): undefined;
export declare function combineConfiguredScaleInternal<Domain extends CategoricalDomainItem = CategoricalDomainItem>(scale: D3ScaleType | RechartsScaleType | CustomScaleDefinition<Domain> | undefined, axisDomain: ReadonlyArray<Domain>, axisRange: AxisRange): CustomScaleDefinition<Domain> | undefined;
export declare function combineConfiguredScale(axis: BaseCartesianAxis, realScaleType: D3ScaleType | RechartsScaleType | undefined, axisDomain: NumberDomain | CategoricalDomain | undefined, axisRange: AxisRange | undefined): CustomScaleDefinition | undefined;
