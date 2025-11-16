import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { InternalNavItem, NavItemType } from '../navigation.types';
import { BaseNavComponent } from '../base-nav.component';

@Component({
  selector: 'nav-classic',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './classic.html',
  styleUrl: './classic.css',
})
export class ClassicNav extends BaseNavComponent {
  // -----------------------
  // Public inputs (synced to base class)
  // -----------------------
  navItems = input<NavItemType[]>([]);
  autoExpandActive = input(true);
  collapseOthersOnExpand = input(true);

  // -----------------------
  // Constructor
  // -----------------------
  constructor(router: Router) {
    super(router);

    // Sync inputs to base class signals
    effect(() => this.navItemsSignal.set(this.navItems()));
    effect(() => this.autoExpandActiveSignal.set(this.autoExpandActive()));
    effect(() => this.collapseOthersOnExpandSignal.set(this.collapseOthersOnExpand()));
  }

  // -----------------------
  // Classic-specific hasActiveChild implementation
  // -----------------------
  /**
   * Check if a collapsable item has an active child
   * Simple logic for classic mode:
   * - Only highlight parent if it's NOT expanded (when expanded, child is visible)
   *
   * Uses cached active child status from base class for performance
   */
  hasActiveChild(item: InternalNavItem): boolean {
    if (item.type !== 'collapsable' || !item.children) return false;

    // Only highlight parent if it's NOT expanded
    if (item._expanded()) return false;

    // Use cached status from base class (computed signal)
    return this.getActiveChildStatus(item.id);
  }
}
