"use strict";
"use client";
/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext, useMemo, createElement } from 'react';

const LucideContext = createContext({});
function LucideProvider({
  children,
  size,
  color,
  strokeWidth,
  absoluteStrokeWidth,
  nonScalingStroke,
  className
}) {
  const value = useMemo(
    () => ({
      size,
      color,
      strokeWidth,
      absoluteStrokeWidth,
      nonScalingStroke,
      className
    }),
    [size, color, strokeWidth, absoluteStrokeWidth, nonScalingStroke, className]
  );
  return createElement(LucideContext.Provider, { value }, children);
}
const useLucideContext = () => useContext(LucideContext);

export { LucideProvider, useLucideContext };
//# sourceMappingURL=context.mjs.map
