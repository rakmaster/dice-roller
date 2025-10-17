import { describe, it, expect } from 'vitest';
import {
  parseDiceNotation,
  InvalidNotationError,
  InvalidDiceCountError,
  InvalidDieTypeError,
} from '../../src/parser';

describe('Parser', () => {
  describe('parseDiceNotation', () => {
    describe('valid notation without modifier', () => {
      it('should parse simple dice notation', () => {
        expect(parseDiceNotation('2d6')).toEqual({
          count: 2,
          sides: 6,
          modifier: 0,
        });
      });

      it('should parse single die', () => {
        expect(parseDiceNotation('1d20')).toEqual({
          count: 1,
          sides: 20,
          modifier: 0,
        });
      });

      it('should parse all valid die types', () => {
        expect(parseDiceNotation('1d4').sides).toBe(4);
        expect(parseDiceNotation('1d6').sides).toBe(6);
        expect(parseDiceNotation('1d8').sides).toBe(8);
        expect(parseDiceNotation('1d10').sides).toBe(10);
        expect(parseDiceNotation('1d12').sides).toBe(12);
        expect(parseDiceNotation('1d20').sides).toBe(20);
        expect(parseDiceNotation('1d100').sides).toBe(100);
      });

      it('should parse large dice counts', () => {
        expect(parseDiceNotation('100d6')).toEqual({
          count: 100,
          sides: 6,
          modifier: 0,
        });
      });
    });

    describe('valid notation with modifier', () => {
      it('should parse positive modifier', () => {
        expect(parseDiceNotation('2d6+3')).toEqual({
          count: 2,
          sides: 6,
          modifier: 3,
        });
      });

      it('should parse negative modifier', () => {
        expect(parseDiceNotation('2d6-3')).toEqual({
          count: 2,
          sides: 6,
          modifier: -3,
        });
      });

      it('should parse large modifiers', () => {
        expect(parseDiceNotation('1d20+10').modifier).toBe(10);
        expect(parseDiceNotation('1d20-15').modifier).toBe(-15);
      });
    });

    describe('whitespace handling', () => {
      it('should trim leading whitespace', () => {
        expect(parseDiceNotation('  2d6')).toEqual({
          count: 2,
          sides: 6,
          modifier: 0,
        });
      });

      it('should trim trailing whitespace', () => {
        expect(parseDiceNotation('2d6  ')).toEqual({
          count: 2,
          sides: 6,
          modifier: 0,
        });
      });

      it('should trim both leading and trailing whitespace', () => {
        expect(parseDiceNotation('  2d6+3  ')).toEqual({
          count: 2,
          sides: 6,
          modifier: 3,
        });
      });
    });

    describe('case insensitivity', () => {
      it('should parse uppercase D', () => {
        expect(parseDiceNotation('2D6')).toEqual({
          count: 2,
          sides: 6,
          modifier: 0,
        });
      });

      it('should parse mixed case', () => {
        expect(parseDiceNotation('2D6+3')).toEqual({
          count: 2,
          sides: 6,
          modifier: 3,
        });
      });
    });

    describe('error handling - invalid format', () => {
      it('should throw InvalidNotationError for invalid format', () => {
        expect(() => parseDiceNotation('abc')).toThrow(InvalidNotationError);
        expect(() => parseDiceNotation('2x6')).toThrow(InvalidNotationError);
        expect(() => parseDiceNotation('d20')).toThrow(InvalidNotationError);
        expect(() => parseDiceNotation('2d')).toThrow(InvalidNotationError);
      });

      it('should include notation in error message', () => {
        expect(() => parseDiceNotation('abc')).toThrow('Invalid dice notation "abc"');
      });
    });

    describe('error handling - invalid dice count', () => {
      it('should throw InvalidDiceCountError for zero dice', () => {
        expect(() => parseDiceNotation('0d6')).toThrow(InvalidDiceCountError);
      });

      it('should throw InvalidDiceCountError for negative dice', () => {
        expect(() => parseDiceNotation('-1d6')).toThrow(InvalidDiceCountError);
      });

      it('should throw InvalidDiceCountError for too many dice', () => {
        expect(() => parseDiceNotation('101d6')).toThrow(InvalidDiceCountError);
      });

      it('should include count in error message', () => {
        expect(() => parseDiceNotation('0d6')).toThrow('Invalid dice count 0');
      });
    });

    describe('error handling - invalid die type', () => {
      it('should throw InvalidDieTypeError for unsupported die types', () => {
        expect(() => parseDiceNotation('2d3')).toThrow(InvalidDieTypeError);
        expect(() => parseDiceNotation('2d7')).toThrow(InvalidDieTypeError);
        expect(() => parseDiceNotation('2d13')).toThrow(InvalidDieTypeError);
        expect(() => parseDiceNotation('2d50')).toThrow(InvalidDieTypeError);
      });

      it('should include die type in error message', () => {
        expect(() => parseDiceNotation('2d7')).toThrow('Invalid die type d7');
      });

      it('should list valid die types in error message', () => {
        expect(() => parseDiceNotation('2d7')).toThrow('d4, d6, d8, d10, d12, d20, d100');
      });
    });
  });

  describe('Error classes', () => {
    it('InvalidNotationError should have correct name', () => {
      const error = new InvalidNotationError('test', 'reason');
      expect(error.name).toBe('InvalidNotationError');
      expect(error).toBeInstanceOf(Error);
    });

    it('InvalidDiceCountError should have correct name', () => {
      const error = new InvalidDiceCountError(0);
      expect(error.name).toBe('InvalidDiceCountError');
      expect(error).toBeInstanceOf(Error);
    });

    it('InvalidDieTypeError should have correct name', () => {
      const error = new InvalidDieTypeError(7);
      expect(error.name).toBe('InvalidDieTypeError');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
