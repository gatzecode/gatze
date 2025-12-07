import { Component, inject, input, output, viewChild, computed } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

import { BreakpointService } from '@app/core/services/breakpoint.service';
import { LayoutType, ThemeColor, ThemeMode } from '@app/core/services/config.service';
import { User } from '@app/core/models';
import { Languages } from '@app/shared/components/languages/languages';

import { NavItemType } from '../../components/nav';
import { Settings } from '../../components/settings/settings';
import { DenseNav } from '../../components/nav/dense/dense';
import { AppBranding } from '../../components/app-branding/app-branding';
import { UserAccount } from '../../components/user-account/user-account';

@Component({
  selector: 'layout-dense',
  templateUrl: './layout-dense.html',
  styleUrls: ['../shared/layout-shared.css', './layout-dense.css'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    UserAccount,
    Settings,
    AppBranding,
    DenseNav,
    Languages,
  ],
})
export class LayoutDense {
  private breakpointService = inject(BreakpointService);

  // Inputs
  navItems = input.required<NavItemType[]>();
  currentLayout = input.required<LayoutType>();
  availableLayouts = input.required<LayoutType[]>();
  availableThemes = input.required<ThemeColor[]>();
  themeColor = input.required<ThemeColor>();
  user = input.required<User>();

  // Outputs
  layoutChange = output<LayoutType>();
  themeChange = output<ThemeColor>();
  schemeChange = output<ThemeMode>();

  // ViewChild to access nav component
  navDense = viewChild<DenseNav>('navDense');

  // Computed to check if nav is expanded
  isNavExpanded = computed(() => {
    const nav = this.navDense();
    return nav ? nav.isExpanded() : false;
  });

  // Observable for responsive behavior
  isHandset$ = this.breakpointService.isHandset$;
}
