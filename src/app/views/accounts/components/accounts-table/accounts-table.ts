import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material imports
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

// Services and models
import { AccountsStateService } from '../../services/accounts-state.service';
import { Account } from '../../../../core/models';

@Component({
  selector: 'app-accounts-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './accounts-table.html',
  styles: [`
    :host {
      display: block;
    }

    .table-container {
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid #E5E7EB;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .table-count {
      font-size: 0.875rem;
      color: #6B7280;
    }

    .accounts-table {
      width: 100%;
    }

    .mat-mdc-table {
      background: transparent;
    }

    .mat-mdc-header-row {
      background-color: #F9FAFB;
    }

    .mat-mdc-header-cell {
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    .mat-mdc-row {
      cursor: pointer;
      transition: background-color 0.15s ease;
      border-bottom: 1px solid #F3F4F6;
    }

    .mat-mdc-row:hover {
      background-color: #F9FAFB;
    }

    .mat-mdc-row.selected {
      background-color: #EEF2FF;
      border-left: 4px solid #6366F1;
    }

    .mat-mdc-row.selected:hover {
      background-color: #E0E7FF;
    }

    .card-number {
      font-family: 'Courier New', monospace;
      font-weight: 500;
      color: #111827;
    }

    .account-name {
      font-weight: 500;
      color: #111827;
    }

    .account-number {
      font-family: 'Courier New', monospace;
      color: #6B7280;
      font-size: 0.875rem;
    }

    .status-chip {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-weight: 500;
    }

    .status-active {
      background-color: #D1FAE5;
      color: #065F46;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6B7280;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #D1D5DB;
      margin-bottom: 1rem;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem;
    }
  `]
})
export class AccountsTableComponent {
  private readonly accountsState = inject(AccountsStateService);

  // Output event
  accountSelected = output<Account>();

  // Displayed columns
  readonly displayedColumns = ['card', 'name', 'accountNumber', 'status'];

  // Computed from state
  readonly accounts = this.accountsState.accounts;
  readonly selectedAccount = this.accountsState.selectedAccount;
  readonly totalAccounts = this.accountsState.totalAccounts;
  readonly hasAccounts = this.accountsState.hasAccounts;
  readonly loading = this.accountsState.searching;

  onSelectAccount(account: Account): void {
    this.accountSelected.emit(account);
  }

  isSelected(account: Account): boolean {
    const selected = this.selectedAccount();
    return selected?.accountNumber === account.accountNumber;
  }

  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
}
