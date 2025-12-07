import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';

import { Account, AccountSearchCriteria, Cardholder, Card } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/accounts'; // Replace with your actual API URL

  /**
   * Search accounts by criteria
   */
  searchAccounts(criteria: AccountSearchCriteria): Observable<Account[]> {
    // TODO: Replace with actual HTTP call
    // const params = this.buildQueryParams(criteria);
    // return this.http.get<Account[]>(`${this.apiUrl}/search`, { params });

    // Mock data for development
    return this.getMockAccounts(criteria).pipe(delay(800));
  }

  /**
   * Get cardholder details by account number
   */
  getCardholderByAccount(accountNumber: string): Observable<Cardholder> {
    // TODO: Replace with actual HTTP call
    // return this.http.get<Cardholder>(`${this.apiUrl}/${accountNumber}/cardholder`);

    // Mock data for development
    return this.getMockCardholder(accountNumber).pipe(delay(600));
  }

  /**
   * Get cards associated with an account
   */
  getCardsByAccount(accountNumber: string): Observable<Card[]> {
    // TODO: Replace with actual HTTP call
    // return this.http.get<Card[]>(`${this.apiUrl}/${accountNumber}/cards`);

    // Mock data for development
    return this.getMockCards(accountNumber).pipe(delay(500));
  }

  /**
   * Update cardholder information
   */
  updateCardholder(accountNumber: string, cardholder: Cardholder): Observable<Cardholder> {
    // TODO: Replace with actual HTTP call
    // return this.http.put<Cardholder>(`${this.apiUrl}/${accountNumber}/cardholder`, cardholder);

    // Mock response for development
    return of(cardholder).pipe(delay(700));
  }

  /**
   * Update card information
   */
  updateCard(accountNumber: string, card: Card): Observable<Card> {
    // TODO: Replace with actual HTTP call
    // return this.http.put<Card>(`${this.apiUrl}/${accountNumber}/cards/${card.cardNumber}`, card);

    // Mock response for development
    return of(card).pipe(delay(500));
  }

  /**
   * Create a new card for an account
   */
  createCard(accountNumber: string, card: Card): Observable<Card> {
    // TODO: Replace with actual HTTP call
    // return this.http.post<Card>(`${this.apiUrl}/${accountNumber}/cards`, card);

    // Mock response for development
    return of(card).pipe(delay(600));
  }

  /**
   * Delete a card
   */
  deleteCard(accountNumber: string, cardNumber: string): Observable<void> {
    // TODO: Replace with actual HTTP call
    // return this.http.delete<void>(`${this.apiUrl}/${accountNumber}/cards/${cardNumber}`);

    // Mock response for development
    return of(void 0).pipe(delay(400));
  }

  /**
   * Create a complete new account with cardholder and card
   */
  createCompleteAccount(
    account: Account,
    cardholder: Cardholder,
    card: Card
  ): Observable<{ account: Account; cardholder: Cardholder; card: Card }> {
    // TODO: Replace with actual HTTP call
    // return this.http.post<any>(`${this.apiUrl}/complete`, { account, cardholder, card });

    // Mock response for development
    return of({ account, cardholder, card }).pipe(delay(1500));
  }

  /**
   * Build query params from search criteria
   */
  private buildQueryParams(criteria: AccountSearchCriteria): HttpParams {
    let params = new HttpParams();

    if (criteria.firstName) {
      params = params.set('firstName', criteria.firstName);
    }
    if (criteria.lastName) {
      params = params.set('lastName', criteria.lastName);
    }
    if (criteria.secondLastName) {
      params = params.set('secondLastName', criteria.secondLastName);
    }
    if (criteria.accountNumber) {
      params = params.set('accountNumber', criteria.accountNumber);
    }
    if (criteria.cardNumber) {
      params = params.set('cardNumber', criteria.cardNumber);
    }
    if (criteria.additionalsOnly) {
      params = params.set('additionalsOnly', 'true');
    }

    return params;
  }

  // ============ MOCK DATA METHODS (Remove in production) ============

  /**
   * Normalize text by removing accents/tildes for search purposes
   */
  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private getMockAccounts(criteria: AccountSearchCriteria): Observable<Account[]> {
    const mockAccounts: Account[] = [
      {
        card: '4152313471829283',
        name: 'GARCÍA HERNÁNDEZ MARÍA JOSÉ',
        accountNumber: '1234567890',
      },
      {
        card: '4152313471829291',
        name: 'GARCÍA HERNÁNDEZ JUAN CARLOS',
        accountNumber: '1234567891',
      },
      {
        card: '4152313471829309',
        name: 'MARTÍNEZ LÓPEZ ANA LAURA',
        accountNumber: '1234567892',
      },
      {
        card: '4152313471829317',
        name: 'RODRÍGUEZ SÁNCHEZ PEDRO ANTONIO',
        accountNumber: '1234567893',
      },
      {
        card: '4152313471829325',
        name: 'GONZÁLEZ RAMÍREZ SOFÍA ELENA',
        accountNumber: '1234567894',
      },
      {
        card: '4152313471829333',
        name: 'HERNÁNDEZ GARCÍA JOSÉ LUIS',
        accountNumber: '1234567895',
      },
      {
        card: '4152313471829341',
        name: 'LÓPEZ MARTÍNEZ CARMEN ROSA',
        accountNumber: '1234567896',
      },
      {
        card: '4152313471829358',
        name: 'SÁNCHEZ PÉREZ FRANCISCO JAVIER',
        accountNumber: '1234567897',
      },
      {
        card: '4152313471829366',
        name: 'PÉREZ GONZÁLEZ LUCÍA FERNANDA',
        accountNumber: '1234567898',
      },
      {
        card: '4152313471829374',
        name: 'RAMÍREZ TORRES MIGUEL ÁNGEL',
        accountNumber: '1234567899',
      },
      {
        card: '4152313471829382',
        name: 'TORRES LÓPEZ DANIELA ALEJANDRA',
        accountNumber: '1234567900',
      },
      {
        card: '4152313471829390',
        name: 'FLORES HERNÁNDEZ RICARDO ANTONIO',
        accountNumber: '1234567901',
      },
      {
        card: '4152313471829408',
        name: 'JIMÉNEZ GARCÍA PATRICIA ELIZABETH',
        accountNumber: '1234567902',
      },
      {
        card: '4152313471829416',
        name: 'MORALES SÁNCHEZ ANDRÉS FELIPE',
        accountNumber: '1234567903',
      },
      {
        card: '4152313471829424',
        name: 'DÍAZ RODRÍGUEZ VALENTINA ISABEL',
        accountNumber: '1234567904',
      },
    ];

    // Filtering with accent-insensitive search
    let filtered = mockAccounts;

    if (criteria.firstName) {
      const normalizedFirstName = this.normalizeText(criteria.firstName);
      filtered = filtered.filter((acc) =>
        this.normalizeText(acc.name).includes(normalizedFirstName)
      );
    }

    if (criteria.lastName) {
      const normalizedLastName = this.normalizeText(criteria.lastName);
      filtered = filtered.filter((acc) =>
        this.normalizeText(acc.name).includes(normalizedLastName)
      );
    }

    if (criteria.accountNumber) {
      filtered = filtered.filter((acc) => acc.accountNumber.includes(criteria.accountNumber!));
    }

    if (criteria.cardNumber) {
      filtered = filtered.filter((acc) => acc.card.includes(criteria.cardNumber!));
    }

    return of(filtered);
  }

  private getMockCardholder(accountNumber: string): Observable<Cardholder> {
    const mockCardholder: Cardholder = {
      cardNumber: '4152313471829283',
      personalData: {
        firstName: 'MARÍA JOSÉ',
        lastName: 'GARCÍA',
        secondLastName: 'HERNÁNDEZ',
        embossName: 'M J GARCIA H',
        birthDate: '1990-05-15',
        rfc: 'GAHM900515XX3',
        curp: 'GAHM900515MDFRRR03',
      },
      contactData: {
        homePhone: '5512345678',
        cellPhone: '5523456789',
        workPhone: '5534567890',
        email: 'maria.garcia@example.com',
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
        cfdiUse: 'G03',
      },
      address: {
        street: 'AV INSURGENTES SUR',
        exteriorNumber: '1234',
        interiorNumber: '501',
        zipCode: '03100',
        neighborhood: 'DEL VALLE',
        municipality: 'BENITO JUÁREZ',
        state: 'CIUDAD DE MÉXICO',
      },
    };

    return of(mockCardholder);
  }

  private getMockCards(accountNumber: string): Observable<Card[]> {
    const mockCards: Card[] = [
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
          { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
        ],
      },
      {
        cardNumber: '4152313471829291',
        type: 'ADDITIONAL',
        cardholder: 'GARCÍA HERNÁNDEZ JUAN CARLOS',
        manufacturer: 'VISA',
        expiration: '2025-12-31',
        creditLimit: 50000,
        status: 'ACTIVE',
        accessMethods: [
          { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
          { accessMethod: 'ATM', type: 'CHIP', status: 'BLOCKED' },
        ],
      },
    ];

    return of(mockCards);
  }
}
