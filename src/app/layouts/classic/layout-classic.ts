import { Component, inject, input, output } from '@angular/core';
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
import { Settings } from '../../components/settings/settings';
import { ClassicNav } from '../../components/nav/classic/classic';
import { LogoGatze } from '../../components/logo/logo';
import { UserAccount } from '../../components/user-account/user-account';
import {
  ThemeColor,
  ThemeMode,
  LayoutType,
} from '../../core/services/config.service';

@Component({
  selector: 'layout-classic',
  templateUrl: './layout-classic.html',
  styleUrl: './layout-classic.css',
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
    ClassicNav,
  ],
})
export class LayoutClassic {
  private breakpointObserver = inject(BreakpointObserver);

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
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}
