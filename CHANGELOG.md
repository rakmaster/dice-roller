# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-17

### Added
- Framework-agnostic dice rolling engine (`@dice-roller/core`)
- Vue 3 component with comprehensive features (`@dice-roller/vue`)
- 15 named slots for complete customization
- Events system: `@before-roll`, `@after-roll`, `@roll`, `@error`, `@validation-error`
- Two-way binding with `v-model:notation`
- Exposed API via template refs (roll, clearHistory, result, history, error, notation)
- Validation rules system for game-specific constraints
- Disabled and loading states
- Plugin architecture for animations and effects
- 20+ configurable props
- Multiple input types (text, select, combo)
- History tracking with customizable display
- Theming via CSS variables with 9 pre-built themes
- Interactive documentation with live playground
- Comprehensive API reference
- Full TypeScript support
- Seeded RNG for deterministic testing

### Documentation
- GitHub Pages site with interactive examples
- Complete API reference tables
- Usage examples and best practices
- Plugin interface documentation

[1.0.0]: https://github.com/rakmaster/dice-roller/releases/tag/v1.0.0
