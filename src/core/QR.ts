export class QR {
  private base64: string;
  public raw?: string;

  save(base64: string, raw?: string) {
    this.base64 = base64.replace(/^data:image\/png;base64,/, '');
    this.raw = raw;
  }

  get(): Buffer {
    return Buffer.from(this.base64, 'base64');
  }
}
