import { DOCS_URL } from "./exceptions";
import { LocalSessionStorage, MediaStorage } from "./abc/storage.abc";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

export class MediaStorageCore implements MediaStorage {
  async save(messageId: string, mimetype: string, buffer: Buffer): Promise<string> {
    return Promise.resolve(`Media attachment's available only in WAHA Plus version. ${DOCS_URL}`);
  }
}

export class SessionStorageCore extends LocalSessionStorage {
  public sessionsFolder: string;

  constructor(engine: string) {
    super(engine);
    this.sessionsFolder = path.join(os.tmpdir(), 'waha-')
  }

  get engineFolder(){
    return path.join(this.sessionsFolder, this.engine);
  }

  init() {
    fs.mkdirSync(this.engineFolder, {recursive: true});
  }

  getFolderPath(name: string): string {
    return path.join(this.engineFolder, name);
  }

  clean(sessionName: string) {
    const folder = this.getFolderPath(sessionName);
    fs.rmSync(folder, { recursive: true });
  }

  getAll(): string[] {
    return fs.readdirSync(this.engineFolder, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }
}
