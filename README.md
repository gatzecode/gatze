# Gatze

A modern Angular 21 admin dashboard application showcasing advanced layout management, theming capabilities, and enterprise-grade architecture patterns.

## Project Overview

Gatze is a sophisticated single-page application built with the latest Angular features, implementing a responsive admin interface with dynamic layout switching, Material Design 3 integration, and signal-based reactive state management.

**Key Features:**
- Multiple navigation layouts (Classic and Dense)
- Advanced theming system with 4 color palettes
- Light/dark mode with system preference detection
- Responsive design with automatic mobile adaptation
- Signal-based reactive state management
- Server-side rendering ready
- Zoneless change detection for optimal performance

## Technology Stack

### Core Framework
- **Angular 21.0.2** - Latest Angular framework with standalone components
- **TypeScript 5.9.2** - Strict mode enabled for type safety
- **RxJS 7.8.0** - Reactive programming library

### UI Framework & Styling
- **Angular Material 21.0.1** - Material Design 3 components
- **Angular CDK 21.0.1** - Component Development Kit
- **Tailwind CSS 4.1.17** - Latest Tailwind v4 with @theme directive
- **PostCSS 8.5.6** - CSS processing with @tailwindcss/postcss plugin
- **Custom CSS Variables** - Material Design 3 token system

### Build Tools
- **Angular CLI 21.0.1** - Official Angular command-line interface
- **@angular/build 21.0.1** - Vite-based build system
- **esbuild** - Fast JavaScript bundler
- **TypeScript Compiler** - With strict mode and isolated modules

### Testing
- **Karma 6.4.0** - Test runner
- **Jasmine 5.9.0** - Testing framework
- **karma-chrome-launcher** - Chrome browser testing
- **karma-coverage** - Code coverage reports

### Development Tools
- **Prettier** - Code formatting
- **EditorConfig** - Consistent coding styles
- **VS Code** - Recommended IDE with extensions

## Architecture Overview

### Modern Angular Features

**Standalone Component Architecture:**
- No NgModules - all components are standalone
- Direct component imports for better tree-shaking
- Improved code splitting and bundle size optimization

**Signal-Based Reactive State:**
```typescript
readonly themeColor = signal<ThemeColor>(DEFAULT_CONFIG.themeColor);
readonly isDarkMode = computed(() => {
  const mode = this.themeMode();
  if (mode === 'auto') return this.systemPrefersDark();
  return mode === 'dark';
});
```

**Zoneless Change Detection:**
- Configured via `provideZonelessChangeDetection()`
- Improved performance by eliminating Zone.js overhead
- Fine-grained reactivity with signals

**Dependency Injection with inject():**
```typescript
private breakpointService = inject(BreakpointService);
private configService = inject(ConfigService);
```

## Project Structure

```
gatze/
├── src/
│   ├── app/
│   │   ├── core/                      # Core singleton services
│   │   │   └── services/
│   │   │       ├── config.service.ts         # Theme & layout configuration
│   │   │       ├── breakpoint.service.ts     # Responsive breakpoint detection
│   │   │       └── localstorege.service.ts   # LocalStorage wrapper
│   │   │
│   │   ├── shared/                    # Shared components & layouts
│   │   │   ├── components/
│   │   │   │   ├── nav/              # Navigation system
│   │   │   │   │   ├── base-nav.ts          # Abstract base class
│   │   │   │   │   ├── classic/             # Classic nav layout
│   │   │   │   │   ├── dense/               # Dense nav layout
│   │   │   │   │   └── navigation.types.ts  # Type definitions
│   │   │   │   ├── settings/                # Settings panel
│   │   │   │   ├── user-account/            # User account component
│   │   │   │   └── app-branding/            # App branding
│   │   │   │
│   │   │   └── layouts/              # Layout containers
│   │   │       ├── main/             # Main layout orchestrator
│   │   │       ├── classic/          # Classic layout wrapper
│   │   │       └── dense/            # Dense layout wrapper
│   │   │
│   │   ├── views/                     # Feature views/pages
│   │   │   ├── dashboard/            # Dashboard page
│   │   │   ├── product/              # Product management
│   │   │   └── user/                 # User management
│   │   │
│   │   ├── app.ts                     # Root component
│   │   ├── app.config.ts              # Application configuration
│   │   └── app.routes.ts              # Route definitions
│   │
│   ├── assets/                        # Static assets
│   ├── styles.css                     # Global styles
│   ├── theme.css                      # Material Design 3 theme
│   ├── tailwinds.css                  # Tailwind configuration
│   └── main.ts                        # Application entry point
│
├── public/                            # Static files served as-is
├── angular.json                       # Angular workspace configuration
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
└── postcss.config.json               # PostCSS configuration
```

