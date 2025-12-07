import { Injectable, signal, computed, inject } from '@angular/core';
import { Account, Cardholder, Card } from '../../../core/models';
import { AccountsService } from '../../../core/services/accounts.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsStateService {
  private readonly accountsService = inject(AccountsService);

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
    this.cardsSignal.update(cards => [...cards, newCard]);

    // Optionally persist to backend
    const accountNumber = this.accountNumber();
    if (accountNumber) {
      this.setSaving(true);
      this.accountsService.createCard(accountNumber, newCard).subscribe({
        next: (createdCard) => {
          // Update the card with any server-generated data
          this.updateCard(createdCard);
          this.setSaving(false);
        },
        error: (error: any) => {
          this.setError('Error creating card: ' + error.message);
          // Remove the optimistically added card on error
          this.cardsSignal.update(cards =>
            cards.filter(c => c.cardNumber !== newCard.cardNumber)
          );
          this.setSaving(false);
        }
      });
    }
  }

  /**
   * Create a complete new account with cardholder and card
   */
  createAccount(account: Account, cardholder: Cardholder, card: Card): void {
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
        this.setError('Error creating account: ' + error.message);
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

    if (!cardholder || !accountNumber) {
      this.setError('No cardholder data to save');
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
        this.setError('Error saving cardholder data: ' + error.message);
        this.setSaving(false);
      }
    });
  }

  /**
   * Save card changes
   */
  saveCard(card: Card): void {
    const accountNumber = this.accountNumber();

    if (!accountNumber) {
      this.setError('No account selected');
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
        this.setError('Error saving card data: ' + error.message);
        this.setSaving(false);
      }
    });
  }

  // Private methods

  /**
   * Load cardholder and cards data for the selected account
   */
  private loadAccountData(accountNumber: string): void {
    this.setLoading(true);
    this.clearError();

    // Load cardholder data
    this.accountsService.getCardholderByAccount(accountNumber).subscribe({
      next: (cardholder) => {
        this.cardholderSignal.set(cardholder);
      },
      error: (error) => {
        this.setError('Error loading cardholder data: ' + error.message);
        this.setLoading(false);
      }
    });

    // Load cards data
    this.accountsService.getCardsByAccount(accountNumber).subscribe({
      next: (cards) => {
        this.cardsSignal.set(cards);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError('Error loading cards data: ' + error.message);
        this.setLoading(false);
      }
    });
  }
}
