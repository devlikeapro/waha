type IGetBoundingClient = Pick<Element, 'getBoundingClientRect'>;
/**
 * Calculates the height of the X-axis based on the tick labels and the axis label.
 * @param params - The parameters object.
 * @param [params.ticks] - An array-like object of tick elements, each with a `getBoundingClientRect` method.
 * @param [params.label] - The axis label element, with a `getBoundingClientRect` method.
 * @param [params.labelGapWithTick=5] - The gap between the label and the tick.
 * @param [params.tickSize=0] - The length of the tick line.
 * @param [params.tickMargin=0] - The margin between the tick line and the tick text.
 * @returns The calculated height of the X-axis.
 */
export declare const getCalculatedXAxisHeight: ({ ticks, label, labelGapWithTick, tickSize, tickMargin, }: {
    ticks: ArrayLike<IGetBoundingClient> | null;
    label: IGetBoundingClient | null | undefined;
    labelGapWithTick: number | undefined;
    tickSize: number | undefined;
    tickMargin: number | undefined;
}) => number;
export {};