### Directory Purposes

**`src/app/core/`** - Application-wide singleton services
- Configuration management
- Breakpoint detection
- Storage abstraction

**`src/app/shared/`** - Reusable components and layouts
- Navigation components (Classic, Dense)
- Layout containers
- Common UI components

**`src/app/views/`** - Feature modules and pages
- Dashboard with charts and stats
- Product management with CRUD operations
- User management

## Architectural Patterns

### 1. Template-Driven Layout System
The main layout acts as a template/mold that dynamically switches between Classic and Dense layouts based on user preference and device type.

### 2. Abstract Base Classes for Code Reuse
- `BaseNav` contains shared navigation logic
- `ClassicNav` and `DenseNav` extend the base class
- Reduces code duplication while maintaining flexibility

### 3. Service Layer Pattern
- Singleton services via `providedIn: 'root'`
- Centralized state management
- Persistent storage abstraction

### 4. Computed Signals for Derived State
```typescript
protected effectiveLayout = computed<LayoutType>(() => {
  const isMobile = this.isHandset();
  const configuredLayout = this.configService.layout();
  if (isMobile) return 'classic';
  return configuredLayout;
});
```

### 5. Observable-to-Signal Conversion
Bridging RxJS Observables with Angular Signals:
```typescript
const navigationEnd$ = this.router.events.pipe(
  filter(event => event instanceof NavigationEnd)
);
const navigationEndSignal = toSignal(navigationEnd$);
```

### 6. Material Design 3 Token System
- CSS custom properties for theming
- Multiple theme palettes (indigo, green, rose, orange)
- Light/dark mode with system preference detection
- `light-dark()` function for automatic color switching

### 7. Lazy Loading Routes
```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./views/dashboard/dashboard')
    .then((m) => m.Dashboard),
  title: 'Dashboard',
}
```

## Layout System

The application uses a modular layout architecture that enables efficient switching between different navigation styles while maintaining a consistent user experience.

### Main Layout Component

The `MainComponent` (`src/app/shared/layouts/main/`) serves as a **layout template/mold** that provides:

- Material Sidenav container structure
- Responsive behavior (mobile/desktop)
- Fixed toolbar
- Scrollable content area
- Theme management integration
- Navigation variant selection

#### Responsive Layout Switching

The MainComponent automatically adapts the navigation layout based on device type:

**Desktop/Tablet:**
- Users can choose between `classic` and `dense` layouts
- Layout preference is saved to localStorage
- Smooth transitions between layouts

**Mobile (Handset):**
- **Automatically forces `classic` layout** regardless of user preference
- Dense layout is disabled on mobile for better UX
- Sidenav opens in `over` mode (overlays content)
- Sidenav is closed by default on mobile

**Implementation:**
```typescript
// Computed signal that forces classic on mobile
protected effectiveLayout = computed<LayoutType>(() => {
  const isMobile = this.isHandset();
  const configuredLayout = this.configService.layout();

  // Force classic layout on mobile devices
  if (isMobile) {
    return 'classic';
  }

  return configuredLayout;
});
```

