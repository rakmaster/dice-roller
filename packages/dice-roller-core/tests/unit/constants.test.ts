import { describe, it, expect } from 'vitest';
import { DIE_TYPES, MIN_DICE_COUNT, MAX_DICE_COUNT, DICE_NOTATION_REGEX } from '../../src/constants';

describe('Constants', () => {
  describe('DIE_TYPES', () => {
    it('should contain all standard RPG die types', () => {
      expect(DIE_TYPES).toEqual([4, 6, 8, 10, 12, 20, 100]);
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(DIE_TYPES)).toBe(true);
    });
  });

  describe('MIN_DICE_COUNT', () => {
    it('should be 1', () => {
      expect(MIN_DICE_COUNT).toBe(1);
    });
  });

  describe('MAX_DICE_COUNT', () => {
    it('should be 100', () => {
      expect(MAX_DICE_COUNT).toBe(100);
    });
  });

  describe('DICE_NOTATION_REGEX', () => {
    it('should match valid dice notation without modifier', () => {
      expect(DICE_NOTATION_REGEX.test('2d6')).toBe(true);
      expect(DICE_NOTATION_REGEX.test('1d20')).toBe(true);
      expect(DICE_NOTATION_REGEX.test('10d10')).toBe(true);
    });

    it('should match valid dice notation with positive modifier', () => {
      expect(DICE_NOTATION_REGEX.test('2d6+3')).toBe(true);
      expect(DICE_NOTATION_REGEX.test('1d20+5')).toBe(true);
    });

    it('should match valid dice notation with negative modifier', () => {
      expect(DICE_NOTATION_REGEX.test('2d6-3')).toBe(true);
      expect(DICE_NOTATION_REGEX.test('1d20-2')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(DICE_NOTATION_REGEX.test('2D6')).toBe(true);
      expect(DICE_NOTATION_REGEX.test('1D20+3')).toBe(true);
    });

    it('should not match invalid notation', () => {
      expect(DICE_NOTATION_REGEX.test('abc')).toBe(false);
      expect(DICE_NOTATION_REGEX.test('2x6')).toBe(false);
      expect(DICE_NOTATION_REGEX.test('d20')).toBe(false);
      expect(DICE_NOTATION_REGEX.test('2d')).toBe(false);
    });
  });
});
