/**
 * Tests for FaceRecognitionService - NO MOCKS
 * Tests pure functions directly by calling real implementation.
 */
import { 
  isValidEmbedding, 
  toVectorLiteral, 
  THRESHOLDS, 
  sanitizeName, 
  buildVectorSql,
  calculateConsensus,
  isWithinCorrectionWindow,
  determineVoteAction,
  ConsensusResult
} from '../face-recognition.service';

describe('Face Recognition Pure Functions (No Mocks)', () => {
  describe('isValidEmbedding', () => {
    it('accepts valid 512-dim embedding', () => {
      const valid = Array(512).fill(0).map((_, i) => Math.sin(i) * 0.1);
      expect(isValidEmbedding(valid)).toBe(true);
    });

    it('rejects 256-dim embedding', () => {
      expect(isValidEmbedding(Array(256).fill(0.1))).toBe(false);
    });

    it('rejects 1024-dim embedding', () => {
      expect(isValidEmbedding(Array(1024).fill(0.1))).toBe(false);
    });

    it('rejects embedding with NaN', () => {
      const withNaN = Array(512).fill(0.1);
      withNaN[0] = NaN;
      expect(isValidEmbedding(withNaN)).toBe(false);
    });

    it('rejects embedding with Infinity', () => {
      const withInf = Array(512).fill(0.1);
      withInf[100] = Infinity;
      expect(isValidEmbedding(withInf)).toBe(false);
    });

    it('rejects embedding with -Infinity', () => {
      const withNegInf = Array(512).fill(0.1);
      withNegInf[50] = -Infinity;
      expect(isValidEmbedding(withNegInf)).toBe(false);
    });

    it('rejects embedding with string values', () => {
      const withString = Array(512).fill(0.1);
      (withString as unknown[])[0] = '0.1';
      expect(isValidEmbedding(withString)).toBe(false);
    });

    it('rejects null', () => {
      expect(isValidEmbedding(null)).toBe(false);
    });

    it('rejects undefined', () => {
      expect(isValidEmbedding(undefined)).toBe(false);
    });

    it('rejects empty array', () => {
      expect(isValidEmbedding([])).toBe(false);
    });

    it('accepts embedding with zero values', () => {
      const zeros = Array(512).fill(0);
      expect(isValidEmbedding(zeros)).toBe(true);
    });

    it('accepts embedding with negative values', () => {
      const negative = Array(512).fill(-0.5);
      expect(isValidEmbedding(negative)).toBe(true);
    });
  });

  describe('toVectorLiteral', () => {
    it('converts embedding to pgvector format', () => {
      const embedding = [0.1, 0.2, 0.3];
      expect(toVectorLiteral(embedding)).toBe('[0.1,0.2,0.3]');
    });

    it('handles negative values', () => {
      expect(toVectorLiteral([-0.5, 0.5])).toBe('[-0.5,0.5]');
    });

    it('handles scientific notation', () => {
      const result = toVectorLiteral([1e-10, 1e10]);
      expect(result).toBe('[1e-10,10000000000]');
    });

    it('throws on NaN (SQL injection prevention)', () => {
      expect(() => toVectorLiteral([NaN, 0.1])).toThrow('Invalid embedding values');
    });

    it('throws on Infinity', () => {
      expect(() => toVectorLiteral([Infinity])).toThrow('Invalid embedding values');
    });

    it('throws on -Infinity', () => {
      expect(() => toVectorLiteral([-Infinity])).toThrow('Invalid embedding values');
    });

    it('handles empty array', () => {
      expect(toVectorLiteral([])).toBe('[]');
    });

    it('handles single element', () => {
      expect(toVectorLiteral([0.5])).toBe('[0.5]');
    });
  });

  describe('sanitizeName', () => {
    it('removes angle brackets', () => {
      expect(sanitizeName('John <script>')).toBe('John script');
    });

    it('removes quotes', () => {
      expect(sanitizeName("O'Brien")).toBe('OBrien');
      expect(sanitizeName('Say "Hello"')).toBe('Say Hello');
    });

    it('removes ampersand', () => {
      expect(sanitizeName('Tom & Jerry')).toBe('Tom  Jerry');
    });

    it('removes backslash', () => {
      expect(sanitizeName('path\\name')).toBe('pathname');
    });

    it('removes backticks', () => {
      expect(sanitizeName('test`injection')).toBe('testinjection');
    });

    it('trims whitespace', () => {
      expect(sanitizeName('  John Doe  ')).toBe('John Doe');
    });

    it('preserves normal names', () => {
      expect(sanitizeName('Alice Smith')).toBe('Alice Smith');
      expect(sanitizeName('José García')).toBe('José García');
    });

    it('returns empty string for all-special input', () => {
      expect(sanitizeName('<>&"\'')).toBe('');
    });

    it('handles mixed valid and invalid characters', () => {
      expect(sanitizeName('John<>Doe')).toBe('JohnDoe');
    });

    it('preserves numbers', () => {
      expect(sanitizeName('Worker 123')).toBe('Worker 123');
    });

    it('preserves hyphens and underscores', () => {
      expect(sanitizeName('Mary-Jane_Watson')).toBe('Mary-Jane_Watson');
    });

    it('removes javascript: protocol', () => {
      expect(sanitizeName('javascript:alert(1)')).toBe('alert(1)');
    });

    it('removes event handlers', () => {
      expect(sanitizeName('onclick=alert(1)')).toBe('alert(1)');
      expect(sanitizeName('onmouseover=hack')).toBe('hack');
    });

    it('removes control characters', () => {
      expect(sanitizeName('test\x00null')).toBe('testnull');
      expect(sanitizeName('test\x1Fcontrol')).toBe('testcontrol');
    });

    it('truncates to max length (100 chars)', () => {
      const longName = 'A'.repeat(150);
      expect(sanitizeName(longName)).toBe('A'.repeat(100));
    });
  });

  describe('buildVectorSql', () => {
    it('returns SQL fragment for valid embedding', () => {
      const embedding = Array(512).fill(0.1);
      const result = buildVectorSql(embedding);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('throws for invalid dimension embedding', () => {
      expect(() => buildVectorSql(Array(256).fill(0.1))).toThrow('Invalid embedding');
    });

    it('throws for embedding with NaN', () => {
      const withNaN = Array(512).fill(0.1);
      withNaN[0] = NaN;
      expect(() => buildVectorSql(withNaN)).toThrow('Invalid embedding');
    });

    it('throws for embedding with Infinity', () => {
      const withInf = Array(512).fill(0.1);
      withInf[0] = Infinity;
      expect(() => buildVectorSql(withInf)).toThrow('Invalid embedding');
    });

    it('throws for non-array input', () => {
      expect(() => buildVectorSql('not an array' as unknown as number[])).toThrow('Invalid embedding');
    });

    it('throws for null input', () => {
      expect(() => buildVectorSql(null as unknown as number[])).toThrow('Invalid embedding');
    });
  });

  describe('THRESHOLDS', () => {
    it('HIGH_CONFIDENCE is stricter than MEDIUM', () => {
      expect(THRESHOLDS.HIGH_CONFIDENCE).toBeLessThan(THRESHOLDS.MEDIUM_CONFIDENCE);
    });

    it('EMBEDDING_DIM is 512 (InsightFace standard)', () => {
      expect(THRESHOLDS.EMBEDDING_DIM).toBe(512);
    });

    it('HIGH_CONFIDENCE is positive', () => {
      expect(THRESHOLDS.HIGH_CONFIDENCE).toBeGreaterThan(0);
    });

    it('MEDIUM_CONFIDENCE is less than 1', () => {
      expect(THRESHOLDS.MEDIUM_CONFIDENCE).toBeLessThan(1);
    });
  });

  describe('calculateConsensus', () => {
    it('returns reached=true for single match', () => {
      const matches = [{ workerId: 1 }];
      const result = calculateConsensus(matches, 1);
      expect(result.reached).toBe(true);
      expect(result.bestVotes).toBe(1);
      expect(result.totalValid).toBe(1);
    });

    it('returns reached=true when no valid matches', () => {
      const matches = [{ workerId: null }, { workerId: null }];
      const result = calculateConsensus(matches, null);
      expect(result.reached).toBe(true);
      expect(result.totalValid).toBe(0);
    });

    it('returns reached=true when majority agrees (3 of 5)', () => {
      const matches = [
        { workerId: 1 },
        { workerId: 1 },
        { workerId: 1 },
        { workerId: 2 },
        { workerId: 3 },
      ];
      const result = calculateConsensus(matches, 1);
      expect(result.reached).toBe(true);
      expect(result.bestVotes).toBe(3);
      expect(result.totalValid).toBe(5);
    });

    it('returns reached=false when no majority (2 of 4 = 50%)', () => {
      const matches = [
        { workerId: 1 },
        { workerId: 1 },
        { workerId: 2 },
        { workerId: 2 },
      ];
      const result = calculateConsensus(matches, 1);
      expect(result.reached).toBe(false);
      expect(result.bestVotes).toBe(2);
    });

    it('returns reached=true when clear majority (3 of 4 = 75%)', () => {
      const matches = [
        { workerId: 1 },
        { workerId: 1 },
        { workerId: 1 },
        { workerId: 2 },
      ];
      const result = calculateConsensus(matches, 1);
      expect(result.reached).toBe(true);
    });

    it('returns reached=false when best match has minority', () => {
      const matches = [
        { workerId: 1 },
        { workerId: 2 },
        { workerId: 2 },
        { workerId: 2 },
      ];
      const result = calculateConsensus(matches, 1);
      expect(result.reached).toBe(false);
      expect(result.bestVotes).toBe(1);
    });

    it('handles mixed null and valid workerIds', () => {
      const matches = [
        { workerId: 1 },
        { workerId: 1 },
        { workerId: null },
        { workerId: 2 },
      ];
      const result = calculateConsensus(matches, 1);
      expect(result.reached).toBe(true);
      expect(result.totalValid).toBe(3); // null is excluded
    });

    it('returns reached=true for empty matches array', () => {
      const result = calculateConsensus([], null);
      expect(result.reached).toBe(true);
      expect(result.totalValid).toBe(0);
    });

    it('returns reached=true for single null match', () => {
      const result = calculateConsensus([{ workerId: null }], null);
      expect(result.reached).toBe(true);
      expect(result.totalValid).toBe(0);
    });

    it('provides voteCounts map for logging', () => {
      const matches = [
        { workerId: 1 },
        { workerId: 1 },
        { workerId: 2 },
        { workerId: 3 },
      ];
      const result = calculateConsensus(matches, 1);
      expect(result.voteCounts.get(1)).toBe(2);
      expect(result.voteCounts.get(2)).toBe(1);
      expect(result.voteCounts.get(3)).toBe(1);
    });
  });

  describe('isWithinCorrectionWindow', () => {
    const WINDOW_MS = 30 * 60 * 1000;

    it('returns true for recent timestamp', () => {
      const recent = new Date(Date.now() - 1000);
      expect(isWithinCorrectionWindow(recent, WINDOW_MS)).toBe(true);
    });

    it('returns false for old timestamp', () => {
      const old = new Date(Date.now() - 60 * 60 * 1000);
      expect(isWithinCorrectionWindow(old, WINDOW_MS)).toBe(false);
    });

    it('returns true at boundary', () => {
      const atBoundary = new Date(Date.now() - WINDOW_MS + 1000);
      expect(isWithinCorrectionWindow(atBoundary, WINDOW_MS)).toBe(true);
    });

    it('returns false just past boundary', () => {
      const pastBoundary = new Date(Date.now() - WINDOW_MS - 1000);
      expect(isWithinCorrectionWindow(pastBoundary, WINDOW_MS)).toBe(false);
    });

    it('returns true for current timestamp', () => {
      const now = new Date();
      expect(isWithinCorrectionWindow(now, WINDOW_MS)).toBe(true);
    });
  });
});

/**
 * Business Logic Tests - Testing decision logic.
 */
describe('Face Recognition Business Logic', () => {
  
  describe('processImage decision logic', () => {
    const HIGH_THRESHOLD = THRESHOLDS.HIGH_CONFIDENCE;
    const MEDIUM_THRESHOLD = THRESHOLDS.MEDIUM_CONFIDENCE;

    interface MatchResult {
      workerId: number | null;
      distance: number;
      workerName: string | null;
    }

    function determineAction(
      matches: MatchResult[],
      highThreshold: number,
      mediumThreshold: number
    ): { action: 'auto_confirm' | 'send_poll' | 'unknown'; workerId: number | null; consensus: boolean } {
      if (matches.length === 0) {
        return { action: 'unknown', workerId: null, consensus: false };
      }

      const bestMatch = matches[0];
      const consensusResult = calculateConsensus(matches, bestMatch.workerId);

      if (bestMatch.distance < highThreshold && consensusResult.reached) {
        return { action: 'auto_confirm', workerId: bestMatch.workerId, consensus: consensusResult.reached };
      } else if (bestMatch.distance < mediumThreshold) {
        return { action: 'send_poll', workerId: bestMatch.workerId, consensus: consensusResult.reached };
      }
      return { action: 'unknown', workerId: null, consensus: consensusResult.reached };
    }

    it('auto-confirms high confidence match with consensus', () => {
      const matches: MatchResult[] = [
        { workerId: 1, distance: 0.3, workerName: 'Alice' },
        { workerId: 1, distance: 0.35, workerName: 'Alice' },
        { workerId: 1, distance: 0.38, workerName: 'Alice' },
      ];
      const result = determineAction(matches, HIGH_THRESHOLD, MEDIUM_THRESHOLD);
      expect(result.action).toBe('auto_confirm');
      expect(result.workerId).toBe(1);
      expect(result.consensus).toBe(true);
    });

    it('sends poll for high confidence without consensus', () => {
      const matches: MatchResult[] = [
        { workerId: 1, distance: 0.3, workerName: 'Alice' },
        { workerId: 2, distance: 0.32, workerName: 'Bob' },
        { workerId: 2, distance: 0.35, workerName: 'Bob' },
      ];
      const result = determineAction(matches, HIGH_THRESHOLD, MEDIUM_THRESHOLD);
      expect(result.action).toBe('send_poll');
      expect(result.consensus).toBe(false);
    });

    it('sends poll for medium confidence match', () => {
      const matches: MatchResult[] = [
        { workerId: 1, distance: 0.5, workerName: 'Alice' },
      ];
      const result = determineAction(matches, HIGH_THRESHOLD, MEDIUM_THRESHOLD);
      expect(result.action).toBe('send_poll');
      expect(result.workerId).toBe(1);
    });

    it('returns unknown for low confidence match', () => {
      const matches: MatchResult[] = [
        { workerId: 1, distance: 0.7, workerName: 'Alice' },
      ];
      const result = determineAction(matches, HIGH_THRESHOLD, MEDIUM_THRESHOLD);
      expect(result.action).toBe('unknown');
      expect(result.workerId).toBe(null);
    });

    it('returns unknown for empty matches', () => {
      const result = determineAction([], HIGH_THRESHOLD, MEDIUM_THRESHOLD);
      expect(result.action).toBe('unknown');
    });

    it('handles boundary at high threshold', () => {
      const matches: MatchResult[] = [
        { workerId: 1, distance: 0.4, workerName: 'Alice' },
      ];
      const result = determineAction(matches, HIGH_THRESHOLD, MEDIUM_THRESHOLD);
      expect(result.action).toBe('send_poll');
    });

    it('handles boundary at medium threshold', () => {
      const matches: MatchResult[] = [
        { workerId: 1, distance: 0.6, workerName: 'Alice' },
      ];
      const result = determineAction(matches, HIGH_THRESHOLD, MEDIUM_THRESHOLD);
      expect(result.action).toBe('unknown');
    });
  });

  describe('processPollVote decision logic', () => {
    it('confirms on Yes vote', () => {
      expect(determineVoteAction("Yes, it's Alice")).toBe('confirm');
    });

    it('confirms on any Yes prefix', () => {
      expect(determineVoteAction('Yes')).toBe('confirm');
      expect(determineVoteAction('Yes, correct')).toBe('confirm');
    });

    it('rejects on No vote', () => {
      expect(determineVoteAction('No')).toBe('reject');
    });

    it('flags new person', () => {
      expect(determineVoteAction('New Person')).toBe('new_person');
    });

    it('returns invalid for unknown vote', () => {
      expect(determineVoteAction('Maybe')).toBe('invalid');
      expect(determineVoteAction('')).toBe('invalid');
    });

    it('is case sensitive for No', () => {
      expect(determineVoteAction('no')).toBe('invalid');
      expect(determineVoteAction('NO')).toBe('invalid');
    });

    it('handles whitespace-only vote', () => {
      expect(determineVoteAction('   ')).toBe('invalid');
    });

    it('handles partial matches correctly', () => {
      // Note: 'Yesterday' starts with 'Yes' so it matches - this is acceptable
      // because poll options are controlled by us and won't contain such strings
      expect(determineVoteAction('Yesterday')).toBe('confirm'); // startsWith('Yes') matches
      expect(determineVoteAction('Not sure')).toBe('invalid'); // 'No' requires exact match
    });

    it('trims whitespace before checking', () => {
      expect(determineVoteAction('  Yes  ')).toBe('confirm');
      expect(determineVoteAction('  No  ')).toBe('reject');
      expect(determineVoteAction('  New Person  ')).toBe('new_person');
    });

    it('returns invalid for empty string', () => {
      expect(determineVoteAction('')).toBe('invalid');
    });
  });

  describe('backfill logic', () => {
    interface PendingLog {
      id: number;
      embedding: number[];
      status: 'pending' | 'confirmed' | 'rejected';
    }

    function cosineDistance(a: number[], b: number[]): number {
      if (a.length !== b.length) return 1;
      let dot = 0, normA = 0, normB = 0;
      for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
      }
      const similarity = dot / (Math.sqrt(normA) * Math.sqrt(normB));
      return 1 - similarity;
    }

    function findBackfillCandidates(
      newEmbedding: number[],
      pendingLogs: PendingLog[],
      threshold: number
    ): number[] {
      return pendingLogs
        .filter(log => log.status === 'pending')
        .filter(log => cosineDistance(newEmbedding, log.embedding) < threshold)
        .map(log => log.id);
    }

    it('backfills similar pending logs', () => {
      const newEmbedding = Array(512).fill(0.1);
      const pendingLogs: PendingLog[] = [
        { id: 1, embedding: Array(512).fill(0.1), status: 'pending' },
        { id: 2, embedding: Array(512).fill(0.11), status: 'pending' },
        { id: 3, embedding: Array(512).fill(-0.5), status: 'pending' },
      ];

      const candidates = findBackfillCandidates(newEmbedding, pendingLogs, 0.6);
      expect(candidates).toContain(1);
      expect(candidates).toContain(2);
      expect(candidates).not.toContain(3);
    });

    it('ignores non-pending logs', () => {
      const newEmbedding = Array(512).fill(0.1);
      const pendingLogs: PendingLog[] = [
        { id: 1, embedding: Array(512).fill(0.1), status: 'confirmed' },
        { id: 2, embedding: Array(512).fill(0.1), status: 'rejected' },
        { id: 3, embedding: Array(512).fill(0.1), status: 'pending' },
      ];

      const candidates = findBackfillCandidates(newEmbedding, pendingLogs, 0.6);
      expect(candidates).toEqual([3]);
    });

    it('returns empty for no matches', () => {
      const newEmbedding = Array(512).fill(0.1);
      const pendingLogs: PendingLog[] = [
        { id: 1, embedding: Array(512).fill(-0.9), status: 'pending' },
      ];

      const candidates = findBackfillCandidates(newEmbedding, pendingLogs, 0.6);
      expect(candidates).toEqual([]);
    });
  });

  describe('correctLog time window logic', () => {
    interface LogEntry {
      id: number;
      timestamp: Date;
      workerName: string;
      status: 'auto' | 'confirmed' | 'pending' | 'rejected';
    }

    /**
     * Filters logs that can be corrected (both 'auto' and 'confirmed' statuses).
     */
    function filterCorrectableLogs(
      logs: LogEntry[],
      windowMs: number
    ): LogEntry[] {
      const cutoff = Date.now() - windowMs;
      return logs.filter(log => 
        (log.status === 'auto' || log.status === 'confirmed') && 
        log.timestamp.getTime() > cutoff
      );
    }

    function findLogToCorrect(
      logs: LogEntry[],
      wrongName?: string
    ): LogEntry | undefined {
      if (wrongName) {
        return logs.find(l => l.workerName.toLowerCase() === wrongName.toLowerCase());
      }
      return logs[0];
    }

    const WINDOW_MS = 30 * 60 * 1000;

    it('filters logs within time window', () => {
      const now = Date.now();
      const logs: LogEntry[] = [
        { id: 1, timestamp: new Date(now - 1000), workerName: 'Alice', status: 'confirmed' },
        { id: 2, timestamp: new Date(now - WINDOW_MS - 1000), workerName: 'Bob', status: 'confirmed' },
      ];

      const filtered = filterCorrectableLogs(logs, WINDOW_MS);
      expect(filtered.map(l => l.id)).toEqual([1]);
    });

    it('includes both auto and confirmed statuses', () => {
      const now = Date.now();
      const logs: LogEntry[] = [
        { id: 1, timestamp: new Date(now - 1000), workerName: 'Alice', status: 'auto' },
        { id: 2, timestamp: new Date(now - 1000), workerName: 'Bob', status: 'confirmed' },
        { id: 3, timestamp: new Date(now - 1000), workerName: 'Charlie', status: 'pending' },
        { id: 4, timestamp: new Date(now - 1000), workerName: 'Dave', status: 'rejected' },
      ];

      const filtered = filterCorrectableLogs(logs, WINDOW_MS);
      expect(filtered.map(l => l.id)).toEqual([1, 2]);
    });

    it('excludes pending and rejected statuses', () => {
      const now = Date.now();
      const logs: LogEntry[] = [
        { id: 1, timestamp: new Date(now - 1000), workerName: 'Alice', status: 'pending' },
        { id: 2, timestamp: new Date(now - 1000), workerName: 'Bob', status: 'rejected' },
      ];

      const filtered = filterCorrectableLogs(logs, WINDOW_MS);
      expect(filtered).toEqual([]);
    });

    it('finds log by wrong name (case insensitive)', () => {
      const logs: LogEntry[] = [
        { id: 1, timestamp: new Date(), workerName: 'Alice', status: 'confirmed' },
        { id: 2, timestamp: new Date(), workerName: 'Bob', status: 'confirmed' },
      ];

      expect(findLogToCorrect(logs, 'bob')?.id).toBe(2);
      expect(findLogToCorrect(logs, 'BOB')?.id).toBe(2);
      expect(findLogToCorrect(logs, 'Bob')?.id).toBe(2);
    });

    it('returns most recent when no wrong name specified', () => {
      const logs: LogEntry[] = [
        { id: 1, timestamp: new Date(), workerName: 'Alice', status: 'confirmed' },
        { id: 2, timestamp: new Date(), workerName: 'Bob', status: 'confirmed' },
      ];

      expect(findLogToCorrect(logs)?.id).toBe(1);
    });

    it('returns undefined when wrong name not found', () => {
      const logs: LogEntry[] = [
        { id: 1, timestamp: new Date(), workerName: 'Alice', status: 'confirmed' },
      ];

      expect(findLogToCorrect(logs, 'Charlie')).toBeUndefined();
    });

    it('returns undefined for empty logs', () => {
      expect(findLogToCorrect([], 'Alice')).toBeUndefined();
      expect(findLogToCorrect([])).toBeUndefined();
    });
  });
});
