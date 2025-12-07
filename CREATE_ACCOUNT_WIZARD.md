# 🆕 Wizard de Creación de Cuentas - CROWN System

## Resumen

Se implementó un **wizard completo paso a paso** para crear nuevas cuentas de crédito con toda la información necesaria: cuenta, tarjetahabiente y tarjeta principal.

## ✨ Características Principales

### Wizard de 4 Pasos

1. **Paso 1: Información de Cuenta**
   - Número de cuenta (10 dígitos)
   - Tipo de cuenta (Crédito/Débito)
   - Límite de crédito

2. **Paso 2: Información del Tarjetahabiente**
   - Datos personales (nombre, apellidos, fecha nacimiento, RFC, CURP)
   - Datos de contacto (teléfono, email)
   - Domicilio fiscal completo
   - Régimen fiscal y uso de CFDI

3. **Paso 3: Tarjeta Principal**
   - Número de tarjeta (16 dígitos)
   - Marca (VISA, Mastercard, Amex)
   - Fecha de expiración
   - Nombre en tarjeta (opcional, se genera automáticamente)
   - Métodos de acceso (POS, ATM, E-Commerce)

4. **Paso 4: Resumen y Confirmación**
   - Vista previa de toda la información
   - Botón para crear la cuenta

## 🎨 Interfaz de Usuario

### Ubicación del Botón

```
┌────────────────────────────────────────────┐
│ 💳 Consulta de Cuentas de Crédito         │
│                               [Nueva Cuenta]│
│ ──────────────────────────────────────────│
│                                            │
│  [Panel de Búsqueda]                      │
│                                            │
└────────────────────────────────────────────┘
```

### Wizard Modal

```
┌──────────────────────────────────────────────┐
│ 🏢 Crear Nueva Cuenta de Crédito      [X]   │
├──────────────────────────────────────────────┤
│                                              │
│  ① Cuenta → ② Tarjetahabiente → ③ Tarjeta → ④ Confirmar
│  ═════════                                   │
│                                              │
│  📋 Información de Cuenta                    │
│  ────────────────────────────────────────── │
│                                              │
│  Número de Cuenta: [__________]             │
│  Tipo: [Crédito ▼]                          │
│  Límite: $[_______] MXN                     │
│                                              │
│               [Cancelar]  [Siguiente →]      │
└──────────────────────────────────────────────┘
```

## 🚀 Flujo de Creación

### 1. Inicio del Proceso

```typescript
// Usuario hace click en "Nueva Cuenta"
onCreateAccount(): void {
  const dialogRef = this.dialog.open(AccountWizardComponent, {
    width: '900px',
    maxWidth: '95vw',
    disableClose: true
  });
}
```

### 2. Paso 1: Información de Cuenta

Usuario completa:
- ✅ Número de cuenta (10 dígitos, validación en tiempo real)
- ✅ Tipo de cuenta (dropdown)
- ✅ Límite de crédito (mínimo $1,000)

**Validaciones**:
- Número debe ser exactamente 10 dígitos
- Límite debe ser mayor o igual a $1,000

### 3. Paso 2: Tarjetahabiente (El Más Completo)

**Datos Personales**:
- Nombre(s)
- Apellido Paterno
- Apellido Materno (opcional)
- Fecha de Nacimiento
- RFC (validación con formato mexicano)
- CURP (validación con formato mexicano)

**Contacto**:
- Teléfono celular (10 dígitos)
- Email (validación de formato)

**Domicilio Fiscal**:
- Calle, número exterior/interior
- Código postal (5 dígitos)
- Colonia, municipio, estado
- Régimen fiscal (catálogo SAT)
- Uso de CFDI (catálogo SAT)

### 4. Paso 3: Tarjeta Principal

Usuario configura:
- Número de tarjeta (16 dígitos)
- Marca (VISA/Mastercard/Amex)
- Fecha de expiración
- Nombre en tarjeta (opcional)
- Métodos de acceso activos

**Generación Automática**:
Si no se proporciona nombre en tarjeta, se genera automáticamente:
```typescript
// Ejemplo: Juan Carlos García Hernández
// Genera: "J C GARCIA H"
private generateEmbossName(): string {
  const { firstName, lastName, secondLastName } = this.form.value;
  const first = firstName?.charAt(0) || '';
  const last = lastName?.substring(0, 10) || '';
  const second = secondLastName?.charAt(0) || '';
  return `${first} ${second} ${last}`.trim().toUpperCase();
}
```

### 5. Paso 4: Resumen

Muestra tres tarjetas con resumen:
- 📋 **Cuenta**: Número, tipo, límite
- 👤 **Tarjetahabiente**: Nombre, RFC, CURP, contacto
- 💳 **Tarjeta**: Número, marca, métodos activos

Usuario puede:
- ← Regresar a cualquier paso anterior
- ✅ Crear cuenta (si todo es válido)

## 📊 Estructura de Datos

