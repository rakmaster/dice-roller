# Quickstart Guide: Dice Roller Core Library

**For**: Developers integrating the dice roller library  
**Updated**: 2025-10-16

## Installation

```bash
# Install the core library
npm install @dice-roller/core

# Or with yarn
yarn add @dice-roller/core

# Or with pnpm
pnpm add @dice-roller/core
```

## Basic Usage (P1 - MVP)

### Simple Dice Rolling

```typescript
import { roll } from '@dice-roller/core';

// Roll a single d20
const result = roll("1d20");
console.log(result.total); // 1-20

// Roll multiple dice
const result2 = roll("3d6");
console.log(result2.total); // 3-18

// Roll different die types
const d4 = roll("1d4");   // 1-4
const d8 = roll("2d8");   // 2-16
const d100 = roll("1d100"); // 1-100
```

## Modifiers (P2)

### Adding and Subtracting

```typescript
import { roll } from '@dice-roller/core';

// Add modifier
const attack = roll("1d20+5");
console.log(attack.total); // 6-25

// Subtract modifier
const penalty = roll("2d6-2");
console.log(penalty.total); // 0-10

// Large modifiers
const buffed = roll("3d4+10");
console.log(buffed.total); // 13-22
```

## Detailed Results (P3)

### Seeing Individual Rolls

```typescript
import { rollDetailed } from '@dice-roller/core';

// Get detailed breakdown
const result = rollDetailed("3d6+3");

console.log(result.rolls);    // [4, 6, 2] - individual die values
console.log(result.modifier); // 3
console.log(result.total);    // 15 (4 + 6 + 2 + 3)
console.log(result.notation); // "3d6+3"

// Display to user
console.log(`You rolled: [${result.rolls.join(', ')}] + ${result.modifier} = ${result.total}`);
// Output: "You rolled: [4, 6, 2] + 3 = 15"
```

## Error Handling

### Validating Input

```typescript
import { roll, isValidNotation } from '@dice-roller/core';

// Check before rolling
const notation = "2d6+3";
if (isValidNotation(notation)) {
  const result = roll(notation);
  console.log(result.total);
} else {
  console.error("Invalid notation!");
}

// Handle errors
try {
  const result = roll("2x6"); // Invalid format
} catch (error) {
  console.error(error.message);
  // "Invalid dice notation "2x6": format must be XdY or XdY±Z"
}
```

### Common Error Cases

```typescript
import { roll } from '@dice-roller/core';

// Invalid format
roll("abc");      // Error: Invalid dice notation
roll("2x6");      // Error: Invalid format
roll("d20d6");    // Error: Invalid format

// Out of range
roll("0d6");      // Error: Dice count must be between 1 and 100
roll("101d6");    // Error: Dice count must be between 1 and 100

// Invalid die type
roll("2d7");      // Error: Invalid die type d7
roll("1d13");     // Error: Invalid die type d13
```

## Testing with Seeds

### Deterministic Rolls

```typescript
import { roll, rollDetailed } from '@dice-roller/core';

// Same seed = same results (for testing)
const result1 = roll("2d6", { seed: 12345 });
const result2 = roll("2d6", { seed: 12345 });
console.log(result1.total === result2.total); // true

// Different seeds = different results
const result3 = roll("2d6", { seed: 67890 });
console.log(result1.total === result3.total); // likely false

// Works with detailed rolls too
const detailed = rollDetailed("3d6", { seed: 12345 });
console.log(detailed.rolls); // Always [4, 5, 3] with this seed
```

## Utility Functions

### Parsing and Validation

```typescript
import { 
  parseDiceNotation, 
  isValidNotation, 
  getValidDieTypes 
} from '@dice-roller/core';

// Parse notation
const parsed = parseDiceNotation("2d6+3");
console.log(parsed);
// { count: 2, sides: 6, modifier: 3 }

// Validate notation
console.log(isValidNotation("2d6+3"));  // true
console.log(isValidNotation("2x6"));    // false

// Get valid die types
const validTypes = getValidDieTypes();
console.log(validTypes); // [4, 6, 8, 10, 12, 20, 100]
```

## TypeScript Support

### Full Type Safety

```typescript
import type { 
  RollResult, 
  DetailedRollResult, 
  DiceNotation,
  DieType 
} from '@dice-roller/core';

// Type-safe results
const result: RollResult = roll("2d6");
const detailed: DetailedRollResult = rollDetailed("3d6+3");

// Type-safe parsing
const notation: DiceNotation = parseDiceNotation("1d20");

// Type-safe die types
const validSides: DieType = 20; // OK
const invalidSides: DieType = 7; // TypeScript error
```

## Common Patterns

### Building a Dice Roller UI

```typescript
import { rollDetailed, isValidNotation } from '@dice-roller/core';

function handleRoll(notation: string) {
  // Validate input
  if (!isValidNotation(notation)) {
    return { error: "Invalid dice notation" };
  }

  // Roll with details
  const result = rollDetailed(notation);

  // Format for display
  return {
    display: `You rolled: [${result.rolls.join(', ')}] + ${result.modifier} = ${result.total}`,
    total: result.total,
    rolls: result.rolls
  };
}

// Usage
const output = handleRoll("3d6+3");
console.log(output.display);
// "You rolled: [4, 6, 2] + 3 = 15"
```

### Character Sheet Integration

```typescript
import { roll } from '@dice-roller/core';

interface Character {
  strength: number;
  dexterity: number;
}

function rollAttack(character: Character, weaponBonus: number = 0) {
  const strengthMod = Math.floor((character.strength - 10) / 2);
  const totalBonus = strengthMod + weaponBonus;
  
  const notation = `1d20${totalBonus >= 0 ? '+' : ''}${totalBonus}`;
  return roll(notation);
}

const hero: Character = { strength: 16, dexterity: 14 };
const attackRoll = rollAttack(hero, 2); // 1d20+5 (STR +3, weapon +2)
console.log(`Attack roll: ${attackRoll.total}`);
```

### Damage Calculator

```typescript
import { rollDetailed } from '@dice-roller/core';

function calculateDamage(weaponDice: string, criticalHit: boolean = false) {
  if (criticalHit) {
    // Double the dice on a crit
    const parsed = parseDiceNotation(weaponDice);
    const critNotation = `${parsed.count * 2}d${parsed.sides}+${parsed.modifier}`;
    return rollDetailed(critNotation);
  }
  
  return rollDetailed(weaponDice);
}

// Normal hit
const normal = calculateDamage("2d6+3");
console.log(`Damage: ${normal.total}`);

// Critical hit!
const crit = calculateDamage("2d6+3", true);
console.log(`Critical damage: ${crit.total}`); // Rolls 4d6+3
```

## Performance Notes

- Rolls complete in <100ms for up to 100 dice
- Parsing is <10ms for any valid notation
- Zero runtime dependencies
- Bundle size <10KB (minified + gzipped)
- Tree-shakeable - import only what you need

## Browser Compatibility

- Modern browsers (ES2020+)
- Node.js 18+
- Works with all major bundlers (Vite, Webpack, Rollup, esbuild)
- Supports both ESM and CommonJS

## Next Steps

- **Vue Integration**: Install `@dice-roller/vue` for `<v-dice-roller>` component
- **React Integration**: Use the core library with React hooks
- **Advanced Features**: Check documentation for future enhancements

## Support

- **Issues**: [GitHub Issues](https://github.com/yourname/dice-roller/issues)
- **Docs**: [Full Documentation](https://dice-roller.dev/docs)
- **Examples**: [CodeSandbox Examples](https://codesandbox.io/s/dice-roller-examples)
