import * as React from 'react';
import { useLightboxProps, useMotionPreference, useEventCallback, useLayoutEffect, useLightboxState, isImageSlide, isImageFitCover, round, useDocumentContext, useController, usePointerEvents, cleanup, makeUseContext, createIcon, IconButton, devicePixelRatio, ImageSlide, clsx, cssClass, addToolbarButton, createModule } from '../../index.js';
import { EVENT_ON_KEY_DOWN, EVENT_ON_WHEEL, UNKNOWN_ACTION_TYPE, CLASS_FULLSIZE, CLASS_FLEX_CENTER, CLASS_SLIDE_WRAPPER, CLASS_SLIDE_WRAPPER_INTERACTIVE, PLUGIN_ZOOM } from '../../types.js';

const defaultZoomProps = {
    minZoom: 1,
    maxZoomPixelRatio: 1,
    zoomInMultiplier: 2,
    doubleTapDelay: 300,
    doubleClickDelay: 500,
    doubleClickMaxStops: 2,
    keyboardMoveDistance: 50,
    wheelZoomDistanceFactor: 100,
    pinchZoomDistanceFactor: 100,
    pinchZoomV4: false,
    scrollToZoom: false,
    maxZoom: 8,
};
function validateMinZoom(minZoom) {
    return Math.min(Math.max(minZoom, Number.EPSILON), 1);
}
function resolveZoomProps(zoom) {
    const { minZoom, ...rest } = { ...defaultZoomProps, ...zoom };
    return { minZoom: validateMinZoom(minZoom), ...rest };
}

