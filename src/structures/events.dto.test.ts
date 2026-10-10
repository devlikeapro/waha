import { EventMessageRequest } from '@waha/structures/events.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

async function problems(body: any): Promise<string[]> {
  const errors = await validate(plainToInstance(EventMessageRequest, body));
  const paths: string[] = [];
  const walk = (list: any[], prefix: string) => {
    for (const error of list) {
      const path = prefix + error.property;
      if (error.constraints) paths.push(path);
      walk(error.children ?? [], path + '.');
    }
  };
  walk(errors, '');
  return paths.sort();
}

const CHAT = '123456789@c.us';

describe('EventMessageRequest validation', () => {
  it('checks the fields inside the event', async () => {
    expect(await problems({ chatId: CHAT, event: {} })).toEqual([
      'event.name',
      'event.startTime',
    ]);
  });

  it('requires the event itself', async () => {
    expect(await problems({ chatId: CHAT })).toEqual(['event']);
  });

  it('checks the event location too', async () => {
    const body = {
      chatId: CHAT,
      event: { name: 'Meeting', startTime: 1760000000, location: {} },
    };

    expect(await problems(body)).toEqual(['event.location.name']);
  });

  it('accepts a complete event', async () => {
    const body = {
      chatId: CHAT,
      event: { name: 'Meeting', startTime: 1760000000 },
    };

    expect(await problems(body)).toEqual([]);
  });
});
