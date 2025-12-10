import { Injectable, signal, computed, inject } from '@angular/core';
import { Account, Cardholder, Card } from '../../../core/models';
import { AccountsService } from './accounts.service';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsStateService {
  private readonly accountsService = inject(AccountsService);
  private readonly mockDataService = inject(MockDataService);

  // Private writable signals
  private readonly accountsSignal = signal<Account[]>([]);
  private readonly selectedAccountSignal = signal<Account | null>(null);
  private readonly cardholderSignal = signal<Cardholder | null>(null);
  private readonly cardsSignal = signal<Card[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly searchingSignal = signal<boolean>(false);
  private readonly savingSignal = signal<boolean>(false);

  // Public readonly signals
  readonly accounts = this.accountsSignal.asReadonly();
  readonly selectedAccount = this.selectedAccountSignal.asReadonly();
  readonly cardholder = this.cardholderSignal.asReadonly();
  readonly cards = this.cardsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly searching = this.searchingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();

  // Computed signals (derived values)
  readonly hasAccounts = computed(() => this.accountsSignal().length > 0);
  readonly totalAccounts = computed(() => this.accountsSignal().length);
  readonly accountActive = computed(() => this.selectedAccountSignal() !== null);
  readonly hasCardholder = computed(() => this.cardholderSignal() !== null);
  readonly totalCards = computed(() => this.cardsSignal().length);

  readonly cardNumber = computed(() => {
    const account = this.selectedAccountSignal();
    return account ? account.card : '';
  });

  readonly accountNumber = computed(() => {
    const account = this.selectedAccountSignal();
    return account ? account.accountNumber : '';
  });

  readonly cardholderFullName = computed(() => {
    const cardholder = this.cardholderSignal();
    if (!cardholder) return '';

    const { firstName, lastName, secondLastName } = cardholder.personalData;
    return `${firstName} ${lastName} ${secondLastName || ''}`.trim();
  });

  readonly activeCards = computed(() => {
    return this.cardsSignal().filter(card => card.status === 'ACTIVE');
  });

  readonly blockedCards = computed(() => {
    return this.cardsSignal().filter(card => card.status === 'BLOCKED');
  });

  // State management methods

  /**
   * Set the list of accounts from search results
   */
  setAccounts(accounts: Account[]): void {
    this.accountsSignal.set(accounts);
  }

  /**
   * Add a single account to the list
   */
  addAccount(account: Account): void {
    this.accountsSignal.update(accounts => [...accounts, account]);
  }

  /**
   * Select an account and load its related data
   */
  selectAccount(account: Account): void {
    this.selectedAccountSignal.set(account);
    this.loadAccountData(account.accountNumber);
  }

  /**
   * Update cardholder information
   */
  updateCardholder(cardholder: Cardholder): void {
    this.cardholderSignal.set(cardholder);
  }

  /**
   * Update the list of cards
   */
  updateCards(cards: Card[]): void {
    this.cardsSignal.set(cards);
  }

  /**
   * Update a single card in the list
   */
  updateCard(updatedCard: Card): void {
    this.cardsSignal.update(cards =>
      cards.map(card =>
        card.cardNumber === updatedCard.cardNumber ? updatedCard : card
      )
    );
  }

  /**
   * Add a new card to the list
   */
  addCard(newCard: Card): void {
    // Validation
    if (!newCard || !newCard.cardNumber) {
      this.setError('Invalid card data: card number is required');
      return;
    }

    const accountNumber = this.accountNumber();
    if (!accountNumber) {
      this.setError('No account selected. Please select an account first.');
      return;
    }

    // Check for duplicate card numbers
    const existingCard = this.cardsSignal().find(c => c.cardNumber === newCard.cardNumber);
    if (existingCard) {
      this.setError(`Card ${newCard.cardNumber} already exists for this account`);
      return;
    }

    // Optimistic update
    this.cardsSignal.update(cards => [...cards, newCard]);
    this.setSaving(true);
    this.clearError();

    // Persist to backend
    this.accountsService.createCard(accountNumber, newCard).subscribe({
      next: (createdCard) => {
        // Update the card with any server-generated data
        this.updateCard(createdCard);
        this.setSaving(false);
      },
      error: (error: any) => {
        const errorMessage = this.extractErrorMessage(error, 'creating card');
        this.setError(errorMessage);
        // Rollback optimistic update
        this.cardsSignal.update(cards =>
          cards.filter(c => c.cardNumber !== newCard.cardNumber)
        );
        this.setSaving(false);
      }
    });
  }

  /**
   * Create a complete new account with cardholder and card
   */
  createAccount(account: Account, cardholder: Cardholder, card: Card): void {
    // Validation
    if (!account || !account.accountNumber) {
      this.setError('Invalid account data: account number is required');
      return;
    }

    if (!cardholder || !cardholder.personalData) {
      this.setError('Invalid cardholder data: personal information is required');
      return;
    }

    if (!card || !card.cardNumber) {
      this.setError('Invalid card data: card number is required');
      return;
    }

    // Check for duplicate account number
    const existingAccount = this.accountsSignal().find(
      a => a.accountNumber === account.accountNumber
    );
    if (existingAccount) {
      this.setError(`Account ${account.accountNumber} already exists`);
      return;
    }

    this.setLoading(true);
    this.clearError();

    this.accountsService.createCompleteAccount(account, cardholder, card).subscribe({
      next: (result) => {
        // Add to accounts list
        this.addAccount(result.account);

        // Set as selected account
        this.selectedAccountSignal.set(result.account);

        // Set cardholder and card data
        this.cardholderSignal.set(result.cardholder);
        this.cardsSignal.set([result.card]);

        this.setLoading(false);
      },
      error: (error: any) => {
        const errorMessage = this.extractErrorMessage(error, 'creating account');
        this.setError(errorMessage);
        this.setLoading(false);
      }
    });
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  /**
   * Set searching state
   */
  setSearching(searching: boolean): void {
    this.searchingSignal.set(searching);
  }

  /**
   * Set saving state
   */
  setSaving(saving: boolean): void {
    this.savingSignal.set(saving);
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Reset all state to initial values
   */
  reset(): void {
    this.accountsSignal.set([]);
    this.selectedAccountSignal.set(null);
    this.cardholderSignal.set(null);
    this.cardsSignal.set([]);
    this.loadingSignal.set(false);
    this.searchingSignal.set(false);
    this.savingSignal.set(false);
    this.errorSignal.set(null);
  }

  /**
   * Load initial accounts data
   */
  loadInitialData(): void {
    const initialAccounts = this.mockDataService.getInitialAccounts();
    this.setAccounts(initialAccounts);
  }

  /**
   * Clear search results but keep selected account
   */
  clearSearch(): void {
    this.accountsSignal.set([]);
    this.searchingSignal.set(false);
    this.clearError();
  }

  /**
   * Save cardholder changes
   */
  saveCardholder(): void {
    const cardholder = this.cardholderSignal();
    const accountNumber = this.accountNumber();

    if (!cardholder) {
      this.setError('No cardholder data to save');
      return;
    }

    if (!accountNumber) {
      this.setError('No account selected. Please select an account first.');
      return;
    }

    // Validate required cardholder fields
    if (!cardholder.personalData?.firstName || !cardholder.personalData?.lastName) {
      this.setError('Cardholder name is required');
      return;
    }

    this.setSaving(true);
    this.clearError();

    this.accountsService.updateCardholder(accountNumber, cardholder).subscribe({
      next: (updated) => {
        this.cardholderSignal.set(updated);
        this.setSaving(false);
      },
      error: (error) => {
        const errorMessage = this.extractErrorMessage(error, 'saving cardholder data');
        this.setError(errorMessage);
        this.setSaving(false);
      }
    });
  }

  /**
   * Save card changes
   */
  saveCard(card: Card): void {
    const accountNumber = this.accountNumber();

    if (!card || !card.cardNumber) {
      this.setError('Invalid card data: card number is required');
      return;
    }

    if (!accountNumber) {
      this.setError('No account selected. Please select an account first.');
      return;
    }

    // Verify card exists in current account
    const existingCard = this.cardsSignal().find(c => c.cardNumber === card.cardNumber);
    if (!existingCard) {
      this.setError(`Card ${card.cardNumber} not found in current account`);
      return;
    }

    this.setSaving(true);
    this.clearError();

    this.accountsService.updateCard(accountNumber, card).subscribe({
      next: (updated) => {
        this.updateCard(updated);
        this.setSaving(false);
      },
      error: (error) => {
        const errorMessage = this.extractErrorMessage(error, 'saving card data');
        this.setError(errorMessage);
        this.setSaving(false);
      }
    });
  }

  // Private methods

  /**
   * Load cardholder and cards data for the selected account
   */
  private loadAccountData(accountNumber: string): void {
    if (!accountNumber) {
      this.setError('Invalid account number');
      return;
    }

    this.setLoading(true);
    this.clearError();

    // Try to load from mock data first
    const mockCardholder = this.mockDataService.getCardholderByAccountNumber(accountNumber);
    const mockCards = this.mockDataService.getCardsByAccountNumber(accountNumber);

    if (mockCardholder && mockCards.length > 0) {
      // Use mock data
      this.cardholderSignal.set(mockCardholder);
      this.cardsSignal.set(mockCards);
      this.setLoading(false);
    } else {
      // Load from API
      this.accountsService.getCardholderByAccount(accountNumber).subscribe({
        next: (cardholder) => {
          this.cardholderSignal.set(cardholder);
        },
        error: (error: any) => {
          const errorMessage = this.extractErrorMessage(error, 'loading cardholder data');
          this.setError(errorMessage);
          this.setLoading(false);
        }
      });

      this.accountsService.getCardsByAccount(accountNumber).subscribe({
        next: (cards) => {
          this.cardsSignal.set(cards);
          this.setLoading(false);
        },
        error: (error: any) => {
          const errorMessage = this.extractErrorMessage(error, 'loading cards data');
          this.setError(errorMessage);
          this.setLoading(false);
        }
      });
    }
  }

  /**
   * Extract user-friendly error message from HTTP error
   * @param error - Error object from HTTP request
   * @param operation - Description of the operation that failed
   * @returns User-friendly error message
   */
  private extractErrorMessage(error: any, operation: string): string {
    // Network error
    if (error.status === 0) {
      return `Network error while ${operation}. Please check your internet connection.`;
    }

    // HTTP error codes
    switch (error.status) {
      case 400:
        return `Invalid data while ${operation}. Please verify your input.`;
      case 401:
        return `Authentication required. Please log in again.`;
      case 403:
        return `Access denied while ${operation}. You don't have permission to perform this action.`;
      case 404:
        return `Resource not found while ${operation}.`;
      case 409:
        return `Conflict while ${operation}. The resource may already exist.`;
      case 422:
        return `Validation error while ${operation}. ${error.error?.message || 'Please check your data.'}`;
      case 500:
        return `Server error while ${operation}. Please try again later.`;
      case 503:
        return `Service temporarily unavailable. Please try again later.`;
      default:
        // Try to extract error message from response
        if (error.error?.message) {
          return `Error while ${operation}: ${error.error.message}`;
        }
        if (error.message) {
          return `Error while ${operation}: ${error.message}`;
        }
        return `Unexpected error while ${operation}. Please try again.`;
    }
  }
}
