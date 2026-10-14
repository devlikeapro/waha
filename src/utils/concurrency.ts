/**
 * Maps the items with at most `limit` calls of fn running at once,
 * keeping the order of the items. Rejects as soon as a call rejects.
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index], index);
    }
  }
  const workers = [];
  for (let i = 0; i < Math.min(Math.max(limit, 1), items.length); i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}
