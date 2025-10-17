import { DICE_NOTATION_REGEX } from './constants';
import { isValidDiceCount, isValidDieType } from './validators';
import type { DiceNotation, DieType } from './types';

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

/**
 * Parse dice notation string into structured format
 * 
 * @param notation - Dice notation string (e.g., "2d6", "1d20", "3d8+3")
 * @returns Parsed dice notation
 * @throws {InvalidNotationError} If notation format is invalid
 * @throws {InvalidDiceCountError} If dice count is out of range
 * @throws {InvalidDieTypeError} If die type is not supported
 * 
 * @example
 * parseDiceNotation("2d6+3")
 * // Returns: { count: 2, sides: 6, modifier: 3 }
 */
export function parseDiceNotation(notation: string): DiceNotation {
  const trimmed = notation.trim();
  const match = DICE_NOTATION_REGEX.exec(trimmed);
  
  if (!match) {
    throw new InvalidNotationError(
      notation,
      'format must be XdY or XdY±Z (e.g., "2d6", "1d20+3", "3d8-2")'
    );
  }
  
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  
  // Validate dice count
  if (!isValidDiceCount(count)) {
    throw new InvalidDiceCountError(count);
  }
  
  // Validate die type
  if (!isValidDieType(sides)) {
    throw new InvalidDieTypeError(sides);
  }
  
  return {
    count,
    sides: sides as DieType,
    modifier,
  };
}
