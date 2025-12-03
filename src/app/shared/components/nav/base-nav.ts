import { computed, effect, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { InternalNavItem, NavItemType } from './navigation.types';

/**
 * Abstract base class for navigation components
 * Contains all shared logic between ClassicNav and DenseNav
 * Reduces code duplication and improves maintainability
 *
 * Note: Subclasses must declare their own input() signals and sync them
 * with the base class signals in their constructor
 */
export abstract class BaseNav {
  // -----------------------
  // Shared reactive state (to be synced from subclass inputs)
  // -----------------------
  protected navItemsSignal = signal<NavItemType[]>([]);
  protected autoExpandActiveSignal = signal(true);
  protected collapseOthersOnExpandSignal = signal(true);

  // Internal navigation state
  protected internalMap = new Map<string, InternalNavItem>();
  internalItems = signal<InternalNavItem[]>([]);

  // Reactive current URL signal (updated on navigation)
  protected currentUrlSignal = signal('');

  // Cache active children to avoid recalculating on every change detection
  private activeChildrenCache = computed(() => {
    const url = this.currentUrlSignal();
    const items = this.internalItems();
    const cache = new Map<string, boolean>();

    items.forEach((item) => {
      if (item.type === 'collapsable' && item.children) {
        const hasActive = item.children.some(
          (child) => child.link && this.isLinkActive(url, child.link, child.exactMatch)
        );
        cache.set(item.id, hasActive);
      }
    });

    return cache;
  });

  // -----------------------
  // Constructor
  // -----------------------
  constructor(protected router: Router) {
    // Initialize URL signal with current router URL
    this.currentUrlSignal.set(this.router.url);

    // Convert NavigationEnd events to signal (auto-cleanup)
    const navigationEnd$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );
    const navigationEndSignal = toSignal(navigationEnd$);

    // Update URL signal on every navigation end
    effect(() => {
      const navEvent = navigationEndSignal();
      if (navEvent) {
        this.currentUrlSignal.set(this.router.url);
      }
    });

    this.setupBaseEffects();
  }

  // -----------------------
  // Setup effects (shared logic)
  // -----------------------
  private setupBaseEffects(): void {
    // Build internal tree whenever navItems changes
    effect(() => {
      const items = this.navItemsSignal() || [];
      const converted = this.buildInternalTree(items);
      this.internalItems.set(converted);
    });

    // Auto-expand when URL changes or items change
    effect(() => {
      const url = this.currentUrlSignal();
      const items = this.internalItems(); // Depend on items too
      if (url && this.autoExpandActiveSignal()) {
        this.expandActiveMenu();
      }
    });

    // Allow subclasses to add their own effects
    this.setupSubclassEffects();
  }

  /**
   * Hook for subclasses to add their own effects
   * Override this method in ClassicNav or DenseNav if needed
   */
  protected setupSubclassEffects(): void {
    // Default: no additional effects
  }

  // -----------------------
  // Shared methods
  // -----------------------

  /**
   * Build or reuse InternalNavItem instances in a tree-preserving way
   * This preserves the _expanded signal when navItems update
   */
  protected buildInternalTree(items: NavItemType[]): InternalNavItem[] {
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

  /**
   * Auto-expand parent items when a child route is active
   */
  protected expandActiveMenu(): void {
    const currentUrl = this.currentUrlSignal();

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

  /**
   * Check if a link matches the current URL
   */
  protected isLinkActive(currentUrl: string, link: string, exactMatch?: boolean): boolean {
    if (!link) return false;
    if (exactMatch) {
      return currentUrl === link;
    }
    return currentUrl.startsWith(link);
  }

  /**
   * Get cached active child status for an item
   * Uses computed signal to avoid recalculation on every CD
   */
  protected getActiveChildStatus(itemId: string): boolean {
    return this.activeChildrenCache().get(itemId) ?? false;
  }

  /**
   * Toggle expand/collapse state of a collapsable item
   */
  toggleExpand(item: InternalNavItem): void {
    if (item.disabled) return;

    const isExpanding = !item._expanded();

    if (this.collapseOthersOnExpandSignal() && isExpanding) {
      this.internalItems().forEach((navItem) => {
        if (navItem.type === 'collapsable' && navItem !== item) {
          navItem._expanded.set(false);
        }
      });
    }

    item._expanded.set(isExpanding);
  }

  /**
   * TrackBy function for template loops
   */
  trackById(_: number, item: InternalNavItem): string {
    return item.id;
  }

  // -----------------------
  // Abstract methods (must be implemented by subclasses)
  // -----------------------

  /**
   * Check if a collapsable item has an active child
   * Each subclass implements its own logic:
   * - ClassicNav: Simple check based on expanded state
   * - DenseNav: Smart logic based on sidebar collapsed/expanded state
   */
  abstract hasActiveChild(item: InternalNavItem): boolean;
}
