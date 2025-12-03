import { Component, inject, computed } from '@angular/core';
import { NavItemType } from '../../components/nav';

import { LayoutClassic } from '../classic/layout-classic';
import { LayoutDense } from '../dense/layout-dense';
import { BreakpointService } from '@app/core/services/breakpoint.service';
import {
  ConfigService,
  LayoutType,
  ThemeColor,
  ThemeMode,
} from '@app/core/services/config.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrl: './main.css',
  imports: [LayoutClassic, LayoutDense],
})
export class Main {
  private breakpointService = inject(BreakpointService);
  protected configService = inject(ConfigService);

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

  // Navigation items
  protected readonly navItems: NavItemType[] = [
    
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
        {
          id: 'users-teams',
          title: 'Teams',
          icon: 'groups',
          link: '/users/teams',
          type: 'basic',
        },
      ],
    },
    {
      id: 'products',
      title: 'Products',
      icon: 'inventory_2',
      type: 'collapsable',
      children: [
        {
          id: 'products-list',
          title: 'List Products',
          icon: 'list',
          link: '/products/list',
          type: 'basic',
        },
        {
          id: 'products-new',
          title: 'Add Product',
          icon: 'add_circle',
          link: '/products/new',
          type: 'basic',
        },
        {
          id: 'products-categories',
          title: 'Categories',
          icon: 'category',
          link: '/products/categories',
          type: 'basic',
          badge: {
            title: '5',
            classes: 'badge-primary',
          },
        },
      ],
    },
    {
      id: 'divider-1',
      type: 'divider',
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      link: '/dashboard',
      type: 'basic',
      exactMatch: true,
    },

    {
      id: 'orders',
      title: 'Orders',
      icon: 'shopping_cart',
      type: 'collapsable',
      children: [
        {
          id: 'orders-all',
          title: 'All Orders',
          icon: 'receipt_long',
          link: '/orders',
          type: 'basic',
          badge: {
            title: 'New',
            classes: 'badge-success',
          },
        },
        {
          id: 'orders-pending',
          title: 'Pending',
          icon: 'pending',
          link: '/orders/pending',
          type: 'basic',
        },
        {
          id: 'orders-completed',
          title: 'Completed',
          icon: 'done_all',
          link: '/orders/completed',
          type: 'basic',
        },
      ],
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: 'people',
      link: '/customers',
      type: 'basic',
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
      id: 'reports',
      title: 'Reports',
      subtitle: 'View analytics',
      icon: 'assessment',
      link: '/reports',
      type: 'basic',
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
