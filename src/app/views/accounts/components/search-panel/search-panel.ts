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
      height: 100%;
    }

    .search-panel {
      padding: 1.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    .panel-title {
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0;
    }

    .panel-content {
      flex: 1;
      overflow-y: auto;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary, #6B7280);
      margin-left: 0.25rem;
    }

    mat-form-field {
      width: 100%;
    }

    .full-width-checkbox {
      margin: 0.5rem 0;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    }

    .full-width {
      width: 100%;
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
      fullName: ['', [Validators.maxLength(300)]],
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

    // Split fullName into firstName, lastName, secondLastName
    const fullName = this.searchForm.value.fullName?.trim() || '';
    const nameParts = fullName.split(/\s+/).filter((part: string) => part);

    const criteria = {
      firstName: nameParts[0] || '',
      lastName: nameParts[1] || '',
      secondLastName: nameParts[2] || '',
      accountNumber: this.searchForm.value.accountNumber,
      cardNumber: this.searchForm.value.cardNumber,
      additionalsOnly: this.searchForm.value.additionalsOnly
    };

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
      fullName: '',
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
