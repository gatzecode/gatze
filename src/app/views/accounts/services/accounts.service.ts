import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';

import { Account, AccountSearchCriteria, Cardholder, Card } from '../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/accounts'; // Replace with your actual API URL

  // Mock data storage (persists during session)
  private mockAccounts: Account[] = [
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

  private mockCardholders: Map<string, Cardholder> = new Map([
    ['1234567890', {
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
    }],
    ['1234567891', {
      cardNumber: '4152313471829291',
      personalData: {
        firstName: 'JUAN CARLOS',
        lastName: 'GARCÍA',
        secondLastName: 'HERNÁNDEZ',
        embossName: 'J C GARCIA H',
        birthDate: '1988-03-20',
        rfc: 'GAHJ880320XX1',
        curp: 'GAHJ880320HDFRRR01',
      },
      contactData: {
        homePhone: '5545678901',
        cellPhone: '5523456790',
        workPhone: '5556789012',
        email: 'juan.garcia@example.com',
      },
      taxData: {
        street: 'REFORMA',
        exteriorNumber: '100',
        interiorNumber: '',
        zipCode: '06600',
        neighborhood: 'JUÁREZ',
        municipality: 'CUAUHTÉMOC',
        state: 'CIUDAD DE MÉXICO',
        taxRegime: '612',
        cfdiUse: 'G03',
      },
      address: {
        street: 'REFORMA',
        exteriorNumber: '100',
        interiorNumber: '',
        zipCode: '06600',
        neighborhood: 'JUÁREZ',
        municipality: 'CUAUHTÉMOC',
        state: 'CIUDAD DE MÉXICO',
      },
    }],
    ['1234567892', {
      cardNumber: '4152313471829309',
      personalData: {
        firstName: 'ANA LAURA',
        lastName: 'MARTÍNEZ',
        secondLastName: 'LÓPEZ',
        embossName: 'A L MARTINEZ L',
        birthDate: '1992-07-12',
        rfc: 'MALA920712XX2',
        curp: 'MALA920712MDFPPR02',
      },
      contactData: {
        homePhone: '5567890123',
        cellPhone: '5523456791',
        workPhone: '5578901234',
        email: 'ana.martinez@example.com',
      },
      taxData: {
        street: 'UNIVERSIDAD',
        exteriorNumber: '500',
        interiorNumber: '201',
        zipCode: '03339',
        neighborhood: 'NARVARTE',
        municipality: 'BENITO JUÁREZ',
        state: 'CIUDAD DE MÉXICO',
        taxRegime: '605',
        cfdiUse: 'G03',
      },
      address: {
        street: 'UNIVERSIDAD',
        exteriorNumber: '500',
        interiorNumber: '201',
        zipCode: '03339',
        neighborhood: 'NARVARTE',
        municipality: 'BENITO JUÁREZ',
        state: 'CIUDAD DE MÉXICO',
      },
    }],
    ['1234567893', {
      cardNumber: '4152313471829317',
      personalData: {
        firstName: 'PEDRO ANTONIO',
        lastName: 'RODRÍGUEZ',
        secondLastName: 'SÁNCHEZ',
        embossName: 'P A RODRIGUEZ S',
        birthDate: '1985-11-25',
        rfc: 'ROSP851125XX4',
        curp: 'ROSP851125HDFRDN04',
      },
      contactData: {
        homePhone: '5589012345',
        cellPhone: '5523456792',
        workPhone: '5590123456',
        email: 'pedro.rodriguez@example.com',
      },
      taxData: {
        street: 'CONSTITUCIÓN',
        exteriorNumber: '250',
        interiorNumber: '',
        zipCode: '54000',
        neighborhood: 'CENTRO',
        municipality: 'TLALNEPANTLA',
        state: 'MÉXICO',
        taxRegime: '612',
        cfdiUse: 'G01',
      },
      address: {
        street: 'CONSTITUCIÓN',
        exteriorNumber: '250',
        interiorNumber: '',
        zipCode: '54000',
        neighborhood: 'CENTRO',
        municipality: 'TLALNEPANTLA',
        state: 'MÉXICO',
      },
    }],
    ['1234567894', {
      cardNumber: '4152313471829325',
      personalData: {
        firstName: 'SOFÍA ELENA',
        lastName: 'GONZÁLEZ',
        secondLastName: 'RAMÍREZ',
        embossName: 'S E GONZALEZ R',
        birthDate: '1995-02-14',
        rfc: 'GORS950214XX5',
        curp: 'GORS950214MDFNMF05',
      },
      contactData: {
        homePhone: '3336789012',
        cellPhone: '5523456793',
        workPhone: '3336789013',
        email: 'sofia.gonzalez@example.com',
      },
      taxData: {
        street: 'Miguel HIDALGO',
        exteriorNumber: '789',
        interiorNumber: '3B',
        zipCode: '44100',
        neighborhood: 'CENTRO',
        municipality: 'GUADALAJARA',
        state: 'JALISCO',
        taxRegime: '626',
        cfdiUse: 'G03',
      },
      address: {
        street: 'Miguel HIDALGO',
        exteriorNumber: '789',
        interiorNumber: '3B',
        zipCode: '44100',
        neighborhood: 'CENTRO',
        municipality: 'GUADALAJARA',
        state: 'JALISCO',
      },
    }],
    ['1234567895', {
      cardNumber: '4152313471829333',
      personalData: {
        firstName: 'JOSÉ LUIS',
        lastName: 'HERNÁNDEZ',
        secondLastName: 'GARCÍA',
        embossName: 'J L HERNANDEZ G',
        birthDate: '1987-09-08',
        rfc: 'HEGL870908XX6',
        curp: 'HEGL870908HDFRRR06',
      },
      contactData: {
        homePhone: '8187654321',
        cellPhone: '5523456794',
        workPhone: '8187654322',
        email: 'jose.hernandez@example.com',
      },
      taxData: {
        street: 'MORELOS',
        exteriorNumber: '456',
        interiorNumber: '',
        zipCode: '64000',
        neighborhood: 'CENTRO',
        municipality: 'MONTERREY',
        state: 'NUEVO LEÓN',
        taxRegime: '605',
        cfdiUse: 'G03',
      },
      address: {
        street: 'MORELOS',
        exteriorNumber: '456',
        interiorNumber: '',
        zipCode: '64000',
        neighborhood: 'CENTRO',
        municipality: 'MONTERREY',
        state: 'NUEVO LEÓN',
      },
    }],
    ['1234567896', {
      cardNumber: '4152313471829341',
      personalData: {
        firstName: 'CARMEN ROSA',
        lastName: 'LÓPEZ',
        secondLastName: 'MARTÍNEZ',
        embossName: 'C R LOPEZ M',
        birthDate: '1993-04-30',
        rfc: 'LOMC930430XX7',
        curp: 'LOMC930430MDFPRC07',
      },
      contactData: {
        homePhone: '6865551234',
        cellPhone: '5523456795',
        workPhone: '6865551235',
        email: 'carmen.lopez@example.com',
      },
      taxData: {
        street: 'JUÁREZ',
        exteriorNumber: '321',
        interiorNumber: '5',
        zipCode: '21000',
        neighborhood: 'CENTRO',
        municipality: 'MEXICALI',
        state: 'BAJA CALIFORNIA',
        taxRegime: '616',
        cfdiUse: 'S01',
      },
      address: {
        street: 'JUÁREZ',
        exteriorNumber: '321',
        interiorNumber: '5',
        zipCode: '21000',
        neighborhood: 'CENTRO',
        municipality: 'MEXICALI',
        state: 'BAJA CALIFORNIA',
      },
    }],
    ['1234567897', {
      cardNumber: '4152313471829358',
      personalData: {
        firstName: 'FRANCISCO JAVIER',
        lastName: 'SÁNCHEZ',
        secondLastName: 'PÉREZ',
        embossName: 'F J SANCHEZ P',
        birthDate: '1989-12-17',
        rfc: 'SAPF891217XX8',
        curp: 'SAPF891217HDFRRC08',
      },
      contactData: {
        homePhone: '6644567890',
        cellPhone: '5523456796',
        workPhone: '6644567891',
        email: 'francisco.sanchez@example.com',
      },
      taxData: {
        street: 'REVOLUCIÓN',
        exteriorNumber: '987',
        interiorNumber: '',
        zipCode: '22000',
        neighborhood: 'CENTRO',
        municipality: 'TIJUANA',
        state: 'BAJA CALIFORNIA',
        taxRegime: '612',
        cfdiUse: 'G03',
      },
      address: {
        street: 'REVOLUCIÓN',
        exteriorNumber: '987',
        interiorNumber: '',
        zipCode: '22000',
        neighborhood: 'CENTRO',
        municipality: 'TIJUANA',
        state: 'BAJA CALIFORNIA',
      },
    }],
    ['1234567898', {
      cardNumber: '4152313471829366',
      personalData: {
        firstName: 'LUCÍA FERNANDA',
        lastName: 'PÉREZ',
        secondLastName: 'GONZÁLEZ',
        embossName: 'L F PEREZ G',
        birthDate: '1991-06-22',
        rfc: 'PEGL910622XX9',
        curp: 'PEGL910622MDFRNC09',
      },
      contactData: {
        homePhone: '4421234567',
        cellPhone: '5523456797',
        workPhone: '4421234568',
        email: 'lucia.perez@example.com',
      },
      taxData: {
        street: 'INDEPENDENCIA',
        exteriorNumber: '654',
        interiorNumber: '10',
        zipCode: '76000',
        neighborhood: 'CENTRO',
        municipality: 'QUERÉTARO',
        state: 'QUERÉTARO',
        taxRegime: '605',
        cfdiUse: 'G03',
      },
      address: {
        street: 'INDEPENDENCIA',
        exteriorNumber: '654',
        interiorNumber: '10',
        zipCode: '76000',
        neighborhood: 'CENTRO',
        municipality: 'QUERÉTARO',
        state: 'QUERÉTARO',
      },
    }],
    ['1234567899', {
      cardNumber: '4152313471829374',
      personalData: {
        firstName: 'MIGUEL ÁNGEL',
        lastName: 'RAMÍREZ',
        secondLastName: 'TORRES',
        embossName: 'M A RAMIREZ T',
        birthDate: '1986-01-11',
        rfc: 'RATM860111XX0',
        curp: 'RATM860111HDFMRG00',
      },
      contactData: {
        homePhone: '4448765432',
        cellPhone: '5523456798',
        workPhone: '4448765433',
        email: 'miguel.ramirez@example.com',
      },
      taxData: {
        street: 'ZARAGOZA',
        exteriorNumber: '147',
        interiorNumber: '',
        zipCode: '78000',
        neighborhood: 'CENTRO',
        municipality: 'SAN LUIS POTOSÍ',
        state: 'SAN LUIS POTOSÍ',
        taxRegime: '626',
        cfdiUse: 'G03',
      },
      address: {
        street: 'ZARAGOZA',
        exteriorNumber: '147',
        interiorNumber: '',
        zipCode: '78000',
        neighborhood: 'CENTRO',
        municipality: 'SAN LUIS POTOSÍ',
        state: 'SAN LUIS POTOSÍ',
      },
    }],
    ['1234567900', {
      cardNumber: '4152313471829382',
      personalData: {
        firstName: 'DANIELA ALEJANDRA',
        lastName: 'TORRES',
        secondLastName: 'LÓPEZ',
        embossName: 'D A TORRES L',
        birthDate: '1994-08-19',
        rfc: 'TOLD940819XX1',
        curp: 'TOLD940819MDFRRN01',
      },
      contactData: {
        homePhone: '2289876543',
        cellPhone: '5523456799',
        workPhone: '2289876544',
        email: 'daniela.torres@example.com',
      },
      taxData: {
        street: 'ALLENDE',
        exteriorNumber: '258',
        interiorNumber: '2',
        zipCode: '91000',
        neighborhood: 'CENTRO',
        municipality: 'XALAPA',
        state: 'VERACRUZ',
        taxRegime: '605',
        cfdiUse: 'G03',
      },
      address: {
        street: 'ALLENDE',
        exteriorNumber: '258',
        interiorNumber: '2',
        zipCode: '91000',
        neighborhood: 'CENTRO',
        municipality: 'XALAPA',
        state: 'VERACRUZ',
      },
    }],
    ['1234567901', {
      cardNumber: '4152313471829390',
      personalData: {
        firstName: 'RICARDO ANTONIO',
        lastName: 'FLORES',
        secondLastName: 'HERNÁNDEZ',
        embossName: 'R A FLORES H',
        birthDate: '1990-10-05',
        rfc: 'FOHR901005XX2',
        curp: 'FOHR901005HDFRLC02',
      },
      contactData: {
        homePhone: '9616543210',
        cellPhone: '5523456800',
        workPhone: '9616543211',
        email: 'ricardo.flores@example.com',
      },
      taxData: {
        street: 'GUERRERO',
        exteriorNumber: '369',
        interiorNumber: '',
        zipCode: '29000',
        neighborhood: 'CENTRO',
        municipality: 'TUXTLA GUTIÉRREZ',
        state: 'CHIAPAS',
        taxRegime: '612',
        cfdiUse: 'G01',
      },
      address: {
        street: 'GUERRERO',
        exteriorNumber: '369',
        interiorNumber: '',
        zipCode: '29000',
        neighborhood: 'CENTRO',
        municipality: 'TUXTLA GUTIÉRREZ',
        state: 'CHIAPAS',
      },
    }],
    ['1234567902', {
      cardNumber: '4152313471829408',
      personalData: {
        firstName: 'PATRICIA ELIZABETH',
        lastName: 'JIMÉNEZ',
        secondLastName: 'GARCÍA',
        embossName: 'P E JIMENEZ G',
        birthDate: '1988-05-28',
        rfc: 'JIGP880528XX3',
        curp: 'JIGP880528MDFMRT03',
      },
      contactData: {
        homePhone: '9997654321',
        cellPhone: '5523456801',
        workPhone: '9997654322',
        email: 'patricia.jimenez@example.com',
      },
      taxData: {
        street: 'VICTORIA',
        exteriorNumber: '741',
        interiorNumber: '4C',
        zipCode: '97000',
        neighborhood: 'CENTRO',
        municipality: 'MÉRIDA',
        state: 'YUCATÁN',
        taxRegime: '605',
        cfdiUse: 'G03',
      },
      address: {
        street: 'VICTORIA',
        exteriorNumber: '741',
        interiorNumber: '4C',
        zipCode: '97000',
        neighborhood: 'CENTRO',
        municipality: 'MÉRIDA',
        state: 'YUCATÁN',
      },
    }],
    ['1234567903', {
      cardNumber: '4152313471829416',
      personalData: {
        firstName: 'ANDRÉS FELIPE',
        lastName: 'MORALES',
        secondLastName: 'SÁNCHEZ',
        embossName: 'A F MORALES S',
        birthDate: '1992-03-16',
        rfc: 'MOSA920316XX4',
        curp: 'MOSA920316HDFRNR04',
      },
      contactData: {
        homePhone: '6144567890',
        cellPhone: '5523456802',
        workPhone: '6144567891',
        email: 'andres.morales@example.com',
      },
      taxData: {
        street: 'MADERO',
        exteriorNumber: '852',
        interiorNumber: '',
        zipCode: '31000',
        neighborhood: 'CENTRO',
        municipality: 'CHIHUAHUA',
        state: 'CHIHUAHUA',
        taxRegime: '626',
        cfdiUse: 'G03',
      },
      address: {
        street: 'MADERO',
        exteriorNumber: '852',
        interiorNumber: '',
        zipCode: '31000',
        neighborhood: 'CENTRO',
        municipality: 'CHIHUAHUA',
        state: 'CHIHUAHUA',
      },
    }],
    ['1234567904', {
      cardNumber: '4152313471829424',
      personalData: {
        firstName: 'VALENTINA ISABEL',
        lastName: 'DÍAZ',
        secondLastName: 'RODRÍGUEZ',
        embossName: 'V I DIAZ R',
        birthDate: '1996-11-09',
        rfc: 'DIRV961109XX5',
        curp: 'DIRV961109MDFZRL05',
      },
      contactData: {
        homePhone: '9518765432',
        cellPhone: '5523456803',
        workPhone: '9518765433',
        email: 'valentina.diaz@example.com',
      },
      taxData: {
        street: 'COLÓN',
        exteriorNumber: '963',
        interiorNumber: '7A',
        zipCode: '68000',
        neighborhood: 'CENTRO',
        municipality: 'OAXACA',
        state: 'OAXACA',
        taxRegime: '616',
        cfdiUse: 'S01',
      },
      address: {
        street: 'COLÓN',
        exteriorNumber: '963',
        interiorNumber: '7A',
        zipCode: '68000',
        neighborhood: 'CENTRO',
        municipality: 'OAXACA',
        state: 'OAXACA',
      },
    }],
  ]);

  private mockCards: Map<string, Card[]> = new Map([
    ['1234567890', [{
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
    }]],
    ['1234567891', [{
      cardNumber: '4152313471829291',
      type: 'PRINCIPAL',
      cardholder: 'GARCÍA HERNÁNDEZ JUAN CARLOS',
      manufacturer: 'VISA',
      expiration: '2026-06-30',
      creditLimit: 75000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567892', [{
      cardNumber: '4152313471829309',
      type: 'PRINCIPAL',
      cardholder: 'MARTÍNEZ LÓPEZ ANA LAURA',
      manufacturer: 'MASTERCARD',
      expiration: '2026-03-31',
      creditLimit: 60000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567893', [{
      cardNumber: '4152313471829317',
      type: 'PRINCIPAL',
      cardholder: 'RODRÍGUEZ SÁNCHEZ PEDRO ANTONIO',
      manufacturer: 'VISA',
      expiration: '2027-01-31',
      creditLimit: 100000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567894', [{
      cardNumber: '4152313471829325',
      type: 'PRINCIPAL',
      cardholder: 'GONZÁLEZ RAMÍREZ SOFÍA ELENA',
      manufacturer: 'AMERICAN EXPRESS',
      expiration: '2026-09-30',
      creditLimit: 80000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567895', [{
      cardNumber: '4152313471829333',
      type: 'PRINCIPAL',
      cardholder: 'HERNÁNDEZ GARCÍA JOSÉ LUIS',
      manufacturer: 'VISA',
      expiration: '2025-11-30',
      creditLimit: 55000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567896', [{
      cardNumber: '4152313471829341',
      type: 'PRINCIPAL',
      cardholder: 'LÓPEZ MARTÍNEZ CARMEN ROSA',
      manufacturer: 'MASTERCARD',
      expiration: '2026-07-31',
      creditLimit: 45000,
      status: 'BLOCKED',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'BLOCKED' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'BLOCKED' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'BLOCKED' },
      ],
    }]],
    ['1234567897', [{
      cardNumber: '4152313471829358',
      type: 'PRINCIPAL',
      cardholder: 'SÁNCHEZ PÉREZ FRANCISCO JAVIER',
      manufacturer: 'VISA',
      expiration: '2027-02-28',
      creditLimit: 90000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567898', [{
      cardNumber: '4152313471829366',
      type: 'PRINCIPAL',
      cardholder: 'PÉREZ GONZÁLEZ LUCÍA FERNANDA',
      manufacturer: 'MASTERCARD',
      expiration: '2026-04-30',
      creditLimit: 65000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567899', [{
      cardNumber: '4152313471829374',
      type: 'PRINCIPAL',
      cardholder: 'RAMÍREZ TORRES MIGUEL ÁNGEL',
      manufacturer: 'VISA',
      expiration: '2025-10-31',
      creditLimit: 70000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567900', [{
      cardNumber: '4152313471829382',
      type: 'PRINCIPAL',
      cardholder: 'TORRES LÓPEZ DANIELA ALEJANDRA',
      manufacturer: 'AMERICAN EXPRESS',
      expiration: '2026-08-31',
      creditLimit: 85000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567901', [{
      cardNumber: '4152313471829390',
      type: 'PRINCIPAL',
      cardholder: 'FLORES HERNÁNDEZ RICARDO ANTONIO',
      manufacturer: 'VISA',
      expiration: '2027-03-31',
      creditLimit: 95000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567902', [{
      cardNumber: '4152313471829408',
      type: 'PRINCIPAL',
      cardholder: 'JIMÉNEZ GARCÍA PATRICIA ELIZABETH',
      manufacturer: 'MASTERCARD',
      expiration: '2026-05-31',
      creditLimit: 58000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567903', [{
      cardNumber: '4152313471829416',
      type: 'PRINCIPAL',
      cardholder: 'MORALES SÁNCHEZ ANDRÉS FELIPE',
      manufacturer: 'VISA',
      expiration: '2026-12-31',
      creditLimit: 72000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
    ['1234567904', [{
      cardNumber: '4152313471829424',
      type: 'PRINCIPAL',
      cardholder: 'DÍAZ RODRÍGUEZ VALENTINA ISABEL',
      manufacturer: 'MASTERCARD',
      expiration: '2026-10-31',
      creditLimit: 48000,
      status: 'ACTIVE',
      accessMethods: [
        { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
        { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' },
      ],
    }]],
  ]);

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

    // Mock response for development - persist data in memory
    this.mockAccounts.push(account);
    this.mockCardholders.set(account.accountNumber, cardholder);
    this.mockCards.set(account.accountNumber, [card]);

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
    // Use persisted mock data
    let filtered = this.mockAccounts;

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
    // Use persisted mock data from Map
    const cardholder = this.mockCardholders.get(accountNumber);

    if (!cardholder) {
      // Return empty/default cardholder if not found instead of throwing error
      const defaultCardholder: Cardholder = {
        cardNumber: '',
        personalData: {
          firstName: '',
          lastName: '',
          secondLastName: '',
          embossName: '',
          birthDate: '',
          rfc: '',
          curp: '',
        },
        contactData: {
          cellPhone: '',
          email: '',
        },
        taxData: {
          street: '',
          exteriorNumber: '',
          interiorNumber: '',
          zipCode: '',
          neighborhood: '',
          municipality: '',
          state: '',
          taxRegime: '',
          cfdiUse: '',
        },
      };
      return of(defaultCardholder);
    }

    return of(cardholder);
  }

  private getMockCards(accountNumber: string): Observable<Card[]> {
    // Use persisted mock data from Map
    const cards = this.mockCards.get(accountNumber);

    if (!cards) {
      // Return empty array if no cards found for this account
      return of([]);
    }

    return of(cards);
  }
}