This ensures optimal UX across all device sizes without manual configuration.

### Navigation Components

The application features a modern, signal-based navigation system located in `src/app/shared/components/nav/`:

#### ClassicNav (`nav-classic`)

Traditional navigation with full text labels and icons:

**Features:**
- Auto-expand active menu items on navigation
- Optional collapse of other items when expanding one
- **Smart parent highlighting**: Parent items are visually highlighted when collapsed and a child route is active (highlighting disappears when expanded)
- Reactive state management using Angular signals
- Full support for icons, badges, and subtitles
- Disabled and hidden item states

**Inputs:**
- `navItems`: Navigation data structure (NavItemType[])
- `autoExpandActive`: Auto-expand active items (default: true)
- `collapseOthersOnExpand`: Collapse other items on expand (default: true)

#### DenseNav (`nav-dense`)

Compact navigation with intelligent state preservation:

**Features:**
- Ultra-compact width (4rem by default) that expands on hover (16rem)
- Temporary expansion on mouse hover
- **Smart submenu behavior**: Items expanded via click stay expanded when you leave hover
- **State preservation**: Navigation remembers which items you've expanded
- **Smart parent highlighting**: Parent items are visually highlighted when collapsed and a child route is active (highlighting disappears when expanded)
- Same reactive signal-based architecture as ClassicNav
- Perfect for maximizing content space

**Inputs:**
- `navItems`: Navigation data structure (NavItemType[])
- `denseMode`: Enable dense mode (default: true)
- `denseWidth`: Width in dense mode (default: '4rem')
- `expandedWidth`: Width when expanded (default: '16rem')
- `autoExpandActive`: Auto-expand active items (default: true)
- `collapseOthersOnExpand`: Collapse other items on expand (default: true)

**How It Works:**
1. **On sidebar hover enter**: Sidebar expands from 4rem to 16rem
2. **Click on collapsable item**: Item expands to show children (traditional behavior)
3. **On sidebar hover leave**: Sidebar collapses to 4rem, **but items stay expanded**
4. **On sidebar re-hover**: Sidebar expands again, showing your expanded items
5. **Smart parent highlighting**:
   - **Sidebar collapsed (4rem)**: Parent always highlighted if any child is active
   - **Sidebar expanded (16rem)**:
     - Item collapsed → Parent highlighted if child is active
     - Item expanded → Parent NOT highlighted (child is visible)

This creates a smooth, intuitive experience where users can:
- Expand items with click (standard interaction)
- Leave and return to the sidebar without losing their navigation state
- See their previously expanded items when hovering back
- **Always** identify which parent contains the active page when sidebar is collapsed (icon highlighted)
- See the actual active child when both sidebar and item are expanded (no redundant highlighting)
- Work more efficiently without re-expanding menus constantly

**Switching between navigation variants** is as simple as changing the layout setting - all components share the same `NavItemType` interface.

### Navigation Item Types

The navigation system supports the following item types (defined in `src/app/shared/components/nav/navigation.types.ts`):

- **`basic`**: Simple navigation items with links
  - Supports icons, badges, tooltips
  - Can be internal or external links
  - Optional exact route matching

- **`collapsable`**: Items with expandable children
  - Auto-expand when child is active
  - Animated expansion/collapse
  - Supports nested navigation structures

- **`group`**: Grouped items with section headers
  - Visual grouping with title
  - Contains child items

- **`divider`**: Visual separators
  - Creates horizontal dividers between sections

- **`spacer`**: Flexible spacing
  - Pushes subsequent items to the bottom

### Navigation Item Properties

Each navigation item (`NavItemType`) can include:

