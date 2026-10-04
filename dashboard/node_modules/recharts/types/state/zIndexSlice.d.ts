type ZIndexEntry = {
    /**
     * Reference to the DOM element that corresponds to this z-index.
     * This element is used to create a React portal for rendering components at this z-index.
     *
     * If undefined, it means no element is currently registered for this z-index,
     * and registration is in progress. If that happens, wait for the next render cycle.
     */
    element: Element | undefined;
    /**
     * Panorama items can't mix with normal items in the same z-index layer,
     * because they are rendered in a different SVG element.
     * So we need to have a separate element reference for panorama z-index portals.
     */
    panoramaElement: Element | undefined;
    consumers: number;
};
type ZIndexState = {
    zIndexMap: Record<number, ZIndexEntry>;
};
export declare const registerZIndexPortal: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: {
    zIndex: number;
}], {
    zIndex: number;
}, "zIndex/registerZIndexPortal", never, unknown>, unregisterZIndexPortal: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: {
    zIndex: number;
}], {
    zIndex: number;
}, "zIndex/unregisterZIndexPortal", never, unknown>, registerZIndexPortalElement: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: {
    zIndex: number;
    element: Element;
    isPanorama: boolean;
}], {
    zIndex: number;
    element: Element;
    isPanorama: boolean;
}, "zIndex/registerZIndexPortalElement", never, unknown>, unregisterZIndexPortalElement: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: {
    zIndex: number;
    isPanorama: boolean;
}], {
    zIndex: number;
    isPanorama: boolean;
}, "zIndex/unregisterZIndexPortalElement", never, unknown>;
export declare const zIndexReducer: import("redux").Reducer<ZIndexState>;
export {};
