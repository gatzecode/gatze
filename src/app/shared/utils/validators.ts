import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator for Mexican RFC (Registro Federal de Contribuyentes)
 * Accepts both legal entities (12 chars) and individuals (13 chars)
 * Format:
 * - Legal entity: XXX000000XXX (3 letters, 6 digits, 3 alphanumeric)
 * - Individual: XXXX000000XXX (4 letters, 6 digits, 3 alphanumeric)
 */
export function rfcValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().toUpperCase().trim();

    // RFC pattern: allows Ñ and & for legal entities
    const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    const valid = rfcPattern.test(value);

    return valid ? null : {
      invalidRfc: {
        value: control.value,
        message: 'Invalid RFC format. Expected format: XXX000000XXX or XXXX000000XXX'
      }
    };
  };
}

/**
 * Validator for Mexican CURP (Clave Única de Registro de Población)
 * Format: XXXX000000XXXXXNN (18 characters)
 * - 4 letters (first surname, second surname, first name)
 * - 6 digits (date of birth: YYMMDD)
 * - 1 letter (gender: H/M)
 * - 2 letters (state code)
 * - 3 consonants (surnames and name)
 * - 2 alphanumeric (homoclave)
 */
export function curpValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().toUpperCase().trim();

    // CURP pattern
    const curpPattern = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
    const valid = curpPattern.test(value);

    if (!valid) {
      return {
        invalidCurp: {
          value: control.value,
          message: 'Invalid CURP format. Expected 18 characters in format: XXXX000000HXXXXX00'
        }
      };
    }

    // Additional validation: check if date is valid
    const yearDigits = value.substring(4, 6);
    const month = value.substring(6, 8);
    const day = value.substring(8, 10);

    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    if (monthNum < 1 || monthNum > 12) {
      return {
        invalidCurp: {
          value: control.value,
          message: 'Invalid month in CURP'
        }
      };
    }

    if (dayNum < 1 || dayNum > 31) {
      return {
        invalidCurp: {
          value: control.value,
          message: 'Invalid day in CURP'
        }
      };
    }

    return null;
  };
}

/**
 * Email validator with comprehensive pattern matching
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().trim();

    // RFC 5322 simplified email pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailPattern.test(value);

    return valid ? null : {
      invalidEmail: {
        value: control.value,
        message: 'Invalid email format'
      }
    };
  };
}

/**
 * Mexican phone validator (10 digits)
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().replace(/\D/g, '');
    const valid = /^\d{10}$/.test(value);

    return valid ? null : {
      invalidPhone: {
        value: control.value,
        message: 'Phone must be 10 digits'
      }
    };
  };
}

/**
 * Mexican postal code validator (5 digits)
 */
export function postalCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().replace(/\D/g, '');
    const valid = /^\d{5}$/.test(value);

    return valid ? null : {
      invalidPostalCode: {
        value: control.value,
        message: 'Postal code must be 5 digits'
      }
    };
  };
}

/**
 * Credit card number validator (16 digits)
 */
export function cardNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().replace(/\D/g, '');
    const valid = /^\d{16}$/.test(value);

    return valid ? null : {
      invalidCardNumber: {
        value: control.value,
        message: 'Card number must be 16 digits'
      }
    };
  };
}
