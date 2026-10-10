import { extractInteractiveBody } from '@waha/core/engines/noweb/interactive.body';

describe('extractInteractiveBody', () => {
  it('joins header title, body and footer of a buttons message', () => {
    const interactive = {
      header: { title: 'Order 123' },
      body: { text: 'Confirm your order?' },
      footer: { text: 'Test store' },
      nativeFlowMessage: { buttons: [] },
    };

    expect(extractInteractiveBody(interactive)).toBe(
      'Order 123\nConfirm your order?\nTest store',
    );
  });

  it('adds the title and body of each carousel card, as NOWEB carries them', () => {
    const interactive = {
      body: { text: 'Pick a product' },
      carouselMessage: {
        cards: [
          { header: { title: 'Product A' }, body: { text: '$10' } },
          { body: { text: '$20' } },
        ],
      },
    };

    expect(extractInteractiveBody(interactive)).toBe(
      'Pick a product\nProduct A\n$10\n$20',
    );
  });

  it('reads the carousel cards where GOWS carries them', () => {
    const interactive = {
      body: { text: 'Pick a product' },
      InteractiveMessage: {
        CarouselMessage: {
          cards: [{ body: { text: '$10' } }, { body: { text: '$20' } }],
        },
      },
    };

    expect(extractInteractiveBody(interactive)).toBe(
      'Pick a product\n$10\n$20',
    );
  });

  it('is null when there is no text, as in a payment message', () => {
    const payment = {
      InteractiveMessage: { NativeFlowMessage: { buttons: [{}] } },
    };

    expect(extractInteractiveBody(payment)).toBeNull();
    expect(extractInteractiveBody(undefined)).toBeNull();
  });
});
