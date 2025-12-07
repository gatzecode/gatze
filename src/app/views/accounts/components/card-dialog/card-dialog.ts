import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

// Models and validators
import { Card, CardStatus } from '../../../../core/models';
import { cardNumberValidator } from '../../../../shared/utils/validators';

export interface CardDialogData {
  card?: Card;
  accountNumber: string;
  isAdditional?: boolean;
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="flex items-center gap-2">
        <mat-icon class="text-indigo-600">{{ isEditMode() ? 'edit' : 'add_card' }}</mat-icon>
        {{ isEditMode() ? 'Editar Tarjeta' : 'Agregar Nueva Tarjeta' }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="cardForm" class="card-form">
          <!-- Card Number -->
          <div class="field-group full-width">
            <label class="field-label">Número de Tarjeta</label>
            <mat-form-field appearance="outline">
              <input
                matInput
                formControlName="cardNumber"
                maxlength="16"
                placeholder="16 dígitos"
                [readonly]="isEditMode()">
              <mat-icon matPrefix>credit_card</mat-icon>
              @if (cardForm.get('cardNumber')?.invalid && cardForm.get('cardNumber')?.touched) {
                <mat-error>{{ getErrorMessage('cardNumber') }}</mat-error>
              }
            </mat-form-field>
          </div>

          <!-- Card Type -->
          <div class="field-group full-width">
            <label class="field-label">Tipo de Tarjeta</label>
            <mat-form-field appearance="outline">
              <mat-select formControlName="type" [disabled]="isEditMode()">
                <mat-option value="PRINCIPAL">Principal</mat-option>
                <mat-option value="ADDITIONAL">Adicional</mat-option>
              </mat-select>
              <mat-icon matPrefix>category</mat-icon>
              @if (cardForm.get('type')?.invalid && cardForm.get('type')?.touched) {
                <mat-error>{{ getErrorMessage('type') }}</mat-error>
              }
            </mat-form-field>
          </div>

          <!-- Cardholder Name -->
          <div class="field-group full-width">
            <label class="field-label">Nombre del Tarjetahabiente</label>
            <mat-form-field appearance="outline">
              <input
                matInput
                formControlName="cardholder"
                maxlength="100"
                placeholder="Nombre completo">
              <mat-icon matPrefix>person</mat-icon>
              @if (cardForm.get('cardholder')?.invalid && cardForm.get('cardholder')?.touched) {
                <mat-error>{{ getErrorMessage('cardholder') }}</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="form-row">
            <!-- Manufacturer -->
            <div class="field-group">
              <label class="field-label">Marca</label>
              <mat-form-field appearance="outline">
                <mat-select formControlName="manufacturer">
                  <mat-option value="VISA">VISA</mat-option>
                  <mat-option value="MASTERCARD">Mastercard</mat-option>
                  <mat-option value="AMERICAN EXPRESS">American Express</mat-option>
                </mat-select>
                <mat-icon matPrefix>payment</mat-icon>
                @if (cardForm.get('manufacturer')?.invalid && cardForm.get('manufacturer')?.touched) {
                  <mat-error>{{ getErrorMessage('manufacturer') }}</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Expiration Date -->
            <div class="field-group">
              <label class="field-label">Fecha de Expiración</label>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  [matDatepicker]="expirationPicker"
                  formControlName="expiration">
                <mat-icon matPrefix>event</mat-icon>
                <mat-datepicker-toggle matSuffix [for]="expirationPicker"></mat-datepicker-toggle>
                <mat-datepicker #expirationPicker></mat-datepicker>
                @if (cardForm.get('expiration')?.invalid && cardForm.get('expiration')?.touched) {
                  <mat-error>{{ getErrorMessage('expiration') }}</mat-error>
                }
              </mat-form-field>
            </div>
          </div>

          <div class="form-row">
            <!-- Credit Limit -->
            <div class="field-group">
              <label class="field-label">Límite de Crédito</label>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  type="number"
                  formControlName="creditLimit"
                  placeholder="0.00">
                <span matPrefix>$&nbsp;</span>
                <span matSuffix>MXN</span>
                @if (cardForm.get('creditLimit')?.invalid && cardForm.get('creditLimit')?.touched) {
                  <mat-error>{{ getErrorMessage('creditLimit') }}</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Status -->
            <div class="field-group">
              <label class="field-label">Estado</label>
              <mat-form-field appearance="outline">
                <mat-select formControlName="status">
                  <mat-option value="ACTIVE">Activa</mat-option>
                  <mat-option value="BLOCKED">Bloqueada</mat-option>
                  <mat-option value="CANCELLED">Cancelada</mat-option>
                  <mat-option value="EXPIRED">Expirada</mat-option>
                </mat-select>
                <mat-icon matPrefix>info</mat-icon>
                @if (cardForm.get('status')?.invalid && cardForm.get('status')?.touched) {
                  <mat-error>{{ getErrorMessage('status') }}</mat-error>
                }
              </mat-form-field>
            </div>
          </div>

          <!-- Access Methods -->
          <div class="access-methods-section">
            <h3 class="section-title">
              <mat-icon>vpn_key</mat-icon>
              Métodos de Acceso
            </h3>

            <div class="access-methods-grid">
              <mat-checkbox formControlName="accessPOS" color="primary">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-sm">point_of_sale</mat-icon>
                  <span>POS (Punto de Venta)</span>
                </div>
              </mat-checkbox>

              <mat-checkbox formControlName="accessATM" color="primary">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-sm">local_atm</mat-icon>
                  <span>ATM (Cajero Automático)</span>
                </div>
              </mat-checkbox>

              <mat-checkbox formControlName="accessEcommerce" color="primary">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-sm">shopping_cart</mat-icon>
                  <span>E-Commerce</span>
                </div>
              </mat-checkbox>

              <mat-checkbox formControlName="accessContactless" color="primary">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-sm">contactless</mat-icon>
                  <span>Contactless</span>
                </div>
              </mat-checkbox>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          [disabled]="cardForm.invalid || saving()">
          @if (saving()) {
            <mat-spinner diameter="20" class="inline-block mr-2"></mat-spinner>
          } @else {
            <mat-icon>save</mat-icon>
          }
          {{ isEditMode() ? 'Guardar Cambios' : 'Crear Tarjeta' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 500px;
      max-width: 600px;
    }

    .card-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-left: 0.25rem;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
    }

    .access-methods-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #E5E7EB;
    }

    .access-methods-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .dialog-actions {
      padding: 1rem 1.5rem;
      border-top: 1px solid #E5E7EB;
      margin-top: 1rem;
    }

    @media (max-width: 600px) {
      .dialog-container {
        min-width: 100%;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .access-methods-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CardDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CardDialogComponent>);
  private readonly data = inject<CardDialogData>(MAT_DIALOG_DATA);

  readonly saving = signal(false);
  readonly isEditMode = signal(false);

  cardForm!: FormGroup;

  ngOnInit(): void {
    this.isEditMode.set(!!this.data?.card);
    this.initForm();

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
      status: ['ACTIVE', Validators.required],
      // Access methods
      accessPOS: [true],
      accessATM: [true],
      accessEcommerce: [true],
      accessContactless: [false]
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
      accessPOS: accessMethods.some(m => m.accessMethod === 'POS'),
      accessATM: accessMethods.some(m => m.accessMethod === 'ATM'),
      accessEcommerce: accessMethods.some(m => m.accessMethod === 'ECOMMERCE'),
      accessContactless: accessMethods.some(m => m.accessMethod === 'CONTACTLESS')
    });
  }

  onSave(): void {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

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
      accessMethods
    };

    this.dialogRef.close(card);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.cardForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['maxLength']) return `Máximo ${control.errors['maxLength'].requiredLength} caracteres`;
    if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}`;
    if (control.errors['invalidCardNumber']) return control.errors['invalidCardNumber'].message;

    return 'Valor inválido';
  }
}
