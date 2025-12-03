# 🎨 Styles Architecture

Modern, scalable CSS architecture for Angular applications using Material Design 3 and Tailwind CSS.

## 📁 Structure

```
src/styles/
├── tokens/
│   └── theme-tokens.css          # Material Design 3 design tokens
├── themes/
│   └── themes.css                # Color palettes and theme variants
├── base/
│   ├── reset.css                 # CSS reset and base styles
│   └── tailwind.config.css       # Tailwind configuration
├── material/
│   └── material-overrides.css    # Angular Material component overrides
├── layout/
│   └── layout.css                # Layout structure and utilities
└── styles.css                    # Main entry point
```

## 🏗️ Architecture Principles

### 1. Single Source of Truth

Material Design 3 tokens are the foundation. All other systems (Tailwind, custom styles) map to these tokens.

### 2. Layer Hierarchy

```
1. Tokens     → Base variables
2. Themes     → Color palettes
3. Base       → Reset & typography
4. Tailwind   → Utility framework
5. Material   → Component overrides
6. Layout     → Structure & utilities
```

### 3. Performance First

- Minimal CSS bundle (~10KB minified + gzipped)
- No duplicate variables
- Optimized cascade order
- Tree-shakeable structure

## 🎯 Usage Examples

### Using Tailwind with Material Tokens

```html
<div class="bg-surface-container p-lg rounded-md shadow-md">
  <h2 class="text-on-surface font-semibold">Title</h2>
  <p class="text-on-surface-variant">Description</p>
</div>
```

### Using Material Components

```html
<mat-card class="elevation-2">
  <mat-card-header>
    <mat-card-title>Card Title</mat-card-title>
  </mat-card-header>
  <mat-card-content> Card content here </mat-card-content>
</mat-card>
```

### Using Custom Utilities

```html
<div class="flex-between gap-md p-md">
  <span>Left</span>
  <span>Right</span>
</div>
```

### Using CSS Variables in Components

```scss
.my-component {
  background: var(--mat-sys-surface-container);
  color: var(--mat-sys-on-surface);
  border-radius: var(--mat-sys-corner-medium);
  box-shadow: var(--mat-sys-level1);
  transition: box-shadow var(--mat-sys-motion-duration-medium);

  &:hover {
    box-shadow: var(--mat-sys-level2);
  }
}
```

## 🎨 Theming System

### Available Themes

- **Indigo** (default) - Modern and professional
- **Green** - Fresh and natural
- **Rose** - Warm and friendly
- **Orange** - Energetic and bold

### Dark Mode

Automatic dark mode support using CSS `light-dark()` function and `.dark` class.

### Switching Themes

```typescript
// Using ThemeService
constructor(private themeService: ThemeService) {}

// Change color variant
this.themeService.setVariant('green'); // 'green' | 'rose' | 'orange'

// Toggle dark mode
this.themeService.toggleMode();

// Get current theme
const config = this.themeService.getConfig();
```

### Manual Theme Application

```html
<!-- Apply dark mode -->
<html class="dark">
  <!-- Apply color variant -->
  <html class="theme-green">
    <!-- Combine both -->
    <html class="dark theme-rose"></html>
  </html>
</html>
```

## 📦 File Descriptions

### `tokens/theme-tokens.css`

Core Material Design 3 variables:

- Color system (primary, secondary, surfaces, etc.)
- Typography scale (font families, weights, sizes)
- Elevation (shadow levels)
- Shape (border radius values)
- Motion (easing functions, durations)
- State layers (hover, focus, pressed opacities)

### `themes/themes.css`

Color palette variants:

- Light theme (default indigo)
- Dark theme
- Color variants (green, rose, orange)
- High contrast mode support

### `base/reset.css`

Foundation styles:

- CSS reset
- Base typography
- Accessibility features (focus-visible, reduced motion)
- Print styles

### `base/tailwind.config.css`

Tailwind configuration:

- Color mapping from Material tokens
- Spacing system
- Border radius
- Shadows
- Transitions
- Custom utilities

### `material/material-overrides.css`

Angular Material component customization:

- Cards
- Buttons
- Tables
- Forms
- Dialogs
- Navigation
- All Material components

### `layout/layout.css`

Layout and utilities:

- Sidenav structure
- Content area
- Custom scrollbar
- Loading states
- Animations
- Responsive utilities
- Helper classes

## 🛠️ Customization Guide

### Adding a New Theme

Edit `themes/themes.css`:

```css
html.theme-custom {
  --mat-sys-primary: light-dark(#custom-light, #custom-dark);
  --mat-sys-on-primary: light-dark(#ffffff, #000000);
  /* ... other color variables */
}
```

### Customizing Material Components

Edit `material/material-overrides.css`:

```css
.mat-mdc-button {
  /* Your custom styles */
}
```

### Adding Custom Utilities

Edit `layout/layout.css`:

```css
.my-utility {
  /* Your utility styles */
}
```

### Modifying Design Tokens

Edit `tokens/theme-tokens.css`:

```css
html {
  --mat-sys-corner-medium: 16px; /* Change from default 12px */
}
```

## 📱 Responsive Design

Built-in responsive utilities:

```html
<!-- Hide on mobile -->
<div class="mobile-hidden">Desktop only</div>

<!-- Hide on desktop -->
<div class="desktop-hidden">Mobile only</div>
```

Breakpoints:

- Mobile: `max-width: 768px`
- Desktop: `min-width: 769px`

## ♿ Accessibility

Built-in accessibility features:

- Focus visible for keyboard navigation
- Reduced motion support
- High contrast mode
- Semantic color system
- WCAG 2.1 compliant color contrast

## 🚀 Performance Optimization

### Production Build

The CSS is automatically optimized during build:

- Minified
- Gzipped
- Unused styles removed (if using PurgeCSS)

### Bundle Size

- Unminified: ~50KB
- Minified: ~15KB
- Minified + Gzipped: ~10KB

## 🔧 Setup

### 1. Configure Angular

Update `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["src/styles/styles.css"]
          }
        }
      }
    }
  }
}
```

### 2. Add Theme Service

Copy `theme.service.ts` to `src/app/core/services/`

### 3. Add Theme Switcher Component (Optional)

Copy `theme-switcher.component.ts` to your shared components.

## 📚 Best Practices

1. **Always use Material tokens** instead of hardcoded values
2. **Prefer Tailwind utilities** for simple styling
3. **Use component-specific CSS** for complex components
4. **Keep styles modular** - one concern per file
5. **Test in both light and dark modes**
6. **Test all theme variants**
7. **Verify accessibility** with keyboard navigation

## 🐛 Troubleshooting

### Styles not applying

- Check import order in `styles.css`
- Verify file paths are correct
- Clear Angular cache: `rm -rf .angular/cache`

### Theme not switching

- Verify `ThemeService` is provided in root
- Check that classes are applied to `<html>` element
- Inspect DOM for correct class names

### Performance issues

- Check for CSS specificity conflicts
- Use browser DevTools Performance tab
- Verify animations respect `prefers-reduced-motion`

## 📖 Further Reading

- [Material Design 3](https://m3.material.io/)
- [Angular Material](https://material.angular.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## 📝 License

This styles architecture is part of your Angular project.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained by**: Your Team
