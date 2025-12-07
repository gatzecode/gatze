import { Component, output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services and models
import { AccountsService } from '../../../../core/services/accounts.service';
import { AccountsStateService } from '../../services/accounts-state.service';
import { Account } from '../../../../core/models';
import { cardNumberValidator } from '../../../../shared/utils/validators';

@Component({
  selector: 'app-search-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './search-panel.html',
  styles: [`
    :host {
      display: block;
    }

    .search-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.5rem 0;
    }

    .results-table {
      width: 100%;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .mat-mdc-table {
      background: white;
    }

    .mat-mdc-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .mat-mdc-row:hover {
      background-color: #EEF2FF;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: #6B7280;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem;
    }
  `]
})
export class SearchPanelComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accountsService = inject(AccountsService);
  private readonly accountsState = inject(AccountsStateService);

  // Output events
  accountSelected = output<Account>();

  // Signals
  readonly displayedColumns = signal<string[]>(['card', 'name', 'account']);

  // Form
  searchForm!: FormGroup;

  // Computed from state service
  readonly accounts = this.accountsState.accounts;
  readonly totalResults = this.accountsState.totalAccounts;
  readonly searching = this.accountsState.searching;
  readonly hasAccounts = this.accountsState.hasAccounts;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      firstName: ['', [Validators.maxLength(100)]],
      lastName: ['', [Validators.maxLength(100)]],
      secondLastName: ['', [Validators.maxLength(100)]],
      accountNumber: ['', [Validators.pattern(/^\d+$/)]],
      cardNumber: ['', [cardNumberValidator()]],
      additionalsOnly: [false]
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    // Validate that at least one search criterion is provided
    const formValue = this.searchForm.value;
    const hasAnyCriteria = Object.entries(formValue).some(([key, value]) => {
      if (key === 'additionalsOnly') return false;
      return value && value.toString().trim() !== '';
    });

    if (!hasAnyCriteria) {
      // Could show a message to the user
      return;
    }

    this.accountsState.setSearching(true);
    this.accountsState.clearError();

    const criteria = this.searchForm.value;

    this.accountsService.searchAccounts(criteria).subscribe({
      next: (accounts) => {
        this.accountsState.setAccounts(accounts);
        this.accountsState.setSearching(false);
      },
      error: (error) => {
        this.accountsState.setError('Error searching accounts: ' + error.message);
        this.accountsState.setSearching(false);
      }
    });
  }

  onClear(): void {
    this.searchForm.reset({
      firstName: '',
      lastName: '',
      secondLastName: '',
      accountNumber: '',
      cardNumber: '',
      additionalsOnly: false
    });
    this.accountsState.clearSearch();
  }

  selectAccount(account: Account): void {
    this.accountSelected.emit(account);
  }

  // Helper method to get form control errors
  getErrorMessage(controlName: string): string {
    const control = this.searchForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['maxLength']) {
      return `Maximum ${control.errors['maxLength'].requiredLength} characters`;
    }
    if (control.errors['pattern']) {
      return 'Invalid format';
    }
    if (control.errors['invalidCardNumber']) {
      return control.errors['invalidCardNumber'].message;
    }

    return 'Invalid value';
  }
}
