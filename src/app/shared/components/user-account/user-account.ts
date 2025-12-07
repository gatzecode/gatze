import { Component, input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { User } from '@app/core/models';

@Component({
  selector: 'user-account',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  template: `
    <div
      class="flex items-center gap-1 w-full ml-1 overflow-hidden"
      [matMenuTriggerFor]="userActions"
    >
      <div
        class="shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
      >
        <span class="text-xs font-semibold text-primary">
          {{ user()?.name?.charAt(0)?.toUpperCase() }}
        </span>
      </div>

      <div
        class="flex flex-col min-w-0 flex-1"
        [class.user-account-info--visible]="isNavExpanded()"
        [class.user-account-info--hidden]="!isNavExpanded()"
      >
        <span class="text-sm font-medium truncate">
          {{ user()?.name }}
        </span>
        <span class="text-xs text-muted-foreground truncate">
          {{ user()?.email }}
        </span>
      </div>
    </div>

    <mat-menu #userActions="matMenu" xPosition="after">
      <button mat-menu-item routerLink="/account/profile">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>
      <button mat-menu-item routerLink="/account/settings">
        <mat-icon>manage_accounts</mat-icon>
        <span>Account Settings</span>
      </button>
      <button mat-menu-item routerLink="/account/preferences">
        <mat-icon>tune</mat-icon>
        <span>Preferences</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item routerLink="/logout">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  styles: [`
      .user-account-info--visible {
        opacity: 1;
        transform: translateX(0);
        max-width: 300px;
        margin-left: 0.5rem;
      }

      .user-account-info--hidden {
        opacity: 0;
        transform: translateX(-10px);
        max-width: 0;
        margin-left: 0;
        pointer-events: none;
      }
    `,
  ],
})
export class UserAccount {
  readonly user = input<User | null>(null);
  readonly showAvatar = input<boolean>(true);
  readonly isNavExpanded = input<boolean>(true);

  signOut(): void {
    console.log('Sign out');
  }

  onProfileClick(): void {
    console.log('Navigate to profile');
  }

  onSettingsClick(): void {
    console.log('Navigate to settings');
  }
}
