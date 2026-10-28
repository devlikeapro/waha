import { CategoricalDomain, NumberDomain } from '../../../util/types';
/**
 * This function validates and transforms the axis domain so that it is safe to use in the provided scale.
 */
export declare const combineCheckedDomain: (realScaleType: string | undefined, axisDomain: NumberDomain | CategoricalDomain | undefined) => NumberDomain | CategoricalDomain | undefined;
