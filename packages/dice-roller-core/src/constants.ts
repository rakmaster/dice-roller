/**
 * Valid die types in standard RPG sets
 */
export const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;

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
 * Format: XdY or XdY+Z or XdY-Z
 * Where X = dice count, Y = die type, Z = modifier
 */
export const DICE_NOTATION_REGEX = /^(\d+)d(\d+)([+-]\d+)?$/i;
