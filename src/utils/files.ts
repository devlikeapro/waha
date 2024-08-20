// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');

export async function fileExists(filepath: string) {
  try {
    await fs.access(filepath, fs.constants.F_OK);
  } catch (error) {
    return false;
  }
  return true;
}
