/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

import { forwardRef, createElement } from 'react';
import { toLucideIconData } from './shared/src/utils/toLucideIconData.mjs';
import { toPascalCase } from './shared/src/utils/toPascalCase.mjs';
import Icon from './Icon.mjs';

function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
  const iconData = typeof iconDataOrName === "string" ? toLucideIconData(iconDataOrName, iconNode, aliases) : iconDataOrName;
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      icon: iconData,
      className,
      ...props
    })
  );
  if (iconData.name) {
    Component.displayName = toPascalCase(iconData.name);
  }
  return Component;
}

export { createLucideIcon as default };
//# sourceMappingURL=createLucideIcon.mjs.map
