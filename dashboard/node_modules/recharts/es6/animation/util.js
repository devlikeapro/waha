/*
 * @description: convert camel case to dash case
 * string => string
 */
export var getDashCase = name => name.replace(/([A-Z])/g, v => "-".concat(v.toLowerCase()));
export var getTransitionVal = (props, duration, easing) => props.map(prop => "".concat(getDashCase(prop), " ").concat(duration, "ms ").concat(easing)).join(',');