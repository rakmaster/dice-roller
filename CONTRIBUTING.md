# Contributing to Dice Roller

Thank you for your interest in contributing! 🎲

## Development Workflow

### Branch Structure
- `main` - Production releases (tagged versions)
- `development` - Integration branch for features
- `feature/*` - Feature branches

### Getting Started

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/dice-roller.git
cd dice-roller
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a feature branch from development**
```bash
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Make your changes** in the appropriate package:
   - `packages/dice-roller-core/` - Core library
   - `packages/dice-roller-vue/` - Vue component

2. **Test your changes**
```bash
cd packages/dice-roller-core
npm test
```

3. **Build to verify**
```bash
npm run build
```

4. **Commit with conventional commits**
```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update README"
```

### Submitting Changes

1. **Push your branch**
```bash
git push origin feature/your-feature-name
```

2. **Create Pull Request**
   - Target: `development` branch
   - Provide clear description of changes
   - Reference any related issues

3. **Code Review**
   - Address feedback
   - Make requested changes
   - Push updates to your branch

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Add tests for new features
- Update documentation as needed

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Aim for high test coverage

### Documentation

- Update README.md if adding new features
- Add JSDoc comments for public APIs
- Update CHANGELOG.md for notable changes

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
