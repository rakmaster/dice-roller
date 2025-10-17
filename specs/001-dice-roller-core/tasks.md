# Tasks: Dice Roller Core Library

**Input**: Design documents from `/specs/001-dice-roller-core/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.ts

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Monorepo structure**: `packages/dice-roller-core/`, `packages/dice-roller-vue/`
- Core package: `packages/dice-roller-core/src/`, `packages/dice-roller-core/tests/`
- Vue package: `packages/dice-roller-vue/src/`, `packages/dice-roller-vue/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create monorepo root structure with packages/ directory
- [x] T002 Create root package.json with npm workspaces configuration
- [x] T003 [P] Create root tsconfig.base.json with shared TypeScript configuration
- [x] T004 [P] Create .gitignore file for node_modules, dist, and build artifacts
- [x] T005 [P] Create root README.md with project overview and structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Initialize dice-roller-core package structure in packages/dice-roller-core/
- [x] T007 Create packages/dice-roller-core/package.json with TypeScript 5.x and Vitest dependencies
- [x] T008 [P] Create packages/dice-roller-core/tsconfig.json extending root config
- [x] T009 [P] Create packages/dice-roller-core/vite.config.ts for Vitest configuration
- [x] T010 [P] Create packages/dice-roller-core/src/constants.ts with DIE_TYPES, MIN_DICE_COUNT, MAX_DICE_COUNT
- [x] T011 [P] Create packages/dice-roller-core/src/types.ts with DieType, DiceNotation, RollResult, DetailedRollResult interfaces
- [x] T012 Create packages/dice-roller-core/src/random.ts with Mulberry32 seeded RNG implementation

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Dice Rolling (Priority: P1) 🎯 MVP

**Goal**: Developer can import library and roll standard RPG dice using simple notation (e.g., "1d20")

**Independent Test**: Import library, call roll("1d20"), verify result is between 1-20

### Implementation for User Story 1

- [x] T013 [P] [US1] Create packages/dice-roller-core/src/validators.ts with notation validation functions
- [x] T014 [P] [US1] Create packages/dice-roller-core/src/parser.ts with parseDiceNotation function using regex
- [x] T015 [US1] Create packages/dice-roller-core/src/roller.ts with roll() function (simple total only)
- [x] T016 [US1] Create packages/dice-roller-core/src/index.ts exporting roll, parseDiceNotation, types
- [x] T017 [US1] Add error classes (InvalidNotationError, InvalidDiceCountError, InvalidDieTypeError) to packages/dice-roller-core/src/index.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Dice Notation with Modifiers (Priority: P2)

**Goal**: Developer can roll dice with modifiers using notation like "2d6+3" or "1d20-2"

**Independent Test**: Call roll("2d6+3"), verify result is between 5-15

### Implementation for User Story 2

- [ ] T018 [US2] Update packages/dice-roller-core/src/parser.ts to parse modifier from notation (±Z)
- [ ] T019 [US2] Update packages/dice-roller-core/src/roller.ts roll() function to apply modifier to total
- [ ] T020 [US2] Update packages/dice-roller-core/src/validators.ts to validate modifier format

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Detailed Roll Results (Priority: P3)

**Goal**: Developer can request detailed results showing individual die rolls and total

**Independent Test**: Call rollDetailed("3d6+3"), verify response includes rolls array, modifier, and total

### Implementation for User Story 3

- [ ] T021 [US3] Create rollDetailed() function in packages/dice-roller-core/src/roller.ts returning DetailedRollResult
- [ ] T022 [US3] Update packages/dice-roller-core/src/index.ts to export rollDetailed function

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Testing & Quality

**Purpose**: Comprehensive test coverage for all user stories

- [x] T023 [P] Create packages/dice-roller-core/tests/unit/constants.test.ts testing DIE_TYPES array
- [ ] T024 [P] Create packages/dice-roller-core/tests/unit/types.test.ts testing type definitions
- [x] T025 [P] Create packages/dice-roller-core/tests/unit/random.test.ts testing seeded RNG determinism
- [x] T026 [P] Create packages/dice-roller-core/tests/unit/validators.test.ts testing validation logic
- [x] T027 [P] Create packages/dice-roller-core/tests/unit/parser.test.ts testing notation parsing
- [x] T028 [P] Create packages/dice-roller-core/tests/unit/roller.test.ts testing roll() and rollDetailed()
- [ ] T029 Create packages/dice-roller-core/tests/property/dice-mechanics.test.ts with property-based tests using fast-check

---

## Phase 7: Vue Component Wrapper

**Purpose**: Create Vue 3 component wrapper for core library

- [ ] T030 Initialize dice-roller-vue package structure in packages/dice-roller-vue/
- [ ] T031 Create packages/dice-roller-vue/package.json with dependencies on dice-roller-core and Vue 3
- [ ] T032 [P] Create packages/dice-roller-vue/tsconfig.json extending root config
- [ ] T033 [P] Create packages/dice-roller-vue/src/composables/useDiceRoller.ts Vue composable wrapping core functions
- [ ] T034 Create packages/dice-roller-vue/src/VDiceRoller.vue component using useDiceRoller composable
- [ ] T035 Create packages/dice-roller-vue/src/index.ts exporting component and composable
- [ ] T036 [P] Create packages/dice-roller-vue/tests/VDiceRoller.test.ts component tests

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T037 [P] Create packages/dice-roller-core/README.md with usage examples and API documentation
- [ ] T038 [P] Create packages/dice-roller-vue/README.md with Vue component usage examples
- [ ] T039 [P] Add JSDoc comments to all public functions in packages/dice-roller-core/src/
- [ ] T040 [P] Configure build scripts in package.json files for both packages
- [ ] T041 [P] Add type declaration generation to tsconfig.json files
- [ ] T042 Run test suite and verify 80%+ coverage across all packages
- [ ] T043 Validate bundle size <10KB for dice-roller-core package
- [ ] T044 Validate performance: rolls complete in <100ms for 100 dice

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Testing (Phase 6)**: Can proceed in parallel with user stories or after
- **Vue Wrapper (Phase 7)**: Depends on User Story 1 (P1) minimum, ideally all core stories
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Adds new function, independently testable

### Within Each User Story

- Parser before roller (parser is used by roller)
- Validators before parser (validation used during parsing)
- Types and constants before everything (foundational)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All test tasks marked [P] can run in parallel
- Documentation tasks can run in parallel with implementation

---

## Parallel Example: User Story 1

```bash
# Launch foundational tasks together:
Task: "Create constants.ts with DIE_TYPES"
Task: "Create types.ts with interfaces"

# Then launch US1 implementation together:
Task: "Create validators.ts"
Task: "Create parser.ts"

# Then sequential:
Task: "Create roller.ts" (depends on parser and validators)
Task: "Create index.ts" (depends on roller)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Optionally add tests (Phase 6)
6. Deploy/publish if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Publish v0.1.0 (MVP!)
3. Add User Story 2 → Test independently → Publish v0.2.0
4. Add User Story 3 → Test independently → Publish v0.3.0
5. Add Vue wrapper → Publish dice-roller-vue v0.1.0
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 (can start in parallel)
   - Developer C: User Story 3 (can start in parallel)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Tests are included but can be deferred if rapid prototyping is preferred
- Vue wrapper (Phase 7) is optional - core library is fully functional without it
