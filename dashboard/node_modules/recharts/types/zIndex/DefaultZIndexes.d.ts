/**
 * A collection of all default zIndex values used by Recharts.
 *
 * You can reuse these, or you can define your own.
 */
export declare const DefaultZIndexes: {
    /**
     * CartesianGrid and PolarGrid
     */
    readonly grid: -100;
    /**
     * Background of Bar and RadialBar.
     * This is not visible by default but can be enabled by setting background={true} on Bar or RadialBar.
     */
    readonly barBackground: -50;
    /**
     * Area, Pie, Radar, and ReferenceArea
     */
    readonly area: 100;
    /**
     * Cursor is embedded inside Tooltip and controlled by it.
     * The Tooltip itself has a separate portal and is not included in the zIndex system;
     * Cursor is the decoration inside the chart area. CursorRectangle is a rectangle box.
     * It renders below bar so that in a stacked bar chart the cursor rectangle does not hide the other bars.
     */
    readonly cursorRectangle: 200;
    /**
     * Bar and RadialBar
     */
    readonly bar: 300;
    /**
     * Line and ReferenceLine, and ErrorBor
     */
    readonly line: 400;
    /**
     * XAxis and YAxis and PolarAngleAxis and PolarRadiusAxis ticks and lines and children
     */
    readonly axis: 500;
    /**
     * Scatter and ReferenceDot,
     * and Dots of Line and Area and Radar if they have dot=true
     */
    readonly scatter: 600;
    /**
     * Hovering over a Bar or RadialBar renders a highlight rectangle
     */
    readonly activeBar: 1000;
    /**
     * Cursor is embedded inside Tooltip and controlled by it.
     * The Tooltip itself has a separate portal and is not included in the zIndex system;
     * Cursor is the decoration inside the chart area, usually a cross or a box.
     * CursorLine is a line cursor rendered in Line, Area, Scatter, Radar charts.
     * It renders above the Line and Scatter so that it is always visible.
     * It renders below active dot so that the dot is always visible and shows the current point.
     * We're also assuming that the active dot is small enough that it does not fully cover the cursor line.
     *
     * This also applies to the radial cursor in RadialBarChart.
     */
    readonly cursorLine: 1100;
    /**
     * Hovering over a Point in Line, Area, Scatter, Radar renders a highlight dot
     */
    readonly activeDot: 1200;
    /**
     * LabelList and Label, including Axis labels
     */
    readonly label: 2000;
};
