export declare class EventHandler {
    #private;
    constructor(window: Window);
    get currentEvent(): Event | null;
    get currentFocus(): Event | null;
    get lastFocusVisible(): Element | null;
    set lastFocusVisible(node: Element);
    handleFocusEvent(evt: Event): void;
    handleKeyboardEvent(evt: KeyboardEvent): void;
    handleMouseEvent(evt: MouseEvent): void;
    registerEventListeners(): void;
    destroy(): void;
}
