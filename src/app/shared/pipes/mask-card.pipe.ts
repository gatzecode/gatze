import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCard',
  standalone: true,
})
export class MaskCardPipe implements PipeTransform {
  transform(
    cardNumber: string | null | undefined,
    maskChar: string = '•',
    visibleStart: number = 6,
    visibleEnd: number = 4
  ): string {
    if (!cardNumber) {
      return '';
    }

    // Eliminar espacios o guiones
    const cleanNumber = cardNumber.toString().replace(/[\s-]/g, '');

    // Si es muy corto, regresarlo tal cual
    if (cleanNumber.length <= visibleStart + visibleEnd) {
      return cleanNumber;
    }

    // Obtener primeras 6 y últimas 4
    const startPart = cleanNumber.slice(0, visibleStart);
    const endPart = cleanNumber.slice(-visibleEnd);

    // Longitud de lo que debe ir enmascarado
    const maskedLength = cleanNumber.length - (visibleStart + visibleEnd);
    const maskedSection = maskChar.repeat(maskedLength);

    // Armar cadena final
    const finalNumber = startPart + maskedSection + endPart;

    // Formatear en grupos de 4
    return finalNumber.match(/.{1,4}/g)?.join(' ') || finalNumber;
  }
}
