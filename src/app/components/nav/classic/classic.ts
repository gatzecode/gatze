import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { InternalNavItem, NavItemType } from '../navigation.types';

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
export class ClassicNav {
  // Inputs (signals provided by the host)
  navItems = input<NavItemType[]>([]);
  autoExpandActive = input(true);
  collapseOthersOnExpand = input(true);

  // Internal reactive list containing WritableSignal for expanded state
  private internalMap = new Map<string, InternalNavItem>();
  internalItems = signal<InternalNavItem[]>([]);

  private previousNavigationId: number | undefined;

  constructor(private router: Router) {
    // Initialize internalItems from navItems whenever navItems change
    effect(() => {
      const items = this.navItems() || [];
      const converted = this.buildInternalTree(items);
      this.internalItems.set(converted);
    });

    // Auto-expand after navigation completes (mirrors previous behaviour but now reacts to router.currentNavigation())
    effect(() => {
      const navigation = this.router.currentNavigation();
      if (navigation === null && this.previousNavigationId !== undefined) {
        // navigation finished
        if (this.autoExpandActive()) {
          this.expandActiveMenu();
        }
        this.previousNavigationId = undefined;
      } else if (navigation !== null) {
        this.previousNavigationId = navigation.id;
      }
    });

    // Also run once on construction to expand any active
    effect(() => {
      if (this.autoExpandActive()) {
        // run on initial read of router.url and internalItems
        // reading internalItems() ensures this effect runs after internalItems are initialized
        const _ = this.internalItems();
        this.expandActiveMenu();
      }
    });
  }

  // Build or reuse InternalNavItem instances in a tree-preserving way
  private buildInternalTree(items: NavItemType[]): InternalNavItem[] {
    const result: InternalNavItem[] = [];

    const visit = (node: NavItemType): InternalNavItem => {
      const existing = this.internalMap.get(node.id);
      if (existing) {
        // update shallow properties, but keep the same _expanded signal
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
        node.children = it.children.map((child) => visit(child));
      }
      result.push(node);
    }

    // Clean up internalMap entries that are no longer present
    const incomingIds = new Set(
      result.flatMap((r) => [r.id, ...(r.children ?? []).map((c) => c.id)])
    );
    for (const key of Array.from(this.internalMap.keys())) {
      if (!incomingIds.has(key)) this.internalMap.delete(key);
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
        if (hasActiveChild) {
          item._expanded.set(true);
        }
      }
    });
  }

  private isLinkActive(currentUrl: string, link: string, exactMatch?: boolean): boolean {
    if (!link) return false;
    if (exactMatch) {
      return currentUrl === link;
    }
    return currentUrl.startsWith(link);
  }

  /**
   * Check if a collapsable item has an active child
   * Used to highlight parent items when collapsed (not expanded)
   * When expanded, the parent loses highlighting since the active child is visible
   */
  hasActiveChild(item: InternalNavItem): boolean {
    if (item.type !== 'collapsable' || !item.children) return false;
    // Only highlight parent if it's NOT expanded
    if (item._expanded()) return false;
    const currentUrl = this.router.url;
    return item.children.some(
      (child) => child.link && this.isLinkActive(currentUrl, child.link, child.exactMatch)
    );
  }

  toggleExpand(item: InternalNavItem): void {
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

  // trackBy for the template
  trackById(_: number, item: InternalNavItem) {
    return item.id;
  }
}
