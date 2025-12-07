import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCard',
  standalone: true
})
export class MaskCardPipe implements PipeTransform {
  transform(cardNumber: string | null | undefined, maskChar: string = '•', visibleDigits: number = 4): string {
    if (!cardNumber) {
      return '';
    }

    // Remove any spaces or dashes
    const cleanNumber = cardNumber.toString().replace(/[\s-]/g, '');

    // If the number is too short, just return it masked
    if (cleanNumber.length <= visibleDigits) {
      return cleanNumber;
    }

    // Get the last 'visibleDigits' digits
    const visiblePart = cleanNumber.slice(-visibleDigits);

    // Mask the rest
    const maskedLength = cleanNumber.length - visibleDigits;
    const maskedPart = maskChar.repeat(maskedLength);

    // Format as groups of 4
    const fullMasked = maskedPart + visiblePart;
    return fullMasked.match(/.{1,4}/g)?.join(' ') || fullMasked;
  }
}
