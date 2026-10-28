/**
 * Checks if two arrays are equal, treating empty arrays as equal regardless of reference.
 * If both arrays are non-empty, it checks for reference equality.
 * @param a
 * @param b
 */
export function emptyArraysAreEqualCheck(a, b) {
  if (Array.isArray(a) && Array.isArray(b) && a.length === 0 && b.length === 0) {
    // empty arrays are always equal, regardless of reference
    return true;
  }
  return a === b;
}

/**
 * Checks if two arrays have the same contents in the same order.
 * @param a
 * @param b
 */
export function arrayContentsAreEqualCheck(a, b) {
  if (a.length === b.length) {
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
}