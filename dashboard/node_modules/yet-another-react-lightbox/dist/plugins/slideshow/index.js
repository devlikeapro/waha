import * as React from 'react';
import { makeUseContext, useLightboxState, useTimeouts, useEvents, useController, useA11yContext, useEventCallback, cleanup, createIcon, useLightboxProps, useLoseFocus, IconButton, addToolbarButton, createModule } from '../../index.js';
import { SLIDE_STATUS_LOADING, SLIDE_STATUS_PLAYING, ACTIVE_SLIDE_LOADING, ACTIVE_SLIDE_PLAYING, ACTIVE_SLIDE_ERROR, SLIDE_STATUS_ERROR, ACTIVE_SLIDE_COMPLETE, SLIDE_STATUS_COMPLETE, PLUGIN_SLIDESHOW } from '../../types.js';

const defaultSlideshowProps = {
    autoplay: false,
    delay: 3000,
    ref: null,
};
const resolveSlideshowProps = (slideshow) => ({
    ...defaultSlideshowProps,
    ...slideshow,
});

const SlideshowContext = React.createContext(null);
const useSlideshow = makeUseContext("useSlideshow", "SlideshowContext", SlideshowContext);
function SlideshowContextProvider({ slideshow, carousel: { finite }, on, children }) {
    const { autoplay, delay, ref } = resolveSlideshowProps(slideshow);
    const wasPlaying = React.useRef(autoplay);
    const [playing, setPlaying] = React.useState(autoplay);
    const scheduler = React.useRef(undefined);
    const slideStatus = React.useRef(undefined);
    const { slides, currentIndex } = useLightboxState();
    const { setTimeout, clearTimeout } = useTimeouts();
    const { subscribe } = useEvents();
    const { next } = useController();
    const { setAutoPlaying } = useA11yContext();
    React.useEffect(() => setAutoPlaying(playing), [playing, setAutoPlaying]);
    const disabled = slides.length === 0 || (finite && currentIndex === slides.length - 1);
    const play = React.useCallback(() => {
        if (!playing && !disabled) {
            setPlaying(true);
        }
    }, [playing, disabled]);
    const pause = React.useCallback(() => {
        if (playing) {
            setPlaying(false);
        }
    }, [playing]);
    const cancelScheduler = React.useCallback(() => {
        clearTimeout(scheduler.current);
        scheduler.current = undefined;
    }, [clearTimeout]);
    const scheduleNextSlide = useEventCallback(() => {
        cancelScheduler();
        if (!playing ||
            disabled ||
            slideStatus.current === SLIDE_STATUS_LOADING ||
            slideStatus.current === SLIDE_STATUS_PLAYING) {
            return;
        }
        scheduler.current = setTimeout(() => {
            if (playing) {
                slideStatus.current = undefined;
                next();
            }
        }, delay);
    });
    React.useEffect(scheduleNextSlide, [currentIndex, playing, scheduleNextSlide]);
    React.useEffect(() => {
        if (playing && disabled) {
            setPlaying(false);
        }
    }, [currentIndex, playing, disabled]);
    const onSlideshowStart = useEventCallback(() => { var _a; return (_a = on.slideshowStart) === null || _a === void 0 ? void 0 : _a.call(on); });
    const onSlideshowStop = useEventCallback(() => { var _a; return (_a = on.slideshowStop) === null || _a === void 0 ? void 0 : _a.call(on); });
    React.useEffect(() => {
        if (playing) {
            onSlideshowStart();
        }
        else if (wasPlaying.current) {
            onSlideshowStop();
        }
        wasPlaying.current = playing;
    }, [playing, onSlideshowStart, onSlideshowStop]);
    React.useEffect(() => cleanup(cancelScheduler, subscribe(ACTIVE_SLIDE_LOADING, () => {
        slideStatus.current = SLIDE_STATUS_LOADING;
        cancelScheduler();
    }), subscribe(ACTIVE_SLIDE_PLAYING, () => {
        slideStatus.current = SLIDE_STATUS_PLAYING;
        cancelScheduler();
    }), subscribe(ACTIVE_SLIDE_ERROR, () => {
        slideStatus.current = SLIDE_STATUS_ERROR;
        scheduleNextSlide();
    }), subscribe(ACTIVE_SLIDE_COMPLETE, () => {
        slideStatus.current = SLIDE_STATUS_COMPLETE;
        scheduleNextSlide();
    })), [subscribe, cancelScheduler, scheduleNextSlide]);
    const context = React.useMemo(() => ({ playing, disabled, play, pause }), [playing, disabled, play, pause]);
    React.useImperativeHandle(ref, () => context, [context]);
    return React.createElement(SlideshowContext.Provider, { value: context }, children);
}

const PlayIcon = createIcon("Play", React.createElement("path", { d: "M8 5v14l11-7z" }));
const PauseIcon = createIcon("Pause", React.createElement("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }));
function SlideshowButton() {
    const { playing, disabled, play, pause } = useSlideshow();
    const { render } = useLightboxProps();
    const focusListeners = useLoseFocus(useController().focus, disabled);
    if (render.buttonSlideshow) {
        return React.createElement(React.Fragment, null, render.buttonSlideshow({ playing, disabled, play, pause }));
    }
    return (React.createElement(IconButton, { label: playing ? "Pause" : "Play", icon: playing ? PauseIcon : PlayIcon, renderIcon: playing ? render.iconSlideshowPause : render.iconSlideshowPlay, onClick: playing ? pause : play, disabled: disabled, ...focusListeners }));
}

function Slideshow({ augment, addModule }) {
    augment(({ slideshow, toolbar, ...restProps }) => ({
        toolbar: addToolbarButton(toolbar, PLUGIN_SLIDESHOW, React.createElement(SlideshowButton, null)),
        slideshow: resolveSlideshowProps(slideshow),
        ...restProps,
    }));
    addModule(createModule(PLUGIN_SLIDESHOW, SlideshowContextProvider));
}

export { Slideshow as default };
