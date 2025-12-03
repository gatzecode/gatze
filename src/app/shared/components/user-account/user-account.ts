import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

interface User {
  email: string;
  avatar?: string;
}

@Component({
  selector: 'user-account',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="userActions">
      <mat-icon>account_circle</mat-icon>
    </button>

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
  styles: [],
})
export class UserAccount {
  @Input() user: User | null = null;
  @Input() showAvatar: boolean = true;

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