- `id` (required): Unique identifier
- `title`: Display text
- `subtitle`: Secondary text
- `icon`: Material icon name
- `link`: Route or URL
- `type`: Item type (basic, collapsable, group, divider, spacer)
- `children`: Nested items (for collapsable and group types)
- `badge`: Badge configuration with title and classes
- `disabled`: Disable item interaction
- `hidden`: Hide item from view
- `exactMatch`: Require exact URL match for active state
- `tooltip`: Tooltip text
- `externalLink`: Mark as external link
- `target`: Link target (_blank, _self, etc.)
- `classes`: Custom CSS classes for title, subtitle, icon, wrapper
- `expanded`: Initial expansion state hint

## Service Architecture

### Config Service

Located in `src/app/core/services/config.service.ts`, the ConfigService is the central configuration hub for the application.

**Features:**
- **Theme Color Palettes**: Switch between indigo, green, rose, and orange color schemes
- **Theme Modes**: Light, dark, and auto (system preference detection)
- **Layout Management**: Switch between classic and dense navigation layouts
- **Persistent Configuration**: All settings saved to localStorage
- **Reactive State**: Signal-based state management for optimal performance
- **System Integration**: Automatic detection and tracking of system dark mode preference

**Available Options:**
- `availableColors`: ['indigo', 'green', 'rose', 'orange']
- `availableModes`: ['light', 'dark', 'auto']
- `availableLayouts`: ['classic', 'dense']

**Public API:**

Configuration Signals (read-only):
- `themeColor()`: Current theme color palette
- `themeMode()`: Current theme mode (light/dark/auto)
- `layout()`: Current navigation layout
- `isDarkMode()`: Computed boolean - true when dark mode is active (respects auto mode)
- `config()`: Complete configuration object

Methods:
- `setThemeColor(color: ThemeColor)`: Change color palette
- `setThemeMode(mode: ThemeMode)`: Set theme mode (light/dark/auto)
- `setLayout(layout: LayoutType)`: Change navigation layout
- `toggleDarkMode()`: Toggle between light and dark (switches to manual mode if in auto)
- `resetToDefaults()`: Reset all settings to defaults
- `getThemeClass()`: Get current theme CSS class name
- `isAutoMode()`: Check if using system preference

**Auto Mode Behavior:**

When theme mode is set to 'auto':
- Automatically detects system color scheme preference
- Listens for system preference changes in real-time
- Updates dark mode state accordingly
- Calling `toggleDarkMode()` while in auto mode switches to manual light/dark mode

### Breakpoint Service

Located in `src/app/core/services/breakpoint.service.ts`, provides responsive breakpoint detection:

**Features:**
- Handset detection (mobile devices)
- Tablet detection (medium-sized screens)
- Web detection (desktop screens)
- RxJS Observable-based with signal conversion
- Angular CDK BreakpointObserver integration

### LocalStorage Service

Located in `src/app/core/services/localstorege.service.ts`, provides a wrapper for localStorage operations:

**Features:**
- Key prefixing for namespace isolation
- Type-safe get/set operations
- JSON serialization/deserialization
- Error handling

## Build Configuration

### TypeScript Configuration

**Path Mappings:**
```json
{
  "@app/core/*": ["./src/app/core/*"],
  "@app/shared/*": ["./src/app/shared/*"]
}
```

**Strict Mode:**
- Full type safety enabled
- Strict null checks
- Strict property initialization
- No implicit any

**Compiler Options:**
- Target: ES2022
- Module: Preserve
- Experimental decorators enabled
- Isolated modules for better build performance

### Angular Build

**Production Configuration:**
- Vite-based build system
- Output hashing for cache busting
- Bundle size budgets:
  - Initial bundle: 500kB warning, 1MB error
  - Component styles: 4kB warning, 8kB error

### Environment Variables (Angular 21)

Angular 21 introduces a new approach for environment variables using the `define` property in `angular.json`. This replaces the traditional `environment.ts` files with a more modern, build-time variable replacement system.

**Key Changes from Previous Versions:**
- ❌ No more `environment.ts` and `environment.prod.ts` files
- ❌ No more `fileReplacements` in angular.json
- ✅ Uses `import.meta.env` instead of importing environment objects
- ✅ Variables defined directly in `angular.json` per configuration
- ✅ Build-time replacement (variables are constants, not runtime values)

