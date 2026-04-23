import * as fs from 'fs-extra';
import * as fsp from 'fs/promises';
import * as path from 'path';

export async function removeSingletonFiles(dir: string): Promise<void> {
  const exists = await fs.pathExists(dir);
  if (!exists) {
    return;
  }
  const files = await fsp.readdir(dir);
  for (const file of files) {
    if (!file.startsWith('Singleton')) {
      continue;
    }
    try {
      await fsp.rm(path.join(dir, file), { force: true });
    } catch {
      // ignore
    }
  }
}