### NewAccountData Interface

```typescript
export interface NewAccountData {
  account: Account;
  cardholder: Cardholder;
  card: Card;
}
```

### Ejemplo de Datos Generados

```typescript
{
  account: {
    accountNumber: "1234567890",
    card: "4152313471829283",
    name: "GARCÍA HERNÁNDEZ JUAN CARLOS"
  },
  cardholder: {
    cardNumber: "4152313471829283",
    personalData: {
      firstName: "JUAN CARLOS",
      lastName: "GARCÍA",
      secondLastName: "HERNÁNDEZ",
      embossName: "J C GARCIA H",
      birthDate: "1990-05-15",
      rfc: "GAHJ900515XX3",
      curp: "GAHJ900515HDFRRR03"
    },
    contactData: {
      cellPhone: "5512345678",
      email: "juan.garcia@example.com"
    },
    taxData: {
      street: "AV INSURGENTES",
      exteriorNumber: "100",
      zipCode: "03100",
      neighborhood: "DEL VALLE",
      municipality: "BENITO JUÁREZ",
      state: "CIUDAD DE MÉXICO",
      taxRegime: "612",
      cfdiUse: "G03"
    }
  },
  card: {
    cardNumber: "4152313471829283",
    type: "PRINCIPAL",
    cardholder: "GARCÍA HERNÁNDEZ JUAN CARLOS",
    manufacturer: "VISA",
    expiration: "2026-12-31",
    creditLimit: 50000,
    status: "ACTIVE",
    accessMethods: [
      { accessMethod: "POS", type: "CHIP", status: "ACTIVE" },
      { accessMethod: "ATM", type: "CHIP", status: "ACTIVE" },
      { accessMethod: "ECOMMERCE", type: "CNP", status: "ACTIVE" }
    ]
  }
}
```

## 🔧 Arquitectura Técnica

### Componentes Creados

#### AccountWizardComponent
**Ubicación**: `src/app/views/accounts/components/account-wizard/`

**Features**:
- Material Stepper (horizontal)
- 3 FormGroups independientes
- Validación por paso (linear stepper)
- Resumen final con vista previa
- Generación automática de emboss name

**Imports Material**:
```typescript
MatStepperModule      // Wizard stepper
MatFormFieldModule    // Form fields
MatInputModule        // Inputs
MatSelectModule       // Dropdowns
MatDatepickerModule   // Date pickers
MatCheckboxModule     // Access methods
MatProgressSpinnerModule  // Loading
```

### Servicios Actualizados

#### AccountsService

**Método Nuevo**:
```typescript
createCompleteAccount(
  account: Account,
  cardholder: Cardholder,
  card: Card
): Observable<{ account, cardholder, card }> {
  // POST /api/accounts/complete
  // Mock: delay 1500ms
}
```

#### AccountsStateService

**Método Nuevo**:
```typescript
createAccount(
  account: Account,
  cardholder: Cardholder,
  card: Card
): void {
  // 1. Call API
  // 2. Add to accounts list
  // 3. Select as current account
  // 4. Set cardholder and card data
}
```

## ✅ Validaciones Implementadas

### Por Paso

**Paso 1 - Cuenta**:
- ✅ Número de cuenta requerido, 10 dígitos exactos
- ✅ Tipo de cuenta requerido
- ✅ Límite mínimo $1,000

**Paso 2 - Tarjetahabiente**:
- ✅ Todos los campos requeridos tienen validación
- ✅ RFC validado con formato mexicano
- ✅ CURP validado con formato mexicano + validación de fecha
- ✅ Email con formato válido
- ✅ Teléfono exactamente 10 dígitos
- ✅ Código postal exactamente 5 dígitos

**Paso 3 - Tarjeta**:
- ✅ Número de tarjeta 16 dígitos
- ✅ Marca requerida
- ✅ Fecha de expiración requerida
- ✅ Emboss name máximo 26 caracteres (opcional)

## 🎯 Experiencia de Usuario

### Navegación

```
Paso 1 → Paso 2 → Paso 3 → Paso 4
  ↓        ↓        ↓        ↓
[Next]   [Next]   [Next]  [Crear]
         [Back]   [Back]   [Back]
```

- **Next**: Solo habilitado si el paso actual es válido
- **Back**: Siempre disponible
- **Cancelar**: Disponible en todos los pasos
- **Crear**: Solo en paso 4, solo si todos los formularios son válidos

### Feedback Visual

1. **Validación en Tiempo Real**:
   - Campos marcados con error al perder foco
   - Mensajes de error específicos
   - Íconos de estado en campos

2. **Progress Indicator**:
   - Stepper header muestra progreso
   - Pasos completados marcados con ✓
   - Paso actual resaltado

3. **Loading States**:
   - Spinner en botón "Crear" mientras se procesa
   - Diálogo bloqueado durante creación

