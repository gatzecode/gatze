import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { InternalNavItem } from '../navigation.types';

/**
 * Reusable navigation item component
 * Renders a single nav item (basic or collapsable parent)
 */
@Component({
  selector: 'nav-item',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  styleUrls: ['./nav-shared.css'],
  template: `
    <a
      mat-list-item
      [routerLink]="item().link"
      [routerLinkActive]="'list-item--activated'"
      [routerLinkActiveOptions]="{ exact: item().exactMatch ?? false }"
      [class.opacity-50]="item().disabled"
      [class.pointer-events-none]="item().disabled"
      [class.cursor-default]="item().disabled"
      [attr.title]="item().tooltip"
      [attr.aria-disabled]="item().disabled"
      [target]="item().externalLink ? item().target ?? '_blank' : undefined"
      [attr.rel]="item().externalLink ? 'noopener noreferrer' : undefined"
      [class]="'rounded-lg transition-all duration-200 custom-list-item-hover ' + (item().classes?.wrapper || '')"
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
    </a>
  `,
})
export class NavItem {
  // Required item data
  item = input.required<InternalNavItem>();

  // Optional display settings
  centerIcon = input<boolean>(false);
  hideText = input<boolean>(false);
  showBadge = input<boolean>(true);
}
