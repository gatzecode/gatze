export interface Account {
  card: string;
  name: string;
  accountNumber: string;
}

export interface AccountSearchCriteria {
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  accountNumber?: string;
  cardNumber?: string;
  additionalsOnly?: boolean;
}
