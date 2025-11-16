import { CommonModule } from '@angular/common';
import { Component, effect, input, signal, WritableSignal, NgZone } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { InternalNavItem, NavItemType } from '../navigation.types';

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
  ],
  templateUrl: './dense.html',
  styleUrl: './dense.css',
})
export class DenseNav {
  // -----------------------
  // Public inputs
  // -----------------------
  // The navigation items (signal input)
  navItems = input<NavItemType[]>([]);

  // Only dense mode (true by default). If you want to support non-dense later,
  // you can change this to an appearance input.
  denseMode = input(true);

  // widths (strings, e.g. '4rem' and '16rem')
  denseWidth = input('4rem');
  expandedWidth = input('16rem');

  // Auto-expand active child on navigation (still supported — when hovered it will expand and auto open parent if child is active)
  autoExpandActive = input(true);
  collapseOthersOnExpand = input(true);

  // -----------------------
  // Internal reactive state
  // -----------------------
  private internalMap = new Map<string, InternalNavItem>();
  internalItems = signal<InternalNavItem[]>([]);

  // hover / temporary expansion state
  isHovering = signal(false);
  isTemporarilyExpanded = signal(false);

  // small helper to avoid thrashing when router navigation events fire rapidly
  private previousNavigationId: number | undefined;

  constructor(private router: Router, private ngZone: NgZone) {
    // Build internal tree whenever navItems changes
    effect(() => {
      const items = this.navItems() || [];
      const converted = this.buildInternalTree(items);
      this.internalItems.set(converted);
    });

    // Expand active menu on navigation end (but only used as hint)
    effect(() => {
      const nav = this.router.currentNavigation();
      if (nav === null && this.previousNavigationId !== undefined) {
        if (this.autoExpandActive()) this.expandActiveMenu();
        this.previousNavigationId = undefined;
      } else if (nav !== null) {
        this.previousNavigationId = nav.id;
      }
    });

    // On construction try to expand active
    effect(() => {
      if (this.autoExpandActive()) {
        const _ = this.internalItems();
        this.expandActiveMenu();
      }
    });

    // Hover reaction: when in dense mode, entering hover expands temporarily
    effect(() => {
      if (!this.denseMode()) return;
      const hovering = this.isHovering();
      if (hovering) {
        // expand the sidebar temporarily
        this.isTemporarilyExpanded.set(true);

        // ensure all collapsables are closed when hover opens (visual in your design)
        this.internalItems().forEach((it) => {
          if (it.type === 'collapsable') it._expanded.set(false);
        });
      } else {
        // leave hover: collapse temporary expansion and ensure no submenus left open
        this.isTemporarilyExpanded.set(false);
        this.internalItems().forEach((it) => {
          if (it.type === 'collapsable') it._expanded.set(false);
        });
      }
    });
  }

  // -----------------------
  // Template handlers
  // -----------------------
  onMouseEnter(): void {
    // run inside Angular zone (already inside) but keep method for clarity
    this.isHovering.set(true);
  }

  onMouseLeave(): void {
    this.isHovering.set(false);
  }

  onToggleExpand(item: InternalNavItem): void {
    if (item.disabled) return;

    const isExpanding = !item._expanded();

    if (this.collapseOthersOnExpand() && isExpanding) {
      this.internalItems().forEach((navItem) => {
        if (navItem.type === 'collapsable' && navItem !== item) {
          navItem._expanded.set(false);
        }
      });
    }

    item._expanded.set(isExpanding);
  }

  // -----------------------
  // Internal utilities
  // -----------------------
  private buildInternalTree(items: NavItemType[]): InternalNavItem[] {
    const result: InternalNavItem[] = [];

    const visit = (node: NavItemType): InternalNavItem => {
      const existing = this.internalMap.get(node.id);
      if (existing) {
        // update shallow properties but reuse _expanded signal
        const copy: InternalNavItem = Object.assign({}, node) as InternalNavItem;
        copy._expanded = existing._expanded;
        this.internalMap.set(node.id, copy);
        return copy;
      }

      const newItem: InternalNavItem = Object.assign({}, node) as InternalNavItem;
      newItem._expanded = signal(!!node.expanded);
      this.internalMap.set(node.id, newItem);
      return newItem;
    };

    for (const it of items) {
      const node = visit(it);
      if (it.children && it.children.length) {
        node.children = it.children.map((c) => visit(c));
      }
      result.push(node);
    }

    // cleanup
    const incomingIds = new Set(
      result.flatMap((r) => [r.id, ...(r.children ?? []).map((c) => c.id)])
    );
    for (const k of Array.from(this.internalMap.keys())) {
      if (!incomingIds.has(k)) this.internalMap.delete(k);
    }

    return result;
  }

  private expandActiveMenu(): void {
    const currentUrl = this.router.url;
    this.internalItems().forEach((item) => {
      if (item.type === 'collapsable' && item.children) {
        const hasActiveChild = item.children.some(
          (child) => child.link && this.isLinkActive(currentUrl, child.link, child.exactMatch)
        );
        if (hasActiveChild) item._expanded.set(true);
      }
    });
  }

  private isLinkActive(currentUrl: string, link: string, exactMatch?: boolean): boolean {
    if (!link) return false;
    if (exactMatch) return currentUrl === link;
    return currentUrl.startsWith(link);
  }

  // trackBy helper (if you migrate template to *ngFor later)
  trackById(_: number, item: InternalNavItem) {
    return item.id;
  }
}
