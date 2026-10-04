import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectZIndexPortalElement } from './zIndexSelectors';
import { registerZIndexPortal, unregisterZIndexPortal } from '../state/zIndexSlice';
import { useIsInChartContext } from '../context/chartLayoutContext';
import { useIsPanorama } from '../context/PanoramaContext';

/**
 * @since 3.4
 */

/**
 * A layer that renders its children into a portal corresponding to the given zIndex.
 * We can't use regular CSS `z-index` because SVG does not support it.
 * So instead, we create separate DOM nodes for each zIndex layer
 * and render the children into the corresponding DOM node using React portals.
 *
 * This component must be used inside a Chart component.
 *
 * @param zIndex numeric zIndex value, higher values are rendered on top of lower values
 * @param children the content to render inside this zIndex layer
 *
 * @since 3.4
 */
export function ZIndexLayer(_ref) {
  var zIndex = _ref.zIndex,
    children = _ref.children;
  /*
   * If we are outside of chart, then we can't rely on the zIndex portal state,
   * so we just render normally.
   */
  var isInChartContext = useIsInChartContext();
  /*
   * If zIndex is undefined then we render normally without portals.
   * Also, if zIndex is 0, we render normally without portals,
   * because 0 is the default layer that does not need a portal.
   */
  var shouldRenderInPortal = isInChartContext && zIndex !== undefined && zIndex !== 0;
  var isPanorama = useIsPanorama();

  /**
   * When zIndex changes, the new portal element is not immediately available because
   * it requires a full render cycle through AllZIndexPortals → ZIndexSvgPortal.
   * During this transition we keep rendering into the previous portal element
   * to avoid an unmount/remount cycle that would cause children to briefly disappear.
   *
   * `registeredZIndexesRef` tracks every zIndex we have registered so that
   * we can defer unregistration of old values until the new portal is ready.
   * `lastPortalElementRef` caches the most recent valid portal DOM node.
   */
  var lastPortalElementRef = useRef(undefined);
  var registeredZIndexesRef = useRef(new Set());
  var dispatch = useAppDispatch();
  var portalElement = useAppSelector(state => selectZIndexPortalElement(state, zIndex, isPanorama));

  /*
   * Lifecycle effect — handles both registration and deferred cleanup.
   *
   * Registration: when zIndex changes we register the new value WITHOUT
   * immediately unregistering the old one. This keeps the old <g> element
   * alive in the DOM so `lastPortalElementRef` remains a valid render target.
   *
   * Deferred cleanup: once `portalElement` for the *new* zIndex becomes
   * available we unregister every stale zIndex that is no longer needed.
   */
  useLayoutEffect(() => {
    if (!shouldRenderInPortal) {
      // Portal rendering was disabled — clean up any stale registrations
      var registered = registeredZIndexesRef.current;
      registered.forEach(z => {
        dispatch(unregisterZIndexPortal({
          zIndex: z
        }));
      });
      registered.clear();
      lastPortalElementRef.current = undefined;
      return;
    }

    /*
     * Because zIndexes are dynamic (meaning, we're not working with a predefined set of layers,
     * but we allow users to define any zIndex at any time), we need to register
     * the requested zIndex in the global store. This way, the ZIndexPortals component
     * can render the corresponding portals and only the requested ones.
     */
    // Register the current zIndex (idempotent — skips if already registered)
    if (!registeredZIndexesRef.current.has(zIndex)) {
      dispatch(registerZIndexPortal({
        zIndex
      }));
      registeredZIndexesRef.current.add(zIndex);
    }

    // When the new portal element is ready, retire old zIndex registrations
    if (portalElement) {
      lastPortalElementRef.current = portalElement;
      var _registered = registeredZIndexesRef.current;
      _registered.forEach(z => {
        if (z !== zIndex) {
          dispatch(unregisterZIndexPortal({
            zIndex: z
          }));
          _registered.delete(z);
        }
      });
    }
  }, [dispatch, zIndex, shouldRenderInPortal, portalElement]);

  // Unmount-only cleanup — unregister everything when the component is removed
  useLayoutEffect(() => {
    var registered = registeredZIndexesRef.current;
    return () => {
      registered.forEach(z => {
        dispatch(unregisterZIndexPortal({
          zIndex: z
        }));
      });
      registered.clear();
    };
  }, [dispatch]);
  if (!shouldRenderInPortal) {
    return children;
  }

  // Prefer the current portal; fall back to the cached one during transitions
  var targetElement = portalElement !== null && portalElement !== void 0 ? portalElement : lastPortalElementRef.current;
  if (!targetElement) {
    // Very first render — no portal has ever been registered yet
    return null;
  }
  return /*#__PURE__*/createPortal(children, targetElement);
}