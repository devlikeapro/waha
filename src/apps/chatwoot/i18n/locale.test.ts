import { i18n } from '@waha/apps/chatwoot/i18n/index';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';

const enLocale = i18n.locale('en-US');
// @ts-ignore
enLocale.strings.datetime.timeZone = 'America/New_York';
const ptBrLocale = i18n.locale('pt-BR');
// @ts-ignore
ptBrLocale.strings.datetime.timeZone = 'America/Sao_Paulo';

describe('Locale', () => {
  describe('FormatHumanDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats dates occurring today with the Today prefix', () => {
      const now = new Date('2024-03-15T10:30:00Z');

      jest.setSystemTime(now);

      const result = enLocale.FormatHumanDate(new Date(now));

      expect(result).toBe('Today, Mar 15 • 06:30 AM EDT');
    });

    it('formats dates occurring yesterday with the Yesterday prefix', () => {
      const now = new Date('2024-03-15T10:30:00Z');
      const yesterday = new Date('2024-03-14T10:30:00Z');

      jest.setSystemTime(now);

      const result = enLocale.FormatHumanDate(yesterday);

      expect(result).toBe('Yesterday, Mar 14 • 06:30 AM EDT');
    });

    it('formats dates from the current year without the year', () => {
      const now = new Date('2024-05-01T09:00:00Z');
      const date = new Date('2024-02-10T14:45:00Z');

      jest.setSystemTime(now);

      const result = enLocale.FormatHumanDate(date);

      expect(result).toBe('Sat, Feb 10 • 09:45 AM EST');
    });

    it('formats dates from previous years including the year', () => {
      const now = new Date('2024-05-01T09:00:00Z');
      const date = new Date('2023-07-10T12:15:00Z');

      jest.setSystemTime(now);

      const result = enLocale.FormatHumanDate(date);

      expect(result).toBe('Mon, Jul 10, 2023 • 08:15 AM EDT');
    });
  });

  describe('FormatHumanDate (pt-BR)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('uses localized Today and Yesterday labels', () => {
      const now = new Date('2024-03-15T10:30:00Z');
      const yesterday = new Date('2024-03-14T10:30:00Z');

      jest.setSystemTime(now);

      const todayResult = ptBrLocale.FormatHumanDate(now);
      const yesterdayResult = ptBrLocale.FormatHumanDate(yesterday);

      expect(todayResult).toBe('Hoje, 15 de mar. • 07:30 BRT');
      expect(yesterdayResult).toBe('Ontem, 14 de mar. • 07:30 BRT');
    });
  });

  describe('whatsapp.group.message', () => {
    it('renders the member tag under the participant', () => {
      const result = enLocale.key(TKey.WHATSAPP_GROUP_MESSAGE).render({
        text: 'Hello',
        participant: 'John (123456789@lid)',
        tag: 'Manager',
      });

      expect(result).toBe('👥 *John (123456789@lid)*\n`Manager`\n\nHello');
    });

    it('renders my member tag under the from line', () => {
      const result = enLocale.key(TKey.MESSAGE_FROM_WHATSAPP).render({
        text: 'Hello',
        tag: 'Manager',
      });

      expect(result).toBe('*📱 Sent from WhatsApp*\n`Manager`\n\nHello');
    });

    it('renders the from line without a tag as before', () => {
      const result = enLocale.key(TKey.MESSAGE_FROM_WHATSAPP).render({
        text: 'Hello',
      });

      expect(result).toBe('*📱 Sent from WhatsApp*\n\nHello');
    });

    it('renders my member tag above my message', () => {
      const result = enLocale.key(TKey.WHATSAPP_GROUP_MESSAGE_FROM_ME).render({
        text: 'Hello',
        tag: 'Manager',
      });

      expect(result).toBe('`Manager`\n\nHello');
    });

    it('renders my message as is without a member tag', () => {
      const result = enLocale.key(TKey.WHATSAPP_GROUP_MESSAGE_FROM_ME).render({
        text: 'Hello',
      });

      expect(result).toBe('Hello');
    });

    it('renders no tag line without a member tag', () => {
      const result = enLocale.key(TKey.WHATSAPP_GROUP_MESSAGE).render({
        text: 'Hello',
        participant: 'John (123456789@lid)',
      });

      expect(result).toBe('👥 *John (123456789@lid)*\n\nHello');
    });
  });
});
