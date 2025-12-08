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
 * Credit card number validator with Luhn algorithm
 * Validates both format (13-19 digits) and checksum
 */
export function cardNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().replace(/\D/g, '');

    // Check length (13-19 digits for various card types)
    if (!/^\d{13,19}$/.test(value)) {
      return {
        invalidCardNumber: {
          value: control.value,
          message: 'Card number must be between 13 and 19 digits',
        },
      };
    }

    // Luhn algorithm validation
    if (!luhnCheck(value)) {
      return {
        invalidCardNumber: {
          value: control.value,
          message: 'Invalid card number (failed checksum validation)',
        },
      };
    }

    return null;
  };
}

/**
 * Luhn algorithm implementation for credit card validation
 * @param cardNumber - Credit card number as string
 * @returns true if valid, false otherwise
 */
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  // Loop through digits from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * CVV/CVC validator (3 or 4 digits depending on card type)
 * @param requiredLength - Optional: specific length to validate (3 or 4)
 */
export function cvvValidator(requiredLength?: 3 | 4): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().replace(/\D/g, '');

    if (requiredLength) {
      // Validate specific length
      const pattern = new RegExp(`^\\d{${requiredLength}}$`);
      if (!pattern.test(value)) {
        return {
          invalidCvv: {
            value: control.value,
            message: `CVV must be ${requiredLength} digits`,
          },
        };
      }
    } else {
      // Allow 3 or 4 digits
      if (!/^\d{3,4}$/.test(value)) {
        return {
          invalidCvv: {
            value: control.value,
            message: 'CVV must be 3 or 4 digits',
          },
        };
      }
    }

    return null;
  };
}

/**
 * Account number validator (numeric, configurable length)
 * @param minLength - Minimum length (default: 8)
 * @param maxLength - Maximum length (default: 12)
 */
export function accountNumberValidator(minLength = 8, maxLength = 12): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().replace(/\D/g, '');
    const length = value.length;

    if (length < minLength || length > maxLength) {
      return {
        invalidAccountNumber: {
          value: control.value,
          message: `Account number must be between ${minLength} and ${maxLength} digits`,
        },
      };
    }

    return null;
  };
}

/**
 * Date range validator
 * Validates that a date is within a specified range
 * @param minDate - Minimum allowed date
 * @param maxDate - Maximum allowed date
 */
export function dateRangeValidator(minDate?: Date, maxDate?: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value;
    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return {
        invalidDate: {
          value: control.value,
          message: 'Invalid date format',
        },
      };
    }

    if (minDate && date < minDate) {
      return {
        invalidDate: {
          value: control.value,
          message: `Date must be after ${minDate.toLocaleDateString()}`,
        },
      };
    }

    if (maxDate && date > maxDate) {
      return {
        invalidDate: {
          value: control.value,
          message: `Date must be before ${maxDate.toLocaleDateString()}`,
        },
      };
    }

    return null;
  };
}

/**
 * Credit limit validator
 * Validates that the credit limit is within acceptable range
 * @param minLimit - Minimum allowed limit (default: 1000)
 * @param maxLimit - Maximum allowed limit (default: 1000000)
 */
export function creditLimitValidator(minLimit = 1000, maxLimit = 1000000): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = parseFloat(control.value);

    if (isNaN(value)) {
      return {
        invalidCreditLimit: {
          value: control.value,
          message: 'Credit limit must be a valid number',
        },
      };
    }

    if (value < minLimit) {
      return {
        invalidCreditLimit: {
          value: control.value,
          message: `Credit limit must be at least ${minLimit.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
          })}`,
        },
      };
    }

    if (value > maxLimit) {
      return {
        invalidCreditLimit: {
          value: control.value,
          message: `Credit limit cannot exceed ${maxLimit.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
          })}`,
        },
      };
    }

    return null;
  };
}
