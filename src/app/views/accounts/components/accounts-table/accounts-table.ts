import { Component, output, inject, ViewChild, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

// Pipes
import { MaskCardPipe } from '../../../../shared/pipes/mask-card.pipe';

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
    MatChipsModule,
    MatPaginatorModule,
    MaskCardPipe,
  ],
  templateUrl: './accounts-table.html',
  styles: [
    `
      :host {
        display: block;
      }

      .table-card {
        width: 100%;
      }

      .selected-row {
        background-color: color-mix(
          in srgb,
          var(--mat-list-active-indicator-color, var(--mat-sys-inverse-primary)) 8%,
          transparent
        );
      }

      .loading-state,
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
      }

      .empty-state mat-icon {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class AccountsTableComponent implements AfterViewInit {
  private readonly accountsState = inject(AccountsStateService);

  // Output event
  accountSelected = output<Account>();

  // ViewChild for paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Displayed columns
  readonly displayedColumns = ['card', 'name', 'accountNumber', 'status'];

  // DataSource for the table
  dataSource = new MatTableDataSource<Account>([]);

  // Computed from state
  readonly accounts = this.accountsState.accounts;
  readonly selectedAccount = this.accountsState.selectedAccount;
  readonly totalAccounts = this.accountsState.totalAccounts;
  readonly hasAccounts = this.accountsState.hasAccounts;
  readonly loading = this.accountsState.searching;

  constructor() {
    // Update dataSource when accounts change
    effect(() => {
      const accounts = this.accounts();
      this.dataSource.data = accounts;

      // Reset paginator to first page when data changes
      // Use queueMicrotask to ensure paginator is ready
      queueMicrotask(() => {
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

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
