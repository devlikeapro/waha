import { isValidElement } from 'react';
import { isEventKey } from './excludeEventProps';

/**
 * Determines how values are stacked:
 *
 * - `none` is the default, it adds values on top of each other. No smarts. Negative values will overlap.
 * - `expand` make it so that the values always add up to 1 - so the chart will look like a rectangle.
 * - `wiggle` and `silhouette` tries to keep the chart centered.
 * - `sign` stacks positive values above zero and negative values below zero. Similar to `none` but handles negatives.
 * - `positive` ignores all negative values, and then behaves like \`none\`.
 *
 * @see {@link https://d3js.org/d3-shape/stack#stack-offsets}
 * (note that the `diverging` offset in d3 is named `sign` in recharts)
 *
 * @inline
 */

/**
 * @deprecated use either `CartesianLayout` or `PolarLayout` instead.
 * Mixing both charts families leads to ambiguity in the type system.
 * These two layouts share very few properties, so it is best to keep them separate.
 */

/**
 * The type of axis.
 *
 * `category`: Treats data as distinct values.
 * Each value is in the same distance from its neighbors, regardless of their actual numeric difference.
 *
 * `number`: Treats data as continuous range.
 * Values that are numerically closer are placed closer together on the axis.
 *
 * `auto`: the type is inferred based on the chart layout.
 *
 * This is external type - users will provide this type in props.
 * Internally we will evaluate it to either 'category' or 'number' based on the layout,
 * before sending it to the store.
 *
 * @inline
 */

/**
 * Individual axes are responsible for resolving the 'auto' type to either 'number' or 'category',
 * based on the chart layout and axis kind. Then they can start using this type.
 */

/**
 * Extracts values from data objects.
 *
 * @inline
 */

/**
 * A version of PresentationAttributes that excludes SVG-specific props.
 * For use with components that render HTML elements (i.e., Legend and Tooltip, which render <ul>, <li>, <div>).
 */

/**
 * @inline
 */

/**
 * @inline
 */

/**
 * @deprecated do not use: too many properties, mixing too many concepts, cartesian and polar together, everything optional.
 * Instead, use either `Coordinate` or `PolarCoordinate`.
 */

export var isPolarCoordinate = c => {
  return 'radius' in c && 'startAngle' in c && 'endAngle' in c;
};

/**
 * String shortcuts for scale types.
 * In case none of these does what you want you can also provide your own scale function
 * @see {@link CustomScaleDefinition}
 */

//
// Event Handler Types -- Copied from @types/react/index.d.ts and adapted for Props.
//

/**
 * The type of easing function to use for animations
 *
 * @inline
 */

/** @deprecated Use EasingInput instead */

/** Specifies the duration of animation, the unit of this option is ms. */

/**
 * This object defines the offset of the chart area and width and height and brush and ... it's a bit too much information all in one.
 * We use it internally but let's not expose it to the outside world.
 * If you are looking for this information, instead import `ChartOffset` or `PlotArea` from `recharts`.
 */

/**
 * The domain of axis.
 * This is the definition
 *
 * Numeric domain is always defined by an array of exactly two values, for the min and the max of the axis.
 * Categorical domain is defined as array of all possible values.
 *
 * Can be specified in many ways:
 * - array of numbers
 * - with special strings like 'dataMin' and 'dataMax'
 * - with special string math like 'dataMin - 100'
 * - with keyword 'auto'
 * - or a function
 * - array of functions
 * - or a combination of the above
 */

/**
 * NumberDomain is an evaluated {@link AxisDomain}.
 * Unlike {@link AxisDomain}, it has no variety - it's a tuple of two number.
 * This is after all the keywords and functions were evaluated and what is left is [min, max].
 *
 * Know that the min, max values are not guaranteed to be nice numbers - values like -Infinity or NaN are possible.
 *
 * There are also `category` axes that have different things than numbers in their domain.
 */

/**
 * @inline
 */

/**
 * Props shared in all renderable axes - meaning the ones that are drawn on the chart,
 * can have ticks, axis line, etc.
 */

/** Defines how ticks are placed and whether / how tick collisions are handled.
 * 'preserveStart' keeps the left tick on collision and ensures that the first tick is always shown.
 * 'preserveEnd' keeps the right tick on collision and ensures that the last tick is always shown.
 * 'preserveStartEnd' keeps the left tick on collision and ensures that the first and last ticks always show.
 * 'equidistantPreserveStart' selects a number N such that every nTh tick will be shown without collision.
 * 'equidistantPreserveEnd' selects a number N such that every nTh tick will be shown, ensuring the last tick is always visible.
 */

