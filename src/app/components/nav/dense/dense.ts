import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { InternalNavItem, NavItemType } from '../navigation.types';
import { BaseNav } from '../base-nav';
import { NavItem, NavCollapsableItem } from '../shared';

@Component({
  selector: 'nav-dense',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
    RouterModule,
    NavItem,
    NavCollapsableItem,
  ],
  templateUrl: './dense.html',
  styleUrls: ['../shared/nav-shared.css', './dense.css'],
})
export class DenseNav extends BaseNav {
  // -----------------------
  // Public inputs (synced to base class)
  // -----------------------
  navItems = input<NavItemType[]>([]);
  autoExpandActive = input(true);
  collapseOthersOnExpand = input(true);

  // -----------------------
  // Dense-specific inputs
  // -----------------------
  denseMode = input(true);
  denseWidth = input('4rem');
  expandedWidth = input('16rem');

  // -----------------------
  // Dense-specific state
  // -----------------------
  isHovering = signal(false);
  isTemporarilyExpanded = signal(false);

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
  // Dense-specific effects
  // -----------------------
  protected override setupSubclassEffects(): void {
    // Hover reaction: when in dense mode, entering hover expands temporarily
    effect(() => {
      if (!this.denseMode()) return;
      const hovering = this.isHovering();
      if (hovering) {
        // Expand the sidebar temporarily
        this.isTemporarilyExpanded.set(true);
        // NOTE: We preserve the expanded state of items
        // Items are only expanded/collapsed via click events
      } else {
        // Leave hover: collapse temporary expansion
        this.isTemporarilyExpanded.set(false);
        // NOTE: We preserve the expanded state of items when leaving hover
        // This allows users to keep their menu items expanded after clicking
      }
    });
  }

  // -----------------------
  // Template handlers
  // -----------------------
  onMouseEnter(): void {
    this.isHovering.set(true);
  }

  onMouseLeave(): void {
    this.isHovering.set(false);
  }

  isExpanded(): boolean {
    return this.isTemporarilyExpanded();
  }

  /**
   * Toggle expand/collapse state of a collapsable item
   * This is triggered by click events only
   * Uses the base class implementation
   */
  onToggleExpand(item: InternalNavItem): void {
    this.toggleExpand(item);
  }

  // -----------------------
  // Dense-specific hasActiveChild implementation
  // -----------------------
  /**
   * Check if a collapsable item has an active child
   * Smart highlighting logic for dense mode:
   * - When sidebar is collapsed (4rem): Always highlight parent if child is active
   * - When sidebar is expanded (16rem): Only highlight if item is NOT expanded
   *
   * Uses cached active child status from base class for performance
   */
  hasActiveChild(item: InternalNavItem): boolean {
    if (item.type !== 'collapsable' || !item.children) return false;

    // Use cached status from base class (computed signal)
    const hasActiveChild = this.getActiveChildStatus(item.id);
    if (!hasActiveChild) return false;

    // If sidebar is collapsed (not temporarily expanded), always highlight parent
    if (!this.isTemporarilyExpanded()) return true;

    // If sidebar is expanded, only highlight if item is NOT expanded
    return !item._expanded();
  }
}
