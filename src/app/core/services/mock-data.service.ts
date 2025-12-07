import { Injectable } from '@angular/core';
import { Account, Cardholder, Card } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  /**
   * Get initial accounts (pre-loaded data)
   */
  getInitialAccounts(): Account[] {
    return [
      { card: '4152313471829283', name: 'GARCÍA HERNÁNDEZ MARÍA JOSÉ', accountNumber: '1000000001' },
      { card: '4152313471829291', name: 'GARCÍA HERNÁNDEZ JUAN CARLOS', accountNumber: '1000000002' },
      { card: '4152313471829309', name: 'MARTÍNEZ LÓPEZ ANA LAURA', accountNumber: '1000000003' },
      { card: '4152313471829317', name: 'RODRÍGUEZ SÁNCHEZ PEDRO ANTONIO', accountNumber: '1000000004' },
      { card: '4152313471829325', name: 'LÓPEZ RAMÍREZ CARLOS ALBERTO', accountNumber: '1000000005' },
      { card: '4152313471829333', name: 'HERNÁNDEZ GONZÁLEZ LAURA PATRICIA', accountNumber: '1000000006' },
      { card: '4152313471829341', name: 'SÁNCHEZ PÉREZ JORGE LUIS', accountNumber: '1000000007' },
      { card: '4152313471829358', name: 'GONZÁLEZ MARTÍNEZ DIANA ELIZABETH', accountNumber: '1000000008' },
      { card: '4152313471829366', name: 'PÉREZ TORRES ROBERTO CARLOS', accountNumber: '1000000009' },
      { card: '4152313471829374', name: 'TORRES CRUZ MARTHA ALICIA', accountNumber: '1000000010' },
      { card: '4152313471829382', name: 'RAMÍREZ FLORES MIGUEL ÁNGEL', accountNumber: '1000000011' },
      { card: '4152313471829390', name: 'FLORES MORALES ANDREA SOFÍA', accountNumber: '1000000012' },
      { card: '4152313471829408', name: 'MORALES JIMÉNEZ FRANCISCO JAVIER', accountNumber: '1000000013' },
      { card: '4152313471829416', name: 'JIMÉNEZ VARGAS GABRIELA ALEJANDRA', accountNumber: '1000000014' },
      { card: '4152313471829424', name: 'VARGAS CASTILLO DANIEL EDUARDO', accountNumber: '1000000015' }
    ];
  }

  /**
   * Get cardholder data for an account
   */
  getCardholderByAccountNumber(accountNumber: string): Cardholder | null {
    const cardholders = this.getAllCardholders();
    return cardholders.get(accountNumber) || null;
  }

  /**
   * Get cards for an account
   */
  getCardsByAccountNumber(accountNumber: string): Card[] {
    const cards = this.getAllCards();
    return cards.get(accountNumber) || [];
  }

  /**
   * Get all cardholders mapped by account number
   */
  private getAllCardholders(): Map<string, Cardholder> {
    return new Map([
      ['1000000001', {
        cardNumber: '4152313471829283',
        personalData: {
          firstName: 'MARÍA JOSÉ',
          lastName: 'GARCÍA',
          secondLastName: 'HERNÁNDEZ',
          embossName: 'M J GARCIA H',
          birthDate: '1990-05-15',
          rfc: 'GAHM900515XX3',
          curp: 'GAHM900515MDFRRR03'
        },
        contactData: {
          homePhone: '5512345678',
          cellPhone: '5523456789',
          workPhone: '5534567890',
          email: 'maria.garcia@example.com'
        },
        taxData: {
          street: 'AV INSURGENTES SUR',
          exteriorNumber: '1234',
          interiorNumber: '501',
          zipCode: '03100',
          neighborhood: 'DEL VALLE',
          municipality: 'BENITO JUÁREZ',
          state: 'CIUDAD DE MÉXICO',
          taxRegime: '605',
          cfdiUse: 'G03'
        }
      }],
      ['1000000002', {
        cardNumber: '4152313471829291',
        personalData: {
          firstName: 'JUAN CARLOS',
          lastName: 'GARCÍA',
          secondLastName: 'HERNÁNDEZ',
          embossName: 'J C GARCIA H',
          birthDate: '1988-03-20',
          rfc: 'GAHJ880320XX1',
          curp: 'GAHJ880320HDFRRL01'
        },
        contactData: {
          cellPhone: '5587654321',
          email: 'juan.garcia@example.com'
        },
        taxData: {
          street: 'CALLE REFORMA',
          exteriorNumber: '456',
          zipCode: '06600',
          neighborhood: 'JUÁREZ',
          municipality: 'CUAUHTÉMOC',
          state: 'CIUDAD DE MÉXICO',
          taxRegime: '612',
          cfdiUse: 'G03'
        }
      }],
      ['1000000003', {
        cardNumber: '4152313471829309',
        personalData: {
          firstName: 'ANA LAURA',
          lastName: 'MARTÍNEZ',
          secondLastName: 'LÓPEZ',
          embossName: 'A L MARTINEZ L',
          birthDate: '1992-07-08',
          rfc: 'MALA920708XX2',
          curp: 'MALA920708MDFRPN08'
        },
        contactData: {
          cellPhone: '5598765432',
          email: 'ana.martinez@example.com'
        },
        taxData: {
          street: 'AV REVOLUCIÓN',
          exteriorNumber: '789',
          zipCode: '01030',
          neighborhood: 'SAN ÁNGEL',
          municipality: 'ÁLVARO OBREGÓN',
          state: 'CIUDAD DE MÉXICO',
          taxRegime: '605',
          cfdiUse: 'G01'
        }
      }],
      ['1000000004', {
        cardNumber: '4152313471829317',
        personalData: {
          firstName: 'PEDRO ANTONIO',
          lastName: 'RODRÍGUEZ',
          secondLastName: 'SÁNCHEZ',
          embossName: 'P A RODRIGUEZ S',
          birthDate: '1985-11-25',
          rfc: 'ROSP851125XX9',
          curp: 'ROSP851125HDFDNR04'
        },
        contactData: {
          cellPhone: '5576543210',
          email: 'pedro.rodriguez@example.com'
        },
        taxData: {
          street: 'CALZADA DE TLALPAN',
          exteriorNumber: '321',
          zipCode: '04220',
          neighborhood: 'PORTALES',
          municipality: 'BENITO JUÁREZ',
          state: 'CIUDAD DE MÉXICO',
          taxRegime: '612',
          cfdiUse: 'G03'
        }
      }],
      ['1000000005', {
        cardNumber: '4152313471829325',
        personalData: {
          firstName: 'CARLOS ALBERTO',
          lastName: 'LÓPEZ',
          secondLastName: 'RAMÍREZ',
          embossName: 'C A LOPEZ R',
          birthDate: '1991-09-12',
          rfc: 'LORC910912XX5',
          curp: 'LORC910912HDFLMR02'
        },
        contactData: {
          cellPhone: '5565432109',
          email: 'carlos.lopez@example.com'
        },
        taxData: {
          street: 'AV UNIVERSIDAD',
          exteriorNumber: '654',
          zipCode: '04510',
          neighborhood: 'COYOACÁN',
          municipality: 'COYOACÁN',
          state: 'CIUDAD DE MÉXICO',
          taxRegime: '626',
          cfdiUse: 'G03'
        }
      }]
    ]);
  }

  /**
   * Get all cards mapped by account number
   */
  private getAllCards(): Map<string, Card[]> {
    return new Map([
      ['1000000001', [
        {
          cardNumber: '4152313471829283',
          type: 'PRINCIPAL',
          cardholder: 'GARCÍA HERNÁNDEZ MARÍA JOSÉ',
          manufacturer: 'VISA',
          expiration: '2025-12-31',
          creditLimit: 50000,
          status: 'ACTIVE',
          accessMethods: [
            { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
            { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
            { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' }
          ]
        }
      ]],
      ['1000000002', [
        {
          cardNumber: '4152313471829291',
          type: 'PRINCIPAL',
          cardholder: 'GARCÍA HERNÁNDEZ JUAN CARLOS',
          manufacturer: 'VISA',
          expiration: '2026-06-30',
          creditLimit: 75000,
          status: 'ACTIVE',
          accessMethods: [
            { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
            { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' }
          ]
        }
      ]],
      ['1000000003', [
        {
          cardNumber: '4152313471829309',
          type: 'PRINCIPAL',
          cardholder: 'MARTÍNEZ LÓPEZ ANA LAURA',
          manufacturer: 'MASTERCARD',
          expiration: '2025-09-30',
          creditLimit: 60000,
          status: 'ACTIVE',
          accessMethods: [
            { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
            { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' }
          ]
        }
      ]],
      ['1000000004', [
        {
          cardNumber: '4152313471829317',
          type: 'PRINCIPAL',
          cardholder: 'RODRÍGUEZ SÁNCHEZ PEDRO ANTONIO',
          manufacturer: 'VISA',
          expiration: '2026-03-31',
          creditLimit: 100000,
          status: 'ACTIVE',
          accessMethods: [
            { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
            { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
            { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' }
          ]
        }
      ]],
      ['1000000005', [
        {
          cardNumber: '4152313471829325',
          type: 'PRINCIPAL',
          cardholder: 'LÓPEZ RAMÍREZ CARLOS ALBERTO',
          manufacturer: 'MASTERCARD',
          expiration: '2025-11-30',
          creditLimit: 45000,
          status: 'BLOCKED',
          accessMethods: [
            { accessMethod: 'POS', type: 'CHIP', status: 'BLOCKED' },
            { accessMethod: 'ATM', type: 'CHIP', status: 'BLOCKED' }
          ]
        }
      ]]
    ]);
  }
}
