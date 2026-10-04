// Type definitions for bidi-js
// A JavaScript implementation of the Unicode Bidirectional Algorithm

/**
 * One of the 23 Unicode bidirectional character type names, as returned by
 * {@link Bidi.getBidiCharTypeName}.
 */
export type BidiCharTypeName =
  | "L"
  | "R"
  | "EN"
  | "ES"
  | "ET"
  | "AN"
  | "CS"
  | "B"
  | "S"
  | "WS"
  | "ON"
  | "BN"
  | "NSM"
  | "AL"
  | "LRO"
  | "RLO"
  | "LRE"
  | "RLE"
  | "PDF"
  | "LRI"
  | "RLI"
  | "FSI"
  | "PDI";

/**
 * The resolved embedding levels for a string, as returned by
 * {@link Bidi.getEmbeddingLevels}.
 */
export interface EmbeddingLevels {
  /**
   * A `Uint8Array` holding the calculated bidi embedding level for each
   * character in the string. A character is in a right-to-left scope if its
   * level is an odd number, and left-to-right if it's even.
   */
  levels: Uint8Array;
  /**
   * One entry per paragraph in the text (paragraphs are separated by explicit
   * breaking characters, not soft line wrapping). The `start` and `end` indices
   * are inclusive, and `level` is the resolved base embedding level of that
   * paragraph.
   */
  paragraphs: Array<{ start: number; end: number; level: number }>;
}

/**
 * A `bidi` object exposing the methods for bidi processing, as returned by the
 * default-exported factory function.
 */
export interface Bidi {
  /**
   * Apply the Bidirectional Algorithm to a string, returning the resolved
   * embedding levels plus a list of each paragraph's start/end indices and
   * resolved base embedding level.
   *
   * @param string - The input string containing mixed-direction text.
   * @param baseDirection - Use `"ltr"` or `"rtl"` to force a base paragraph
   *   direction, otherwise a direction will be chosen automatically from each
   *   paragraph's contents.
   */
  getEmbeddingLevels(
    string: string,
    baseDirection?: "ltr" | "rtl" | "auto"
  ): EmbeddingLevels;

  /**
   * Given a start and end denoting a single line within a string, and a set of
   * precalculated bidi embedding levels, produce a list of `[start, end]`
   * segments whose ordering should be flipped, in sequence.
   *
   * @param string - The full input string.
   * @param embeddingLevelsResult - The result object from
   *   {@link Bidi.getEmbeddingLevels}.
   * @param start - First character in a subset of the full string (inclusive).
   * @param end - Last character in a subset of the full string (inclusive).
   * @returns The list of start/end segments that should be flipped, in order.
   */
  getReorderSegments(
    string: string,
    embeddingLevelsResult: EmbeddingLevels,
    start?: number,
    end?: number
  ): number[][];

  /**
   * Given a string and its resolved embedding levels, return an array of
   * character indices in their new bidi order.
   *
   * @param string - The full input string.
   * @param embedLevelsResult - The result object from
   *   {@link Bidi.getEmbeddingLevels}.
   * @param start - First character in a subset of the full string (inclusive).
   * @param end - Last character in a subset of the full string (inclusive).
   */
  getReorderedIndices(
    string: string,
    embedLevelsResult: EmbeddingLevels,
    start?: number,
    end?: number
  ): number[];

  /**
   * Given a string and its resolved embedding levels, return a new string with
   * its bidi segments reordered (and right-to-left mirrored characters
   * swapped).
   *
   * @param string - The full input string.
   * @param embedLevelsResult - The result object from
   *   {@link Bidi.getEmbeddingLevels}.
   * @param start - First character in a subset of the full string (inclusive).
   * @param end - Last character in a subset of the full string (inclusive).
   */
  getReorderedString(
    string: string,
    embedLevelsResult: EmbeddingLevels,
    start?: number,
    end?: number
  ): string;

  /**
   * Get the bidi character type bit flag for a given character.
   */
  getBidiCharType(char: string): number;

  /**
   * Get the bidi character type name for a given character.
   */
  getBidiCharTypeName(char: string): BidiCharTypeName;

  /**
   * Get the mirrored character for a given character, if one exists, otherwise
   * `null`. Only meaningful for right-to-left characters (those whose embedding
   * level is an odd number).
   */
  getMirroredCharacter(char: string): string | null;

  /**
   * Given a string and its resolved embedding levels, build a map of indices to
   * replacement characters for any characters in right-to-left segments that
   * have defined mirrored characters.
   *
   * @param string - The full input string.
   * @param embeddingLevels - The `levels` array from
   *   {@link Bidi.getEmbeddingLevels}.
   * @param start - First character in a subset of the full string (inclusive).
   * @param end - Last character in a subset of the full string (inclusive).
   */
  getMirroredCharactersMap(
    string: string,
    embeddingLevels: Uint8Array,
    start?: number,
    end?: number
  ): Map<number, string>;

  /**
   * Get the opening bracket character corresponding to a given closing bracket
   * character, or `null` if there is none.
   */
  closingToOpeningBracket(char: string): string | null;

  /**
   * Get the closing bracket character corresponding to a given opening bracket
   * character, or `null` if there is none.
   */
  openingToClosingBracket(char: string): string | null;

  /**
   * Retrieve the canonical form of a bracket character, or `null` if there is
   * none.
   */
  getCanonicalBracket(char: string): string | null;
}

/**
 * The `bidi-js` package's only export is this factory function, which you
 * _must invoke_ to return a `bidi` object exposing the methods for bidi
 * processing.
 *
 * The factory exists so the entire module's code is wrapped within a single
 * self-contained function with no closure dependencies, which enables that
 * function to be stringified and passed into a web worker.
 */
export default function bidiFactory(): Bidi;
