# @dice-roller/vue

Vue 3 component wrapper for the dice-roller-core library.

## Installation

```bash
npm install @dice-roller/vue
```

## Quick Start

```vue
<template>
  <VDiceRoller notation="2d6+3" />
</template>

<script setup>
import { VDiceRoller } from '@dice-roller/vue';
</script>
```

## Configuration Examples

### Minimal - Just Dropdown and Result

Perfect for tight spaces, no extra UI chrome:

```vue
<VDiceRoller 
  input-type="select"
  :hide-roll-button="true"
  :auto-roll="true"
  :minimal="true"
  result-size="small"
/>
```

### Combo Input - Text + Dropdown

Best of both worlds - custom input AND quick presets:

```vue
<VDiceRoller 
  input-type="combo"
  notation="2d6+3"
/>
```

### With History

Track recent rolls:

```vue
<VDiceRoller 
  notation="1d20"
  :show-history="true"
  :show-clear-history="true"
  :history-limit="5"
/>
```

### Without History

Clean, no history tracking:

```vue
<VDiceRoller 
  notation="2d6"
  :show-history="false"
/>
```

### Compact Variant

Smaller padding and fonts:

```vue
<VDiceRoller 
  variant="compact"
  notation="1d6"
/>
```

### Inline Variant

Horizontal layout for toolbars:

```vue
<VDiceRoller 
  variant="inline"
  input-type="combo"
  :show-details="false"
/>
```

## Props

### Input Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `notation` | String | `"2d6"` | Initial dice notation |
| `input-type` | String | `"text"` | Input type: "text", "select", or "combo" |
| `placeholder` | String | `"e.g., 2d6+3"` | Input placeholder text |
| `hide-input` | Boolean | `false` | Hide all input controls |
| `hide-roll-button` | Boolean | `false` | Hide the roll button |
| `roll-button-text` | String | `"🎲"` | Custom button text |
| `auto-roll` | Boolean | `false` | Auto-roll on mount/change |

### Presets

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show-presets` | Boolean | `false` | Show quick roll buttons |
| `presets` | Array | `['1d4', '1d6', ...]` | Array of preset notations |

### Result Display

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show-details` | Boolean | `true` | Show individual roll breakdown |
| `detail-format` | String | `"inline"` | Format: "inline", "breakdown", or "simple" |
| `result-size` | String | `"medium"` | Size: "small", "medium", or "large" |
| `minimal` | Boolean | `false` | Hide notation label |

### History

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show-history` | Boolean | `false` | Display roll history |
| `show-clear-history` | Boolean | `true` | Show clear button (requires `show-history`) |
| `history-limit` | Number | `10` | Max history items |
| `history-title` | String | `"History"` | History section title |
| `clear-history-text` | String | `"Clear"` | Clear button text |

### Styling

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | String | `"default"` | Variant: "default", "compact", or "inline" |

### Behavior

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seed` | Number | `undefined` | Seed for deterministic rolls |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `@roll` | `RollResult` | Emitted when dice are rolled |
| `@error` | `Error` | Emitted when roll fails |
| `@update:notation` | `string` | Emitted when notation changes (v-model support) |

## Methods (via ref)

```vue
<template>
  <VDiceRoller ref="roller" />
  <button @click="rollFromParent">Roll!</button>
</template>

<script setup>
import { ref } from 'vue';
import { VDiceRoller } from '@dice-roller/vue';

const roller = ref(null);

function rollFromParent() {
  roller.value.roll();
}
</script>
```

Available methods:
- `roll()` - Trigger a roll programmatically
- `clearHistory()` - Clear roll history

## Common Patterns

### Character Sheet Integration

```vue
<template>
  <div class="character-sheet">
    <h3>Attack Roll</h3>
    <VDiceRoller 
      :notation="`1d20+${attackBonus}`"
      input-type="select"
      :hide-roll-button="false"
      result-size="small"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const strength = 16;
const proficiency = 3;
const attackBonus = computed(() => Math.floor((strength - 10) / 2) + proficiency);
</script>
```

### Damage Calculator

```vue
<template>
  <VDiceRoller 
    :notation="weaponDamage"
    :show-history="true"
    detail-format="breakdown"
    @roll="handleDamage"
  />
</template>

<script setup>
const weaponDamage = '2d6+3';

function handleDamage(result) {
  console.log(`Dealt ${result.total} damage!`);
}
</script>
```

### Toolbar Integration

```vue
<template>
  <div class="toolbar">
    <VDiceRoller 
      variant="inline"
      input-type="combo"
      :show-details="false"
      result-size="small"
    />
  </div>
</template>
```

## Styling

The component uses scoped styles but exposes CSS classes for customization:

```css
/* Override result colors */
.v-dice-roller .dice-result {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}

/* Customize button */
.v-dice-roller .dice-roll-btn {
  background: #your-brand-color;
}
```

## TypeScript Support

Full TypeScript support with type definitions:

```vue
<script setup lang="ts">
import { VDiceRoller } from '@dice-roller/vue';
import type { RollResult } from '@dice-roller/core';

function handleRoll(result: RollResult) {
  console.log(result.total);
}
</script>
```

## License

MIT
