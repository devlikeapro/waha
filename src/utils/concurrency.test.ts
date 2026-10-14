import { mapWithConcurrency } from '@waha/utils/concurrency';

describe('mapWithConcurrency', () => {
  it('keeps the order and never runs more than the limit at once', async () => {
    let running = 0;
    let most = 0;
    const result = await mapWithConcurrency(
      [50, 10, 30, 0, 20, 5, 15],
      3,
      async (delay, index) => {
        running += 1;
        most = Math.max(most, running);
        await new Promise((resolve) => setTimeout(resolve, delay));
        running -= 1;
        return `${index}:${delay}`;
      },
    );

    expect(result).toEqual([
      '0:50',
      '1:10',
      '2:30',
      '3:0',
      '4:20',
      '5:5',
      '6:15',
    ]);
    expect(most).toBe(3);
  });

  it('handles no item and a limit above the count', async () => {
    expect(await mapWithConcurrency([], 5, async (x) => x)).toEqual([]);
    expect(await mapWithConcurrency([1, 2], 10, async (x) => x * 2)).toEqual([
      2, 4,
    ]);
  });

  it('rejects when a call rejects', async () => {
    await expect(
      mapWithConcurrency([1, 2, 3], 2, async (x) => {
        if (x === 2) {
          throw new Error('boom');
        }
        return x;
      }),
    ).rejects.toThrow('boom');
  });
});
