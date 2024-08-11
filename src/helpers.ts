function parseBool(value: any): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (!value) {
    return false;
  }
  if (value.toLowerCase() === 'true' || value.toLowerCase() === '1') {
    return true;
  }
  if (value.toLowerCase() === 'false' || value.toLowerCase() === '0') {
    return false;
  }

  throw new Error(
    'Error: parseBool got unexpected value - use "true" or "false" values',
  );
}

function flipObject(object) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [value, key]),
  );
}

function splitAt(str: string, index) {
  const fst = [...str];
  const snd = fst.splice(index);
  return [fst.join(''), snd.join('')];
}

export { flipObject, parseBool, splitAt };
