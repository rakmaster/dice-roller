import { describe, it, expect } from 'vitest';
import { roll } from '../../src/roller';

describe('Roller', () => {
  describe('roll', () => {
    describe('basic rolling', () => {
      it('should return result with total and notation', () => {
        const result = roll('2d6', { seed: 12345 });
        
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('notation');
        expect(typeof result.total).toBe('number');
        expect(result.notation).toBe('2d6');
      });

      it('should return total within valid range', () => {
        for (let i = 0; i < 100; i++) {
          const result = roll('2d6');
          expect(result.total).toBeGreaterThanOrEqual(2);
          expect(result.total).toBeLessThanOrEqual(12);
        }
      });

      it('should handle single die', () => {
        for (let i = 0; i < 100; i++) {
          const result = roll('1d20');
          expect(result.total).toBeGreaterThanOrEqual(1);
          expect(result.total).toBeLessThanOrEqual(20);
        }
      });

      it('should handle multiple dice', () => {
        for (let i = 0; i < 100; i++) {
          const result = roll('10d6');
          expect(result.total).toBeGreaterThanOrEqual(10);
          expect(result.total).toBeLessThanOrEqual(60);
        }
      });
    });

    describe('all die types', () => {
      it('should roll d4', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d4');
          expect(result.total).toBeGreaterThanOrEqual(1);
          expect(result.total).toBeLessThanOrEqual(4);
        }
      });

      it('should roll d6', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d6');
          expect(result.total).toBeGreaterThanOrEqual(1);
          expect(result.total).toBeLessThanOrEqual(6);
        }
      });

      it('should roll d8', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d8');
          expect(result.total).toBeGreaterThanOrEqual(1);
          expect(result.total).toBeLessThanOrEqual(8);
        }
      });

      it('should roll d10', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d10');
          expect(result.total).toBeGreaterThanOrEqual(1);
          expect(result.total).toBeLessThanOrEqual(10);
        }
      });

      it('should roll d12', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d12');
          expect(result.total).toBeGreaterThanOrEqual(1);
          expect(result.total).toBeLessThanOrEqual(12);
        }
      });

      it('should roll d20', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d20');
          expect(result.total).toBeGreaterThanOrEqual(1);
          expect(result.total).toBeLessThanOrEqual(20);
        }
      });

      it('should roll d100', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d100');
          expect(result.total).toBeGreaterThanOrEqual(1);
          expect(result.total).toBeLessThanOrEqual(100);
        }
      });
    });

    describe('modifiers', () => {
      it('should apply positive modifier', () => {
        const result = roll('2d6+3', { seed: 12345 });
        const withoutModifier = roll('2d6', { seed: 12345 });
        
        expect(result.total).toBe(withoutModifier.total + 3);
      });

      it('should apply negative modifier', () => {
        const result = roll('2d6-3', { seed: 12345 });
        const withoutModifier = roll('2d6', { seed: 12345 });
        
        expect(result.total).toBe(withoutModifier.total - 3);
      });

      it('should handle large positive modifiers', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d6+10');
          expect(result.total).toBeGreaterThanOrEqual(11);
          expect(result.total).toBeLessThanOrEqual(16);
        }
      });

      it('should handle large negative modifiers', () => {
        for (let i = 0; i < 50; i++) {
          const result = roll('1d6-5');
          expect(result.total).toBeGreaterThanOrEqual(-4);
          expect(result.total).toBeLessThanOrEqual(1);
        }
      });

      it('should allow negative total results', () => {
        const result = roll('1d4-10', { seed: 12345 });
        expect(result.total).toBeLessThan(0);
      });
    });

    describe('seeded randomness', () => {
      it('should produce deterministic results with same seed', () => {
        const result1 = roll('2d6+3', { seed: 12345 });
        const result2 = roll('2d6+3', { seed: 12345 });
        
        expect(result1.total).toBe(result2.total);
      });

      it('should produce different results with different seeds', () => {
        const result1 = roll('2d6', { seed: 12345 });
        const result2 = roll('2d6', { seed: 67890 });
        
        // Very unlikely to be the same (but not impossible)
        // Run multiple times to be more confident
        const results1 = Array.from({ length: 10 }, (_, i) => 
          roll('2d6', { seed: 12345 + i }).total
        );
        const results2 = Array.from({ length: 10 }, (_, i) => 
          roll('2d6', { seed: 67890 + i }).total
        );
        
        expect(results1).not.toEqual(results2);
      });

      it('should produce different results without seed', () => {
        const results = Array.from({ length: 10 }, () => roll('1d20').total);
        const uniqueResults = new Set(results);
        
        // Should have some variation (not all the same)
        expect(uniqueResults.size).toBeGreaterThan(1);
      });
    });

    describe('whitespace handling', () => {
      it('should trim whitespace from notation', () => {
        const result = roll('  2d6+3  ', { seed: 12345 });
        expect(result.notation).toBe('2d6+3');
      });
    });

    describe('error propagation', () => {
      it('should throw error for invalid notation', () => {
        expect(() => roll('abc')).toThrow();
      });

      it('should throw error for invalid die type', () => {
        expect(() => roll('2d7')).toThrow();
      });

      it('should throw error for invalid dice count', () => {
        expect(() => roll('0d6')).toThrow();
        expect(() => roll('101d6')).toThrow();
      });
    });

    describe('edge cases', () => {
      it('should handle maximum dice count', () => {
        const result = roll('100d6', { seed: 12345 });
        expect(result.total).toBeGreaterThanOrEqual(100);
        expect(result.total).toBeLessThanOrEqual(600);
      });

      it('should handle minimum dice count', () => {
        const result = roll('1d6', { seed: 12345 });
        expect(result.total).toBeGreaterThanOrEqual(1);
        expect(result.total).toBeLessThanOrEqual(6);
      });

      it('should handle zero modifier', () => {
        const withModifier = roll('2d6+0', { seed: 12345 });
        const withoutModifier = roll('2d6', { seed: 12345 });
        
        expect(withModifier.total).toBe(withoutModifier.total);
      });
    });
  });
});