**Configuration in angular.json:**

Variables are defined in the `define` property within each build configuration:

```json
{
  "projects": {
    "gatze": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "define": {
                "import.meta.env.API_URL": "'https://api.production.com'",
                "import.meta.env.ENVIRONMENT": "'production'",
                "import.meta.env.ENABLE_DEBUG": "false",
                "import.meta.env.VERSION": "'1.0.0'"
              }
            },
            "development": {
              "define": {
                "import.meta.env.API_URL": "'http://localhost:3000'",
                "import.meta.env.ENVIRONMENT": "'development'",
                "import.meta.env.ENABLE_DEBUG": "true",
                "import.meta.env.VERSION": "'1.0.0-dev'"
              }
            }
          }
        }
      }
    }
  }
}
```

**Important Syntax Rules:**

1. **String values must be wrapped in single quotes inside double quotes:**
   ```json
   "import.meta.env.API_URL": "'https://api.com'"  ✅ Correct
   "import.meta.env.API_URL": "https://api.com"    ❌ Wrong
   ```

2. **Boolean and number values don't need quotes:**
   ```json
   "import.meta.env.ENABLE_DEBUG": "true"   ✅ Correct (boolean)
   "import.meta.env.PORT": "3000"           ✅ Correct (number)
   "import.meta.env.ENABLE_DEBUG": "'true'" ❌ Wrong (string "true")
   ```

3. **Variable names must start with `import.meta.env.`:**
   ```json
   "import.meta.env.API_URL": "..."  ✅ Correct
   "API_URL": "..."                  ❌ Wrong (won't work)
   ```

**Usage in TypeScript:**

Access environment variables using `import.meta.env`:

```typescript
// src/app/app.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<h1>Welcome to {{ appName }}</h1>`
})
export class App {
  // Access environment variables
  private apiUrl = import.meta.env.API_URL;
  private environment = import.meta.env.ENVIRONMENT;
  private debugEnabled = import.meta.env.ENABLE_DEBUG;
  private version = import.meta.env.VERSION;

  constructor() {
    console.log(`App running in ${this.environment} mode`);
    console.log(`API URL: ${this.apiUrl}`);
    console.log(`Debug enabled: ${this.debugEnabled}`);
    console.log(`Version: ${this.version}`);
  }
}
```

**Type Safety (Optional):**

For better TypeScript support, create a type definition file:

```typescript
// src/env.d.ts
interface ImportMeta {
  readonly env: {
    readonly API_URL: string;
    readonly ENVIRONMENT: 'development' | 'production';
    readonly ENABLE_DEBUG: boolean;
    readonly VERSION: string;
  }
}
```

**Current Environment Variables:**

This application uses the following environment variables:

| Variable | Type | Description | Production Value | Development Value |
|----------|------|-------------|------------------|-------------------|
| `API_URL` | string | Backend API endpoint | `'https://api.production.com'` | `'https://api.production.com'` |
| `ENVIRONMENT` | string | Current environment name | `'production'` | `'production'` |
| `ENABLE_DEBUG` | boolean | Enable debug logging | `true` | `false` |
| `VERSION` | string | Application version | `'1.0.0'` | `'1.0.0'` |

**Build Commands:**

```bash
# Development build (uses development configuration)
ng build --configuration=development

# Production build (uses production configuration)
ng build --configuration=production
ng build  # production is default
```

**Serve Commands:**

```bash
# Development server (uses development configuration)
ng serve
ng serve --configuration=development

