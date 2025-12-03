# Gatze

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Architecture

### Layout System

The application uses a modular layout architecture that allows for efficient switching between different navigation styles.

#### Main Layout Component

The `MainComponent` (`src/app/layouts/main/`) serves as a **layout template/mold** that provides:

- Material Sidenav container structure
- Responsive behavior (mobile/desktop)
- Fixed toolbar
- Scrollable content area
- Theme management integration
- Navigation variant selection

##### Responsive Layout Switching

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

#### Navigation Components

The application features a modern, signal-based navigation system located in `src/app/components/nav/`:

##### ClassicNav (`nav-classic`)

Traditional navigation with full text labels and icons:

- **Features:**
  - Auto-expand active menu items on navigation
  - Optional collapse of other items when expanding one
  - **Smart parent highlighting**: Parent items are visually highlighted when collapsed and a child route is active (highlighting disappears when expanded)
  - Reactive state management using Angular signals
  - Full support for icons, badges, and subtitles
  - Disabled and hidden item states

- **Inputs:**
  - `navItems`: Navigation data structure (NavItemType[])
  - `autoExpandActive`: Auto-expand active items (default: true)
  - `collapseOthersOnExpand`: Collapse other items on expand (default: true)

##### DenseNav (`nav-dense`)

Compact navigation with intelligent state preservation:

- **Features:**
  - Ultra-compact width (4rem by default) that expands on hover (16rem)
  - Temporary expansion on mouse hover
  - **Smart submenu behavior**: Items expanded via click stay expanded when you leave hover
  - **State preservation**: Navigation remembers which items you've expanded
  - **Smart parent highlighting**: Parent items are visually highlighted when collapsed and a child route is active (highlighting disappears when expanded)
  - Same reactive signal-based architecture as ClassicNav
  - Perfect for maximizing content space

- **Inputs:**
  - `navItems`: Navigation data structure (NavItemType[])
  - `denseMode`: Enable dense mode (default: true)
  - `denseWidth`: Width in dense mode (default: '4rem')
  - `expandedWidth`: Width when expanded (default: '16rem')
  - `autoExpandActive`: Auto-expand active items (default: true)
  - `collapseOthersOnExpand`: Collapse other items on expand (default: true)

- **How It Works:**
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

##### Planned Variants

The architecture supports four navigation appearances defined in `NavAppearance` type:
- `classic`: Implemented (ClassicNav)
- `dense`: Implemented (DenseNav)

**Switching between navigation variants** is as simple as changing the `currentLayout` signal in MainComponent - all components share the same `NavItemType` interface.

#### Navigation Item Types

The navigation system supports the following item types (defined in `src/app/components/nav/navigation.types.ts`):

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

#### Navigation Item Properties

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

### Service Architecture

#### Config Service

Located in `src/app/core/services/config.service.ts`, the ConfigService is the central configuration hub for the application, providing:

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

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
