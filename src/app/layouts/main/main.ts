import { Component, inject, viewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { NavItemType } from '../../components/nav';
import {
  ConfigService,
  ThemeColor,
  ThemeMode,
  LayoutType,
} from '../../core/services/config.service';
import { Settings } from '../../components/settings/settings';
import { DenseNav } from '../../components/nav/dense/dense';
import { ClassicNav } from '../../components/nav/classic/classic';
import { LogoGatze } from '../../components/logo/logo';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrl: './main.css',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    Settings,
    LogoGatze,
    DenseNav,
    ClassicNav,
  ],
})
export class Main {
  private breakpointObserver = inject(BreakpointObserver);
  protected configService = inject(ConfigService);

  // ViewChild for settings drawer
  settingsPanel = viewChild.required<Settings>('settingsPanel');

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

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
      id: 'analytics',
      title: 'Analytics',
      icon: 'analytics',
      link: '/analytics',
      type: 'basic',
    },
    {
      id: 'divider-1',
      type: 'divider',
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
      id: 'spacer-1',
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
      id: 'divider-3',
      type: 'divider',
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
