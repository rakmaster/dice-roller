# Deployment Guide

## GitHub Pages Setup

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Dice Roller library with Vue component"
git branch -M main
git remote add origin https://github.com/rakmaster/dice-roller.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository: https://github.com/rakmaster/dice-roller
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** → **/docs**
   - Click **Save**

### 3. Wait for Deployment

GitHub will automatically build and deploy your site. It usually takes 1-2 minutes.

Your site will be live at: **https://rakmaster.github.io/dice-roller/**

## Publishing to npm

### Core Library

```bash
cd packages/dice-roller-core
npm login
npm publish --access public
```

### Vue Component

```bash
cd packages/dice-roller-vue
npm login
npm publish --access public
```

## Update Package Names

Before publishing, update the package names in `package.json` files:

**packages/dice-roller-core/package.json**:
```json
{
  "name": "@rakmaster/dice-roller-core",
  ...
}
```

**packages/dice-roller-vue/package.json**:
```json
{
  "name": "@rakmaster/dice-roller-vue",
  ...
}
```

## Repository URLs

- **Repository**: https://github.com/rakmaster/dice-roller
- **Documentation**: https://rakmaster.github.io/dice-roller/
- **Issues**: https://github.com/rakmaster/dice-roller/issues
- **Contact**: logan@phantasea.net

## Files Ready for Deployment

✅ **docs/** - Complete documentation website
✅ **README.md** - Updated with your GitHub username
✅ **packages/** - Core library and Vue component
✅ All GitHub links updated to @rakmaster

## Next Steps

1. Create the repository on GitHub
2. Push your code
3. Enable GitHub Pages
4. (Optional) Publish to npm
5. Share your project!

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to the `docs/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use custom domain
