// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');

import { ISessionAuthRepository } from './ISessionAuthRepository';
import { LocalStore } from './LocalStore';
// Keep all waha related files, ".waha.session.*"
const KEEP_FILES = /^\.waha\.session\..*$/;

export class LocalSessionAuthRepository extends ISessionAuthRepository {
  private store: LocalStore;

  constructor(store: LocalStore) {
    super();
    this.store = store;
  }

  async init(sessionName?: string) {
    await this.store.init(sessionName);
  }

  async clean(sessionName: string) {
    // Remove all files and directories recursively, but keep waha files
    const sessionDirectory = this.store.getSessionDirectory(sessionName);
    // Check it exists and it's directory
    const exists = await fs.pathExists(sessionDirectory);
    if (!exists) {
      return;
    }
    const files = await fs.readdir(sessionDirectory);
    const filesToRemove = files.filter((file) => !file.match(KEEP_FILES));
    for (const file of filesToRemove) {
      await fs.remove(`${sessionDirectory}/${file}`);
    }
  }
}
