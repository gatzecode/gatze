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
    }

    .panel-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #E5E7EB;
    }

    .panel-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
    }

    .panel-content {
      overflow-y: auto;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
