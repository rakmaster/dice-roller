# Feature Specification: Dice Roller Core Library

**Feature Branch**: `001-dice-roller-core`  
**Created**: 2025-10-16  
**Status**: Draft  
**Input**: User description: "Create a dice roller library with a core package for dice mechanics and a Vue component wrapper. Support standard RPG notation like 2d6+3 and 1d20, multiple dice types, modifiers, and provide both individual roll results and totals."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Dice Rolling (Priority: P1)

A developer can import the core library and roll standard RPG dice using simple notation. They can roll a single die type (like "1d20") and get back the result as a number.

**Why this priority**: This is the absolute minimum viable product - the core value proposition of a dice roller. Without this, nothing else matters.

**Independent Test**: Can be fully tested by importing the library, calling a roll function with "1d20", and verifying a number between 1-20 is returned. Delivers immediate value as a usable dice roller.

**Acceptance Scenarios**:

1. **Given** the core library is imported, **When** a developer calls roll with "1d20", **Then** a result between 1 and 20 is returned
2. **Given** the core library is imported, **When** a developer calls roll with "2d6", **Then** a result between 2 and 12 is returned
3. **Given** the core library is imported, **When** a developer calls roll with "3d8", **Then** a result between 3 and 24 is returned
4. **Given** an invalid notation is provided, **When** a developer calls roll, **Then** a clear error message is returned

---

### User Story 2 - Dice Notation with Modifiers (Priority: P2)

A developer can roll dice with mathematical modifiers using standard RPG notation like "2d6+3" or "1d20-2". The system calculates the total including the modifier.

**Why this priority**: Modifiers are essential for most RPG systems. This extends the MVP to cover the majority of common use cases.

**Independent Test**: Can be tested by calling roll with "2d6+3" and verifying the result is between 5 and 15. Works independently of other features.

**Acceptance Scenarios**:

1. **Given** the core library is imported, **When** a developer calls roll with "2d6+3", **Then** the result is between 5 and 15
2. **Given** the core library is imported, **When** a developer calls roll with "1d20-2", **Then** the result is between -1 and 18
3. **Given** the core library is imported, **When** a developer calls roll with "3d4+5", **Then** the result is between 8 and 17

---

### User Story 3 - Detailed Roll Results (Priority: P3)

A developer can request detailed results that show both individual die rolls and the final total. This allows them to display "You rolled: [4, 6, 2] + 3 = 15" to end users.

**Why this priority**: Enhanced user experience for applications that want to show transparency in dice rolls. Not required for basic functionality but adds significant value for gaming applications.

**Independent Test**: Can be tested by calling a detailed roll function with "3d6+3" and verifying the response includes an array of individual rolls, the modifier, and the total.

**Acceptance Scenarios**:

1. **Given** the core library is imported, **When** a developer calls rollDetailed with "3d6+3", **Then** the result includes individual rolls array, modifier value, and total
2. **Given** the core library is imported, **When** a developer calls rollDetailed with "1d20", **Then** the result includes the single die value and total
3. **Given** the core library is imported, **When** a developer calls rollDetailed with "2d8-1", **Then** the result shows both die values, the negative modifier, and final total

---

### Edge Cases

- What happens when notation has zero dice (e.g., "0d6")?
- What happens when notation has extremely large numbers (e.g., "999d999")?
- How does the system handle invalid notation formats (e.g., "d20d6", "2x6", "abc")?
- What happens with negative die counts (e.g., "-2d6")?
- How are decimal modifiers handled (e.g., "2d6+2.5")?
- What happens with whitespace in notation (e.g., "2 d 6 + 3")?
- How does the system handle die types that don't exist in standard RPG sets (e.g., "1d7", "2d3")?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Library MUST parse standard RPG dice notation in the format "XdY" where X is the number of dice and Y is the die type
- **FR-002**: Library MUST support modifiers in the format "XdY+Z" or "XdY-Z" where Z is a positive or negative integer
- **FR-003**: Library MUST support standard RPG die types: d4, d6, d8, d10, d12, d20, d100
- **FR-004**: Library MUST generate random numbers within the valid range for each die type
- **FR-005**: Library MUST return clear error messages for invalid notation formats
- **FR-006**: Library MUST provide a simple roll function that returns only the final total
- **FR-007**: Library MUST provide a detailed roll function that returns individual die results, modifier, and total
- **FR-008**: Library MUST be importable without any UI framework dependencies
- **FR-009**: Library MUST support seeded random number generation for testing and reproducibility
- **FR-010**: Library MUST validate input notation before attempting to roll
- **FR-011**: Library MUST handle whitespace in notation gracefully (trim or accept)
- **FR-012**: Library MUST support rolling 1 to 100 dice in a single notation

### Key Entities

- **DiceNotation**: Represents a parsed dice expression containing die count, die type, and optional modifier
- **RollResult**: Represents the outcome of a dice roll with individual die values and calculated total
- **DieType**: Represents valid die types (d4, d6, d8, d10, d12, d20, d100) with their numeric ranges

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dice rolls complete in under 100ms for standard operations (up to 100 dice)
- **SC-002**: Library can be imported and used with a single function call (roll("2d6+3"))
- **SC-003**: 100% of valid RPG dice notations (XdY format with standard die types) are correctly parsed and rolled
- **SC-004**: Invalid notation returns clear, actionable error messages within 10ms
- **SC-005**: Library bundle size remains under 10KB (minified and gzipped) for core functionality
- **SC-006**: Zero runtime dependencies on UI frameworks or external libraries
- **SC-007**: All dice rolls with the same seed produce identical results (deterministic testing)

