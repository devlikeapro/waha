export class QR {
  private base64: string;

  save(base64) {
    this.base64 = base64.replace(/^data:image\/png;base64,/, '');
  }

  get(): Buffer {
    return Buffer.from(this.base64, 'base64');
  }
}
