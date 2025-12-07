export interface Cardholder {
  cardNumber: string;
  personalData: PersonalData;
  address?: Address;
  contactData: ContactData;
  taxData: TaxData;
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  secondLastName?: string;
  embossName: string;
  birthDate: Date | string;
  rfc: string;
  curp: string;
}

export interface ContactData {
  homePhone?: string;
  cellPhone: string;
  workPhone?: string;
  email: string;
}

export interface TaxData {
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  zipCode: string;
  neighborhood: string;
  municipality: string;
  state: string;
  taxRegime: string;
  cfdiUse: string;
}

export interface Address {
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  zipCode: string;
  neighborhood: string;
  municipality: string;
  state: string;
}
