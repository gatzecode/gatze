import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Components
import { CardDialogComponent } from '../card-dialog/card-dialog';

// Services and models
import { AccountsStateService } from '../../services/accounts-state.service';
import { Card, CardStatus } from '../../../../core/models';

@Component({
  selector: 'app-cards-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './cards-tab.html',
  styles: [
    `
      :host {
        display: block;
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
        padding: 1rem 0;
      }

      .card-item {
        border-radius: 0.75rem;
        padding: 1.5rem;
        transition: all 0.2s;
      }

      .card-item:hover {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        border-color: var(--mat-list-active-indicator-color, var(--mat-sys-inverse-primary));
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 1rem;
      }

      .card-number {
        font-family: 'Courier New', monospace;
        font-size: 1.125rem;
        font-weight: 600;
        letter-spacing: 0.05em;
      }

      .card-detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
      }

      .card-detail-label {
        font-size: 0.875rem;
      }

      .card-detail-value {
        font-weight: 500;
      }

      .access-methods {
        margin-top: 1rem;
      }

      .access-method-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.375rem;
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class CardsTabComponent {
  private readonly accountsState = inject(AccountsStateService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  readonly expandedCardIndex = signal<number | null>(null);

  // Computed from state
  readonly cards = this.accountsState.cards;
  readonly loading = this.accountsState.loading;
  readonly totalCards = this.accountsState.totalCards;
  readonly activeCards = this.accountsState.activeCards;
  readonly blockedCards = this.accountsState.blockedCards;

  /**
   * Get status badge color based on card status
   */
  getStatusColor(status: CardStatus): string {
    const colors: Record<CardStatus, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      BLOCKED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      EXPIRED: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Get status icon based on card status
   */
  getStatusIcon(status: CardStatus): string {
    const icons: Record<CardStatus, string> = {
      ACTIVE: 'check_circle',
      BLOCKED: 'block',
      CANCELLED: 'cancel',
      EXPIRED: 'schedule',
    };
    return icons[status] || 'info';
  }

  /**
   * Get manufacturer icon
   */
  getManufacturerIcon(manufacturer: string): string {
    const lowerManufacturer = manufacturer.toLowerCase();
    if (lowerManufacturer.includes('visa')) return 'payment';
    if (lowerManufacturer.includes('mastercard')) return 'payment';
    if (lowerManufacturer.includes('amex')) return 'payment';
    return 'credit_card';
  }

  /**
   * Format card number with spaces for readability
   */
  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  /**
   * Format credit limit as currency
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  /**
   * Format expiration date
   */
  formatExpiration(expiration: Date | string): string {
    const date = typeof expiration === 'string' ? new Date(expiration) : expiration;
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
    }).format(date);
  }

  /**
   * Toggle card expansion
   */
  toggleCard(index: number): void {
    if (this.expandedCardIndex() === index) {
      this.expandedCardIndex.set(null);
    } else {
      this.expandedCardIndex.set(index);
    }
  }

  /**
   * Check if card is expanded
   */
  isExpanded(index: number): boolean {
    return this.expandedCardIndex() === index;
  }

  /**
   * Get access method icon
   */
  getAccessMethodIcon(type: string): string {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('chip')) return 'credit_card';
    if (lowerType.includes('cnp') || lowerType.includes('ecommerce')) return 'shopping_cart';
    if (lowerType.includes('contactless')) return 'contactless';
    return 'payment';
  }

  /**
   * Get access method status color
   */
  getAccessMethodStatusColor(status?: string): string {
    if (!status) return 'bg-gray-100 text-gray-800';

    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'active') return 'bg-green-100 text-green-800';
    if (lowerStatus === 'blocked') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  }

  /**
   * Open dialog to add new card
   */
  onAddCard(): void {
    const accountNumber = this.accountsState.accountNumber();

    if (!accountNumber) {
      this.showError('No hay cuenta seleccionada');
      return;
    }

    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '700px',
      data: {
        accountNumber,
        isAdditional: this.totalCards() > 0, // If there are cards, suggest additional
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((card: Card) => {
      if (card) {
        this.accountsState.addCard(card);
        this.showSuccess('Tarjeta agregada exitosamente');
      }
    });
  }

  /**
   * Open dialog to edit existing card
   */
  onEditCard(card: Card): void {
    const accountNumber = this.accountsState.accountNumber();

    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '700px',
      data: {
        card,
        accountNumber,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((updatedCard: Card) => {
      if (updatedCard) {
        this.accountsState.saveCard(updatedCard);
        this.showSuccess('Tarjeta actualizada exitosamente');
      }
    });
  }

  /**
   * Block/unblock card
   */
  onToggleCardStatus(card: Card): void {
    const newStatus: CardStatus = card.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    const updatedCard = { ...card, status: newStatus };

    this.accountsState.saveCard(updatedCard);

    const message =
      newStatus === 'BLOCKED'
        ? 'Tarjeta bloqueada exitosamente'
        : 'Tarjeta desbloqueada exitosamente';
    this.showSuccess(message);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
