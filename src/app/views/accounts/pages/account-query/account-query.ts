import { Component, signal, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Material imports
import { MatSidenavModule } from '@angular/material/sidenav';
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
      height: calc(100vh - 64px);
    }

    .sidenav {
      width: 350px;
      border-right: 1px solid #E5E7EB;
      background-color: #FAFAFA;
    }

    .main-content {
      padding: 1.5rem;
      height: 100%;
      overflow-y: auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #E5E7EB;
    }

    .header-info h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-info p {
      font-size: 0.875rem;
      color: #6B7280;
      margin: 0.25rem 0 0 0;
    }

    .content-section {
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 280px;
      }
    }
  `]
})
export class AccountQueryComponent implements OnInit, OnDestroy {
  private readonly accountsState = inject(AccountsStateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

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
