"use strict";
"use client";
/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

import { forwardRef, useState, useEffect, createElement } from 'react';
import dynamicIconImports from './dynamicIconImports.mjs';
import Icon from './Icon.mjs';

const iconNames = Object.keys(dynamicIconImports);
async function getIconData(name) {
  if (!(name in dynamicIconImports)) {
    throw new Error("[lucide-react]: Name in Lucide DynamicIcon not found");
  }
  const icon = await dynamicIconImports[name]();
  if (icon.__iconData != null) {
    return icon.__iconData;
  }
  throw new Error("[lucide-react]: Failed to resolve icon data for DynamicIcon");
}
const DynamicIcon = forwardRef(
  ({ name, fallback: Fallback, ...props }, ref) => {
    const [iconData, setIconData] = useState();
    useEffect(() => {
      getIconData(name).then(setIconData).catch((error) => {
        console.error(error);
      });
    }, [name]);
    if (iconData == null) {
      if (Fallback == null) {
        return null;
      }
      return createElement(Fallback);
    }
    return createElement(Icon, {
      ref,
      ...props,
      icon: iconData
    });
  }
);

export { DynamicIcon as default, iconNames };
//# sourceMappingURL=DynamicIcon.mjs.map
