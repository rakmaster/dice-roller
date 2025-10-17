<!--
Sync Impact Report:
- Version: NEW → 1.0.0 → 1.1.0 (Minor amendment)
- Ratification: 2025-10-16
- Last Amended: 2025-10-16
- Changes in v1.1.0:
  * Principle IV renamed: "Cross-Platform Compatibility" → "Reusable Core Architecture"
  * Removed framework-specific assumptions (React, platform prescriptions)
  * Clarified framework-agnostic approach supporting any consumption pattern (Vue, React, CLI, etc.)
  * Added explicit requirement: core logic must be importable without framework dependencies
- Templates status:
  ✅ spec-template.md - Compatible, no changes needed
  ✅ plan-template.md - Compatible, no changes needed
  ✅ tasks-template.md - Compatible, no changes needed
- Follow-up: None - templates remain compatible
-->

# DiceRoller Constitution

## Core Principles

### I. Simplicity First

Every feature MUST start with the simplest possible implementation that delivers value. Complex dice mechanics, statistical analysis, or advanced features are added only when user stories explicitly require them. YAGNI (You Aren't Gonna Need It) is strictly enforced.

**Rationale**: Dice rolling applications can become unnecessarily complex. Starting simple ensures rapid delivery and prevents over-engineering.

### II. Deterministic & Testable

All dice rolling logic MUST be deterministic and reproducible when seeded. Random number generation MUST support seeding for testing purposes. Every dice mechanic MUST have corresponding unit tests that verify correctness.

**Rationale**: Gaming applications require trustworthy randomness and verifiable fairness. Testability ensures dice mechanics work correctly and can be validated by users.

### III. User Story Driven (NON-NEGOTIABLE)

Features are implemented ONLY when backed by a prioritized user story with acceptance criteria. Each user story MUST be independently testable and deliverable as an MVP increment. Implementation follows strict priority order (P1 → P2 → P3).

**Rationale**: Prevents feature creep and ensures every development effort delivers measurable user value. Enables incremental delivery and validation.

### IV. Reusable Core Architecture

Core dice logic MUST be framework-agnostic and consumable across different contexts (library, CLI, web component, mobile, etc.). Business logic MUST NOT depend on UI frameworks, rendering engines, or platform-specific APIs. Presentation layers MUST be thin adapters around the core.

**Rationale**: Dice rolling logic should be reusable regardless of how it's consumed - whether as a Vue component (`<v-dice-roller>`), React hook, CLI tool, or native mobile app. Separating concerns enables maximum flexibility and code reuse.

### V. Performance & Responsiveness

Dice rolls MUST complete in under 100ms for standard operations (up to 100 dice). Complex calculations (statistics, probability) MUST provide progress feedback for operations exceeding 500ms. Memory usage MUST remain under 50MB for typical use cases.

**Rationale**: Users expect instant feedback when rolling dice. Performance constraints ensure responsive UX even on mobile devices.

## Quality Standards

### Testing Requirements

- **Unit Tests**: MUST cover all dice mechanics, probability calculations, and core logic
- **Integration Tests**: MUST verify platform adapters work correctly with core logic
- **Property-Based Tests**: SHOULD be used for complex dice mechanics to verify mathematical properties
- **Test Coverage**: Minimum 80% code coverage for core dice logic

### Code Quality

- Clear, descriptive naming for dice types and mechanics (e.g., `rollD20WithAdvantage`, not `r20a`)
- Comprehensive documentation for complex dice mechanics and probability calculations
- Type safety enforced where language supports it (TypeScript, Python type hints, etc.)
- No magic numbers - dice configurations MUST be named constants
- Core logic MUST be importable and usable without framework dependencies

## Development Workflow

### Feature Development Process

1. **Specification**: Create user story with acceptance criteria in spec.md
2. **Planning**: Design technical approach in plan.md with constitution check
3. **Task Generation**: Break down into independently testable tasks in tasks.md
4. **Implementation**: Follow test-first approach for each task
5. **Validation**: Verify user story acceptance criteria before marking complete

### Constitution Compliance

- All feature specifications MUST include a constitution check section
- Complexity violations MUST be explicitly justified with rationale
- Code reviews MUST verify compliance with simplicity and testability principles
- Performance requirements MUST be validated before feature completion

## Governance

This constitution supersedes all other development practices. Amendments require:

1. Documentation of proposed change with rationale
2. Impact analysis on existing features and templates
3. Version bump following semantic versioning (MAJOR.MINOR.PATCH)
4. Update of all dependent templates and documentation

All features, pull requests, and code reviews MUST verify compliance with these principles. Complexity MUST be justified against simpler alternatives. When in doubt, choose simplicity over sophistication.

**Version**: 1.1.0 | **Ratified**: 2025-10-16 | **Last Amended**: 2025-10-16
