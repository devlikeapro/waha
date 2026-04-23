/**
 * Tests for Evening Review Service - CSV generation
 */
import { generateAttendanceCsv, DailyLogEntry, parseMonthInput } from '../evening-review.service';

describe('Evening Review CSV Generation (No Mocks)', () => {
  const testDate = new Date('2026-02-05');

  describe('parseMonthInput', () => {
    const refDate = new Date('2026-06-15');

    it('parses full month name', () => {
      const result = parseMonthInput('January', refDate);
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(0);
      expect(result!.start.getFullYear()).toBe(2026);
      expect(result!.label).toContain('January');
    });

    it('parses abbreviated month name', () => {
      const result = parseMonthInput('Feb', refDate);
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(1);
    });

    it('parses month number', () => {
      const result = parseMonthInput('3', refDate);
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(2); // March
    });

    it('parses ISO format YYYY-MM', () => {
      const result = parseMonthInput('2025-12', refDate);
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(11);
      expect(result!.start.getFullYear()).toBe(2025);
    });

    it('is case insensitive', () => {
      expect(parseMonthInput('JANUARY', refDate)).not.toBeNull();
      expect(parseMonthInput('january', refDate)).not.toBeNull();
      expect(parseMonthInput('JaNuArY', refDate)).not.toBeNull();
    });

    it('returns null for invalid input', () => {
      expect(parseMonthInput('invalid', refDate)).toBeNull();
      expect(parseMonthInput('13', refDate)).toBeNull();
      expect(parseMonthInput('2026-13', refDate)).toBeNull();
      expect(parseMonthInput('', refDate)).toBeNull();
    });

    it('returns null for null/undefined input', () => {
      expect(parseMonthInput(null as unknown as string, refDate)).toBeNull();
      expect(parseMonthInput(undefined as unknown as string, refDate)).toBeNull();
    });

    it('returns null for very long input', () => {
      expect(parseMonthInput('a'.repeat(21), refDate)).toBeNull();
    });

    it('returns null for invalid year in ISO format', () => {
      expect(parseMonthInput('0000-01', refDate)).toBeNull();
      expect(parseMonthInput('99999-01', refDate)).toBeNull();
    });

    it('sets end date to last day of month', () => {
      const result = parseMonthInput('February', new Date('2026-01-01'));
      expect(result).not.toBeNull();
      expect(result!.end.getDate()).toBe(28); // 2026 is not a leap year
      expect(result!.end.getHours()).toBe(23);
      expect(result!.end.getMinutes()).toBe(59);
    });

    it('handles leap year February', () => {
      const result = parseMonthInput('2024-02', new Date('2024-01-01'));
      expect(result).not.toBeNull();
      expect(result!.end.getDate()).toBe(29); // 2024 is a leap year
    });

    it('trims whitespace', () => {
      const result = parseMonthInput('  March  ', refDate);
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(2);
    });
  });

  describe('generateAttendanceCsv', () => {
    it('generates header row', () => {
      const csv = generateAttendanceCsv([], testDate);
      expect(csv).toBe('ID,Timestamp,Worker Name,Company,Group/Chat,Status,Confidence');
    });

    it('generates rows for logs', () => {
      const logs: DailyLogEntry[] = [
        {
          id: 1,
          timestamp: new Date('2026-02-05T08:30:00Z'),
          status: 'confirmed',
          workerName: 'Alice',
          company: 'Acme Corp',
          groupId: 'group1@g.us',
          confidence: 0.25,
        },
      ];

      const csv = generateAttendanceCsv(logs, testDate);
      const lines = csv.split('\n');
      
      expect(lines).toHaveLength(2);
      expect(lines[1]).toContain('1,');
      expect(lines[1]).toContain('Alice');
      expect(lines[1]).toContain('Acme Corp');
      expect(lines[1]).toContain('confirmed');
      expect(lines[1]).toContain('75%'); // 1 - 0.25 = 0.75 = 75%
    });

    it('handles null values gracefully', () => {
      const logs: DailyLogEntry[] = [
        {
          id: 2,
          timestamp: null,
          status: null,
          workerName: null,
          company: null,
          groupId: 'chat@c.us',
          confidence: null,
        },
      ];

      const csv = generateAttendanceCsv(logs, testDate);
      const lines = csv.split('\n');
      
      expect(lines[1]).toContain('Unknown');
      expect(lines[1]).not.toContain('null');
    });

    it('escapes commas in fields', () => {
      const logs: DailyLogEntry[] = [
        {
          id: 3,
          timestamp: new Date('2026-02-05T09:00:00Z'),
          status: 'auto',
          workerName: 'Smith, John',
          company: 'Test, Inc.',
          groupId: 'group@g.us',
          confidence: 0.3,
        },
      ];

      const csv = generateAttendanceCsv(logs, testDate);
      
      expect(csv).toContain('"Smith, John"');
      expect(csv).toContain('"Test, Inc."');
    });

    it('escapes quotes in fields', () => {
      const logs: DailyLogEntry[] = [
        {
          id: 4,
          timestamp: new Date('2026-02-05T10:00:00Z'),
          status: 'confirmed',
          workerName: 'John "Johnny" Doe',
          company: 'Test',
          groupId: 'group@g.us',
          confidence: 0.2,
        },
      ];

      const csv = generateAttendanceCsv(logs, testDate);
      
      expect(csv).toContain('"John ""Johnny"" Doe"');
    });

    it('handles multiple logs', () => {
      const logs: DailyLogEntry[] = [
        { id: 1, timestamp: new Date(), status: 'auto', workerName: 'Alice', company: null, groupId: 'g1', confidence: 0.2 },
        { id: 2, timestamp: new Date(), status: 'confirmed', workerName: 'Bob', company: 'Corp', groupId: 'g2', confidence: 0.3 },
        { id: 3, timestamp: new Date(), status: 'pending', workerName: null, company: null, groupId: 'g3', confidence: null },
      ];

      const csv = generateAttendanceCsv(logs, testDate);
      const lines = csv.split('\n');
      
      expect(lines).toHaveLength(4); // header + 3 rows
    });

    it('calculates confidence percentage correctly', () => {
      const logs: DailyLogEntry[] = [
        { id: 1, timestamp: new Date(), status: 'auto', workerName: 'Test', company: null, groupId: 'g', confidence: 0.1 },
        { id: 2, timestamp: new Date(), status: 'auto', workerName: 'Test', company: null, groupId: 'g', confidence: 0.5 },
        { id: 3, timestamp: new Date(), status: 'auto', workerName: 'Test', company: null, groupId: 'g', confidence: 0.0 },
      ];

      const csv = generateAttendanceCsv(logs, testDate);
      
      expect(csv).toContain('90%'); // 1 - 0.1
      expect(csv).toContain('50%'); // 1 - 0.5
      expect(csv).toContain('100%'); // 1 - 0.0
    });

    it('handles newlines in fields', () => {
      const logs: DailyLogEntry[] = [
        {
          id: 5,
          timestamp: new Date(),
          status: 'confirmed',
          workerName: 'Line1\nLine2',
          company: null,
          groupId: 'g',
          confidence: 0.2,
        },
      ];

      const csv = generateAttendanceCsv(logs, testDate);
      
      expect(csv).toContain('"Line1\nLine2"');
    });

    it('handles unicode characters in names', () => {
      const logs: DailyLogEntry[] = [
        {
          id: 6,
          timestamp: new Date(),
          status: 'confirmed',
          workerName: '田中太郎',
          company: 'Société Générale',
          groupId: 'g',
          confidence: 0.2,
        },
      ];

      const csv = generateAttendanceCsv(logs, testDate);
      
      expect(csv).toContain('田中太郎');
      expect(csv).toContain('Société Générale');
    });
  });
});
