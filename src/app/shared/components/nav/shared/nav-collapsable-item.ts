import { Component, input, output } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { InternalNavItem } from '../navigation.types';

/**
 * Collapsable navigation item component
 * Renders a parent item with expandable children
 */
@Component({
  selector: 'nav-collapsable-item',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule],
  styleUrls: ['./nav-shared.css'],
  template: `
    <!-- Parent collapsable header -->
    <a
      mat-list-item
      (click)="toggleExpand.emit()"
      [class.opacity-50]="item().disabled"
      [class.pointer-events-none]="item().disabled"
      [class.cursor-default]="item().disabled"
      [class.list-item--activated]="isActive()"
      [attr.title]="item().tooltip"
      [attr.aria-expanded]="item()._expanded()"
      class="custom-list-item"
    >
      @if (item().icon) {
        <mat-icon
          matListItemIcon
          [class]="item().classes?.icon || ''"
          [class.mx-auto]="centerIcon()"
        >
          {{ item().icon }}
        </mat-icon>
      }

      <span
        matListItemTitle
        [class]="item().classes?.title || ''"
        [class.hidden]="hideText()"
      >
        {{ item().title }}
      </span>

      @if (item().badge && showBadge()) {
        <span
          matListItemMeta
          class="text-xs px-2 py-0.5 rounded-full mr-2"
          [class]="item().badge!.classes || ''"
          [attr.aria-label]="item().badge!.title"
        >
          {{ item().badge!.title }}
        </span>
      }

      <!-- Chevron only visible when text is shown -->
      <div matListItemMeta [class.hidden]="hideText()">
        <mat-icon
          class="chevron-icon"
          [style.transform]="item()._expanded() ? 'rotate(90deg)' : 'rotate(0deg)'"
          aria-hidden="true"
        >
          chevron_right
        </mat-icon>
      </div>
    </a>

    <!-- Children container with collapse animation -->
    <div
      class="grid transition-[grid-template-rows] duration-300 ease-in-out overflow-hidden"
      [class.grid-rows-[0fr]]="!item()._expanded() || hideChildren()"
      [class.grid-rows-[1fr]]="item()._expanded() && !hideChildren()"
    >
      <ul class="min-h-0">
        @for (child of item().children; track child.id) {
          @if (!child.hidden) {
            <li>
              <a
                mat-list-item
                [routerLink]="child.link"
                [routerLinkActive]="'list-item--activated'"
                [routerLinkActiveOptions]="{ exact: child.exactMatch ?? false }"
                [class.opacity-50]="child.disabled"
                [class.pointer-events-none]="child.disabled"
                [class.cursor-default]="child.disabled"
                [class.nav-collapsable-child]="indentChildren()"
                [attr.title]="child.tooltip"
                [attr.aria-disabled]="child.disabled"
                [target]="child.externalLink ? child.target ?? '_blank' : undefined"
                [attr.rel]="child.externalLink ? 'noopener noreferrer' : undefined"
                class="custom-list-item"
              >
                @if (child.icon) {
                  <mat-icon
                    matListItemIcon
                    [class]="child.classes?.icon || ''"
                  >
                    {{ child.icon }}
                  </mat-icon>
                }
                <span matListItemTitle [class]="child.classes?.title || ''">
                  {{ child.title }}
                </span>

                @if (child.badge && showBadge()) {
                  <span
                    matListItemMeta
                    class="text-xs px-2 py-0.5 rounded-full mr-2"
                    [class]="child.badge!.classes || ''"
                    [attr.aria-label]="child.badge!.title"
                  >
                    {{ child.badge!.title }}
                  </span>
                }
              </a>
            </li>
          }
        }
      </ul>
    </div>
  `,
})
export class NavCollapsableItem {
  // Required item data
  item = input.required<InternalNavItem>();

  // Display settings
  centerIcon = input<boolean>(false);
  hideText = input<boolean>(false);
  hideChildren = input<boolean>(false);
  showBadge = input<boolean>(true);
  isActive = input<boolean>(false);
  indentChildren = input<boolean>(true);

  // Events
  toggleExpand = output<void>();
}
