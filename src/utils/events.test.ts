import { EventWildUnmask } from './events';

enum TestEvents {
  MESSAGE = 'message',
  MESSAGE_ANY = 'message.any',
  MESSAGE_ACK = 'message.ack',
  GROUP_JOIN = 'group.join',
  GROUP_V2_JOIN = 'group.v2.join',
  STATE_CHANGE = 'state.change',
}

const WILD = [
  TestEvents.MESSAGE,
  TestEvents.MESSAGE_ANY,
  TestEvents.MESSAGE_ACK,
  TestEvents.GROUP_JOIN,
  TestEvents.GROUP_V2_JOIN,
];

describe('EventWildUnmask', () => {
  const unmask = new EventWildUnmask(TestEvents, WILD);

  it('should keep known events and remove duplicates', () => {
    const result = unmask.unmask(['message', 'message.any', 'message']);
    expect(result.events).toEqual(['message', 'message.any']);
    expect(result.unknown).toEqual([]);
  });

  it('should expand * to the wild list without reporting it as unknown', () => {
    const result = unmask.unmask(['*']);
    expect(result.events).toEqual(WILD);
    expect(result.unknown).toEqual([]);
  });

  it('should not include internal events in * but allow them explicitly', () => {
    expect(unmask.unmask(['*']).events).not.toContain('state.change');
    expect(unmask.unmask(['state.change']).events).toEqual(['state.change']);
  });

  it('should expand prefix wildcards', () => {
    const result = unmask.unmask(['message.*']);
    expect(result.events).toEqual(['message.any', 'message.ack']);
    expect(result.unknown).toEqual([]);
  });

  it('should expand group.* including nested events', () => {
    const result = unmask.unmask(['group.*']);
    expect(result.events).toEqual(['group.join', 'group.v2.join']);
    expect(result.unknown).toEqual([]);
  });

  it('should not include internal events in prefix wildcards', () => {
    const result = unmask.unmask(['state.*']);
    expect(result.events).toEqual([]);
    expect(result.unknown).toEqual(['state.*']);
  });

  it('should report prefix wildcards with no matches as unknown', () => {
    const result = unmask.unmask(['nope.*']);
    expect(result.events).toEqual([]);
    expect(result.unknown).toEqual(['nope.*']);
  });

  it('should return unknown events without failing', () => {
    const result = unmask.unmask(['message', 'nope', 'invalid']);
    expect(result.events).toEqual(['message']);
    expect(result.unknown).toEqual(['nope', 'invalid']);
  });

  it('should combine *, prefixes, known and unknown events', () => {
    const result = unmask.unmask(['message.*', 'state.change', 'nope', 'nope']);
    expect(result.events).toEqual([
      'message.any',
      'message.ack',
      'state.change',
    ]);
    expect(result.unknown).toEqual(['nope']);
  });

  it('should expand * to all events when no wild list is given', () => {
    const all = new EventWildUnmask(TestEvents);
    const result = all.unmask(['*']);
    expect(result.events).toEqual(Object.values(TestEvents));
    expect(result.unknown).toEqual([]);
  });

  it('should return empty lists for empty input', () => {
    const result = unmask.unmask([]);
    expect(result.events).toEqual([]);
    expect(result.unknown).toEqual([]);
  });
});
