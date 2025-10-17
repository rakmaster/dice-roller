# Research: Dice Roller Core Library

**Date**: 2025-10-16  
**Feature**: 001-dice-roller-core  
**Purpose**: Resolve technical decisions and validate approach

## Research Areas

### 1. TypeScript Library Best Practices

**Decision**: Use TypeScript 5.x with strict mode, dual ESM/CJS output

**Rationale**:
- Type safety prevents runtime errors in dice notation parsing
- Modern bundlers (Vite, Rollup, Webpack) all support ESM
- CJS output ensures compatibility with older Node.js projects
- Strict mode catches edge cases at compile time

**Alternatives Considered**:
- Pure JavaScript: Rejected - loses type safety benefits for API consumers
- TypeScript 4.x: Rejected - missing performance improvements and newer features
- ESM-only: Rejected - breaks compatibility with some Node.js environments

**Implementation**:
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true
  }
}
```

---

### 2. Random Number Generation Strategy

**Decision**: Implement seedable PRNG using Mulberry32 algorithm

**Rationale**:
- Mulberry32 is fast, simple, and produces high-quality randomness for gaming
- Seedable RNG enables deterministic testing (Principle II)
- No external dependencies required
- ~10 lines of code, negligible bundle size impact

**Alternatives Considered**:
- Math.random(): Rejected - not seedable, can't reproduce test scenarios
- crypto.randomBytes(): Rejected - overkill for gaming dice, not available in all environments
- External RNG library: Rejected - violates zero-dependency requirement

**Implementation**:
```typescript
function mulberry32(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
```

---

### 3. Dice Notation Parsing Approach

**Decision**: Regular expression parser with validation layer

**Rationale**:
- RPG dice notation is simple and well-defined (XdY±Z)
- Regex provides fast parsing with minimal code
- Separate validation step provides clear error messages
- No need for complex parser generator

**Alternatives Considered**:
- Parser combinator library: Rejected - adds dependency, overkill for simple grammar
- Hand-written recursive descent: Rejected - more code, slower, harder to maintain
- String splitting: Rejected - fragile, poor error handling

**Implementation Pattern**:
```typescript
const DICE_NOTATION_REGEX = /^(\d+)d(\d+)([+-]\d+)?$/i;

function parseDiceNotation(notation: string): DiceNotation {
  const trimmed = notation.trim();
  const match = DICE_NOTATION_REGEX.exec(trimmed);
  
  if (!match) {
    throw new Error(`Invalid dice notation: ${notation}`);
  }
  
  // Extract and validate components...
}
```

---

### 4. Testing Strategy

**Decision**: Vitest for unit tests + fast-check for property-based testing

**Rationale**:
- Vitest is fast, modern, and has excellent TypeScript support
- Property-based testing validates mathematical properties of dice rolls
- No additional test runner needed (Vitest handles both)
- Aligns with Vite build tooling

**Alternatives Considered**:
- Jest: Rejected - slower, requires more configuration for ESM
- Mocha + Chai: Rejected - more dependencies, less integrated experience
- AVA: Rejected - less popular, smaller ecosystem

**Property-Based Test Examples**:
```typescript
// Property: Rolling NdX should always return value between N and N*X
fc.assert(
  fc.property(
    fc.integer({min: 1, max: 100}), // dice count
    fc.constantFrom(4, 6, 8, 10, 12, 20, 100), // die type
    (count, sides) => {
      const result = roll(`${count}d${sides}`);
      return result >= count && result <= count * sides;
    }
  )
);
```

---

### 5. Monorepo Management

**Decision**: npm workspaces (built-in, zero tooling overhead)

**Rationale**:
- Native npm feature, no additional dependencies
- Simple configuration in root package.json
- Works seamlessly with TypeScript project references
- Sufficient for 2-package monorepo

**Alternatives Considered**:
- Lerna: Rejected - deprecated, overkill for simple monorepo
- pnpm workspaces: Rejected - requires pnpm installation
- Turborepo: Rejected - adds complexity, not needed for small project
- Nx: Rejected - heavy tooling, unnecessary for 2 packages

**Configuration**:
```json
{
  "name": "dice-roller",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

---

### 6. Bundle Size Optimization

**Decision**: Tree-shakeable ESM exports, no default export

**Rationale**:
- Named exports enable tree-shaking in consuming applications
- Separate roll() and rollDetailed() functions allow importing only what's needed
- Target <10KB includes all functionality

**Alternatives Considered**:
- Single default export object: Rejected - prevents tree-shaking
- Class-based API: Rejected - larger bundle, unnecessary OOP overhead

**Export Strategy**:
```typescript
// index.ts
export { roll } from './roller';
export { rollDetailed } from './roller';
export { parseDiceNotation } from './parser';
export type { DiceNotation, RollResult, DetailedRollResult } from './types';
```

---

## Summary

All technical decisions support the constitution principles:
- **Simplicity**: Minimal dependencies, straightforward implementations
- **Testability**: Seedable RNG, property-based tests
- **Reusability**: Framework-agnostic TypeScript, dual module format
- **Performance**: Regex parsing, efficient RNG, tree-shakeable exports

No unresolved clarifications remain. Ready for Phase 1 (Design & Contracts).
