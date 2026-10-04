import * as React from 'react';
import { cssClass, useLightboxProps, makeUseContext, useController, clsx, cssVar, translateLabel, createIcon, createIconDisabled, IconButton, addToolbarButton, createModule } from '../../index.js';
import { PLUGIN_CAPTIONS } from '../../types.js';

const cssPrefix = (className) => cssClass(`slide_${className}`);

const defaultCaptionsProps = {
    descriptionTextAlign: "start",
    descriptionMaxLines: 3,
    showToggle: false,
    hidden: false,
};
const resolveCaptionsProps = (captions) => ({
    ...defaultCaptionsProps,
    ...captions,
});
function useCaptionsProps() {
    const { captions } = useLightboxProps();
    return resolveCaptionsProps(captions);
}

const CaptionsContext = React.createContext(null);
const useCaptions = makeUseContext("useCaptions", "CaptionsContext", CaptionsContext);
function CaptionsContextProvider({ captions, children }) {
    const { ref, hidden } = resolveCaptionsProps(captions);
    const [visible, setVisible] = React.useState(!hidden);
    const context = React.useMemo(() => ({
        visible,
        show: () => setVisible(true),
        hide: () => setVisible(false),
    }), [visible]);
    React.useImperativeHandle(ref, () => context, [context]);
    return React.createElement(CaptionsContext.Provider, { value: context }, children);
}

function Title({ title }) {
    const { toolbarWidth } = useController();
    const { styles } = useLightboxProps();
    const { visible } = useCaptions();
    if (!visible)
        return null;
    return (React.createElement("div", { role: "heading", "aria-level": 2, style: styles.captionsTitleContainer, className: clsx(cssPrefix("captions_container"), cssPrefix("title_container")) },
        React.createElement("div", { className: cssPrefix("title"), style: {
                ...(toolbarWidth ? { [cssVar("toolbar_width")]: `${toolbarWidth}px` } : null),
                ...styles.captionsTitle,
            } }, title)));
}

function Description({ description }) {
    const { descriptionTextAlign, descriptionMaxLines } = useCaptionsProps();
    const { styles, labels } = useLightboxProps();
    const { visible } = useCaptions();
    if (!visible)
        return null;
    return (React.createElement("div", { style: styles.captionsDescriptionContainer, className: clsx(cssPrefix("captions_container"), cssPrefix("description_container")) },
        React.createElement("div", { className: cssPrefix("description"), style: {
                ...(descriptionTextAlign !== defaultCaptionsProps.descriptionTextAlign ||
                    descriptionMaxLines !== defaultCaptionsProps.descriptionMaxLines
                    ? {
                        [cssVar("slide_description_text_align")]: descriptionTextAlign,
                        [cssVar("slide_description_max_lines")]: descriptionMaxLines,
                    }
                    : null),
                ...styles.captionsDescription,
            }, role: "paragraph", "aria-roledescription": translateLabel(labels, "Caption") }, typeof description === "string"
            ? description.split("\n").flatMap((line, index) => [...(index > 0 ? [React.createElement("br", { key: index })] : []), line])
            : description)));
}

const captionsIcon = () => (React.createElement(React.Fragment, null,
    React.createElement("path", { strokeWidth: 2, stroke: "currentColor", strokeLinejoin: "round", fill: "none", d: "M3 5l18 0l0 14l-18 0l0-14z" }),
    React.createElement("path", { d: "M7 15h3c.55 0 1-.45 1-1v-1H9.5v.5h-2v-3h2v.5H11v-1c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm7 0h3c.55 0 1-.45 1-1v-1h-1.5v.5h-2v-3h2v.5H18v-1c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1z" })));
const CaptionsVisible = createIcon("CaptionsVisible", captionsIcon());
const CaptionsHidden = createIconDisabled("CaptionsVisible", captionsIcon());
function CaptionsButton() {
    const { visible, show, hide } = useCaptions();
    const { render } = useLightboxProps();
    if (render.buttonCaptions) {
        return React.createElement(React.Fragment, null, render.buttonCaptions({ visible, show, hide }));
    }
    return (React.createElement(IconButton, { label: visible ? "Hide captions" : "Show captions", icon: visible ? CaptionsVisible : CaptionsHidden, renderIcon: visible ? render.iconCaptionsVisible : render.iconCaptionsHidden, onClick: visible ? hide : show }));
}

function Captions({ augment, addModule }) {
    augment(({ captions: captionsProps, render: { slideFooter: renderFooter, ...restRender }, toolbar, ...restProps }) => {
        const captions = resolveCaptionsProps(captionsProps);
        return {
            render: {
                slideFooter: ({ slide }) => (React.createElement(React.Fragment, null, renderFooter === null || renderFooter === void 0 ? void 0 :
                    renderFooter({ slide }),
                    slide.title && React.createElement(Title, { title: slide.title }),
                    slide.description && React.createElement(Description, { description: slide.description }))),
                ...restRender,
            },
            toolbar: addToolbarButton(toolbar, PLUGIN_CAPTIONS, captions.showToggle ? React.createElement(CaptionsButton, null) : null),
            captions,
            ...restProps,
        };
    });
    addModule(createModule(PLUGIN_CAPTIONS, CaptionsContextProvider));
}

export { Captions as default };
