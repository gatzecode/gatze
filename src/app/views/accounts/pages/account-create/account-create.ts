import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Material imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Validators
import {
  rfcValidator,
  curpValidator,
  emailValidator,
  phoneValidator,
  postalCodeValidator,
  cardNumberValidator
} from '../../../../shared/utils/validators';

// Pipes
import { MaskCardPipe } from '../../../../shared/pipes/mask-card.pipe';

// Models and Services
import { Account, Cardholder, Card } from '../../../../core/models';
import { AccountsService } from '../../../../core/services/accounts.service';
import { AccountsStateService } from '../../services/accounts-state.service';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatSnackBarModule,
    MaskCardPipe
  ],
  templateUrl: './account-create.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class AccountCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly accountsService = inject(AccountsService);
  private readonly accountsState = inject(AccountsStateService);
  private readonly snackBar = inject(MatSnackBar);

  // Form groups
  accountForm!: FormGroup;
  cardholderForm!: FormGroup;
  cardForm!: FormGroup;

  // Signals
  readonly creating = signal(false);
  readonly currentStep = signal(0);

  // Mexican states
  readonly states = [
    'AGUASCALIENTES', 'BAJA CALIFORNIA', 'BAJA CALIFORNIA SUR', 'CAMPECHE',
    'CHIAPAS', 'CHIHUAHUA', 'CIUDAD DE MÉXICO', 'COAHUILA', 'COLIMA',
    'DURANGO', 'GUANAJUATO', 'GUERRERO', 'HIDALGO', 'JALISCO', 'MÉXICO',
    'MICHOACÁN', 'MORELOS', 'NAYARIT', 'NUEVO LEÓN', 'OAXACA', 'PUEBLA',
    'QUERÉTARO', 'QUINTANA ROO', 'SAN LUIS POTOSÍ', 'SINALOA', 'SONORA',
    'TABASCO', 'TAMAULIPAS', 'TLAXCALA', 'VERACRUZ', 'YUCATÁN', 'ZACATECAS'
  ];

  // Tax regimes (simplified)
  readonly taxRegimes = [
    { value: '605', label: '605 - Sueldos y Salarios' },
    { value: '606', label: '606 - Arrendamiento' },
    { value: '612', label: '612 - Actividades Empresariales y Profesionales' },
    { value: '616', label: '616 - Sin obligaciones fiscales' },
    { value: '621', label: '621 - Incorporación Fiscal' },
    { value: '626', label: '626 - Régimen Simplificado de Confianza' }
  ];

  // CFDI uses (simplified)
  readonly cfdiUses = [
    { value: 'G01', label: 'G01 - Adquisición de mercancías' },
    { value: 'G03', label: 'G03 - Gastos en general' },
    { value: 'D10', label: 'D10 - Pagos por servicios educativos' },
    { value: 'S01', label: 'S01 - Sin efectos fiscales' },
    { value: 'CP01', label: 'CP01 - Pagos' }
  ];

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    // Account Form
    this.accountForm = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      accountType: ['CREDIT', Validators.required],
      creditLimit: [50000, [Validators.required, Validators.min(1000)]]
    });

    // Cardholder Form
    this.cardholderForm = this.fb.group({
      // Personal
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      secondLastName: ['', Validators.maxLength(100)],
      birthDate: ['', Validators.required],
      rfc: ['', [Validators.required, rfcValidator()]],
      curp: ['', [Validators.required, curpValidator()]],

      // Contact
      cellPhone: ['', [Validators.required, phoneValidator()]],
      email: ['', [Validators.required, emailValidator()]],

      // Tax/Address
      street: ['', Validators.required],
      exteriorNumber: ['', Validators.required],
      interiorNumber: [''],
      zipCode: ['', [Validators.required, postalCodeValidator()]],
      neighborhood: ['', Validators.required],
      municipality: ['', Validators.required],
      state: ['', Validators.required],
      taxRegime: ['605', Validators.required],
      cfdiUse: ['G03', Validators.required]
    });

    // Card Form
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, cardNumberValidator()]],
      manufacturer: ['VISA', Validators.required],
      expiration: ['', Validators.required],
      embossName: ['', [Validators.maxLength(26)]],
      accessPOS: [true],
      accessATM: [true],
      accessEcommerce: [true]
    });
  }

  onStepChange(event: any): void {
    this.currentStep.set(event.selectedIndex);
  }

  onCancel(): void {
    this.router.navigate(['/administration/credit-accounts']);
  }

  onCreate(): void {
    // Validate all forms
    if (this.accountForm.invalid || this.cardholderForm.invalid || this.cardForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.cardholderForm.markAllAsTouched();
      this.cardForm.markAllAsTouched();
      return;
    }

    this.creating.set(true);

    // Build account
    const account: Account = {
      card: this.cardForm.value.cardNumber,
      name: this.getFullName(),
      accountNumber: this.accountForm.value.accountNumber
    };

    // Build cardholder
    const cardholder: Cardholder = {
      cardNumber: this.cardForm.value.cardNumber,
      personalData: {
        firstName: this.cardholderForm.value.firstName,
        lastName: this.cardholderForm.value.lastName,
        secondLastName: this.cardholderForm.value.secondLastName,
        embossName: this.cardForm.value.embossName || this.generateEmbossName(),
        birthDate: this.cardholderForm.value.birthDate,
        rfc: this.cardholderForm.value.rfc,
        curp: this.cardholderForm.value.curp
      },
      contactData: {
        cellPhone: this.cardholderForm.value.cellPhone,
        email: this.cardholderForm.value.email
      },
      taxData: {
        street: this.cardholderForm.value.street,
        exteriorNumber: this.cardholderForm.value.exteriorNumber,
        interiorNumber: this.cardholderForm.value.interiorNumber,
        zipCode: this.cardholderForm.value.zipCode,
        neighborhood: this.cardholderForm.value.neighborhood,
        municipality: this.cardholderForm.value.municipality,
        state: this.cardholderForm.value.state,
        taxRegime: this.cardholderForm.value.taxRegime,
        cfdiUse: this.cardholderForm.value.cfdiUse
      }
    };

    // Build card
    const accessMethods = [];
    if (this.cardForm.value.accessPOS) {
      accessMethods.push({ accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' });
    }
    if (this.cardForm.value.accessATM) {
      accessMethods.push({ accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' });
    }
    if (this.cardForm.value.accessEcommerce) {
      accessMethods.push({ accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' });
    }

    const card: Card = {
      cardNumber: this.cardForm.value.cardNumber,
      type: 'PRINCIPAL',
      cardholder: this.getFullName(),
      manufacturer: this.cardForm.value.manufacturer,
      expiration: this.cardForm.value.expiration,
      creditLimit: this.accountForm.value.creditLimit,
      status: 'ACTIVE',
      accessMethods
    };

    // Call service to create account
    this.accountsService.createCompleteAccount(account, cardholder, card).subscribe({
      next: (result) => {
        this.creating.set(false);
        this.showSuccess('Cuenta creada exitosamente');

        // Add to state
        this.accountsState.addAccount(account);

        // Navigate back to list
        this.router.navigate(['/administration/credit-accounts']);
      },
      error: (error: any) => {
        this.creating.set(false);
        this.showError('Error al crear la cuenta: ' + error.message);
      }
    });
  }

  private getFullName(): string {
    const { firstName, lastName, secondLastName } = this.cardholderForm.value;
    return `${lastName} ${secondLastName || ''} ${firstName}`.trim().toUpperCase();
  }

  private generateEmbossName(): string {
    const { firstName, lastName, secondLastName } = this.cardholderForm.value;
    const first = firstName?.charAt(0) || '';
    const last = lastName?.substring(0, 10) || '';
    const second = secondLastName?.charAt(0) || '';
    return `${first} ${second} ${last}`.trim().toUpperCase();
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Campo requerido';
    if (control.errors['maxLength']) return `Máximo ${control.errors['maxLength'].requiredLength} caracteres`;
    if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}`;
    if (control.errors['pattern']) return 'Formato inválido';
    if (control.errors['invalidRfc']) return control.errors['invalidRfc'].message;
    if (control.errors['invalidCurp']) return control.errors['invalidCurp'].message;
    if (control.errors['invalidEmail']) return control.errors['invalidEmail'].message;
    if (control.errors['invalidPhone']) return control.errors['invalidPhone'].message;
    if (control.errors['invalidPostalCode']) return control.errors['invalidPostalCode'].message;
    if (control.errors['invalidCardNumber']) return control.errors['invalidCardNumber'].message;

    return 'Valor inválido';
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
