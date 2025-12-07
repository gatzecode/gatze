import { Component, signal, effect, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Components
import { SearchPanelComponent } from '../../components/search-panel/search-panel';
import { DetailPanelComponent } from '../../components/detail-panel/detail-panel';
import { AccountWizardComponent, NewAccountData } from '../../components/account-wizard/account-wizard';

// Services and models
import { AccountsStateService } from '../../services/accounts-state.service';
import { Account } from '../../../../core/models';

@Component({
  selector: 'app-account-query',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    SearchPanelComponent,
    DetailPanelComponent
  ],
  templateUrl: './account-query.html',
  styles: [`
    :host {
      display: block;
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .page-subtitle {
      font-size: 1rem;
      color: #6B7280;
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      .page-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AccountQueryComponent implements OnDestroy {
  private readonly accountsState = inject(AccountsStateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

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

    // Effect to log when account is selected
    effect(() => {
      const account = this.selectedAccount();
      if (account) {
        console.log('Account selected:', account);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up state when component is destroyed
    this.accountsState.reset();
  }

  onAccountSelected(account: Account): void {
    this.accountsState.selectAccount(account);
    this.showInfo(`Selected account: ${account.accountNumber}`);
  }

  onCreateAccount(): void {
    const dialogRef = this.dialog.open(AccountWizardComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: NewAccountData) => {
      if (result) {
        // Add the new account to state
        this.accountsState.createAccount(result.account, result.cardholder, result.card);
        this.showSuccess(`Cuenta ${result.account.accountNumber} creada exitosamente`);

        // Automatically select the new account
        setTimeout(() => {
          this.accountsState.selectAccount(result.account);
        }, 500);
      }
    });
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
