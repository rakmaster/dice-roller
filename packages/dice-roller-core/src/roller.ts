import { parseDiceNotation } from './parser';
import { createSeededRandom, defaultRandom, randomInt } from './random';
import type { RollResult, RollOptions } from './types';

/**
 * Roll dice using standard RPG notation
 * 
 * @param notation - Dice notation string (e.g., "2d6", "1d20", "3d8+3")
 * @param options - Optional configuration (seed for deterministic rolls)
 * @returns Roll result with total
 * @throws {InvalidNotationError} If notation is invalid
 * @throws {InvalidDiceCountError} If dice count is out of range
 * @throws {InvalidDieTypeError} If die type is not supported
 * 
 * @example
 * const result = roll("2d6+3");
 * console.log(result.total); // 5-15
 * 
 * @example
 * // Deterministic roll for testing
 * const result = roll("1d20", { seed: 12345 });
 */
export function roll(notation: string, options?: RollOptions): RollResult {
  const parsed = parseDiceNotation(notation);
  
  // Setup RNG
  const rng = options?.seed !== undefined 
    ? createSeededRandom(options.seed)
    : defaultRandom;
  
  // Roll dice
  let total = 0;
  for (let i = 0; i < parsed.count; i++) {
    total += randomInt(1, parsed.sides, rng);
  }
  
  // Apply modifier
  total += parsed.modifier;
  
  return {
    total,
    notation: notation.trim(),
  };
}
