import { Component, inject, computed } from '@angular/core';
import { NavItemType } from '../../components/nav';

import { LayoutClassic } from '../classic/layout-classic';
import { LayoutDense } from '../dense/layout-dense';
import { LayoutEmpty } from '../empty/layout-empty';
import { BreakpointService } from '@app/core/services/breakpoint.service';
import {
  ConfigService,
  LayoutType,
  ThemeColor,
  ThemeMode,
} from '@app/core/services/config.service';
import { User } from '@app/core/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrl: './main.css',
  imports: [LayoutClassic, LayoutDense, LayoutEmpty],
})
export class Main {
  private breakpointService = inject(BreakpointService);
  protected configService = inject(ConfigService);

  // Todo load from auth service
  user: User = {
    email: 'direccion.juridica@grupohgc.com',
    name: 'María Teresa',
  };

  // Get handset detection from service
  private isHandset = this.breakpointService.isHandset;

  /**
   * Effective layout based on device type
   * Mobile devices always use 'classic' layout regardless of user preference
   * Desktop devices use the configured layout
   */
  protected effectiveLayout = computed<LayoutType>(() => {
    const isMobile = this.isHandset();
    const configuredLayout = this.configService.layout();

    // Force classic layout on mobile devices
    if (isMobile) {
      return 'classic';
    }

    return configuredLayout;
  });

  protected effectiveThemeMode = computed<ThemeMode>(() => {
    const themeMode = this.configService.themeMode();
    return themeMode;
  });

  // Navigation items
  protected readonly navItems: NavItemType[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      link: '/dashboard',
      type: 'basic',
      exactMatch: true,
    },
    {
      id: 'spacer-0',
      type: 'spacer',
    },
    {
      id: 'users-group',
      title: 'Users',
      icon: 'admin_panel_settings',
      type: 'group',
      children: [
        {
          id: 'users-all',
          title: 'All Users',
          icon: 'person',
          link: '/users',
          type: 'basic',
        },
        {
          id: 'users-roles',
          title: 'Roles & Permissions',
          icon: 'shield',
          link: '/users/roles',
          type: 'basic',
        },
      ],
    },
    {
      id: 'divider-0',
      type: 'divider',
    },
    {
      id: 'administration',
      title: 'Administration',
      icon: 'admin_panel_settings',
      type: 'collapsable',
      expanded: true,
      children: [
        {
          id: 'credit-accounts',
          title: 'Cuentas',
          icon: 'credit_card',
          link: '/administration/credit-accounts',
          type: 'basic',
          exactMatch: true,
        },
      ],
    },
    {
      id: 'divider-1',
      type: 'divider',
    },
    {
      id: 'spacer-1',
      type: 'spacer',
    },
    {
      id: 'reports-group',
      title: 'Reportes',
      subtitle: 'View analytics',
      icon: 'assessment',
      type: 'group',
      children: [
        {
          id: 'reports-1',
          title: 'Historial Disposición',
          icon: 'assessment',
          link: '/reports',
          type: 'basic',
        },
        {
          id: 'reports-2',
          title: 'Saldos Cuentas',
          icon: 'assessment',
          link: '/reports',
          type: 'basic',
        },
        {
          id: 'reports-3',
          title: 'Saldos por Tarjeta',
          icon: 'assessment',
          link: '/reports',
          type: 'basic',
        },
      ],
    },
    {
      id: 'divider-2',
      type: 'divider',
    },

    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      type: 'collapsable',
      children: [
        {
          id: 'settings-general',
          title: 'General',
          icon: 'tune',
          link: '/settings/general',
          type: 'basic',
        },
        {
          id: 'settings-security',
          title: 'Security',
          icon: 'lock',
          link: '/settings/security',
          type: 'basic',
        },
        {
          id: 'settings-notifications',
          title: 'Notifications',
          icon: 'notifications',
          link: '/settings/notifications',
          type: 'basic',
        },
        {
          id: 'settings-integrations',
          title: 'Integrations',
          icon: 'extension',
          link: '/settings/integrations',
          type: 'basic',
        },
      ],
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help',
      link: 'https://help.example.com',
      type: 'basic',
      externalLink: true,
      target: '_blank',
    },
  ];

  // Methods for configuration control
  setLayout(layout: LayoutType): void {
    this.configService.setLayout(layout);
  }

  setTheme(theme: ThemeColor): void {
    this.configService.setThemeColor(theme);
  }

  setThemeMode(mode: ThemeMode): void {
    this.configService.setThemeMode(mode);
  }

  toggleDarkMode(): void {
    this.configService.toggleDarkMode();
  }
}
