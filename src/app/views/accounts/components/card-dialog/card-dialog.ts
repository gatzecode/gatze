import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Material imports
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Models and validators
import { Card, CardStatus } from '../../../../core/models';
import { cardNumberValidator } from '../../../../shared/utils/validators';

export interface CardDialogData {
  card?: Card;
  accountNumber: string;
  isAdditional?: boolean;
}

interface CardTypeOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface ManufacturerOption {
  value: string;
  label: string;
  icon: string;
}

interface StatusOption {
  value: CardStatus;
  label: string;
  color: string;
}

@Component({
  selector: 'app-card-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <div class="flex items-center gap-3">
          <div class="icon-wrapper">
            <mat-icon>{{ isEditMode() ? 'edit' : 'add_card' }}</mat-icon>
          </div>
          <div>
            <h2 class="dialog-title">
              {{ isEditMode() ? 'Editar Tarjeta' : 'Nueva Tarjeta' }}
            </h2>
            <p class="dialog-subtitle">
              {{
                isEditMode()
                  ? 'Modifica los datos de tu tarjeta'
                  : 'Completa la información de tu nueva tarjeta'
              }}
            </p>
          </div>
        </div>
        <button mat-icon-button (click)="onCancel()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="cardForm" class="card-form">
          <!-- Card Preview -->
          @if (!isEditMode()) {
          <div
            class="card-preview"
            [class.card-preview-visa]="cardForm.get('manufacturer')?.value === 'VISA'"
            [class.card-preview-mastercard]="cardForm.get('manufacturer')?.value === 'MASTERCARD'"
            [class.card-preview-amex]="cardForm.get('manufacturer')?.value === 'AMERICAN EXPRESS'"
          >
            <div class="card-preview-content">
              <div class="card-preview-chip">
                <mat-icon>credit_card</mat-icon>
              </div>
              <div class="card-preview-number">
                {{ formatCardNumber(cardForm.get('cardNumber')?.value) || '•••• •••• •••• ••••' }}
              </div>
              <div class="card-preview-footer">
                <div>
                  <div class="card-preview-label">TITULAR</div>
                  <div class="card-preview-name">
                    {{ cardForm.get('cardholder')?.value || 'NOMBRE DEL TITULAR' }}
                  </div>
                </div>
                <div>
                  <div class="card-preview-label">VENCE</div>
                  <div class="card-preview-exp">
                    {{ formatExpiration(cardForm.get('expiration')?.value) || 'MM/YY' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          }

          <!-- Card Information Section -->
          <div class="form-section">
            <h3 class="section-title">
              <mat-icon>info</mat-icon>
              Información de la Tarjeta
            </h3>

            <!-- Card Number -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Número de Tarjeta</mat-label>
              <input
                matInput
                formControlName="cardNumber"
                maxlength="16"
                placeholder="1234 5678 9012 3456"
                [readonly]="isEditMode()"
                (input)="onCardNumberInput($event)"
              />
              <mat-icon matPrefix>credit_card</mat-icon>
              @if (cardNumberLength() > 0) {
              <span matSuffix class="text-xs text-gray-500">{{ cardNumberLength() }}/16</span>
              } @if (cardForm.get('cardNumber')?.hasError('required') &&
              cardForm.get('cardNumber')?.touched) {
              <mat-error>El número de tarjeta es requerido</mat-error>
              } @if (cardForm.get('cardNumber')?.hasError('invalidCardNumber')) {
              <mat-error
                >{{ cardForm.get('cardNumber')?.errors?.['invalidCardNumber']?.message }}</mat-error
              >
              }
            </mat-form-field>

            <!-- Card Type & Manufacturer Row -->
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tipo de Tarjeta</mat-label>
                <mat-select formControlName="type" [disabled]="isEditMode()">
                  @for (type of cardTypes; track type.value) {
                  <mat-option [value]="type.value">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-sm">{{ type.icon }}</mat-icon>
                      <div>
                        <div>{{ type.label }}</div>
                        <div class="text-xs text-gray-500">{{ type.description }}</div>
                      </div>
                    </div>
                  </mat-option>
                  }
                </mat-select>
                <mat-icon matPrefix>category</mat-icon>
                @if (cardForm.get('type')?.invalid && cardForm.get('type')?.touched) {
                <mat-error>Selecciona el tipo de tarjeta</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Marca</mat-label>
                <mat-select formControlName="manufacturer">
                  @for (manu of manufacturers; track manu.value) {
                  <mat-option [value]="manu.value">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-sm">{{ manu.icon }}</mat-icon>
                      {{ manu.label }}
                    </div>
                  </mat-option>
                  }
                </mat-select>
                <mat-icon matPrefix>payment</mat-icon>
                @if (cardForm.get('manufacturer')?.invalid && cardForm.get('manufacturer')?.touched)
                {
                <mat-error>Selecciona la marca</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Cardholder Name -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre del Tarjetahabiente</mat-label>
              <input
                matInput
                formControlName="cardholder"
                maxlength="100"
                placeholder="Como aparece en la tarjeta"
                (input)="onCardholderInput($event)"
              />
              <mat-icon matPrefix>person</mat-icon>
              @if (cardholderLength() > 0) {
              <span matSuffix class="text-xs text-gray-500">{{ cardholderLength() }}/100</span>
              } @if (cardForm.get('cardholder')?.hasError('required') &&
              cardForm.get('cardholder')?.touched) {
              <mat-error>El nombre del titular es requerido</mat-error>
              } @if (cardForm.get('cardholder')?.hasError('maxlength')) {
              <mat-error>Máximo 100 caracteres</mat-error>
              }
            </mat-form-field>

            <!-- Expiration & Status Row -->
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Fecha de Expiración</mat-label>
                <input
                  matInput
                  [matDatepicker]="expirationPicker"
                  formControlName="expiration"
                  [min]="minDate"
                />
                <mat-icon matPrefix>event</mat-icon>
                <mat-datepicker-toggle matSuffix [for]="expirationPicker"></mat-datepicker-toggle>
                <mat-datepicker #expirationPicker startView="multi-year"></mat-datepicker>
                @if (cardForm.get('expiration')?.invalid && cardForm.get('expiration')?.touched) {
                <mat-error>Selecciona una fecha válida</mat-error>
                } @if (isExpiringSoon()) {
                <mat-hint class="text-orange-600">⚠️ Tarjeta próxima a vencer</mat-hint>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <mat-select formControlName="status">
                  @for (status of statusOptions; track status.value) {
                  <mat-option [value]="status.value">
                    <div class="flex items-center gap-2">
                      <span class="status-dot" [style.background-color]="status.color"></span>
                      {{ status.label }}
                    </div>
                  </mat-option>
                  }
                </mat-select>
                <mat-icon matPrefix>info</mat-icon>
                @if (cardForm.get('status')?.invalid && cardForm.get('status')?.touched) {
                <mat-error>Selecciona el estado</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Credit Limit -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Límite de Crédito</mat-label>
              <input
                matInput
                type="number"
                formControlName="creditLimit"
                placeholder="0.00"
                step="100"
              />
              <span matPrefix>$&nbsp;</span>
              <span matSuffix>MXN</span>
              <mat-icon matPrefix>account_balance_wallet</mat-icon>
              @if (cardForm.get('creditLimit')?.hasError('required') &&
              cardForm.get('creditLimit')?.touched) {
              <mat-error>El límite de crédito es requerido</mat-error>
              } @if (cardForm.get('creditLimit')?.hasError('min')) {
              <mat-error>El límite debe ser mayor o igual a 0</mat-error>
              } @if (creditLimitFormatted()) {
              <mat-hint>Disponible: {{ creditLimitFormatted() }}</mat-hint>
              }
            </mat-form-field>
          </div>

          <!-- Access Methods Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="flex items-center gap-2">
                <mat-icon>vpn_key</mat-icon>
                <h3 class="section-title-text">Métodos de Acceso</h3>
              </div>
              <button mat-button type="button" (click)="toggleAllAccess()" class="text-sm">
                {{ allAccessEnabled() ? 'Desactivar todos' : 'Activar todos' }}
              </button>
            </div>

            <div class="access-methods-grid">
              <div
                class="access-method-card"
                [class.access-method-active]="cardForm.get('accessPOS')?.value"
              >
                <mat-checkbox formControlName="accessPOS" color="primary">
                  <div class="access-method-content">
                    <div class="flex items-center gap-2">
                      <mat-icon>point_of_sale</mat-icon>
                      <span class="font-medium">Punto de Venta</span>
                    </div>
                    <p class="access-method-description">Usa tu tarjeta en comercios físicos</p>
                  </div>
                </mat-checkbox>
              </div>

              <div
                class="access-method-card"
                [class.access-method-active]="cardForm.get('accessATM')?.value"
              >
                <mat-checkbox formControlName="accessATM" color="primary">
                  <div class="access-method-content">
                    <div class="flex items-center gap-2">
                      <mat-icon>local_atm</mat-icon>
                      <span class="font-medium">Cajero Automático</span>
                    </div>
                    <p class="access-method-description">Retira efectivo y consulta saldo</p>
                  </div>
                </mat-checkbox>
              </div>

              <div
                class="access-method-card"
                [class.access-method-active]="cardForm.get('accessEcommerce')?.value"
              >
                <mat-checkbox formControlName="accessEcommerce" color="primary">
                  <div class="access-method-content">
                    <div class="flex items-center gap-2">
                      <mat-icon>shopping_cart</mat-icon>
                      <span class="font-medium">Compras en Línea</span>
                    </div>
                    <p class="access-method-description">Realiza compras en internet</p>
                  </div>
                </mat-checkbox>
              </div>

              <div
                class="access-method-card"
                [class.access-method-active]="cardForm.get('accessContactless')?.value"
              >
                <mat-checkbox formControlName="accessContactless" color="primary">
                  <div class="access-method-content">
                    <div class="flex items-center gap-2">
                      <mat-icon>contactless</mat-icon>
                      <span class="font-medium">Sin Contacto</span>
                    </div>
                    <p class="access-method-description">Paga acercando tu tarjeta</p>
                  </div>
                </mat-checkbox>
              </div>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <!-- Footer Actions -->
      <mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button (click)="onCancel()" [disabled]="saving()">Cancelar</button>
        <button
          mat-flat-button
          color="primary"
          (click)="onSave()"
          [disabled]="cardForm.invalid || saving()"
        >
          @if (saving()) {
          <mat-spinner diameter="20" class="inline-block mr-2"></mat-spinner>
          Guardando... } @else {
          <ng-container>
            <mat-icon class="mr-1">{{ isEditMode() ? 'save' : 'add' }}</mat-icon>
            {{ isEditMode() ? 'Guardar Cambios' : 'Crear Tarjeta' }}
          </ng-container>
          }
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        display: flex;
        flex-direction: column;
        max-height: 95vh;
      }

      .dialog-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 1.5rem;
      }

      .dialog-content {
        padding: 1.5rem;
        overflow-y: auto;
      }

      .card-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .card-preview {
        width: 100%;
        height: 100px;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
      }

      .card-preview-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }

      .card-preview-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .card-preview-label {
        font-size: 0.625rem;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
      }

      .card-preview-name {
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: uppercase;
      }

      .card-preview-exp {
        font-size: 0.875rem;
        font-weight: 500;
      }

      .form-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
      }

      .section-title-text {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .full-width {
        width: 100%;
      }

      .access-methods-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.7rem;
      }

      .access-method-card {
        padding: 1rem;
        border: 1px solid var(--mat-sys-on-primary-container);
        border-radius: 10px;
        transition: all 0.3s ease;
        background: var(--mat-list-active-indicator-color);
      }

      .access-method-card:hover {
        border-color: var(--mat-sys-inverse-primary);
      }

      .access-method-active {
        border-color: var(--mat-sys-primary);
      }

      .access-method-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .access-method-description {
        font-size: 0.75rem;
        margin: 0;
        padding-left: 2rem;
      }

      .dialog-actions {
        padding: 1rem 1.5rem;
        gap: 0.75rem;
      }
    `,
  ],
})
export class CardDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CardDialogComponent>);
  private readonly data = inject<CardDialogData>(MAT_DIALOG_DATA);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  readonly isEditMode = signal(false);
  readonly cardNumberLength = signal(0);
  readonly cardholderLength = signal(0);
  readonly minDate = new Date();

  cardForm!: FormGroup;

  readonly cardTypes: CardTypeOption[] = [
    { value: 'PRINCIPAL', label: 'Principal', icon: 'stars', description: 'Tarjeta titular' },
    {
      value: 'ADDITIONAL',
      label: 'Adicional',
      icon: 'group_add',
      description: 'Tarjeta secundaria',
    },
  ];

  readonly manufacturers: ManufacturerOption[] = [
    { value: 'VISA', label: 'VISA', icon: 'payment' },
    { value: 'MASTERCARD', label: 'Mastercard', icon: 'credit_card' },
    { value: 'AMERICAN EXPRESS', label: 'American Express', icon: 'credit_score' },
  ];

  readonly statusOptions: StatusOption[] = [
    { value: 'ACTIVE', label: 'Activa', color: '#10b981' },
    { value: 'BLOCKED', label: 'Bloqueada', color: '#f59e0b' },
    { value: 'CANCELLED', label: 'Cancelada', color: '#ef4444' },
    { value: 'EXPIRED', label: 'Expirada', color: '#6b7280' },
  ];

  readonly allAccessEnabled = computed(() => {
    return (
      this.cardForm?.get('accessPOS')?.value &&
      this.cardForm?.get('accessATM')?.value &&
      this.cardForm?.get('accessEcommerce')?.value &&
      this.cardForm?.get('accessContactless')?.value
    );
  });

  readonly creditLimitFormatted = computed(() => {
    const value = this.cardForm?.get('creditLimit')?.value;
    if (!value) return null;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  });

  ngOnInit(): void {
    this.isEditMode.set(!!this.data?.card);
    this.initForm();
    this.setupFormListeners();

    if (this.data?.card) {
      this.patchFormFromCard(this.data.card);
    } else if (this.data?.isAdditional) {
      this.cardForm.patchValue({ type: 'ADDITIONAL' });
    }
  }

  private initForm(): void {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, cardNumberValidator()]],
      type: ['PRINCIPAL', Validators.required],
      cardholder: ['', [Validators.required, Validators.maxLength(100)]],
      manufacturer: ['VISA', Validators.required],
      expiration: ['', Validators.required],
      creditLimit: [0, [Validators.required, Validators.min(0)]],
      status: ['ACTIVE' as CardStatus, Validators.required],
      accessPOS: [true],
      accessATM: [true],
      accessEcommerce: [true],
      accessContactless: [false],
    });
  }

  private setupFormListeners(): void {
    this.cardForm
      .get('cardNumber')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.cardNumberLength.set(value?.length || 0);
      });

    this.cardForm
      .get('cardholder')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.cardholderLength.set(value?.length || 0);
      });
  }

  private patchFormFromCard(card: Card): void {
    const accessMethods = card.accessMethods || [];

    this.cardForm.patchValue({
      cardNumber: card.cardNumber,
      type: card.type,
      cardholder: card.cardholder,
      manufacturer: card.manufacturer,
      expiration: card.expiration,
      creditLimit: card.creditLimit,
      status: card.status,
      accessPOS: accessMethods.some((m) => m.accessMethod === 'POS'),
      accessATM: accessMethods.some((m) => m.accessMethod === 'ATM'),
      accessEcommerce: accessMethods.some((m) => m.accessMethod === 'ECOMMERCE'),
      accessContactless: accessMethods.some((m) => m.accessMethod === 'CONTACTLESS'),
    });

    this.cardNumberLength.set(card.cardNumber?.length || 0);
    this.cardholderLength.set(card.cardholder?.length || 0);
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    input.value = value;
    this.cardForm.get('cardNumber')?.setValue(value, { emitEvent: false });
  }

  onCardholderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    input.value = value;
    this.cardForm.get('cardholder')?.setValue(value, { emitEvent: false });
  }

  formatCardNumber(value: string): string {
    if (!value) return '';
    return value.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  formatExpiration(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${month}/${year}`;
  }

  isExpiringSoon(): boolean {
    const expiration = this.cardForm.get('expiration')?.value;
    if (!expiration) return false;

    const exp = new Date(expiration);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    return exp <= threeMonthsFromNow && exp >= now;
  }

  toggleAllAccess(): void {
    const enableAll = !this.allAccessEnabled();
    this.cardForm.patchValue({
      accessPOS: enableAll,
      accessATM: enableAll,
      accessEcommerce: enableAll,
      accessContactless: enableAll,
    });
  }

  onSave(): void {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const formValue = this.cardForm.value;
    const accessMethods = [];

    if (formValue.accessPOS) {
      accessMethods.push({ accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' });
    }
    if (formValue.accessATM) {
      accessMethods.push({ accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' });
    }
    if (formValue.accessEcommerce) {
      accessMethods.push({ accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' });
    }
    if (formValue.accessContactless) {
      accessMethods.push({ accessMethod: 'CONTACTLESS', type: 'NFC', status: 'ACTIVE' });
    }

    const card: Card = {
      cardNumber: formValue.cardNumber,
      type: formValue.type,
      cardholder: formValue.cardholder,
      manufacturer: formValue.manufacturer,
      expiration: formValue.expiration,
      creditLimit: formValue.creditLimit,
      status: formValue.status as CardStatus,
      accessMethods,
    };

    // Simular guardado
    setTimeout(() => {
      this.saving.set(false);
      this.dialogRef.close(card);
    }, 500);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
