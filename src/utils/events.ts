/**
 * Unmask "*" in events list to exact values
 * Remove duplicates if any
 */
export class EventWildUnmask {
  constructor(
    private readonly events: string[] | any,
    private readonly all: string[] | any | null = null,
  ) {
    // in case of enum - convert to array
    this.events = Object.values(events);
    this.all = all ? Object.values(all) : this.events;
  }

  unmask(events: string[]): { events: string[]; unknown: string[] } {
    const rightEvents = [];
    const unknown = [];
    for (const event of events) {
      if (event === '*') {
        rightEvents.push(...this.all);
        continue;
      }
      // Prefix wildcard - 'message.*' matches everything starting with 'message.'
      if (event.includes('*')) {
        const prefix = event.split('*')[0];
        const matched = this.all.filter((known) => known.startsWith(prefix));
        if (matched.length === 0) {
          unknown.push(event);
          continue;
        }
        rightEvents.push(...matched);
        continue;
      }
      if (!this.events.includes(event)) {
        unknown.push(event);
        continue;
      }
      rightEvents.push(event);
    }
    // unique values, the caller decides what to do with unknown ones
    return {
      events: [...new Set(rightEvents)],
      unknown: [...new Set(unknown)],
    };
  }
}