function useZoomAnimation(zoom, offsetX, offsetY, zoomWrapperRef) {
    const zoomAnimation = React.useRef(undefined);
    const zoomAnimationStart = React.useRef(undefined);
    const { zoom: zoomAnimationDuration } = useLightboxProps().animation;
    const reduceMotion = useMotionPreference();
    const playZoomAnimation = useEventCallback(() => {
        var _a, _b, _c;
        (_a = zoomAnimation.current) === null || _a === void 0 ? void 0 : _a.cancel();
        zoomAnimation.current = undefined;
        if (zoomAnimationStart.current && (zoomWrapperRef === null || zoomWrapperRef === void 0 ? void 0 : zoomWrapperRef.current)) {
            try {
                zoomAnimation.current = (_c = (_b = zoomWrapperRef.current).animate) === null || _c === void 0 ? void 0 : _c.call(_b, [
                    { transform: zoomAnimationStart.current },
                    { transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)` },
                ], {
                    duration: !reduceMotion ? (zoomAnimationDuration !== null && zoomAnimationDuration !== void 0 ? zoomAnimationDuration : 500) : 0,
                    easing: zoomAnimation.current ? "ease-out" : "ease-in-out",
                });
            }
            catch (err) {
                console.error(err);
            }
            zoomAnimationStart.current = undefined;
            if (zoomAnimation.current) {
                zoomAnimation.current.onfinish = () => {
                    zoomAnimation.current = undefined;
                };
            }
        }
    });
    useLayoutEffect(playZoomAnimation, [zoom, offsetX, offsetY, playZoomAnimation]);
    return React.useCallback(() => {
        zoomAnimationStart.current = (zoomWrapperRef === null || zoomWrapperRef === void 0 ? void 0 : zoomWrapperRef.current)
            ? window.getComputedStyle(zoomWrapperRef.current).transform
            : undefined;
    }, [zoomWrapperRef]);
}

function useZoomCallback(zoom, disabled) {
    const { on } = useLightboxProps();
    const onZoomCallback = useEventCallback(() => {
        var _a;
        if (!disabled) {
            (_a = on.zoom) === null || _a === void 0 ? void 0 : _a.call(on, { zoom });
        }
    });
    React.useEffect(onZoomCallback, [zoom, onZoomCallback]);
}

function useZoomProps() {
    const { zoom } = useLightboxProps();
    return resolveZoomProps(zoom);
}

function resolveMaxZoom(maxZoom, slide) {
    var _a;
    const resolved = typeof maxZoom === "function" ? ((_a = maxZoom(slide)) !== null && _a !== void 0 ? _a : defaultZoomProps.maxZoom) : maxZoom;
    return Math.max(resolved, 1);
}
function useZoomImageRect(slideRect, imageDimensions) {
    var _a, _b;
    let imageRect = { width: 0, height: 0 };
    let maxImageRect = { width: 0, height: 0 };
    const { currentSlide } = useLightboxState();
    const { imageFit } = useLightboxProps().carousel;
    const { maxZoomPixelRatio, maxZoom: maxZoomInProps } = useZoomProps();
    if (slideRect && currentSlide) {
        const slide = { ...currentSlide, ...imageDimensions };
        if (isImageSlide(slide)) {
            const cover = isImageFitCover(slide, imageFit);
            const width = Math.max(...(((_a = slide.srcSet) === null || _a === void 0 ? void 0 : _a.map((x) => x.width)) || []).concat(slide.width ? [slide.width] : []));
            const height = Math.max(...(((_b = slide.srcSet) === null || _b === void 0 ? void 0 : _b.map((x) => x.height)) || []).concat(slide.height ? [slide.height] : []));
            if (width > 0 && height > 0 && slideRect.width > 0 && slideRect.height > 0) {
                maxImageRect = cover
                    ? {
                        width: Math.round(Math.min(width, (slideRect.width / slideRect.height) * height)),
                        height: Math.round(Math.min(height, (slideRect.height / slideRect.width) * width)),
                    }
                    : { width, height };
                maxImageRect = {
                    width: maxImageRect.width * maxZoomPixelRatio,
                    height: maxImageRect.height * maxZoomPixelRatio,
                };
                imageRect = cover
                    ? {
                        width: Math.min(slideRect.width, maxImageRect.width, width),
                        height: Math.min(slideRect.height, maxImageRect.height, height),
                    }
                    : {
                        width: Math.round(Math.min(slideRect.width, (slideRect.height / height) * width, width)),
                        height: Math.round(Math.min(slideRect.height, (slideRect.width / width) * height, height)),
                    };
            }
        }
        else if (slideRect.width > 0 && slideRect.height > 0) {
            if (imageDimensions && imageDimensions.width > 0 && imageDimensions.height > 0) {
                imageRect = {
                    width: Math.min(slideRect.width, imageDimensions.width),
                    height: Math.min(slideRect.height, imageDimensions.height),
                };
            }
            else {
                imageRect = { width: slideRect.width, height: slideRect.height };
            }
        }
    }
    const maxZoom = currentSlide && imageRect.width
        ? isImageSlide(currentSlide)
            ? Math.max(round(maxImageRect.width / imageRect.width, 5), 1)
            : resolveMaxZoom(maxZoomInProps, currentSlide)
        : 1;
    return { imageRect, maxZoom };
}

function distance(pointerA, pointerB) {
    return Math.hypot(pointerA.clientX - pointerB.clientX, pointerA.clientY - pointerB.clientY);
}
function scaleZoom(value, delta, factor = 100, clamp = 2) {
    return value * Math.min(1 + Math.abs(delta / factor), clamp) ** Math.sign(delta);
}
function useZoomSensors(zoom, minZoom, maxZoom, disabled, zoomIn, zoomOut, changeZoom, changeOffsets, zoomWrapperRef) {
    const activePointers = React.useRef([]);
    const lastPointerDown = React.useRef(0);
    const pinchZoom = React.useRef(undefined);
    const { globalIndex } = useLightboxState();
    const { getOwnerWindow } = useDocumentContext();
    const { containerRef, subscribeSensors } = useController();
    const { keyboardMoveDistance, zoomInMultiplier, wheelZoomDistanceFactor, scrollToZoom, doubleTapDelay, doubleClickDelay, doubleClickMaxStops, pinchZoomDistanceFactor, pinchZoomV4, } = useZoomProps();
    const translateCoordinates = React.useCallback((event) => {
        if (containerRef.current) {
            const { pageX, pageY } = event;
            const { scrollX, scrollY } = getOwnerWindow();
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            return [pageX - left - scrollX - width / 2, pageY - top - scrollY - height / 2];
        }
        return [];
    }, [containerRef, getOwnerWindow]);
    const onKeyDown = useEventCallback((event) => {
        const { key, metaKey, ctrlKey } = event;
        const meta = metaKey || ctrlKey;
        const preventDefault = () => {
            event.preventDefault();
            event.stopPropagation();
        };
        if (zoom > 1) {
            const move = (deltaX, deltaY) => {
                preventDefault();
                changeOffsets(deltaX, deltaY);
            };
            if (key === "ArrowDown") {
                move(0, keyboardMoveDistance);
            }
            else if (key === "ArrowUp") {
                move(0, -keyboardMoveDistance);
            }
            else if (key === "ArrowLeft") {
                move(-keyboardMoveDistance, 0);
            }
            else if (key === "ArrowRight") {
                move(keyboardMoveDistance, 0);
            }
        }
        if (key === "+" || (meta && key === "=")) {
            preventDefault();
            zoomIn();
        }
        else if (key === "-" || (meta && key === "_")) {
            preventDefault();
            zoomOut();
        }
        else if (meta && key === "0") {
            preventDefault();
            changeZoom(1);
        }
    });
    const onWheel = useEventCallback((event) => {
        if (event.ctrlKey || scrollToZoom) {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.stopPropagation();
                changeZoom(scaleZoom(zoom, -event.deltaY, wheelZoomDistanceFactor), true, ...translateCoordinates(event));
                return;
            }
        }
        if (zoom > 1) {
            event.stopPropagation();
            if (!scrollToZoom) {
                changeOffsets(event.deltaX, event.deltaY);
            }
        }
    });
    const clearPointer = React.useCallback((event) => {
        const pointers = activePointers.current;
        pointers.splice(0, pointers.length, ...pointers.filter((p) => p.pointerId !== event.pointerId));
    }, []);
    const replacePointer = React.useCallback((event) => {
        clearPointer(event);
        event.persist();
        activePointers.current.push(event);
    }, [clearPointer]);
    const onPointerDown = useEventCallback((event) => {
        var _a;
        const pointers = activePointers.current;
        if ((event.pointerType === "mouse" && event.buttons > 1) ||
            !((_a = zoomWrapperRef === null || zoomWrapperRef === void 0 ? void 0 : zoomWrapperRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target))) {
            return;
        }
        if (zoom > 1) {
            event.stopPropagation();
        }
        const { timeStamp } = event;
        if (pointers.length === 0 &&
            timeStamp - lastPointerDown.current < (event.pointerType === "touch" ? doubleTapDelay : doubleClickDelay)) {
            lastPointerDown.current = 0;
            const targetZoom = zoom >= 1
                ? zoom !== maxZoom
                    ? zoom * Math.max(maxZoom ** (1 / doubleClickMaxStops), zoomInMultiplier)
                    : 1
                : zoom !== minZoom
                    ? zoom / Math.max(minZoom ** (-1 / doubleClickMaxStops), zoomInMultiplier)
                    : 1;
            changeZoom(targetZoom, false, ...translateCoordinates(event));
        }
        else {
            lastPointerDown.current = timeStamp;
        }
        replacePointer(event);
        if (pointers.length === 2) {
            const initialDistance = distance(pointers[0], pointers[1]);
            pinchZoom.current = {
                previousDistance: initialDistance,
                initialDistance: Math.max(initialDistance, 1),
                initialZoom: zoom,
            };
        }
    });
    const onPointerMove = useEventCallback((event) => {
        const pointers = activePointers.current;
        const activePointer = pointers.find((p) => p.pointerId === event.pointerId);
        if (pointers.length === 2 && pinchZoom.current) {
            event.stopPropagation();
            replacePointer(event);
            const currentDistance = distance(pointers[0], pointers[1]);
            const targetZoom = pinchZoomV4
                ? (pinchZoom.current.initialZoom / pinchZoom.current.initialDistance) * currentDistance
                : scaleZoom(zoom, currentDistance - pinchZoom.current.previousDistance, pinchZoomDistanceFactor);
            changeZoom(targetZoom, true, ...pointers
                .map((x) => translateCoordinates(x))
                .reduce((acc, coordinate) => coordinate.map((x, i) => acc[i] + x / 2)));
            pinchZoom.current.previousDistance = currentDistance;
            return;
        }
        if (zoom > 1) {
            event.stopPropagation();
            if (activePointer) {
                if (pointers.length === 1) {
                    changeOffsets((activePointer.clientX - event.clientX) / zoom, (activePointer.clientY - event.clientY) / zoom);
                }
                replacePointer(event);
            }
        }
    });
    const onPointerUp = React.useCallback((event) => {
        const pointers = activePointers.current;
        if (pointers.length === 2 && pointers.find((p) => p.pointerId === event.pointerId)) {
            pinchZoom.current = undefined;
        }
        clearPointer(event);
    }, [clearPointer]);
    const cleanupSensors = React.useCallback(() => {
        const pointers = activePointers.current;
        pointers.splice(0, pointers.length);
        lastPointerDown.current = 0;
        pinchZoom.current = undefined;
    }, []);
    usePointerEvents(subscribeSensors, onPointerDown, onPointerMove, onPointerUp, disabled);
    React.useEffect(cleanupSensors, [globalIndex, cleanupSensors]);
    React.useEffect(() => {
        if (!disabled) {
            return cleanup(cleanupSensors, subscribeSensors(EVENT_ON_KEY_DOWN, onKeyDown), subscribeSensors(EVENT_ON_WHEEL, onWheel));
        }
        return () => { };
    }, [disabled, subscribeSensors, cleanupSensors, onKeyDown, onWheel]);
}

function useZoomState(imageRect, maxZoom, zoomWrapperRef) {
    const [zoom, setZoom] = React.useState(1);
    const [offsetX, setOffsetX] = React.useState(0);
    const [offsetY, setOffsetY] = React.useState(0);
    const animate = useZoomAnimation(zoom, offsetX, offsetY, zoomWrapperRef);
    const { currentSlide, globalIndex } = useLightboxState();
    const { containerRect, slideRect } = useController();
    const { minZoom, zoomInMultiplier } = useZoomProps();
    const currentSource = currentSlide && isImageSlide(currentSlide) ? currentSlide.src : undefined;
    const disabled = !(zoomWrapperRef === null || zoomWrapperRef === void 0 ? void 0 : zoomWrapperRef.current);
    useLayoutEffect(() => {
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
    }, [globalIndex, currentSource]);
    const changeOffsets = React.useCallback((dx, dy, targetZoom) => {
        const newZoom = targetZoom || zoom;
        const newOffsetX = offsetX - (dx || 0);
        const newOffsetY = offsetY - (dy || 0);
        const maxOffsetX = (imageRect.width * newZoom - slideRect.width) / 2 / newZoom;
        const maxOffsetY = (imageRect.height * newZoom - slideRect.height) / 2 / newZoom;
        setOffsetX(Math.min(Math.abs(newOffsetX), Math.max(maxOffsetX, 0)) * Math.sign(newOffsetX));
        setOffsetY(Math.min(Math.abs(newOffsetY), Math.max(maxOffsetY, 0)) * Math.sign(newOffsetY));
    }, [zoom, offsetX, offsetY, slideRect, imageRect.width, imageRect.height]);
    const changeZoom = React.useCallback((targetZoom, rapid, dx, dy) => {
        const newZoom = round(targetZoom + 0.01 < maxZoom ? (targetZoom - 0.01 > minZoom ? targetZoom : minZoom) : maxZoom, 5);
        if (!rapid) {
            animate();
        }
        changeOffsets(dx ? dx * (1 / zoom - 1 / newZoom) : 0, dy ? dy * (1 / zoom - 1 / newZoom) : 0, newZoom);
        setZoom(newZoom);
    }, [zoom, minZoom, maxZoom, changeOffsets, animate]);
    const handleControllerRectChange = useEventCallback(() => {
        if (zoom > 1) {
            if (zoom > maxZoom) {
                changeZoom(maxZoom, true);
            }
            changeOffsets();
        }
    });
    useLayoutEffect(handleControllerRectChange, [containerRect.width, containerRect.height, handleControllerRectChange]);
    const zoomIn = React.useCallback(() => {
        const targetZoom = zoom * zoomInMultiplier;
        changeZoom(zoom < 1 && targetZoom > 1 ? 1 : targetZoom);
    }, [zoom, zoomInMultiplier, changeZoom]);
    const zoomOut = React.useCallback(() => {
        const targetZoom = zoom / zoomInMultiplier;
        changeZoom(zoom > 1 && targetZoom < 1 ? 1 : targetZoom);
    }, [zoom, zoomInMultiplier, changeZoom]);
    return { zoom, offsetX, offsetY, disabled, changeOffsets, changeZoom, zoomIn, zoomOut };
}

const ZoomControllerContext = React.createContext(null);
const useZoom = makeUseContext("useZoom", "ZoomControllerContext", ZoomControllerContext);
function ZoomContextProvider({ children }) {
    const [zoomWrapper, setZoomWrapper] = React.useState();
    const { slideRect } = useController();
    const { ref, minZoom } = useZoomProps();
    const { imageRect, maxZoom } = useZoomImageRect(slideRect, zoomWrapper === null || zoomWrapper === void 0 ? void 0 : zoomWrapper.imageDimensions);
    const { zoom, offsetX, offsetY, disabled, changeZoom, changeOffsets, zoomIn, zoomOut } = useZoomState(imageRect, maxZoom, zoomWrapper === null || zoomWrapper === void 0 ? void 0 : zoomWrapper.zoomWrapperRef);
    useZoomCallback(zoom, disabled);
    useZoomSensors(zoom, minZoom, maxZoom, disabled, zoomIn, zoomOut, changeZoom, changeOffsets, zoomWrapper === null || zoomWrapper === void 0 ? void 0 : zoomWrapper.zoomWrapperRef);
    const zoomRef = React.useMemo(() => ({ zoom, minZoom, maxZoom, offsetX, offsetY, disabled, zoomIn, zoomOut, changeZoom }), [zoom, minZoom, maxZoom, offsetX, offsetY, disabled, zoomIn, zoomOut, changeZoom]);
    React.useImperativeHandle(ref, () => zoomRef, [zoomRef]);
    const context = React.useMemo(() => ({ ...zoomRef, setZoomWrapper }), [zoomRef, setZoomWrapper]);
    return React.createElement(ZoomControllerContext.Provider, { value: context }, children);
}

const ZoomInIcon = createIcon("ZoomIn", React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" }),
    React.createElement("path", { d: "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" })));
const ZoomOutIcon = createIcon("ZoomOut", React.createElement("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z" }));
const ZoomButton = React.forwardRef(function ZoomButton({ zoomIn, onLoseFocus }, ref) {
    const wasEnabled = React.useRef(false);
    const wasFocused = React.useRef(false);
    const { zoom, minZoom, maxZoom, zoomIn: zoomInCallback, zoomOut: zoomOutCallback, disabled: zoomDisabled, } = useZoom();
    const { render } = useLightboxProps();
    const disabled = zoomDisabled || (zoomIn ? zoom >= maxZoom : zoom <= minZoom);
    React.useEffect(() => {
        if (disabled && wasEnabled.current && wasFocused.current) {
            onLoseFocus();
        }
        if (!disabled) {
            wasEnabled.current = true;
        }
    }, [disabled, onLoseFocus]);
    return (React.createElement(IconButton, { ref: ref, disabled: disabled, label: zoomIn ? "Zoom in" : "Zoom out", icon: zoomIn ? ZoomInIcon : ZoomOutIcon, renderIcon: zoomIn ? render.iconZoomIn : render.iconZoomOut, onClick: zoomIn ? zoomInCallback : zoomOutCallback, onFocus: () => {
            wasFocused.current = true;
        }, onBlur: () => {
            wasFocused.current = false;
        } }));
});

function ZoomButtonsGroup() {
    const zoomInRef = React.useRef(null);
    const zoomOutRef = React.useRef(null);
    const { focus } = useController();
    const focusSibling = React.useCallback((sibling) => {
        var _a, _b;
        if (!((_a = sibling.current) === null || _a === void 0 ? void 0 : _a.disabled)) {
            (_b = sibling.current) === null || _b === void 0 ? void 0 : _b.focus();
        }
        else {
            focus();
        }
    }, [focus]);
    const focusZoomIn = React.useCallback(() => focusSibling(zoomInRef), [focusSibling]);
    const focusZoomOut = React.useCallback(() => focusSibling(zoomOutRef), [focusSibling]);
    return (React.createElement(React.Fragment, null,
        React.createElement(ZoomButton, { zoomIn: true, ref: zoomInRef, onLoseFocus: focusZoomOut }),
        React.createElement(ZoomButton, { ref: zoomOutRef, onLoseFocus: focusZoomIn })));
}

function ZoomToolbarControl() {
    const { render } = useLightboxProps();
    const zoomRef = useZoom();
    if (render.buttonZoom) {
        return React.createElement(React.Fragment, null, render.buttonZoom(zoomRef));
    }
    return React.createElement(ZoomButtonsGroup, null);
}

function isResponsiveImageSlide(slide) {
    var _a;
    return (((_a = slide.srcSet) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0;
}
function reducer({ current, preload }, { type, source }) {
    switch (type) {
        case "fetch":
            if (!current) {
                return { current: source };
            }
            return { current, preload: source };
        case "done":
            if (source === preload) {
                return { current: source };
            }
            return { current, preload };
        default:
            throw new Error(UNKNOWN_ACTION_TYPE);
    }
}
function ResponsiveImage(props) {
    var _a, _b;
    const [{ current, preload }, dispatch] = React.useReducer(reducer, {});
    const { slide: image, rect, imageFit, render, interactive } = props;
    const srcSet = image.srcSet.sort((a, b) => a.width - b.width);
    const width = (_a = image.width) !== null && _a !== void 0 ? _a : srcSet[srcSet.length - 1].width;
    const height = (_b = image.height) !== null && _b !== void 0 ? _b : srcSet[srcSet.length - 1].height;
    const cover = isImageFitCover(image, imageFit);
    const maxWidth = Math.max(...srcSet.map((x) => x.width));
    const targetWidth = Math.min((cover ? Math.max : Math.min)(rect.width, width * (rect.height / height)), maxWidth);
    const pixelDensity = devicePixelRatio();
    const handleResize = useEventCallback(() => {
        var _a;
        const targetSource = (_a = srcSet.find((x) => x.width >= targetWidth * pixelDensity)) !== null && _a !== void 0 ? _a : srcSet[srcSet.length - 1];
        if (!current || srcSet.findIndex((x) => x.src === current) < srcSet.findIndex((x) => x === targetSource)) {
            dispatch({ type: "fetch", source: targetSource.src });
        }
    });
    useLayoutEffect(handleResize, [rect.width, rect.height, pixelDensity, handleResize]);
    const handlePreload = useEventCallback((currentPreload) => dispatch({ type: "done", source: currentPreload }));
    const style = {
        WebkitTransform: !interactive ? "translateZ(0)" : "initial",
    };
    if (!cover) {
        Object.assign(style, rect.width / rect.height < width / height ? { width: "100%", height: "auto" } : { width: "auto", height: "100%" });
    }
    return (React.createElement(React.Fragment, null,
        preload && preload !== current && (React.createElement(ImageSlide, { key: "preload", ...props, offset: undefined, slide: { ...image, src: preload, srcSet: undefined }, style: { position: "absolute", visibility: "hidden", ...style }, onLoad: () => handlePreload(preload), render: {
                ...render,
                iconLoading: () => null,
                iconError: () => null,
            } })),
        current && (React.createElement(ImageSlide, { key: "current", ...props, slide: { ...image, src: current, srcSet: undefined }, style: style }))));
}

function ZoomWrapper({ render, slide, offset, rect }) {
    var _a;
    const [imageDimensions, setImageDimensions] = React.useState();
    const zoomWrapperRef = React.useRef(null);
    const isImage = isImageSlide(slide);
    const { zoom, maxZoom, offsetX, offsetY, setZoomWrapper } = useZoom();
    const interactive = zoom > 1;
    const { carousel, on } = useLightboxProps();
    const { currentIndex } = useLightboxState();
    useLayoutEffect(() => {
        if (offset !== 0 || isImage || !zoomWrapperRef.current)
            return () => { };
        const measure = () => {
            const wrapper = zoomWrapperRef.current;
            if (!wrapper)
                return;
            let width = 0;
            let height = 0;
            for (const child of wrapper.children) {
                if (child instanceof HTMLElement) {
                    width = Math.max(width, child.offsetWidth);
                    height = Math.max(height, child.offsetHeight);
                }
            }
            setImageDimensions((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
        };
        measure();
        if (typeof ResizeObserver === "undefined")
            return () => { };
        const observer = new ResizeObserver(measure);
        for (const child of zoomWrapperRef.current.children) {
            observer.observe(child);
        }
        return () => observer.disconnect();
    }, [offset, isImage, rect]);
    useLayoutEffect(() => {
        if (offset === 0) {
            setZoomWrapper({ zoomWrapperRef, imageDimensions });
            return () => setZoomWrapper(undefined);
        }
        return () => { };
    }, [offset, imageDimensions, setZoomWrapper]);
    let rendered = (_a = render.slide) === null || _a === void 0 ? void 0 : _a.call(render, { slide, offset, rect, zoom, maxZoom });
    if (!rendered && isImage) {
        const slideProps = {
            slide,
            offset,
            rect,
            render,
            imageFit: carousel.imageFit,
            imageProps: carousel.imageProps,
            onClick: offset === 0 ? () => { var _a; return (_a = on.click) === null || _a === void 0 ? void 0 : _a.call(on, { index: currentIndex }); } : undefined,
        };
        rendered = isResponsiveImageSlide(slide) ? (React.createElement(ResponsiveImage, { ...slideProps, slide: slide, interactive: interactive, rect: offset === 0 ? { width: rect.width * zoom, height: rect.height * zoom } : rect })) : (React.createElement(ImageSlide, { onLoad: (img) => setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight }), ...slideProps }));
    }
    if (!rendered)
        return null;
    return (React.createElement("div", { ref: zoomWrapperRef, className: clsx(cssClass(CLASS_FULLSIZE), cssClass(CLASS_FLEX_CENTER), cssClass(CLASS_SLIDE_WRAPPER), interactive && cssClass(CLASS_SLIDE_WRAPPER_INTERACTIVE)), style: offset === 0 ? { transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)` } : undefined }, rendered));
}

const Zoom = ({ augment, addModule }) => {
    augment(({ zoom: zoomProps, toolbar, render, controller, ...restProps }) => {
        const zoom = resolveZoomProps(zoomProps);
        return {
            zoom,
            toolbar: addToolbarButton(toolbar, PLUGIN_ZOOM, React.createElement(ZoomToolbarControl, null)),
            render: {
                ...render,
                slide: (props) => {
                    var _a, _b;
                    return isImageSlide(props.slide) || (props.slide.type != null && ((_a = zoom.supports) === null || _a === void 0 ? void 0 : _a.includes(props.slide.type))) ? (React.createElement(ZoomWrapper, { render: render, ...props })) : ((_b = render.slide) === null || _b === void 0 ? void 0 : _b.call(render, props));
                },
            },
            controller: { ...controller, preventDefaultWheelY: zoom.scrollToZoom },
            ...restProps,
        };
    });
    addModule(createModule(PLUGIN_ZOOM, ZoomContextProvider));
};

export { Zoom as default };