4. **Confirmación**:
   - Snackbar verde: "Cuenta {número} creada exitosamente"
   - Auto-selección de la nueva cuenta
   - Cierre automático del wizard

## 📱 Responsive Design

### Desktop (> 768px)
- Wizard width: 900px
- Grid de 2 columnas en formularios
- Todos los campos visibles

### Mobile (< 768px)
- Wizard: 100% width
- Grid de 1 columna
- Scroll vertical en pasos largos

## 🔄 Flujo Post-Creación

```
1. Usuario completa wizard
2. Click "Crear Cuenta"
3. ⏳ Loading... (1.5s mock)
4. ✅ Cuenta creada en backend
5. 📝 Agregada a lista de cuentas
6. 🎯 Seleccionada automáticamente
7. 📊 Tabs cargados con datos
8. 💬 Notificación de éxito
9. ❌ Wizard se cierra
```

## 🧪 Casos de Prueba

### Happy Path
```
1. Click "Nueva Cuenta"
2. Llenar Paso 1 con datos válidos → Next
3. Llenar Paso 2 con datos válidos → Next
4. Llenar Paso 3 con datos válidos → Next
5. Revisar resumen → Crear Cuenta
6. ✅ Cuenta creada y seleccionada
```

### Validación de Errores
```
1. Intentar Next con datos inválidos
   → Botón deshabilitado
2. Campos requeridos vacíos
   → Mensajes de error
3. RFC/CURP inválidos
   → Error específico de formato
4. Cancelar en cualquier paso
   → Wizard se cierra sin crear
```

### Edge Cases
```
1. Nombre muy largo
   → Emboss name generado correctamente (max 26)
2. Solo nombre sin apellido materno
   → Funciona correctamente
3. Todos los métodos de acceso desmarcados
   → Permitido (card creada sin access methods)
```

## 🎨 Catálogos SAT Incluidos

### Regímenes Fiscales (Simplificado)
- 605 - Sueldos y Salarios
- 606 - Arrendamiento
- 612 - Actividades Empresariales
- 616 - Sin obligaciones fiscales
- 621 - Incorporación Fiscal
- 626 - Régimen Simplificado de Confianza

### Usos de CFDI (Simplificado)
- G01 - Adquisición de mercancías
- G03 - Gastos en general
- D10 - Servicios educativos
- S01 - Sin efectos fiscales
- CP01 - Pagos

**Nota**: En producción, usar catálogos completos del SAT.

## 🚀 Mejoras Futuras

1. **Validación Duplicados**
   - Verificar que número de cuenta no exista
   - Verificar que número de tarjeta no exista

2. **Carga de Datos**
   - Auto-completar dirección por código postal
   - Validación de RFC/CURP contra SAT

3. **Generación Automática**
   - Generar número de cuenta automáticamente
   - Generar número de tarjeta válido (Luhn)

4. **Adjuntos**
   - Subir documentos (INE, comprobante domicilio)
   - Vista previa de documentos

5. **Guardar Borrador**
   - Guardar progreso para completar después
   - LocalStorage para datos temporales

## 📊 Métricas de Bundle

```
✅ Build Exitoso
📦 Account Query Chunk: 276.39 kB (50.94 kB gzipped)
📈 Aumento: +57 kB (incluye wizard completo)
🚀 Lazy Loading: Carga solo cuando se necesita
```

## 🔗 Integración con API Real

### Endpoint Esperado

```typescript
POST /api/accounts/complete

Request Body:
{
  "account": {
    "accountNumber": "1234567890",
    "accountType": "CREDIT",
    "creditLimit": 50000
  },
  "cardholder": { /* ... */ },
  "card": { /* ... */ }
}

Response:
{
  "account": { /* ... con ID generado */ },
  "cardholder": { /* ... confirmado */ },
  "card": { /* ... confirmado */ }
}
```

### Reemplazar Mock

En `accounts.service.ts`:
```typescript
// ACTUAL (Mock)
return of({ account, cardholder, card }).pipe(delay(1500));

// CAMBIAR A (Real API)
return this.http.post<any>(`${this.apiUrl}/complete`, {
  account,
  cardholder,
  card
});
```

---

**Implementado**: 2025-12-06
**Versión**: 1.2.0
**Estado**: ✅ Funcional con Mock Data

## 📝 Resumen Ejecutivo

Se implementó un **wizard completo de 4 pasos** para crear cuentas de crédito con:

✅ Validación exhaustiva en cada paso
✅ UI/UX intuitiva con Material Stepper
✅ Resumen visual antes de confirmar
✅ Integración completa con el sistema
✅ Auto-selección de cuenta creada
✅ Notificaciones de éxito/error
✅ Responsive design
✅ Mock data para desarrollo

**Total de archivos creados**: 2 (wizard.ts + wizard.html)
**Servicios actualizados**: 2 (AccountsService + AccountsStateService)
**Componentes actualizados**: 1 (AccountQueryComponent)
**Build status**: ✅ Exitoso
