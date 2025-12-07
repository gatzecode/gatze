import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Material imports
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Services and validators
import { AccountsStateService } from '../../services/accounts-state.service';
import {
  rfcValidator,
  curpValidator,
  emailValidator,
  phoneValidator,
  postalCodeValidator,
} from '../../../../shared/utils/validators';

@Component({
  selector: 'app-cardholder-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './cardholder-tab.html',
  styles: [
    `
      :host {
        display: block;
      }

      .section-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        padding: 1rem 0;
      }

      .full-width {
        grid-column: 1 / -1;
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
    `,
  ],
})
export class CardholderTabComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accountsState = inject(AccountsStateService);

  // Signals to control panel expansion
  readonly personalExpanded = signal<boolean>(true);
  readonly contactExpanded = signal<boolean>(true);
  readonly taxExpanded = signal<boolean>(true);

  // Forms
  cardholderForm!: FormGroup;

  // Computed from state
  readonly cardholder = this.accountsState.cardholder;
  readonly cardNumber = this.accountsState.cardNumber;
  readonly saving = this.accountsState.saving;

  // Tax regime options (SAT catalog)
  readonly taxRegimes = [
    { value: '601', label: '601 - General de Ley Personas Morales' },
    { value: '603', label: '603 - Personas Morales con Fines no Lucrativos' },
    { value: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios' },
    { value: '606', label: '606 - Arrendamiento' },
    { value: '607', label: '607 - Régimen de Enajenación o Adquisición de Bienes' },
    { value: '608', label: '608 - Demás ingresos' },
    {
      value: '610',
      label: '610 - Residentes en el Extranjero sin Establecimiento Permanente en México',
    },
    { value: '611', label: '611 - Ingresos por Dividendos (socios y accionistas)' },
    { value: '612', label: '612 - Personas Físicas con Actividades Empresariales y Profesionales' },
    { value: '614', label: '614 - Ingresos por intereses' },
    { value: '615', label: '615 - Régimen de los ingresos por obtención de premios' },
    { value: '616', label: '616 - Sin obligaciones fiscales' },
    {
      value: '620',
      label: '620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
    },
    { value: '621', label: '621 - Incorporación Fiscal' },
    { value: '622', label: '622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
    { value: '623', label: '623 - Opcional para Grupos de Sociedades' },
    { value: '624', label: '624 - Coordinados' },
    {
      value: '625',
      label:
        '625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
    },
    { value: '626', label: '626 - Régimen Simplificado de Confianza' },
  ];

  // CFDI use options (SAT catalog)
  readonly cfdiUses = [
    { value: 'G01', label: 'G01 - Adquisición de mercancías' },
    { value: 'G02', label: 'G02 - Devoluciones, descuentos o bonificaciones' },
    { value: 'G03', label: 'G03 - Gastos en general' },
    { value: 'I01', label: 'I01 - Construcciones' },
    { value: 'I02', label: 'I02 - Mobilario y equipo de oficina por inversiones' },
    { value: 'I03', label: 'I03 - Equipo de transporte' },
    { value: 'I04', label: 'I04 - Equipo de computo y accesorios' },
    { value: 'I05', label: 'I05 - Dados, troqueles, moldes, matrices y herramental' },
    { value: 'I06', label: 'I06 - Comunicaciones telefónicas' },
    { value: 'I07', label: 'I07 - Comunicaciones satelitales' },
    { value: 'I08', label: 'I08 - Otra maquinaria y equipo' },
    { value: 'D01', label: 'D01 - Honorarios médicos, dentales y gastos hospitalarios' },
    { value: 'D02', label: 'D02 - Gastos médicos por incapacidad o discapacidad' },
    { value: 'D03', label: 'D03 - Gastos funerales' },
    { value: 'D04', label: 'D04 - Donativos' },
    {
      value: 'D05',
      label:
        'D05 - Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)',
    },
    { value: 'D06', label: 'D06 - Aportaciones voluntarias al SAR' },
    { value: 'D07', label: 'D07 - Primas por seguros de gastos médicos' },
    { value: 'D08', label: 'D08 - Gastos de transportación escolar obligatoria' },
    {
      value: 'D09',
      label:
        'D09 - Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones',
    },
    { value: 'D10', label: 'D10 - Pagos por servicios educativos (colegiaturas)' },
    { value: 'S01', label: 'S01 - Sin efectos fiscales' },
    { value: 'CP01', label: 'CP01 - Pagos' },
    { value: 'CN01', label: 'CN01 - Nómina' },
  ];

  // Mexican states
  readonly states = [
    'AGUASCALIENTES',
    'BAJA CALIFORNIA',
    'BAJA CALIFORNIA SUR',
    'CAMPECHE',
    'CHIAPAS',
    'CHIHUAHUA',
    'CIUDAD DE MÉXICO',
    'COAHUILA',
    'COLIMA',
    'DURANGO',
    'GUANAJUATO',
    'GUERRERO',
    'HIDALGO',
    'JALISCO',
    'MÉXICO',
    'MICHOACÁN',
    'MORELOS',
    'NAYARIT',
    'NUEVO LEÓN',
    'OAXACA',
    'PUEBLA',
    'QUERÉTARO',
    'QUINTANA ROO',
    'SAN LUIS POTOSÍ',
    'SINALOA',
    'SONORA',
    'TABASCO',
    'TAMAULIPAS',
    'TLAXCALA',
    'VERACRUZ',
    'YUCATÁN',
    'ZACATECAS',
  ];

  constructor() {
    // Effect to update form when cardholder changes
    effect(() => {
      const cardholder = this.cardholder();
      if (cardholder && this.cardholderForm) {
        this.patchFormFromCardholder(cardholder);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.cardholderForm = this.fb.group({
      // Personal Data
      personalData: this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.maxLength(100)]],
        secondLastName: ['', Validators.maxLength(100)],
        embossName: ['', [Validators.maxLength(26)]],
        birthDate: ['', Validators.required],
        rfc: ['', [Validators.required, rfcValidator()]],
        curp: ['', [Validators.required, curpValidator()]],
      }),

      // Contact Data
      contactData: this.fb.group({
        homePhone: ['', [phoneValidator()]],
        cellPhone: ['', [Validators.required, phoneValidator()]],
        workPhone: ['', [phoneValidator()]],
        email: ['', [Validators.required, emailValidator()]],
      }),

      // Tax Data
      taxData: this.fb.group({
        street: ['', Validators.required],
        exteriorNumber: ['', Validators.required],
        interiorNumber: [''],
        zipCode: ['', [Validators.required, postalCodeValidator()]],
        neighborhood: ['', Validators.required],
        municipality: ['', Validators.required],
        state: ['', Validators.required],
        taxRegime: ['', Validators.required],
        cfdiUse: ['', Validators.required],
      }),
    });
  }

  private patchFormFromCardholder(cardholder: any): void {
    this.cardholderForm.patchValue(
      {
        personalData: cardholder.personalData,
        contactData: cardholder.contactData,
        taxData: cardholder.taxData,
      },
      { emitEvent: false }
    );
  }

  // Getters to access FormGroups
  get personalData(): FormGroup {
    return this.cardholderForm.get('personalData') as FormGroup;
  }

  get contactData(): FormGroup {
    return this.cardholderForm.get('contactData') as FormGroup;
  }

  get taxData(): FormGroup {
    return this.cardholderForm.get('taxData') as FormGroup;
  }

  // Helper to get error messages
  getErrorMessage(formGroup: FormGroup, controlName: string): string {
    const control = formGroup.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'This field is required';
    if (errors['maxLength']) return `Maximum ${errors['maxLength'].requiredLength} characters`;
    if (errors['invalidRfc']) return errors['invalidRfc'].message;
    if (errors['invalidCurp']) return errors['invalidCurp'].message;
    if (errors['invalidEmail']) return errors['invalidEmail'].message;
    if (errors['invalidPhone']) return errors['invalidPhone'].message;
    if (errors['invalidPostalCode']) return errors['invalidPostalCode'].message;

    return 'Invalid value';
  }

  // Check if form has changes
  hasChanges(): boolean {
    return this.cardholderForm?.dirty ?? false;
  }

  // Get current form value as Cardholder object
  getCardholderData(): any {
    return {
      cardNumber: this.cardNumber(),
      ...this.cardholderForm.value,
    };
  }
}
