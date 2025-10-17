/**
 * API Contracts for Dice Roller Core Library
 * 
 * These TypeScript interfaces define the public API surface.
 * All implementations must conform to these contracts.
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Valid die types in standard RPG sets
 */
export type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

/**
 * Parsed dice notation
 * 
 * @example
 * { count: 2, sides: 6, modifier: 3 } // "2d6+3"
 * { count: 1, sides: 20, modifier: 0 } // "1d20"
 * { count: 3, sides: 8, modifier: -2 } // "3d8-2"
 */
export interface DiceNotation {
  /** Number of dice to roll (1-100) */
  count: number;
  
  /** Number of sides on each die (4, 6, 8, 10, 12, 20, 100) */
  sides: DieType;
  
  /** Modifier to add/subtract from total (default: 0) */
  modifier: number;
}

/**
 * Simple roll result (P1, P2)
 * 
 * @example
 * { total: 11, notation: "2d6+3" }
 */
export interface RollResult {
  /** Final calculated result including modifier */
  total: number;
  
  /** Original notation string */
  notation: string;
}

/**
 * Detailed roll result with individual die values (P3)
 * 
 * @example
 * {
 *   rolls: [4, 6, 2],
 *   modifier: 3,
 *   total: 15,
 *   notation: "3d6+3"
 * }
 */
export interface DetailedRollResult {
  /** Individual die roll values */
  rolls: number[];
  
  /** The modifier applied */
  modifier: number;
  
  /** Final calculated result (sum of rolls + modifier) */
  total: number;
  
  /** Original notation string */
  notation: string;
}

/**
 * Options for configuring dice rolls
 */
export interface RollOptions {
  /** Optional seed for deterministic random number generation */
  seed?: number;
}

// ============================================================================
// Core Functions (User Story 1 - P1)
// ============================================================================

/**
 * Roll dice using standard RPG notation
 * 
 * @param notation - Dice notation string (e.g., "2d6", "1d20", "3d8")
 * @param options - Optional configuration
 * @returns Simple roll result with total
 * @throws {Error} If notation is invalid
 * 
 * @example
 * const result = roll("2d6");
 * console.log(result.total); // 2-12
 * 
 * @example
 * const result = roll("1d20", { seed: 12345 }); // Deterministic for testing
 */
export function roll(notation: string, options?: RollOptions): RollResult;

// ============================================================================
// Modifier Support (User Story 2 - P2)
// ============================================================================

/**
 * Roll dice with modifiers using standard RPG notation
 * 
 * @param notation - Dice notation with modifier (e.g., "2d6+3", "1d20-2")
 * @param options - Optional configuration
 * @returns Simple roll result with total including modifier
 * @throws {Error} If notation is invalid
 * 
 * @example
 * const result = roll("2d6+3");
 * console.log(result.total); // 5-15
 * 
 * @example
 * const result = roll("1d20-2");
 * console.log(result.total); // -1 to 18
 */
// Note: Same function signature as P1, modifier support is built-in

// ============================================================================
// Detailed Results (User Story 3 - P3)
// ============================================================================

/**
 * Roll dice and return detailed results with individual die values
 * 
 * @param notation - Dice notation string (e.g., "3d6+3", "2d8-1")
 * @param options - Optional configuration
 * @returns Detailed roll result with individual rolls, modifier, and total
 * @throws {Error} If notation is invalid
 * 
 * @example
 * const result = rollDetailed("3d6+3");
 * console.log(result.rolls);    // [4, 6, 2]
 * console.log(result.modifier); // 3
 * console.log(result.total);    // 15
 * 
 * @example
 * // Deterministic roll for testing
 * const result = rollDetailed("2d6", { seed: 12345 });
 */
export function rollDetailed(
  notation: string,
  options?: RollOptions
): DetailedRollResult;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Parse dice notation string into structured format
 * 
 * @param notation - Dice notation string
 * @returns Parsed dice notation
 * @throws {Error} If notation is invalid
 * 
 * @example
 * const parsed = parseDiceNotation("2d6+3");
 * // { count: 2, sides: 6, modifier: 3 }
 */
export function parseDiceNotation(notation: string): DiceNotation;

/**
 * Validate dice notation string
 * 
 * @param notation - Dice notation string to validate
 * @returns true if valid, false otherwise
 * 
 * @example
 * isValidNotation("2d6+3");  // true
 * isValidNotation("2x6");    // false
 * isValidNotation("abc");    // false
 */
export function isValidNotation(notation: string): boolean;

/**
 * Get valid die types
 * 
 * @returns Array of valid die types
 * 
 * @example
 * const types = getValidDieTypes();
 * // [4, 6, 8, 10, 12, 20, 100]
 */
export function getValidDieTypes(): readonly DieType[];

// ============================================================================
// Error Types
// ============================================================================

/**
 * Error thrown when dice notation is invalid
 */
export class InvalidNotationError extends Error {
  constructor(notation: string, reason: string) {
    super(`Invalid dice notation "${notation}": ${reason}`);
    this.name = 'InvalidNotationError';
  }
}

/**
 * Error thrown when dice count is out of range
 */
export class InvalidDiceCountError extends Error {
  constructor(count: number) {
    super(`Invalid dice count ${count}: must be between 1 and 100`);
    this.name = 'InvalidDiceCountError';
  }
}

/**
 * Error thrown when die type is not supported
 */
export class InvalidDieTypeError extends Error {
  constructor(sides: number) {
    super(
      `Invalid die type d${sides}: must be one of d4, d6, d8, d10, d12, d20, d100`
    );
    this.name = 'InvalidDieTypeError';
  }
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Valid die types
 */
export const DIE_TYPES: readonly DieType[] = [4, 6, 8, 10, 12, 20, 100];

/**
 * Minimum number of dice that can be rolled
 */
export const MIN_DICE_COUNT = 1;

/**
 * Maximum number of dice that can be rolled
 */
export const MAX_DICE_COUNT = 100;

/**
 * Regular expression for parsing dice notation
 */
export const DICE_NOTATION_REGEX = /^(\d+)d(\d+)([+-]\d+)?$/i;
