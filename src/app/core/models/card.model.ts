export interface Card {
  cardNumber: string;
  type: string;
  cardholder: string;
  manufacturer: string;
  expiration: Date | string;
  creditLimit: number;
  status: CardStatus;
  accessMethods?: AccessMethod[];
}

export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'CANCELLED' | 'EXPIRED';

export interface AccessMethod {
  accessMethod: string;
  type: string;
  status?: string;
}
