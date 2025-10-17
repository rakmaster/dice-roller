<template>
  <div class="v-dice-roller" :class="variantClass">
    <!-- Prepend Slot -->
    <div v-if="$slots.prepend" class="dice-prepend">
      <slot name="prepend" :notation="localNotation" :roll="handleRoll" />
    </div>

    <!-- Input Section -->
    <div v-if="!hideInput" class="dice-input-group">
      <!-- Input Prepend Slot -->
      <slot name="input-prepend" :notation="localNotation" />

      <input
        v-if="inputType === 'text' || inputType === 'combo'"
        v-model="localNotation"
        @keyup.enter="handleRoll"
        :placeholder="placeholder"
        class="dice-input"
        :class="{ 'combo-input': inputType === 'combo' }"
        type="text"
      />
      
      <select
        v-if="inputType === 'select' || inputType === 'combo'"
        v-model="localNotation"
        @change="autoRoll && handleRoll()"
        class="dice-select"
        :class="{ 'combo-select': inputType === 'combo' }"
      >
        <option v-if="inputType === 'select'" value="" disabled>Select dice...</option>
        <option v-for="preset in presets" :key="preset" :value="preset">
          {{ preset }}
        </option>
      </select>

      <!-- Input Append Slot -->
      <slot name="input-append" :notation="localNotation" />

      <button
        v-if="!hideRollButton"
        @click="handleRoll"
        class="dice-roll-btn"
        :disabled="!localNotation || disabled || loading"
      >
        <slot name="button" :roll="handleRoll" :loading="loading" :disabled="disabled">
          <span v-if="loading">⏳</span>
          <span v-else>{{ rollButtonText }}</span>
        </slot>
      </button>
    </div>

    <!-- Quick Presets (only if not using select/combo) -->
    <div
      v-if="showPresets && inputType === 'text'"
      class="dice-presets"
    >
      <button
        v-for="preset in presets"
        :key="preset"
        @click="localNotation = preset; handleRoll()"
        class="preset-btn"
      >
        {{ preset }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="dice-error">
      <slot name="error" :error="error">
        {{ error }}
      </slot>
    </div>

    <!-- Result Display -->
    <div v-if="result" class="dice-result" :class="resultSizeClass">
      <slot name="result" :result="result" :notation="result.notation" :total="result.total" :rolls="result.rolls" :modifier="result.modifier">
        <!-- Default Result Content -->
        <slot name="result-notation" :notation="result.notation">
          <div v-if="!minimal" class="result-notation">{{ result.notation }}</div>
        </slot>
        
        <slot name="result-total" :total="result.total">
          <div class="result-total">{{ result.total }}</div>
        </slot>
        
        <div
          v-if="showDetails && result.rolls"
          class="result-details"
        >
          <slot name="result-details" :rolls="result.rolls" :modifier="result.modifier" :total="result.total">
            <template v-if="detailFormat === 'inline'">
              [{{ result.rolls.join(', ') }}]<span v-if="result.modifier !== 0"> {{ result.modifier > 0 ? '+' : '' }}{{ result.modifier }}</span>
            </template>
            <template v-else-if="detailFormat === 'breakdown'">
              <div class="breakdown">
                <span v-for="(roll, i) in result.rolls" :key="i" class="die-value">{{ roll }}</span>
                <span v-if="result.modifier !== 0" class="modifier">{{ result.modifier > 0 ? '+' : '' }}{{ result.modifier }}</span>
                <span class="equals">=</span>
                <span class="total-value">{{ result.total }}</span>
              </div>
            </template>
            <template v-else>
              Rolls: {{ result.rolls.join(', ') }}
              <span v-if="result.modifier !== 0"> ({{ result.modifier > 0 ? '+' : '' }}{{ result.modifier }})</span>
            </template>
          </slot>
        </div>
      </slot>
    </div>

    <!-- Actions Slot -->
    <div v-if="$slots.actions" class="dice-actions">
      <slot name="actions" :result="result" :history="history" :roll="handleRoll" :clear="clearHistory" />
    </div>

    <!-- History -->
    <div v-if="showHistory && history.length > 0" class="dice-history">
      <slot name="history" :history="displayHistory" :clear="clearHistory">
        <div class="history-header">
          <slot name="history-title" :title="historyTitle">
            <span class="history-title">{{ historyTitle }}</span>
          </slot>
          <button
            v-if="showClearHistory"
            @click="clearHistory"
            class="clear-history-btn"
          >
            <slot name="history-clear" :clear="clearHistory">
              {{ clearHistoryText }}
            </slot>
          </button>
        </div>
        <div class="history-items">
          <div
            v-for="(item, index) in displayHistory"
            :key="index"
            class="history-item"
          >
            <slot name="history-item" :item="item" :index="index">
              <span class="history-notation">{{ item.notation }}</span>
              <span class="history-total">{{ item.total }}</span>
            </slot>
          </div>
        </div>
      </slot>
    </div>

    <!-- Append Slot -->
    <div v-if="$slots.append" class="dice-append">
      <slot name="append" :result="result" :history="history" :roll="handleRoll" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { rollDetailed } from '@dice-roller/core';

const props = defineProps({
  // Input configuration
  notation: {
    type: String,
    default: '2d6'
  },
  inputType: {
    type: String,
    default: 'text', // 'text', 'select', 'combo'
    validator: (value) => ['text', 'select', 'combo'].includes(value)
  },
  placeholder: {
    type: String,
    default: 'e.g., 2d6+3'
  },
  hideInput: {
    type: Boolean,
    default: false
  },
  hideRollButton: {
    type: Boolean,
    default: false
  },
  rollButtonText: {
    type: String,
    default: '🎲'
  },
  autoRoll: {
    type: Boolean,
    default: false
  },

  // Presets
  showPresets: {
    type: Boolean,
    default: false
  },
  presets: {
    type: Array,
    default: () => ['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100', '2d6+3']
  },

  // Result display
  showDetails: {
    type: Boolean,
    default: true
  },
  detailFormat: {
    type: String,
    default: 'inline', // 'inline', 'breakdown', 'simple'
    validator: (value) => ['inline', 'breakdown', 'simple'].includes(value)
  },
  resultSize: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  minimal: {
    type: Boolean,
    default: false
  },

  // History
  showHistory: {
    type: Boolean,
    default: false
  },
  showClearHistory: {
    type: Boolean,
    default: true
  },
  historyLimit: {
    type: Number,
    default: 10
  },
  historyTitle: {
    type: String,
    default: 'History'
  },
  clearHistoryText: {
    type: String,
    default: 'Clear'
  },

  // Styling
  variant: {
    type: String,
    default: 'default', // 'default', 'compact', 'inline'
    validator: (value) => ['default', 'compact', 'inline'].includes(value)
  },

  // Behavior
  seed: {
    type: Number,
    default: undefined
  },
  
  // Validation
  rules: {
    type: Array,
    default: () => []
  },
  
  // State
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  
  // Plugin
  animationPlugin: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['roll', 'error', 'update:notation', 'before-roll', 'after-roll', 'validation-error']);

const localNotation = ref(props.notation);
const result = ref(null);
const error = ref(null);
const history = ref([]);

// Computed
const variantClass = computed(() => `variant-${props.variant}`);
const resultSizeClass = computed(() => `size-${props.resultSize}`);
const displayHistory = computed(() => history.value.slice(0, props.historyLimit));

// Watch for external notation changes
watch(() => props.notation, (newVal) => {
  localNotation.value = newVal;
});

// Watch for local notation changes
watch(localNotation, (newVal) => {
  emit('update:notation', newVal);
});

// Validation
function validateNotation(notation) {
  if (!props.rules || props.rules.length === 0) {
    return { valid: true };
  }
  
  for (const rule of props.rules) {
    const result = rule(notation);
    
    // Rule returns true = valid
    if (result === true) continue;
    
    // Rule returns false = invalid (generic error)
    if (result === false) {
      return { valid: false, error: 'Invalid notation' };
    }
    
    // Rule returns string = invalid with custom error
    if (typeof result === 'string') {
      return { valid: false, error: result };
    }
  }
  
  return { valid: true };
}

// Methods
async function handleRoll() {
  // Check if disabled or loading
  if (props.disabled || props.loading) {
    return;
  }
  
  try {
    error.value = null;
    
    // Validate notation first
    const validation = validateNotation(localNotation.value);
    if (!validation.valid) {
      error.value = validation.error;
      emit('validation-error', validation.error);
      return;
    }
    
    // Emit before-roll event with current notation
    emit('before-roll', { notation: localNotation.value });
    
    const options = props.seed !== undefined ? { seed: props.seed } : {};
    
    // If animation plugin exists, use it (result shown after animation)
    if (props.animationPlugin && typeof props.animationPlugin.roll === 'function') {
      result.value = await props.animationPlugin.roll(localNotation.value, options);
    } else {
      // Standard roll (result shown immediately)
      result.value = rollDetailed(localNotation.value, options);
    }
    
    if (props.showHistory) {
      history.value.unshift({
        notation: result.value.notation,
        total: result.value.total
      });
    }
    
    // Emit after-roll event with result
    emit('after-roll', result.value);
    
    // Keep existing roll event for backwards compatibility
    emit('roll', result.value);
  } catch (err) {
    error.value = err.message;
    result.value = null;
    emit('error', err);
  }
}

function clearHistory() {
  history.value = [];
}

// Auto-roll on mount if specified
if (props.autoRoll && localNotation.value) {
  handleRoll();
}

// Expose methods and refs for parent components
defineExpose({
  // Methods
  roll: handleRoll,
  clearHistory,
  
  // Reactive state (read-only refs)
  result,
  history,
  error,
  notation: localNotation
});
</script>

<style scoped>
.v-dice-roller {
  --dice-primary-color: #667eea;
  --dice-primary-hover: #5568d3;
  --dice-secondary-color: #764ba2;
  --dice-error-color: #ff4757;
  --dice-border-color: #ddd;
  --dice-border-radius: 4px;
  --dice-text-color: #333;
  --dice-bg-color: white;
  --dice-result-text: white;
  
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Input Group */
.dice-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.dice-input,
.dice-select {
  padding: 8px 12px;
  border: 1px solid var(--dice-border-color);
  border-radius: var(--dice-border-radius);
  font-size: 14px;
  transition: border-color 0.2s;
  background: var(--dice-bg-color);
  color: var(--dice-text-color);
}

.dice-input {
  flex: 1;
}

.dice-input:focus,
.dice-select:focus {
  outline: none;
  border-color: var(--dice-primary-color);
}

.combo-input {
  flex: 2;
}

.combo-select {
  flex: 1;
}

.dice-roll-btn {
  padding: 8px 16px;
  background: var(--dice-primary-color);
  color: var(--dice-result-text);
  border: none;
  border-radius: var(--dice-border-radius);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.dice-roll-btn:hover:not(:disabled) {
  background: var(--dice-primary-hover);
}

.dice-roll-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Presets */
.dice-presets {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.preset-btn {
  padding: 6px 12px;
  background: var(--dice-bg-color);
  border: 1px solid var(--dice-primary-color);
  color: var(--dice-primary-color);
  border-radius: var(--dice-border-radius);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: var(--dice-primary-color);
  color: var(--dice-result-text);
}

/* Error */
.dice-error {
  background: var(--dice-error-color);
  color: var(--dice-result-text);
  padding: 10px 12px;
  border-radius: var(--dice-border-radius);
  margin-bottom: 12px;
  font-size: 13px;
}

/* Result */
.dice-result {
  background: linear-gradient(135deg, var(--dice-primary-color) 0%, var(--dice-secondary-color) 100%);
  color: var(--dice-result-text);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  margin-bottom: 12px;
}

.result-notation {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.result-total {
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
}

.result-details {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.breakdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.die-value,
.modifier,
.total-value {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--dice-border-radius);
  font-weight: 600;
}

.equals {
  opacity: 0.7;
}

/* Result sizes */
.size-small .result-total {
  font-size: 32px;
}

.size-small .dice-result {
  padding: 12px;
}

.size-medium .result-total {
  font-size: 48px;
}

.size-large .result-total {
  font-size: 64px;
}

.size-large .dice-result {
  padding: 24px;
}

/* History */
.dice-history {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.clear-history-btn {
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-history-btn:hover {
  background: #f5f5f5;
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 13px;
}

.history-notation {
  color: #667eea;
  font-weight: 600;
}

.history-total {
  font-weight: bold;
  color: #333;
}

/* Slot Containers */
.dice-prepend,
.dice-append {
  margin-bottom: 12px;
}

.dice-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

/* Variants */
.variant-compact .dice-input-group {
  margin-bottom: 8px;
}

.variant-compact .dice-result {
  padding: 12px;
}

.variant-compact .result-total {
  font-size: 36px;
}

.variant-inline .dice-input-group {
  margin-bottom: 0;
}

.variant-inline .dice-result {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  margin-bottom: 0;
}

.variant-inline .result-notation {
  margin-bottom: 0;
}

.variant-inline .result-total {
  font-size: 24px;
}

.variant-inline .result-details {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}
</style>
