/**
 * Several errors from parallel tasks as one, the message lists all of them
 */
export class MultipleErrors extends Error {
  constructor(public errors: any[]) {
    const messages = errors.map((error) => error?.message ?? String(error));
    super(`${errors.length} errors: ${messages.join('; ')}`);
  }
}
