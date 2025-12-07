import { Component, signal, effect, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Material imports
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

// Components
import { SearchPanelComponent } from '../../components/search-panel/search-panel';
import { DetailPanelComponent } from '../../components/detail-panel/detail-panel';
import { AccountsTableComponent } from '../../components/accounts-table/accounts-table';

// Services and models
import { AccountsStateService } from '../../services/accounts-state.service';
import { Account } from '../../../../core/models';

@Component({
  selector: 'app-account-query',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    SearchPanelComponent,
    DetailPanelComponent,
    AccountsTableComponent
  ],
  templateUrl: './account-query.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .sidenav-container {
      height: 100%;
      background: transparent;
    }

    .sidenav {
      width: 350px;
      border-left: 1px solid rgba(0, 0, 0, 0.12);
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
    }

    .main-content {
      height: 100%;
      overflow-y: auto;
      transition: margin-right 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .shadow-professional {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
        max-width: 350px;
        position: absolute;
        z-index: 100;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
      }
    }
  `]
})
export class AccountQueryComponent implements OnInit, OnDestroy {
  private readonly accountsState = inject(AccountsStateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  // Sidenav reference
  @ViewChild('searchSidenav') searchSidenav!: MatSidenav;

  // Sidenav state
  readonly searchSidenavOpen = signal<boolean>(this.getStoredSidenavState());

  // Computed from state
  readonly selectedAccount = this.accountsState.selectedAccount;
  readonly error = this.accountsState.error();
  readonly loading = this.accountsState.loading;

  constructor() {
    // Effect to show errors
    effect(() => {
      const error = this.accountsState.error();
      if (error) {
        this.showError(error);
        // Auto-clear error after showing
        setTimeout(() => {
          this.accountsState.clearError();
        }, 100);
      }
    });
  }

  ngOnInit(): void {
    // Load initial data when component initializes
    this.accountsState.loadInitialData();
  }

  toggleSearchSidenav(): void {
    this.searchSidenavOpen.update(value => !value);
    this.storeSidenavState(this.searchSidenavOpen());
  }

  private getStoredSidenavState(): boolean {
    const stored = localStorage.getItem('searchSidenavOpen');
    return stored !== null ? stored === 'true' : true;
  }

  private storeSidenavState(isOpen: boolean): void {
    localStorage.setItem('searchSidenavOpen', isOpen.toString());
  }

  ngOnDestroy(): void {
    // Don't reset - keep data for navigation
  }

  onAccountSelected(account: Account): void {
    this.accountsState.selectAccount(account);
  }

  onCreateAccount(): void {
    this.router.navigate(['/administration/credit-accounts/new']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }
}
