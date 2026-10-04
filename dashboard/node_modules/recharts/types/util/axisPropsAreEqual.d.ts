import { XAxisProps, YAxisProps } from '../index';
/**
 * Usually we would not compare array props deeply for performance consideration.
 * However, for axis props, domain is sometimes defined as a two-elements array, and range is always
 * a two-elements array. So we can do a shallow comparison for the rest props and a shallow
 * comparison for these two array props.
 * @param prevProps
 * @param nextProps
 */
export declare function axisPropsAreEqual<T extends YAxisProps | XAxisProps>(prevProps: T, nextProps: T): boolean;
