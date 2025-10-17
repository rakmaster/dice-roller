// Core functions
export { roll } from './roller';
export { parseDiceNotation } from './parser';

// Validators
export { isValidNotation, getValidDieTypes } from './validators';

// Types
export type {
  DieType,
  DiceNotation,
  RollResult,
  DetailedRollResult,
  RollOptions,
} from './types';

// Error classes
export {
  InvalidNotationError,
  InvalidDiceCountError,
  InvalidDieTypeError,
} from './parser';

// Constants
export {
  DIE_TYPES,
  MIN_DICE_COUNT,
  MAX_DICE_COUNT,
} from './constants';
