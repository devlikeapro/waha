import * as React from 'react';
import { createIcon, useLightboxProps, useLightboxState, isImageSlide, IconButton, addToolbarButton } from '../../index.js';

const defaultShareProps = {
    share: undefined,
};
const resolveShareProps = (share) => ({
    ...defaultShareProps,
    ...share,
});

function isShareSupported() {
    return typeof navigator !== "undefined" && Boolean(navigator.canShare);
}

const ShareIcon = createIcon("ShareIcon", React.createElement("path", { d: "m16 5-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" }));
function ShareButton() {
    const { render, on, share: shareProps } = useLightboxProps();
    const { share: customShare } = resolveShareProps(shareProps);
    const { currentSlide, currentIndex } = useLightboxState();
    if (!isShareSupported())
        return null;
    if (render.buttonShare) {
        return React.createElement(React.Fragment, null, render.buttonShare());
    }
    const share = (currentSlide &&
        ((typeof currentSlide.share === "object" && currentSlide.share) ||
            (typeof currentSlide.share === "string" && { url: currentSlide.share }) ||
            (isImageSlide(currentSlide) && { url: currentSlide.src }))) ||
        undefined;
    const canShare = customShare ? (currentSlide === null || currentSlide === void 0 ? void 0 : currentSlide.share) !== false : share && navigator.canShare(share);
    const defaultShare = () => {
        if (share) {
            navigator.share(share).catch(() => { });
        }
    };
    const handleShare = () => {
        var _a;
        if (currentSlide) {
            (customShare || defaultShare)({ slide: currentSlide });
            (_a = on.share) === null || _a === void 0 ? void 0 : _a.call(on, { index: currentIndex });
        }
    };
    return (React.createElement(IconButton, { label: "Share", icon: ShareIcon, renderIcon: render.iconShare, disabled: !canShare, onClick: handleShare }));
}

function Share({ augment }) {
    augment(({ toolbar, share, ...rest }) => ({
        toolbar: addToolbarButton(toolbar, "share", React.createElement(ShareButton, null)),
        share: resolveShareProps(share),
        ...rest,
    }));
}

export { Share as default, isShareSupported };
