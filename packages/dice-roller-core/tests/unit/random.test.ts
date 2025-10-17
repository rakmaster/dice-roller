import { describe, it, expect } from 'vitest';
import { createSeededRandom, defaultRandom, randomInt } from '../../src/random';

describe('Random', () => {
  describe('createSeededRandom', () => {
    it('should generate deterministic values with same seed', () => {
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(12345);

      const values1 = Array.from({ length: 10 }, () => rng1());
      const values2 = Array.from({ length: 10 }, () => rng2());

      expect(values1).toEqual(values2);
    });

    it('should generate different values with different seeds', () => {
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(67890);

      const values1 = Array.from({ length: 10 }, () => rng1());
      const values2 = Array.from({ length: 10 }, () => rng2());

      expect(values1).not.toEqual(values2);
    });

    it('should generate values between 0 and 1', () => {
      const rng = createSeededRandom(12345);

      for (let i = 0; i < 100; i++) {
        const value = rng();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should generate different values on subsequent calls', () => {
      const rng = createSeededRandom(12345);
      const values = Array.from({ length: 10 }, () => rng());
      const uniqueValues = new Set(values);

      expect(uniqueValues.size).toBeGreaterThan(1);
    });
  });

  describe('defaultRandom', () => {
    it('should generate values between 0 and 1', () => {
      for (let i = 0; i < 100; i++) {
        const value = defaultRandom();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });

  describe('randomInt', () => {
    it('should generate integers within range', () => {
      const rng = createSeededRandom(12345);

      for (let i = 0; i < 100; i++) {
        const value = randomInt(1, 6, rng);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(6);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it('should generate deterministic values with seeded RNG', () => {
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(12345);

      const values1 = Array.from({ length: 10 }, () => randomInt(1, 20, rng1));
      const values2 = Array.from({ length: 10 }, () => randomInt(1, 20, rng2));

      expect(values1).toEqual(values2);
    });

    it('should work with default RNG when not provided', () => {
      for (let i = 0; i < 100; i++) {
        const value = randomInt(1, 6);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(6);
      }
    });

    it('should handle single value range', () => {
      const rng = createSeededRandom(12345);
      const value = randomInt(5, 5, rng);
      expect(value).toBe(5);
    });

    it('should generate all values in range over many iterations', () => {
      const rng = createSeededRandom(12345);
      const values = new Set<number>();

      for (let i = 0; i < 1000; i++) {
        values.add(randomInt(1, 6, rng));
      }

      // Should have generated all values 1-6
      expect(values.size).toBe(6);
      expect(values.has(1)).toBe(true);
      expect(values.has(6)).toBe(true);
    });
  });
});
