import {
  getWebjsAckReason,
  getWebjsMessageAck,
} from './ack.webjs';

describe('WebJS message acknowledgements', () => {
  it('prefers the acknowledgement emitted with the event', () => {
    expect(getWebjsMessageAck({ ack: 2 }, -1)).toBe(-1);
  });

  it('extracts a bounded error message for failed sends', () => {
    expect(
      getWebjsAckReason(
        { rawData: { error: { message: 'recipient is not available' } } },
        -1,
      ),
    ).toBe('recipient is not available');
  });

  it('provides a useful fallback when WebJS gives no error detail', () => {
    expect(getWebjsAckReason({ rawData: {} }, -1)).toBe(
      'WhatsApp returned ACK_ERROR before delivery',
    );
  });

  it('does not add a reason for successful acknowledgements', () => {
    expect(getWebjsAckReason({ rawData: { error: 'stale error' } }, 2)).toBe(
      undefined,
    );
  });
});