# Production-like server (uses production configuration)
ng serve --configuration=production
```

**Benefits of the New Approach:**

1. **Simpler Configuration:** No need for separate environment files
2. **Type Safety:** Variables are checked at compile time
3. **Better Performance:** Build-time replacement, no runtime overhead
4. **No File Replacement:** Cleaner angular.json without fileReplacements
5. **Standard Compliance:** Uses web standard `import.meta` instead of custom imports
6. **Better Tree Shaking:** Unused variables are eliminated during build

**Migration from Old Environment Files:**

If migrating from Angular versions < 17:

**Before (Old Approach):**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// Usage
import { environment } from './environments/environment';
console.log(environment.apiUrl);
```

**After (Angular 21):**
```typescript
// No environment file needed!

// Usage
console.log(import.meta.env.API_URL);
```

**Limitations:**

1. **Build-time only:** Variables cannot be changed at runtime
2. **No dynamic values:** Cannot use JavaScript expressions
3. **No object spreading:** Each variable must be defined individually
4. **Requires rebuild:** Changing variables requires a new build

**Best Practices:**

1. ✅ Use uppercase with underscores for variable names: `API_URL`, `ENABLE_DEBUG`
2. ✅ Keep development and production configurations in sync (same variable names)
3. ✅ Use TypeScript types for better autocomplete and type checking
4. ✅ Document all environment variables in README
5. ✅ Use meaningful defaults for optional variables
6. ❌ Don't commit sensitive values (API keys, secrets) to version control
7. ❌ Don't use environment variables for feature flags (use a proper feature flag system)

**Global Stylesheets:**
1. `src/styles.css` - Global application styles
2. `src/theme.css` - Material Design 3 theme tokens
3. `src/tailwinds.css` - Tailwind CSS configuration

### Tailwind Configuration

Using Tailwind CSS v4 with the new @theme directive:

**Features:**
- Material Design 3 color token integration
- Dark mode via class strategy (`.dark`)
- CSS custom properties mapped to Material tokens
- Gray scale with `light-dark()` function
- Animation and transition tokens
- Responsive design utilities

### Theme System

Material Design 3 implementation with:

**Color System:**
- 4 theme palettes: indigo (default), green, rose, orange
- Complete color scales for each palette
- Light/dark mode variants using `light-dark()` function

**Additional Systems:**
- Typography scale (display, headline, title, body, label)
- Elevation system with box shadows
- Shape system (border radius tokens)
- State layer opacity tokens
- High contrast mode support

## Development Commands

### Development Server

Start a local development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application automatically reloads when source files change.

### Code Scaffolding

Generate a new component:

```bash
ng generate component component-name
```

For available schematics:

```bash
ng generate --help
```

### Building

Build the project for production:

```bash
ng build
```

Build artifacts are stored in the `dist/` directory.

### Testing

Execute unit tests:

```bash
ng test
```

Tests run with Karma test runner and Jasmine framework.

### Code Formatting

Format code with Prettier:

```bash
npm run format
```

## Entry Point

The application bootstraps from `src/main.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

**Application Configuration** (`src/app/app.config.ts`):
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),  // Zoneless for performance
    provideRouter(routes),
    provideAnimationsAsync()
  ]
};
```

**Routing** (`src/app/app.routes.ts`):
- Default redirect to `/dashboard`
- Lazy-loaded feature routes
- Wildcard route handling

## Performance Optimizations

- **Zoneless Change Detection**: Eliminates Zone.js overhead
- **Signal-Based Reactivity**: Fine-grained change detection
- **Lazy Loading**: Routes load on demand
- **Computed Signals**: Memoized derived state
- **Vite Build System**: Fast development and production builds
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Smaller initial bundle size

## Best Practices Demonstrated

- Standalone component architecture
- Signal-based state management
- Abstract base classes for code reuse
- Separation of concerns (core/shared/views)
- Type-safe development with strict TypeScript
- Path mappings for clean imports
- Responsive design patterns
- Persistent user preferences
- Material Design 3 compliance
- Accessibility considerations

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Material Documentation](https://material.angular.io)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Material Design 3 Guidelines](https://m3.material.io)
- [Angular Signals Guide](https://angular.dev/guide/signals)

## License

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.
