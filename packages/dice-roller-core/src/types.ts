import { DIE_TYPES } from './constants';

/**
 * Valid die types in standard RPG sets
 */
export type DieType = typeof DIE_TYPES[number];

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
 * Simple roll result
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
 * Detailed roll result with individual die values
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
