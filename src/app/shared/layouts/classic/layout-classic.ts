import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { NavItemType } from '../../components/nav';
import { Settings } from '../../components/settings/settings';
import { ClassicNav } from '../../components/nav/classic/classic';
import { AppBranding } from '../../components/app-branding/app-branding';
import { UserAccount } from '../../components/user-account/user-account';
import { BreakpointService } from '@app/core/services/breakpoint.service';
import { LayoutType, ThemeColor, ThemeMode } from '@app/core/services/config.service';
import { Languages } from "@app/shared/components/languages/languages";

@Component({
  selector: 'layout-classic',
  templateUrl: './layout-classic.html',
  styleUrls: ['../shared/layout-shared.css', './layout-classic.css'],
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
    ClassicNav,
    Languages
],
})
export class LayoutClassic {
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

  // Observable for responsive behavior
  isHandset$ = this.breakpointService.isHandset$;
}
