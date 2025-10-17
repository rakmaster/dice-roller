# 🎲 Dice Roller v1.0.0 - Initial Release

We're excited to announce the first release of Dice Roller - a framework-agnostic dice rolling library with a highly configurable Vue 3 component!

## 📦 Packages

- **@dice-roller/core** - Framework-agnostic dice rolling engine
- **@dice-roller/vue** - Vue 3 component with advanced features

## ✨ Core Features

### Framework-Agnostic Engine
- Parse and roll any standard dice notation (e.g., `2d6+3`, `1d20`, `3d8-2`)
- Seeded RNG for deterministic testing
- Full TypeScript support with complete type definitions
- Zero runtime dependencies
- Comprehensive test coverage

### Vue 3 Component
- **15 Named Slots** - Customize every part of the component
- **Events System** - `@before-roll`, `@after-roll`, `@roll`, `@error`, `@validation-error`
- **v-model Support** - Two-way binding with `v-model:notation`
- **Exposed API** - Access methods and state via template refs
- **Validation Rules** - Game-specific constraints (D&D, Pathfinder, etc.)
- **State Management** - Disabled and loading states
- **Plugin Architecture** - Extend with animations, sounds, and effects
- **20+ Props** - Complete control over behavior and appearance
- **Theming** - CSS variables with 9 pre-built color themes
- **History Tracking** - Optional roll history with customizable display

## 🎮 Use Cases

- **Tabletop RPGs** - D&D, Pathfinder, Call of Cthulhu
- **Board Games** - Any game requiring dice rolls
- **Gaming Apps** - Web-based gaming platforms
- **Discord Bots** - Dice rolling commands
- **Educational Tools** - Probability and statistics

## 📚 Documentation

- **[Live Demo & Playground](https://rakmaster.github.io/dice-roller/)** - Interactive examples
- **[Component Documentation](https://rakmaster.github.io/dice-roller/component.html)** - Complete API reference
- **[GitHub Repository](https://github.com/rakmaster/dice-roller)** - Source code and examples

## 🚀 Quick Start

### Core Library
```bash
npm install @dice-roller/core
```

```javascript
import { roll, rollDetailed } from '@dice-roller/core';

const result = roll('2d6+3');
console.log(result); // 11

const detailed = rollDetailed('2d6+3');
console.log(detailed); // { notation: '2d6+3', total: 11, rolls: [4, 4], modifier: 3 }
```

### Vue Component
```bash
npm install @dice-roller/vue
```

```vue
<script setup>
import { VDiceRoller } from '@dice-roller/vue';
</script>

<template>
  <VDiceRoller 
    notation="2d6+3"
    @roll="result => console.log(result)"
  />
</template>
```

## 🔮 What's Next?

- **Animation Plugins** - 3D dice, sprite animations, particle effects
- **Sound Effects** - Audio feedback for rolls
- **Accessibility** - Enhanced keyboard navigation and screen reader support
- **More Themes** - Additional pre-built color schemes
- **Advanced Validation** - More game system presets

## 🙏 Acknowledgments

Component design inspired by the fantastic work of the [Vuetify team](https://vuetifyjs.com).

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

**Enjoy rolling! 🎲**

If you find this useful, please ⭐ star the repo and share it with others!
