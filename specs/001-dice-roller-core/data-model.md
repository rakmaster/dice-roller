# Data Model: Dice Roller Core Library

**Date**: 2025-10-16  
**Feature**: 001-dice-roller-core  
**Purpose**: Define core entities and their relationships

## Entity Overview

```
┌─────────────────┐
│  DiceNotation   │──────┐
│  (Input)        │      │
└─────────────────┘      │
                         │ parsed by
                         ▼
                   ┌─────────────┐
                   │   Parser    │
                   └─────────────┘
                         │
                         │ produces
                         ▼
┌─────────────────┐      │      ┌──────────────────┐
│   DieType       │◄─────┼─────►│   RollResult     │
│  (Constants)    │      │      │   (Output)       │
└─────────────────┘      │      └──────────────────┘
                         │
                         │ detailed version
                         ▼
                   ┌──────────────────────┐
                   │ DetailedRollResult   │
                   │ (Output)             │
                   └──────────────────────┘
```

---

## Core Entities

### 1. DiceNotation

**Purpose**: Represents a parsed dice expression

**Attributes**:
- `count: number` - Number of dice to roll (1-100)
- `sides: number` - Number of sides on each die (4, 6, 8, 10, 12, 20, 100)
- `modifier: number` - Optional modifier to add/subtract (default: 0)

**Validation Rules**:
- `count` must be between 1 and 100 (inclusive)
- `sides` must be one of: 4, 6, 8, 10, 12, 20, 100
- `modifier` can be any integer (positive, negative, or zero)

**Example**:
```typescript
{
  count: 2,
  sides: 6,
  modifier: 3
} // Represents "2d6+3"
```

**Relationships**:
- References `DieType` enum for valid sides values
- Input to roller functions
- Produced by parser

---

### 2. RollResult

**Purpose**: Represents the outcome of a simple dice roll (P1, P2)

**Attributes**:
- `total: number` - Final calculated result including modifier
- `notation: string` - Original notation string (e.g., "2d6+3")

**Validation Rules**:
- `total` must be within valid range for the notation
  - Minimum: count × 1 + modifier
  - Maximum: count × sides + modifier

**Example**:
```typescript
{
  total: 11,
  notation: "2d6+3"
} // Rolled [4, 4] + 3 = 11
```

**Relationships**:
- Returned by `roll()` function
- Simpler version of `DetailedRollResult`

---

### 3. DetailedRollResult

**Purpose**: Represents the outcome of a detailed dice roll with individual die values (P3)

**Attributes**:
- `rolls: number[]` - Individual die roll values
- `modifier: number` - The modifier applied
- `total: number` - Final calculated result (sum of rolls + modifier)
- `notation: string` - Original notation string

**Validation Rules**:
- `rolls.length` must equal the count from notation
- Each value in `rolls` must be between 1 and sides (inclusive)
- `total` must equal sum(rolls) + modifier

**Example**:
```typescript
{
  rolls: [4, 6, 2],
  modifier: 3,
  total: 15,
  notation: "3d6+3"
} // Rolled [4, 6, 2] + 3 = 15
```

**Relationships**:
- Returned by `rollDetailed()` function
- Extended version of `RollResult` with transparency

---

### 4. DieType (Enum/Constants)

**Purpose**: Valid die types in standard RPG sets

**Values**:
```typescript
const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DIE_TYPES[number]; // 4 | 6 | 8 | 10 | 12 | 20 | 100
```

**Validation Rules**:
- Only these values are accepted for die sides
- Used by parser to validate notation

**Rationale**:
- Matches standard physical RPG dice sets
- Prevents invalid die types like d7, d3, d13

---

## State Transitions

### Parsing Flow

```
Input String
    │
    ▼
"2d6+3" ──► trim() ──► regex match ──► validate ──► DiceNotation
    │                                       │
    │                                       ▼
    └──────────────────────────────► Error (invalid)
```

### Rolling Flow (Simple)

```
DiceNotation
    │
    ▼
Generate random numbers ──► Sum results ──► Add modifier ──► RollResult
    │
    └─► Uses seeded RNG for deterministic testing
```

### Rolling Flow (Detailed)

```
DiceNotation
    │
    ▼
Generate random numbers ──► Store individual rolls ──► Sum + modifier ──► DetailedRollResult
    │                            │
    │                            └─► Preserved for transparency
    └─► Uses seeded RNG for deterministic testing
```

---

## Validation Matrix

| Entity | Field | Valid Range | Error Message |
|--------|-------|-------------|---------------|
| DiceNotation | count | 1-100 | "Dice count must be between 1 and 100" |
| DiceNotation | sides | 4,6,8,10,12,20,100 | "Invalid die type: dX. Must be d4, d6, d8, d10, d12, d20, or d100" |
| DiceNotation | modifier | any integer | N/A (always valid) |
| RollResult | total | count*1+mod to count*sides+mod | Internal consistency check |
| DetailedRollResult | rolls.length | equals count | Internal consistency check |
| DetailedRollResult | rolls[i] | 1 to sides | Internal consistency check |

---

## Type Safety Guarantees

### Compile-Time Checks
- TypeScript ensures all fields are present
- Literal types prevent invalid die types
- Number types prevent string/boolean confusion

### Runtime Checks
- Parser validates notation format
- Validator ensures count/sides are in range
- Roller verifies results are mathematically correct

---

## Memory Footprint

**Estimated sizes** (per instance):
- `DiceNotation`: ~24 bytes (3 numbers)
- `RollResult`: ~40 bytes (1 number + string reference)
- `DetailedRollResult`: ~40 bytes + (8 bytes × roll count)
  - For 100d20: ~840 bytes
  - Well under 50MB memory constraint

**Optimization notes**:
- No object pooling needed (short-lived objects)
- Strings are immutable and shared
- Arrays are sized exactly to roll count

---

## Extension Points

**Future enhancements** (not in current scope):
- Advantage/disadvantage rolls (keep highest/lowest)
- Exploding dice (reroll on max)
- Critical success/failure detection
- Roll history/statistics

These would add new entity types but wouldn't break existing contracts.
