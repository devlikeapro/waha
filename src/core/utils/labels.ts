import { Label } from '@waha/structures/labels.dto';
import * as lodash from 'lodash';

/**
 * Find label by name like in Web: trimmed, case-insensitive, any label type
 */
export function findLabelByName(
  labels: Label[],
  name: string,
): Label | undefined {
  const wanted = name.trim().toLocaleLowerCase();
  return lodash.find(
    labels,
    (label) => label.name?.trim().toLocaleLowerCase() === wanted,
  );
}
