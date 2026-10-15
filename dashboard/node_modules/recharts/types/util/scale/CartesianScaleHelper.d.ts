import { BandPosition, RechartsScale } from './RechartsScale';
import { CategoricalDomainItem, Coordinate, NullableCoordinate } from '../types';
export interface CartesianScaleHelper<XDomain extends CategoricalDomainItem = CategoricalDomainItem, YDomain extends CategoricalDomainItem = CategoricalDomainItem> {
    map(value: {
        x: XDomain;
        y: YDomain;
    }, { position }: {
        position: BandPosition;
    }): Coordinate;
    mapWithFallback(value: {
        x?: XDomain | null | undefined;
        y?: YDomain | null | undefined;
    }, { position, fallback }: {
        position?: BandPosition;
        fallback: 'rangeMin' | 'rangeMax';
    }): Coordinate;
    isInRange({ x, y }: Partial<NullableCoordinate>): boolean;
}
/**
 * Groups X and Y scale functions together and provides helper methods.
 */
export declare class CartesianScaleHelperImpl<XDomain extends CategoricalDomainItem = CategoricalDomainItem, YDomain extends CategoricalDomainItem = CategoricalDomainItem> implements CartesianScaleHelper<XDomain, YDomain> {
    private xAxisScale;
    private yAxisScale;
    constructor({ x, y }: {
        x: RechartsScale<XDomain>;
        y: RechartsScale<YDomain>;
    });
    map(value: {
        x: XDomain;
        y: YDomain;
    }, { position }: {
        position: BandPosition;
    }): Coordinate;
    mapWithFallback(value: {
        x?: XDomain | null | undefined;
        y?: YDomain | null | undefined;
    }, { position, fallback }: {
        position?: BandPosition;
        fallback: 'rangeMin' | 'rangeMax';
    }): Coordinate;
    isInRange({ x, y }: Partial<NullableCoordinate>): boolean;
}
