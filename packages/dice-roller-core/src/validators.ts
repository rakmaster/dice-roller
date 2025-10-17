import { DIE_TYPES, MIN_DICE_COUNT, MAX_DICE_COUNT, DICE_NOTATION_REGEX } from './constants';
import type { DieType } from './types';

/**
 * Check if a value is a valid die type
 */
export function isValidDieType(sides: number): sides is DieType {
  return DIE_TYPES.includes(sides as DieType);
}

/**
 * Check if dice count is within valid range
 */
export function isValidDiceCount(count: number): boolean {
  return count >= MIN_DICE_COUNT && count <= MAX_DICE_COUNT;
}

/**
 * Validate dice notation string format
 * 
 * @param notation - Dice notation string to validate
 * @returns true if valid, false otherwise
 */
export function isValidNotation(notation: string): boolean {
  const trimmed = notation.trim();
  const match = DICE_NOTATION_REGEX.exec(trimmed);
  
  if (!match) {
    return false;
  }
  
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  
  return isValidDiceCount(count) && isValidDieType(sides);
}

/**
 * Get list of valid die types
 */
export function getValidDieTypes(): readonly DieType[] {
  return DIE_TYPES;
}
