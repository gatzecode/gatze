import { Component } from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface NavLink {
  title: string;
  route: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-simple-nav',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  template: `
    <mat-nav-list aria-label="Navegación principal">
      <ul>
        @for (link of navLinks; track link.route) {
        <li>
          <a mat-list-item [routerLink]="link.route" [activated]="link.isActive">
            <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
            <span matListItemTitle>{{ link.title }}</span>
          </a>
        </li>
        }
      </ul>
    </mat-nav-list>
  `,
  styles: [
    `
      mat-nav-list {
        padding: 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
    `,
  ],
})
export class SimpleNavComponent {
  navLinks: NavLink[] = [
    { title: 'Dashboard', route: '/dashboard', icon: 'dashboard', isActive: true },
    { title: 'Perfil', route: '/profile', icon: 'person', isActive: false },
    { title: 'Configuración', route: '/settings', icon: 'settings', isActive: false },
    { title: 'Mensajes', route: '/messages', icon: 'mail', isActive: false },
  ];
}

// ============================================================================
// EJEMPLO 2: Navegación con Secciones y Dividers
// ============================================================================

@Component({
  selector: 'app-sectioned-nav',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  template: `
    <mat-nav-list aria-label="Navegación con secciones">
      <!-- Sección Principal -->
      <h3 matSubheader>Principal</h3>
      <ul>
        @for (link of mainLinks; track link.route) {
        <li>
          <a mat-list-item [routerLink]="link.route" [activated]="link.isActive">
            <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
            <span matListItemTitle>{{ link.title }}</span>
          </a>
        </li>
        }
      </ul>

      <mat-divider></mat-divider>

      <!-- Sección Administración -->
      <h3 matSubheader>Administración</h3>
      <ul>
        @for (link of adminLinks; track link.route) {
        <li>
          <a mat-list-item [routerLink]="link.route" [activated]="link.isActive">
            <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
            <span matListItemTitle>{{ link.title }}</span>
          </a>
        </li>
        }
      </ul>
    </mat-nav-list>
  `,
  styles: [
    `
      mat-nav-list {
        padding: 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      h3[matSubheader] {
        font-size: 0.75rem;
        font-weight: 600;
        color: #666;
        padding: 16px 16px 8px 16px;
        margin: 0;
      }

      mat-divider {
        margin: 8px 0;
      }
    `,
  ],
})
export class SectionedNavComponent {
  mainLinks: NavLink[] = [
    { title: 'Dashboard', route: '/dashboard', icon: 'dashboard', isActive: true },
    { title: 'Proyectos', route: '/projects', icon: 'folder', isActive: false },
    { title: 'Tareas', route: '/tasks', icon: 'task', isActive: false },
  ];

  adminLinks: NavLink[] = [
    { title: 'Usuarios', route: '/admin/users', icon: 'people', isActive: false },
    { title: 'Configuración', route: '/admin/settings', icon: 'settings', isActive: false },
    { title: 'Reportes', route: '/admin/reports', icon: 'assessment', isActive: false },
  ];
}

// ============================================================================
// EJEMPLO 3: Navegación con Badges y Metadata
// ============================================================================

interface NavLinkWithBadge extends NavLink {
  badge?: number;
  subtitle?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-advanced-nav',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  template: `
    <mat-nav-list aria-label="Navegación avanzada">
      <ul>
        @for (link of navLinks; track link.route) {
        <li>
          <a
            mat-list-item
            [routerLink]="link.route"
            [activated]="link.isActive"
            [disabled]="link.disabled"
          >
            <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>

            <span matListItemTitle>{{ link.title }}</span>

            @if (link.subtitle) {
            <span matListItemLine>{{ link.subtitle }}</span>
            } @if (link.badge && link.badge > 0) {
            <span matListItemMeta class="badge">{{ link.badge }}</span>
            }
          </a>
        </li>
        }
      </ul>
    </mat-nav-list>
  `,
  styles: [
    `
      mat-nav-list {
        padding: 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .badge {
        background: #f44336;
        color: white;
        border-radius: 12px;
        padding: 2px 8px;
        font-size: 0.75rem;
        font-weight: 600;
        min-width: 20px;
        text-align: center;
      }

      a[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class AdvancedNavComponent {
  navLinks: NavLinkWithBadge[] = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      isActive: true,
      subtitle: 'Panel principal',
    },
    {
      title: 'Mensajes',
      route: '/messages',
      icon: 'mail',
      isActive: false,
      badge: 5,
      subtitle: 'Nuevos mensajes',
    },
    {
      title: 'Notificaciones',
      route: '/notifications',
      icon: 'notifications',
      isActive: false,
      badge: 12,
    },
    {
      title: 'Configuración',
      route: '/settings',
      icon: 'settings',
      isActive: false,
    },
    {
      title: 'Mantenimiento',
      route: '/maintenance',
      icon: 'construction',
      isActive: false,
      disabled: true,
      subtitle: 'Próximamente',
    },
  ];
}

// ============================================================================
// EJEMPLO 4: Navegación con RouterLinkActive (Automático)
// ============================================================================

@Component({
  selector: 'app-auto-active-nav',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  template: `
    <mat-nav-list aria-label="Navegación con activación automática">
      <ul>
        @for (link of navLinks; track link.route) {
        <li>
          <a
            mat-list-item
            [routerLink]="link.route"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: link.exact || false }"
          >
            <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
            <span matListItemTitle>{{ link.title }}</span>
          </a>
        </li>
        }
      </ul>
    </mat-nav-list>
  `,
  styles: [
    `
      mat-nav-list {
        padding: 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .active-link {
        background-color: rgba(99, 102, 241, 0.1) !important;
        color: #6366f1 !important;
      }

      .active-link mat-icon {
        color: #6366f1;
      }
    `,
  ],
})
export class AutoActiveNavComponent {
  navLinks = [
    { title: 'Dashboard', route: '/dashboard', icon: 'dashboard', exact: true },
    { title: 'Usuarios', route: '/users', icon: 'people', exact: false },
    { title: 'Productos', route: '/products', icon: 'inventory', exact: false },
    { title: 'Reportes', route: '/reports', icon: 'assessment', exact: false },
  ];
}

// ============================================================================
// EJEMPLO 5: Navegación Anidada con Expansión
// ============================================================================

interface NavLink {
  title: string;
  route: string;
  icon: string;
  isActive: boolean;
}

interface NavLinkExpandable extends NavLink {
  children?: NavLink[];
  expanded?: boolean;
}

@Component({
  selector: 'app-expandable-nav',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  template: `
    <mat-nav-list aria-label="Navegación expandible">
      <ul>
        @for (link of navLinks; track link.route) {
        <li>
          @if (link.children && link.children.length > 0) {
          <!-- Item expandible -->
          <a mat-list-item (click)="toggleExpand(link)" [activated]="link.isActive">
            <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
            <span matListItemTitle>{{ link.title }}</span>
            <div matListItemMeta>
              <mat-icon [class.rotated]="link.expanded"> chevron_right </mat-icon>
            </div>
          </a>

          <!-- Children expandidos -->
          <div class="nested-wrapper" [class.expanded]="link.expanded">
            <ul class="nested-list">
              @for (child of link.children; track child.route) {
              <li>
                <a mat-list-item [routerLink]="child.route" [activated]="child.isActive">
                  <span matListItemTitle class="nested-title">{{ child.title }}</span>
                </a>
              </li>
              }
            </ul>
          </div>
          } @else {
          <!-- Item simple -->
          <a mat-list-item [routerLink]="link.route" [activated]="link.isActive">
            <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
            <span matListItemTitle>{{ link.title }}</span>
          </a>
          }
        </li>
        }
      </ul>
    </mat-nav-list>
  `,
  styles: [
    `
      mat-nav-list {
        margin: 0;
      }

      ul > li {
        margin: 3px;
      }

      .mat-mdc-nav-list .mat-mdc-list-item {
        border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-small));
        --mat-focus-indicator-border-radius: var(
          --mat-list-active-indicator-shape,
          var(--mat-sys-corner-small)
        ) !important;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      /* Wrapper para la animación */
      .nested-wrapper {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 300ms ease-in-out;
        overflow: hidden;
      }

      .nested-wrapper.expanded {
        grid-template-rows: 1fr;
      }

      .nested-list {
        min-height: 0;
        background-color: rgba(0, 0, 0, 0.02);
      }

      .nested-title {
        padding-left: 40px;
      }

      /* Rotación del ícono */
      mat-icon {
        transition: transform 200ms ease-in-out;
      }

      mat-icon.rotated {
        transform: rotate(90deg);
      }
    `,
  ],
})
export class ExpandableNavComponent {
  navLinks: NavLinkExpandable[] = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      isActive: true,
    },
    {
      title: 'Configuración',
      route: '/settings',
      icon: 'settings',
      isActive: false,
      expanded: false,
      children: [
        { title: 'Perfil', route: '/settings/profile', icon: 'dashboard', isActive: false },
        { title: 'Seguridad', route: '/settings/security', icon: '', isActive: false },
        { title: 'Privacidad', route: '/settings/privacy', icon: '', isActive: false },
      ],
    },
    {
      title: 'Usuarios',
      route: '/users',
      icon: 'people',
      isActive: false,
      expanded: false,
      children: [
        { title: 'Todos', route: '/users/all', icon: '', isActive: false },
        { title: 'Roles', route: '/users/roles', icon: '', isActive: false },
        { title: 'Permisos', route: '/users/permissions', icon: '', isActive: false },
      ],
    },
    {
      title: 'Reportes',
      route: '/reports',
      icon: 'assessment',
      isActive: false,
    },
  ];

  toggleExpand(link: NavLinkExpandable) {
    link.expanded = !link.expanded;
  }
}

interface NavLink {
  title: string;
  route: string;
  icon: string;
  isActive: boolean;
}

interface NavLinkExpandable extends NavLink {
  children?: NavLink[];
  expanded?: boolean;
}

@Component({
  selector: 'app-expandable-nav1',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  template: `
    <nav class="sidebar">
      <!-- Navigation Links -->
      <mat-nav-list>
        <ul class="nav-list">
          @for (link of navLinks; track link.route) {
          <li>
            @if (link.children && link.children.length > 0) {
            <!-- Item expandible -->
            <a
              mat-list-item
              (click)="toggleExpand(link)"
              [class.active]="link.isActive"
              class="nav-item"
            >
              <mat-icon class="nav-icon">{{ link.icon }}</mat-icon>
              <span class="nav-title">{{ link.title }}</span>
              <mat-icon class="expand-icon">
                {{ link.expanded ? 'expand_more' : 'chevron_right' }}
              </mat-icon>
            </a>

            <!-- Children expandidos -->
            @if (link.expanded) {
            <ul class="nested-list">
              @for (child of link.children; track child.route) {
              <li>
                <a
                  mat-list-item
                  [routerLink]="child.route"
                  [class.active]="child.isActive"
                  class="nav-item nested"
                >
                  <span class="nested-title">{{ child.title }}</span>
                </a>
              </li>
              }
            </ul>
            } } @else {
            <!-- Item simple -->
            <a
              mat-list-item
              [routerLink]="link.route"
              [class.active]="link.isActive"
              class="nav-item"
            >
              <mat-icon class="nav-icon">{{ link.icon }}</mat-icon>
              <span class="nav-title">{{ link.title }}</span>
            </a>
            }
          </li>
          }
        </ul>
      </mat-nav-list>
    </nav>
  `,
  styles: [
    `
      .mat-mdc-nav-list .mat-mdc-list-item {
        border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-none));
        --mat-focus-indicator-border-radius: var(
          --mat-list-active-indicator-shape,
          var(--mat-sys-corner-none)
        ) !important;
      }

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      mat-nav-list {
        padding: 0;
      }

      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
      }

      .nav-list > li {
        margin: 0;
      }

      .nav-item {
        height: 48px !important;
        border-radius: 8px;
        padding: 0 12px !important;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .nav-item:hover {
        background-color: #f9fafb;
        border-color: #e5e7eb;
      }

      .nav-item.active {
        border-left: 2px solid var(--mat-sys-primary);
      }

      .nav-item.active .nav-icon {
        color: var(--mat-sys-primary);
      }

      .nav-item.active .nav-title {
        color: var(--mat-sys-primary);
        font-weight: 500;
      }

      .nav-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #6b7280;
        margin-right: 0 !important;
      }

      .nav-title {
        font-size: 14px;
        color: #374151;
        flex: 1;
        margin-left: 12px;
        font-weight: 400;
      }

      .expand-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #9ca3af;
        margin-left: auto;
      }

      .nested-list {
        list-style: none;
        margin: 0;
        background-color: #f9fafb;
        border-radius: 4px;
        margin-top: 4px;
      }

      .nav-item.nested {
        height: 40px !important;
        padding-left: 44px !important;
        font-size: 13px;
      }

      .nested-title {
        color: #6b7280;
        font-size: 13px;
        font-weight: 400;
      }

      .nav-item.nested.active .nested-title {
        color: var(--mat-sys-primary);
        font-weight: 500;
      }

      /* Override Material styles */
      ::ng-deep .mat-mdc-list-item {
        --mdc-list-list-item-leading-icon-size: 40px;
      }

      ::ng-deep .mat-mdc-list-item-unscoped-content {
        display: flex;
        align-items: center;
        width: 100%;
      }
    `,
  ],
})
export class ExpandableNav1Component {
  navLinks: NavLinkExpandable[] = [
    {
      title: 'Home',
      route: '/dashboard',
      icon: 'home',
      isActive: false,
    },
    {
      title: 'Search',
      route: '/search',
      icon: 'search',
      isActive: false,
    },
    {
      title: 'Team',
      route: '/team',
      icon: 'people',
      isActive: false,
    },
    {
      title: 'Reports',
      route: '/reports',
      icon: 'bar_chart',
      isActive: false,
    },
    {
      title: 'Events',
      route: '/events',
      icon: 'event',
      isActive: true,
    },
    {
      title: 'Options',
      route: '/settings',
      icon: 'settings',
      isActive: false,
      expanded: false,
      children: [
        { title: 'Perfil', route: '/settings/profile', icon: '', isActive: false },
        { title: 'Seguridad', route: '/settings/security', icon: '', isActive: false },
        { title: 'Privacidad', route: '/settings/privacy', icon: '', isActive: false },
      ],
    },
  ];

  toggleExpand(link: NavLinkExpandable) {
    link.expanded = !link.expanded;
  }
}

import { MatButtonModule } from '@angular/material/button';

interface MenuLink {
  label: string;
  route: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-compact-menu',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatButtonModule],
  template: `
    <mat-nav-list dense>
      @for (link of links; track link.route) {
      <mat-list-item [activated]="link.isActive">
        <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
        <a matListItemTitle [href]="link.route">{{ link.label }}</a>
        <button matIconButton (click)="showInfo(link)" matListItemMeta aria-label="Más información">
          <mat-icon>info</mat-icon>
        </button>
      </mat-list-item>
      }
    </mat-nav-list>
  `,
  styles: [
    `
      mat-nav-list {
        padding: 0;
      }

      a[matListItemTitle] {
        text-decoration: none;
        color: inherit;
        flex: 1;
      }

      a[matListItemTitle]:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class CompactMenuComponent {
  links: MenuLink[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      isActive: true,
    },
    {
      label: 'Perfil',
      route: '/profile',
      icon: 'person',
      isActive: false,
    },
    {
      label: 'Configuración',
      route: '/settings',
      icon: 'settings',
      isActive: false,
    },
    {
      label: 'Mensajes',
      route: '/messages',
      icon: 'mail',
      isActive: false,
    },
    {
      label: 'Notificaciones',
      route: '/notifications',
      icon: 'notifications',
      isActive: false,
    },
    {
      label: 'Ayuda',
      route: '/help',
      icon: 'help',
      isActive: false,
    },
  ];

  showInfo(link: MenuLink): void {
    alert(`Información sobre: ${link.label}\nRuta: ${link.route}`);
  }

  // Método para cambiar el item activo
  setActive(selectedLink: MenuLink): void {
    this.links.forEach((link) => {
      link.isActive = link === selectedLink;
    });
  }
}
