import { describe, it, expect } from 'vitest';
import {
  isValidDieType,
  isValidDiceCount,
  isValidNotation,
  getValidDieTypes,
} from '../../src/validators';

describe('Validators', () => {
  describe('isValidDieType', () => {
    it('should return true for valid die types', () => {
      expect(isValidDieType(4)).toBe(true);
      expect(isValidDieType(6)).toBe(true);
      expect(isValidDieType(8)).toBe(true);
      expect(isValidDieType(10)).toBe(true);
      expect(isValidDieType(12)).toBe(true);
      expect(isValidDieType(20)).toBe(true);
      expect(isValidDieType(100)).toBe(true);
    });

    it('should return false for invalid die types', () => {
      expect(isValidDieType(3)).toBe(false);
      expect(isValidDieType(5)).toBe(false);
      expect(isValidDieType(7)).toBe(false);
      expect(isValidDieType(13)).toBe(false);
      expect(isValidDieType(50)).toBe(false);
    });
  });

  describe('isValidDiceCount', () => {
    it('should return true for valid dice counts', () => {
      expect(isValidDiceCount(1)).toBe(true);
      expect(isValidDiceCount(10)).toBe(true);
      expect(isValidDiceCount(50)).toBe(true);
      expect(isValidDiceCount(100)).toBe(true);
    });

    it('should return false for dice count below minimum', () => {
      expect(isValidDiceCount(0)).toBe(false);
      expect(isValidDiceCount(-1)).toBe(false);
    });

    it('should return false for dice count above maximum', () => {
      expect(isValidDiceCount(101)).toBe(false);
      expect(isValidDiceCount(1000)).toBe(false);
    });
  });

  describe('isValidNotation', () => {
    it('should return true for valid notation without modifier', () => {
      expect(isValidNotation('1d4')).toBe(true);
      expect(isValidNotation('2d6')).toBe(true);
      expect(isValidNotation('3d8')).toBe(true);
      expect(isValidNotation('1d20')).toBe(true);
      expect(isValidNotation('5d100')).toBe(true);
    });

    it('should return true for valid notation with positive modifier', () => {
      expect(isValidNotation('2d6+3')).toBe(true);
      expect(isValidNotation('1d20+5')).toBe(true);
      expect(isValidNotation('3d8+10')).toBe(true);
    });

    it('should return true for valid notation with negative modifier', () => {
      expect(isValidNotation('2d6-3')).toBe(true);
      expect(isValidNotation('1d20-2')).toBe(true);
    });

    it('should handle whitespace', () => {
      expect(isValidNotation('  2d6  ')).toBe(true);
      expect(isValidNotation('  1d20+3  ')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(isValidNotation('2D6')).toBe(true);
      expect(isValidNotation('1D20+3')).toBe(true);
    });

    it('should return false for invalid format', () => {
      expect(isValidNotation('abc')).toBe(false);
      expect(isValidNotation('2x6')).toBe(false);
      expect(isValidNotation('d20')).toBe(false);
      expect(isValidNotation('2d')).toBe(false);
      expect(isValidNotation('2d6d8')).toBe(false);
    });

    it('should return false for invalid die type', () => {
      expect(isValidNotation('2d7')).toBe(false);
      expect(isValidNotation('1d13')).toBe(false);
      expect(isValidNotation('3d50')).toBe(false);
    });

    it('should return false for invalid dice count', () => {
      expect(isValidNotation('0d6')).toBe(false);
      expect(isValidNotation('101d6')).toBe(false);
      expect(isValidNotation('-1d6')).toBe(false);
    });
  });

  describe('getValidDieTypes', () => {
    it('should return array of valid die types', () => {
      const types = getValidDieTypes();
      expect(types).toEqual([4, 6, 8, 10, 12, 20, 100]);
    });

    it('should return readonly array', () => {
      const types = getValidDieTypes();
      expect(Object.isFrozen(types)).toBe(true);
    });
  });
});
