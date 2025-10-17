/**
 * Mulberry32 - A simple, fast, and high-quality PRNG
 * 
 * This is a seeded pseudo-random number generator that produces
 * deterministic results for testing while maintaining good randomness
 * properties for gaming applications.
 * 
 * @param seed - Initial seed value
 * @returns Function that generates random numbers between 0 and 1
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed;
  
  return function(): number {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Default random number generator using Math.random()
 * 
 * @returns Random number between 0 and 1
 */
export function defaultRandom(): number {
  return Math.random();
}

/**
 * Generate a random integer between min and max (inclusive)
 * 
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param rng - Random number generator function
 * @returns Random integer between min and max
 */
export function randomInt(min: number, max: number, rng: () => number = defaultRandom): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
