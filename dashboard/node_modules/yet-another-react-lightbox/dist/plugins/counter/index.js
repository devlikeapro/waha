import * as React from 'react';
import { useLightboxState, clsx, cssClass, createModule } from '../../index.js';
import { MODULE_CONTROLLER, PLUGIN_COUNTER } from '../../types.js';

const defaultCounterProps = {
    separator: "/",
    container: {},
};
const resolveCounterProps = (counter) => ({
    ...defaultCounterProps,
    ...counter,
});

function CounterComponent({ counter }) {
    const { slides, currentIndex } = useLightboxState();
    const { separator, container: { className, ...rest }, className: legacyClassName, ...legacyRest } = resolveCounterProps(counter);
    if (slides.length === 0)
        return null;
    return (React.createElement("div", { className: clsx(cssClass("counter"), className || legacyClassName), ...legacyRest, ...rest, "aria-hidden": true },
        currentIndex + 1,
        " ",
        separator,
        " ",
        slides.length));
}
function Counter({ augment, addChild }) {
    augment(({ counter, ...restProps }) => ({
        counter: resolveCounterProps(counter),
        ...restProps,
    }));
    addChild(MODULE_CONTROLLER, createModule(PLUGIN_COUNTER, CounterComponent));
}

export { Counter as default };