/**
 * Ticks can be any type when the axis is the type of category.
 *
 * Ticks must be numbers when the axis is the type of number.
 *
 * @inline
 */

/**
 * @inline
 */

/**
 * @inline
 */

export var adaptEventHandlers = (props, newHandler) => {
  if (!props || typeof props === 'function' || typeof props === 'boolean') {
    return null;
  }
  var inputProps = props;
  if (/*#__PURE__*/isValidElement(props)) {
    inputProps = props.props;
  }
  if (typeof inputProps !== 'object' && typeof inputProps !== 'function') {
    return null;
  }
  var out = {};
  Object.keys(inputProps).forEach(key => {
    if (isEventKey(key) && typeof inputProps[key] === 'function') {
      out[key] = newHandler || (e => inputProps[key](inputProps, e));
    }
  });
  return out;
};
var getEventHandlerOfChild = (originalHandler, data, index) => e => {
  originalHandler(data, index, e);
  return null;
};
export var adaptEventsOfChild = (props, data, index) => {
  if (props === null || typeof props !== 'object' && typeof props !== 'function') {
    return null;
  }
  var out = null;
  Object.keys(props).forEach(key => {
    var item = props[key];
    if (isEventKey(key) && typeof item === 'function') {
      if (!out) out = {};
      out[key] = getEventHandlerOfChild(item, data, index);
    }
  });
  return out;
};

/**
 * 'axis' means that all graphical items belonging to this axis tick will be highlighted,
 * and all will be present in the tooltip.
 * Tooltip with 'axis' will display when hovering on the chart background.
 *
 * 'item' means only the one graphical item being hovered will show in the tooltip.
 * Tooltip with 'item' will display when hovering over individual graphical items.
 *
 * This is calculated internally;
 * charts have a `defaultTooltipEventType` and `validateTooltipEventTypes` options.
 *
 * Users then use <Tooltip shared={true} /> or <Tooltip shared={false} /> to control their preference,
 * and charts will then see what is allowed and what is not.
 */

/**
 * These are the props we are going to pass to an `activeDot` or `dot` if it is a function or a custom Component
 */

/**
 * This is the type of `activeDot` prop on:
 * - Area
 * - Line
 * - Radar
 *
 * @inline
 */

/**
 * Inside the dot event handlers we provide extra information about the dot point
 * that the Dot component itself does not need but users might find useful.
 */

/**
 * This is the type of `dot` prop on:
 * - Area
 * - Line
 * - Radar
 *
 * @inline
 */

/**
 * Animation metadata forwarded to custom chart shapes.
 *
 * These props let a shape react to the current animation state without needing
 * to know how its parent chart component computes the animated geometry.
 */

/**
 * Simplified version of the MouseEvent so that we don't have to mock the whole thing in tests.
 *
 * This is meant to represent the React.MouseEvent
 * which is a wrapper on top of https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
 */

/**
 * Simplified version of the MouseEvent for SVG elements.
 *
 * Similar to MousePointer but uses SVGGraphicsElement properties instead of HTMLElement properties.
 * SVG elements use getBBox() to get the intrinsic size instead of offsetWidth/offsetHeight.
 */

/**
 * Recharts accepts mouse events from both HTML and SVG elements.
 */

/**
 * Coordinates relative to the top-left corner of the active element.
 * Also include scale which means that element that's scaled will return the same coordinates as element that's not scaled.
 */

/**
 * Data provider means that this component accepts a `data` prop which is where you can input your data into the chart state.
 * The data is an array of objects, where each object represents a data point.
 *
 * DataPointType is the type of each data point object in the data array.
 *
 * The data is reused in multiple charts and components. Meaning if you provide data on the chart level,
 * then all child components, graphical items, legend, tooltip, axes ... will be able to access the data.
 *
 * Same goes for the graphical item. If you provide data on the graphical item level,
 * then that data is visible for the main chart, and all axes, tooltip, legend ... in the whole chart.
 * This is not scoped to the graphical item only.
 */

/**
 * Data consumer means that this component accepts a `dataKey` prop which is how you specify
 * which dimension of the data to use for this component.
 *
 * DataPointType is the type of each data point object in the data array.
 * DataValueType is the type of the value that this dataKey extracts from each data point.
 */

/**
 * Props shared with all Cartesian and Polar charts.
 * There are three charts that do not use these base props, and define their own:
 * - Treemap
 * - Sunburst
 * - Sankey
 */

export var isNonEmptyArray = arr => {
  return Array.isArray(arr) && arr.length > 0;
};