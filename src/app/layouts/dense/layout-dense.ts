import { Component, inject, input, output, viewChild, computed } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { NavItemType } from '../../components/nav';
import { Settings } from '../../components/settings/settings';
import { DenseNav } from '../../components/nav/dense/dense';
import { LogoGatze } from '../../components/logo/logo';
import { UserAccount } from '../../components/user-account/user-account';
import {
  ThemeColor,
  ThemeMode,
  LayoutType,
} from '../../core/services/config.service';
import { BreakpointService } from '../../core/services/breakpoint.service';

@Component({
  selector: 'layout-dense',
  templateUrl: './layout-dense.html',
  styleUrl: './layout-dense.css',
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
    LogoGatze,
    DenseNav,
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
