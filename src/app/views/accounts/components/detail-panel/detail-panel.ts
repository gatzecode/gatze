import { Component, input, signal, computed, inject, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { CardholderTabComponent } from '../cardholder-tab/cardholder-tab';
import { CardsTabComponent } from '../cards-tab/cards-tab';

// Services
import { AccountsStateService } from '../../services/accounts-state.service';

@Component({
  selector: 'app-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    CardholderTabComponent,
    CardsTabComponent
  ],
  templateUrl: './detail-panel.html',
  styles: [`
    :host {
      display: block;
    }

    .account-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 0.5rem 0.5rem 0 0;
    }

    .account-info {
      flex: 1;
    }

    .account-number {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 0.25rem;
    }

    .cardholder-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .card-number {
      font-family: 'Courier New', monospace;
      font-size: 1rem;
      letter-spacing: 0.1em;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    ::ng-deep .mat-mdc-tab-labels {
      background-color: #F9FAFB;
      border-bottom: 1px solid #E5E7EB;
    }

    ::ng-deep .mat-mdc-tab-label {
      color: #6B7280;
    }

    ::ng-deep .mat-mdc-tab-label-active {
      color: #6366F1;
    }
  `]
})
export class DetailPanelComponent {
  private readonly accountsState = inject(AccountsStateService);
  private readonly snackBar = inject(MatSnackBar);

  // ViewChild to access cardholder tab
  private readonly cardholderTab = viewChild(CardholderTabComponent);

  // Signals
  readonly currentTabIndex = signal<number>(0);

  // Computed from state
  readonly cardholder = this.accountsState.cardholder;
  readonly selectedAccount = this.accountsState.selectedAccount;
  readonly cardNumber = this.accountsState.cardNumber;
  readonly cardholderName = this.accountsState.cardholderFullName;
  readonly accountNumber = this.accountsState.accountNumber;
  readonly saving = this.accountsState.saving;
  readonly loading = this.accountsState.loading;

  readonly showDetail = computed(() => {
    return this.selectedAccount() !== null;
  });

  readonly canSave = computed(() => {
    const tab = this.cardholderTab();
    if (!tab) return false;
    return tab.hasChanges() && tab.cardholderForm.valid;
  });

  onTabChange(index: number): void {
    this.currentTabIndex.set(index);
  }

  onSaveChanges(): void {
    const cardholderTabComponent = this.cardholderTab();

    if (!cardholderTabComponent) {
      this.showError('Cardholder tab not available');
      return;
    }

    if (!cardholderTabComponent.cardholderForm.valid) {
      cardholderTabComponent.cardholderForm.markAllAsTouched();
      this.showError('Please fix validation errors before saving');
      return;
    }

    const updatedCardholder = cardholderTabComponent.getCardholderData();
    this.accountsState.updateCardholder(updatedCardholder);
    this.accountsState.saveCardholder();

    // Show success message
    this.accountsState.saving();
    setTimeout(() => {
      if (!this.accountsState.error()) {
        this.showSuccess('Changes saved successfully');
        cardholderTabComponent.cardholderForm.markAsPristine();
      }
    }, 1000);
  }

  onCancelChanges(): void {
    const cardholderTabComponent = this.cardholderTab();

    if (cardholderTabComponent) {
      // Reset form to original values
      const cardholder = this.cardholder();
      if (cardholder) {
        cardholderTabComponent.cardholderForm.reset();
        cardholderTabComponent.cardholderForm.patchValue({
          personalData: cardholder.personalData,
          contactData: cardholder.contactData,
          taxData: cardholder.taxData
        });
        cardholderTabComponent.cardholderForm.markAsPristine();
        this.showInfo('Changes cancelled');
      }
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
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

  /**
   * Format card number with spaces
   */
  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
}
