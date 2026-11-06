export class ProxyTimeoutError extends Error {}

/**
 * The proxy answered the CONNECT itself (407, 403, 502...) instead of opening the tunnel
 */
export class ProxyAnswerError extends Error {
  constructor(public statusCode: number) {
    super(`The proxy answered ${statusCode}`);
  }
}
