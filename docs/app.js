const { createApp } = Vue;

// Inline dice roller core
const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100];
const MIN_DICE_COUNT = 1;
const MAX_DICE_COUNT = 100;
const DICE_NOTATION_REGEX = /^(\d+)d(\d+)([+-]\d+)?$/i;

function createSeededRandom(seed) {
  let state = seed;
  return function() {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(min, max, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function parseDiceNotation(notation) {
  const trimmed = notation.trim();
  const match = DICE_NOTATION_REGEX.exec(trimmed);
  
  if (!match) {
    throw new Error(`Invalid dice notation "${notation}": format must be XdY or XdY±Z`);
  }
  
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  
  if (count < MIN_DICE_COUNT || count > MAX_DICE_COUNT) {
    throw new Error(`Invalid dice count ${count}: must be between 1 and 100`);
  }
  
  if (!DIE_TYPES.includes(sides)) {
    throw new Error(`Invalid die type d${sides}: must be d4, d6, d8, d10, d12, d20, or d100`);
  }
  
  return { count, sides, modifier };
}

function rollDetailed(notation, options = {}) {
  const parsed = parseDiceNotation(notation);
  const rng = options.seed !== undefined 
    ? createSeededRandom(options.seed)
    : Math.random;
  
  const rolls = [];
  for (let i = 0; i < parsed.count; i++) {
    rolls.push(randomInt(1, parsed.sides, rng));
  }
  
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + parsed.modifier;
  
  return {
    rolls,
    modifier: parsed.modifier,
    total,
    notation: notation.trim(),
  };
}

// Vue Component
const VDiceRollerComponent = {
  template: `
    <div class="v-dice-roller" :class="variantClass">
      <div class="dice-prepend">
        <slot name="prepend" :notation="localNotation" :roll="handleRoll"></slot>
      </div>

      <div v-if="!hideInput" class="dice-input-group">
        <slot name="input-prepend" :notation="localNotation"></slot>

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

        <slot name="input-append" :notation="localNotation"></slot>

        <button
          v-if="!hideRollButton"
          @click="handleRoll"
          class="dice-roll-btn"
          :disabled="!localNotation"
        >
          <slot name="button" :roll="handleRoll">{{ rollButtonText }}</slot>
        </button>
      </div>

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

      <div v-if="error" class="dice-error">
        <slot name="error" :error="error">{{ error }}</slot>
      </div>

      <div v-if="result" class="dice-result" :class="resultSizeClass">
        <slot name="result" :result="result" :notation="result.notation" :total="result.total" :rolls="result.rolls" :modifier="result.modifier">
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

      <div class="dice-actions">
        <slot name="actions" :result="result" :history="history" :roll="handleRoll" :clear="clearHistory"></slot>
      </div>

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
              <slot name="history-clear" :clear="clearHistory">{{ clearHistoryText }}</slot>
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

      <div class="dice-append">
        <slot name="append" :result="result" :history="history" :roll="handleRoll"></slot>
      </div>
    </div>
  `,
  props: {
    notation: { type: String, default: '2d6' },
    inputType: { type: String, default: 'text' },
    placeholder: { type: String, default: 'e.g., 2d6+3' },
    hideInput: { type: Boolean, default: false },
    hideRollButton: { type: Boolean, default: false },
    rollButtonText: { type: String, default: '🎲' },
    autoRoll: { type: Boolean, default: false },
    showPresets: { type: Boolean, default: false },
    presets: { type: Array, default: () => ['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100', '2d6+3'] },
    showDetails: { type: Boolean, default: true },
    detailFormat: { type: String, default: 'inline' },
    resultSize: { type: String, default: 'medium' },
    minimal: { type: Boolean, default: false },
    showHistory: { type: Boolean, default: false },
    showClearHistory: { type: Boolean, default: true },
    historyLimit: { type: Number, default: 10 },
    historyTitle: { type: String, default: 'History' },
    clearHistoryText: { type: String, default: 'Clear' },
    variant: { type: String, default: 'default' },
    seed: { type: Number, default: undefined },
    rules: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      localNotation: this.notation,
      result: null,
      error: null,
      history: []
    };
  },
  computed: {
    variantClass() {
      return `variant-${this.variant}`;
    },
    resultSizeClass() {
      return `size-${this.resultSize}`;
    },
    displayHistory() {
      return this.history.slice(0, this.historyLimit);
    }
  },
  watch: {
    notation(newVal) {
      this.localNotation = newVal;
    }
  },
  emits: ['roll', 'error', 'update:notation', 'before-roll', 'after-roll', 'validation-error'],
  methods: {
    validateNotation(notation) {
      if (!this.rules || this.rules.length === 0) {
        return { valid: true };
      }
      
      for (const rule of this.rules) {
        const result = rule(notation);
        
        if (result === true) continue;
        if (result === false) {
          return { valid: false, error: 'Invalid notation' };
        }
        if (typeof result === 'string') {
          return { valid: false, error: result };
        }
      }
      
      return { valid: true };
    },
    handleRoll() {
      // Check if disabled or loading
      if (this.disabled || this.loading) {
        return;
      }
      
      try {
        this.error = null;
        
        // Validate notation first
        const validation = this.validateNotation(this.localNotation);
        if (!validation.valid) {
          this.error = validation.error;
          this.$emit('validation-error', validation.error);
          return;
        }
        
        // Emit before-roll event
        this.$emit('before-roll', { notation: this.localNotation });
        
        const options = this.seed !== undefined ? { seed: this.seed } : {};
        this.result = rollDetailed(this.localNotation, options);
        
        if (this.showHistory) {
          this.history.unshift({
            notation: this.result.notation,
            total: this.result.total
          });
        }
        
        // Emit after-roll event
        this.$emit('after-roll', this.result);
        
        // Keep existing roll event for backwards compatibility
        this.$emit('roll', this.result);
      } catch (err) {
        this.error = err.message;
        this.result = null;
        this.$emit('error', err);
      }
    },
    clearHistory() {
      this.history = [];
    }
  },
  mounted() {
    if (this.autoRoll && this.localNotation) {
      this.handleRoll();
    }
  }
};

// Add component styles
const style = document.createElement('style');
style.textContent = `
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
  
  /* Theme overrides */
  .theme-orange-black { --dice-primary-color: #ff6b35; --dice-primary-hover: #e55a2b; --dice-secondary-color: #1a1a1a; }
  .theme-green-teal { --dice-primary-color: #10b981; --dice-primary-hover: #059669; --dice-secondary-color: #14b8a6; --dice-border-radius: 8px; }
  .theme-dark { --dice-primary-color: #3b82f6; --dice-primary-hover: #2563eb; --dice-secondary-color: #8b5cf6; --dice-bg-color: #1f2937; --dice-text-color: #e5e7eb; --dice-border-color: #374151; }
  .theme-pink-purple { --dice-primary-color: #ec4899; --dice-primary-hover: #db2777; --dice-secondary-color: #a855f7; --dice-bg-color: #fdf2f8; --dice-text-color: #831843; --dice-border-color: #fce7f3; --dice-border-radius: 12px; }
  .theme-red-gold { --dice-primary-color: #dc2626; --dice-primary-hover: #b91c1c; --dice-secondary-color: #f59e0b; --dice-bg-color: #fef2f2; --dice-text-color: #7f1d1d; --dice-border-color: #fca5a5; }
  .theme-mono { --dice-primary-color: #374151; --dice-primary-hover: #1f2937; --dice-secondary-color: #6b7280; --dice-border-radius: 2px; }
  .theme-cyber { --dice-primary-color: #00ff9f; --dice-primary-hover: #00cc7f; --dice-secondary-color: #ff00ff; --dice-bg-color: #0a0e27; --dice-text-color: #00ff9f; --dice-border-color: #00ff9f; --dice-border-radius: 0; --dice-result-text: #0a0e27; }
  .theme-pastel { --dice-primary-color: #a8dadc; --dice-primary-hover: #89c2c5; --dice-secondary-color: #f1faee; --dice-bg-color: #f1faee; --dice-text-color: #1d3557; --dice-border-color: #f1faee; --dice-border-radius: 16px; --dice-result-text: #1d3557; }
  
  .dice-input-group { display: flex; gap: 8px; margin-bottom: 12px; }
  .dice-input, .dice-select { flex: 1; padding: 8px 12px; border: 1px solid var(--dice-border-color); border-radius: var(--dice-border-radius); font-size: 14px; background: var(--dice-bg-color); color: var(--dice-text-color); }
  .dice-input:focus, .dice-select:focus { outline: none; border-color: var(--dice-primary-color); }
  .combo-input { flex: 2; }
  .combo-select { flex: 1; }
  .dice-roll-btn { padding: 8px 16px; background: var(--dice-primary-color); color: var(--dice-result-text); border: none; border-radius: var(--dice-border-radius); font-size: 14px; cursor: pointer; white-space: nowrap; }
  .dice-roll-btn:hover:not(:disabled) { background: var(--dice-primary-hover); }
  .dice-roll-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .dice-presets { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .preset-btn { padding: 6px 12px; background: var(--dice-bg-color); border: 1px solid var(--dice-primary-color); color: var(--dice-primary-color); border-radius: var(--dice-border-radius); font-size: 13px; cursor: pointer; }
  .preset-btn:hover { background: var(--dice-primary-color); color: var(--dice-result-text); }
  .dice-error { background: var(--dice-error-color); color: var(--dice-result-text); padding: 10px 12px; border-radius: var(--dice-border-radius); margin-bottom: 12px; font-size: 13px; }
  .dice-result { background: linear-gradient(135deg, var(--dice-primary-color) 0%, var(--dice-secondary-color) 100%); color: var(--dice-result-text); border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px; }
  .result-notation { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
  .result-total { font-size: 48px; font-weight: bold; line-height: 1; }
  .result-details { font-size: 13px; opacity: 0.85; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.3); }
  .breakdown { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }
  .die-value, .modifier, .total-value { padding: 4px 8px; background: rgba(255, 255, 255, 0.2); border-radius: var(--dice-border-radius); font-weight: 600; }
  .equals { opacity: 0.7; }
  .size-small .result-total { font-size: 32px; }
  .size-small .dice-result { padding: 12px; }
  .size-large .result-total { font-size: 64px; }
  .size-large .dice-result { padding: 24px; }
  .dice-history { border-top: 1px solid #e0e0e0; padding-top: 12px; }
  .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .history-title { font-size: 13px; font-weight: 600; color: #666; }
  .clear-history-btn { padding: 4px 8px; background: transparent; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; color: #666; cursor: pointer; }
  .clear-history-btn:hover { background: #f5f5f5; }
  .history-items { display: flex; flex-direction: column; gap: 6px; }
  .history-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8f9fa; border-radius: 4px; font-size: 13px; }
  .history-notation { color: var(--dice-primary-color); font-weight: 600; }
  .history-total { font-weight: bold; color: #333; }
  .dice-prepend:empty, .dice-append:empty { display: none; }
  .dice-prepend, .dice-append { margin-bottom: 12px; }
  .dice-actions:empty { display: none; }
  .dice-actions { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0; }
  .variant-compact .dice-input-group { margin-bottom: 8px; }
  .variant-compact .dice-result { padding: 12px; }
  .variant-compact .result-total { font-size: 36px; }
  .variant-inline .dice-input-group { margin-bottom: 0; }
  .variant-inline .dice-result { display: inline-flex; align-items: center; gap: 12px; padding: 8px 16px; margin-bottom: 0; }
  .variant-inline .result-notation { margin-bottom: 0; }
  .variant-inline .result-total { font-size: 24px; }
  .variant-inline .result-details { margin-top: 0; padding-top: 0; border-top: none; }
`;
document.head.appendChild(style);

// Expose component globally for slots page
window.VDiceRollerComponent = VDiceRollerComponent;

// Mount Vue app (unless skipAutoMount is set)
if (!window.skipAutoMount) {
  createApp({
    components: {
      'v-dice-roller': VDiceRollerComponent
    }
  }).mount('#app');
}
