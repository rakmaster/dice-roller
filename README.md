# 🎲 Dice Roller

[![npm version](https://img.shields.io/npm/v/@dice-roller/core.svg)](https://www.npmjs.com/package/@dice-roller/core)
[![npm downloads](https://img.shields.io/npm/dm/@dice-roller/core.svg)](https://www.npmjs.com/package/@dice-roller/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/rakmaster/dice-roller.svg)](https://github.com/rakmaster/dice-roller/stargazers)

A framework-agnostic dice roller library with highly configurable Vue 3 component for RPG and gaming applications.

**[📚 Live Demo & Documentation](https://rakmaster.github.io/dice-roller/)**

## Features

✨ **Framework-Agnostic Core** - Use with any JavaScript framework or vanilla JS  
🎨 **Fully Themeable** - CSS variables for complete color customization  
🔧 **Vuetify-Style Slots** - 15 named slots for maximum flexibility  
📦 **Zero Dependencies** - Core library has no runtime dependencies  
⚡ **Lightweight** - <10KB minified + gzipped  
🎯 **TypeScript** - Full type safety and IntelliSense support  
🧪 **Deterministic Testing** - Seeded RNG for reproducible results  
🎮 **Interactive Playground** - Live documentation with real-time prop editing  

## Quick Start

### Core Library (Framework-Agnostic)

```bash
npm install @dice-roller/core
```

```typescript
import { roll, rollDetailed } from '@dice-roller/core';

// Simple roll - just get the total
const result = roll("2d6+3");
console.log(result.total); // 5-15

// Detailed roll - see individual dice
const detailed = rollDetailed("3d6+3");
console.log(detailed.rolls);    // [4, 6, 2]
console.log(detailed.modifier); // 3
console.log(detailed.total);    // 15
```

### Vue Component

```bash
npm install @dice-roller/vue
```

```vue
<template>
  <!-- Minimal usage -->
  <VDiceRoller notation="2d6+3" />
  
  <!-- With configuration -->
  <VDiceRoller 
    notation="1d20"
    input-type="combo"
    :show-history="true"
    variant="compact"
  />
  
  <!-- With events -->
  <VDiceRoller 
    notation="2d6"
    @before-roll="onBeforeRoll"
    @after-roll="onAfterRoll"
    @error="onError"
  />
  
  <!-- With v-model (two-way binding) -->
  <VDiceRoller v-model:notation="diceNotation" />
  
  <!-- Themed -->
  <div class="my-theme">
    <VDiceRoller notation="3d6" />
  </div>
</template>

<script setup>
import { VDiceRoller } from '@dice-roller/vue';
</script>

<style>
.my-theme {
  --dice-primary-color: #ff6b35;
  --dice-secondary-color: #1a1a1a;
}
</style>
```

## Component Features

### Display Variants
- **Default** - Full-featured with all controls
- **Compact** - Smaller padding and fonts for tight spaces
- **Inline** - Horizontal layout for toolbars

### Input Types
- **Text** - Free-form input for custom notation
- **Select** - Dropdown with preset options
- **Combo** - Text input + dropdown on same line

### Customization Options
- Show/hide history tracking
- Show/hide preset buttons
- Configurable result size (small/medium/large)
- Multiple detail formats (inline/breakdown/simple)
- Auto-roll on mount or change
- Minimal mode (just result, no labels)

### Slots (Vuetify-Style)
Customize any part of the component with 15 named slots:
```vue
<VDiceRoller notation="2d6">
  <!-- Add content before component -->
  <template #prepend>
    <div>⚔️ Attack Roll</div>
  </template>
  
  <!-- Custom result display -->
  <template #result-total="{ total }">
    {{ total }} {{ total >= 10 ? '🔥' : '✨' }}
  </template>
  
  <!-- Custom action buttons -->
  <template #actions="{ roll }">
    <button @click="roll">Reroll</button>
  </template>
</VDiceRoller>
```

**Available Slots**: `prepend`, `input-prepend`, `input-append`, `button`, `result`, `result-notation`, `result-total`, `result-details`, `error`, `actions`, `history`, `history-title`, `history-clear`, `history-item`, `append`

### Two-Way Binding (v-model)
Sync notation with parent component state:
```vue
<script setup>
import { ref } from 'vue';
const diceNotation = ref('2d6+3');
</script>

<template>
  <!-- Component updates diceNotation, and vice versa -->
  <VDiceRoller v-model:notation="diceNotation" />
  
  <!-- External input synced to same data -->
  <input v-model="diceNotation" />
</template>
```

### Disabled & Loading States
Control component interactivity:
```vue
<template>
  <!-- Disabled state -->
  <VDiceRoller notation="2d6" :disabled="true" />
  
  <!-- Loading state (shows ⏳ in button) -->
  <VDiceRoller notation="2d6" :loading="isRolling" />
  
  <!-- Async roll example -->
  <VDiceRoller 
    notation="2d6"
    :loading="loading"
    @before-roll="loading = true"
    @after-roll="loading = false"
  />
</template>
```

### Validation Rules
Add custom validation rules:
```vue
<script setup>
// Define validation rules
const rules = [
  v => !!v || 'Notation required',
  v => {
    const match = v.match(/(\d+)d/);
    if (!match) return true;
    return parseInt(match[1]) <= 10 || 'Maximum 10 dice allowed';
  },
  v => {
    const match = v.match(/d(\d+)/);
    if (!match) return true;
    const allowed = [4,6,8,10,12,20,100];
    return allowed.includes(parseInt(match[1])) || 'Standard dice only';
  }
];
</script>

<template>
  <VDiceRoller 
    notation="2d6"
    :rules="rules"
    @validation-error="onError"
  />
</template>
```

**Rule Format**: Each rule is a function `(notation: string) => true | false | string`
- `true` = valid
- `false` = invalid (generic error)
- `string` = invalid with custom error message

**Game Presets Example**:
```javascript
// Create reusable rule sets
export const dnd5e = {
  player: [
    v => !!v || 'Required',
    v => /^\d+d\d+/.test(v) || 'Invalid notation',
    v => parseInt(v.match(/(\d+)d/)?.[1] || 0) <= 20 || 'Max 20 dice',
    v => [4,6,8,10,12,20,100].includes(parseInt(v.match(/d(\d+)/)?.[1] || 0)) || 'Standard dice only'
  ],
  gm: [
    v => !!v || 'Required',
    v => parseInt(v.match(/(\d+)d/)?.[1] || 0) <= 100 || 'Max 100 dice'
  ]
};
```

### Programmatic Access (Template Refs)
Access component methods and state via template refs:
```vue
<script setup>
import { ref } from 'vue';
const diceRoller = ref(null);

const rollDice = () => diceRoller.value.roll();
const clear = () => diceRoller.value.clearHistory();
const checkResult = () => console.log(diceRoller.value.result);
</script>

<template>
  <VDiceRoller ref="diceRoller" notation="2d6+3" />
  <button @click="rollDice">Roll Externally</button>
</template>
```

**Exposed API**:
- `roll()` - Trigger a roll programmatically
- `clearHistory()` - Clear the roll history
- `result` - Current result (reactive ref)
- `history` - Roll history array (reactive ref)
- `error` - Error message if any (reactive ref)
- `notation` - Current notation (reactive ref)

### Animation Plugins
Extend the component with custom animations via the plugin system:

```vue
<script setup>
// Example plugin interface
const myAnimationPlugin = {
  async roll(notation, options) {
    // 1. Parse notation and calculate result
    const result = calculateRoll(notation);
    
    // 2. Play animation (dice rolling, tumbling, etc.)
    await playAnimation(result);
    
    // 3. Return result AFTER animation completes
    // Result displays only when animation finishes
    return {
      notation,
      total: result.total,
      rolls: result.rolls,
      modifier: result.modifier
    };
  }
};
</script>

<template>
  <VDiceRoller 
    notation="2d6"
    :animation-plugin="myAnimationPlugin"
  />
</template>
```

**Plugin Interface**:
```typescript
interface DiceAnimationPlugin {
  roll(notation: string, options?: RollOptions): Promise<RollResult>;
  mount?(container: HTMLElement): void;  // Optional: setup
  unmount?(): void;                      // Optional: cleanup
}
```

**Available Plugins** (separate packages):
- `@dice-roller/3d-plugin` - Three.js 3D dice with physics
- `@dice-roller/sprite-plugin` - 2D sprite animations
- `@dice-roller/sound-plugin` - Sound effects

### Events
React to roll lifecycle with event handlers:
```vue
<VDiceRoller
  notation="2d6+3"
  @before-roll="({ notation }) => console.log('Rolling:', notation)"
  @after-roll="(result) => console.log('Result:', result.total)"
  @error="(err) => console.error('Invalid notation:', err.message)"
/>
```

**Available Events**:
- `@before-roll` - Fired before roll execution, receives `{ notation }`
- `@after-roll` - Fired after successful roll, receives full result object
- `@roll` - Fired after roll (backwards compatibility)
- `@error` - Fired on invalid notation
- `@update:notation` - Fired when notation changes (used by v-model)

### Theming
Customize colors with CSS variables:
```css
.my-dice-roller {
  --dice-primary-color: #667eea;
  --dice-secondary-color: #764ba2;
  --dice-border-radius: 8px;
  --dice-text-color: #333;
  /* ...and 5 more variables */
}
```

## Documentation

- **[📚 Interactive Documentation](https://rakmaster.github.io/dice-roller/component.html)** - Comprehensive guide with live playground
  - Interactive prop editor with real-time updates
  - Usage examples and best practices
  - Complete API reference (Props, Slots, CSS Variables)
  - Theming examples with 9 pre-built color schemes
- **[Core Library API](./packages/dice-roller-core/README.md)** - Framework-agnostic API
- **[Vue Component Props](./packages/dice-roller-vue/README.md)** - Complete prop reference

## Project Structure

This is a monorepo containing two packages:

```
packages/
├── dice-roller-core/     # Framework-agnostic TypeScript library
└── dice-roller-vue/      # Vue 3 component wrapper
```

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test
```

## Architecture

The project follows the **Reusable Core Architecture** principle:

- **Core Package**: Pure business logic, framework-agnostic
- **Vue Package**: Thin presentation layer wrapping the core

This separation enables:
- Core works with React, Svelte, Angular, or vanilla JS
- Independent versioning and publishing
- Maximum code reuse across frameworks

## Browser Support

- Modern browsers (ES2020+)
- Node.js 18+
- Works with Vite, Webpack, Rollup, esbuild

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines and code of conduct.

## Contact

- **GitHub**: [@rakmaster](https://github.com/rakmaster)
- **Email**: logan@phantasea.net
- **Issues**: [GitHub Issues](https://github.com/rakmaster/dice-roller/issues)

## Credits

Built with ❤️ for the RPG and gaming community by Logan Williams.
