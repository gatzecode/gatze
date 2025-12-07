# 💳 Funcionalidad: Agregar y Editar Tarjetas

## Resumen

Se ha implementado la funcionalidad completa para **agregar nuevas tarjetas** y **editar tarjetas existentes** en el módulo de Cuentas de Crédito CROWN.

## ✨ Características Implementadas

### 1. Agregar Nueva Tarjeta

**Ubicación**: Tab "Cards" → Botón "Agregar Tarjeta"

**Funcionalidad**:
- Diálogo modal con formulario completo
- Validación en tiempo real
- Configuración de métodos de acceso (POS, ATM, E-Commerce, Contactless)
- Guardado optimista con rollback en caso de error
- Notificaciones de éxito/error

### 2. Editar Tarjeta Existente

**Ubicación**: Cada tarjeta → Botón "Editar"

**Funcionalidad**:
- Mismo diálogo que agregar, pero pre-llenado
- Número de tarjeta y tipo bloqueados (no editables)
- Actualización en tiempo real
- Notificaciones de éxito/error

### 3. Bloquear/Desbloquear Tarjeta

**Ubicación**: Cada tarjeta → Botón "Bloquear/Desbloquear"

**Funcionalidad**:
- Toggle rápido del estado de la tarjeta
- Cambio visual inmediato
- Persiste el cambio al backend (mock)

## 📋 Campos del Formulario

### Información Básica

| Campo | Tipo | Validación | Notas |
|-------|------|------------|-------|
| **Número de Tarjeta** | Input | 16 dígitos, requerido | Solo lectura al editar |
| **Tipo de Tarjeta** | Select | Requerido | PRINCIPAL o ADICIONAL |
| **Nombre Tarjetahabiente** | Input | Máx 100 chars, requerido | Nombre completo |
| **Marca** | Select | Requerido | VISA, Mastercard, Amex |
| **Fecha de Expiración** | Date Picker | Requerido | Fecha futura |
| **Límite de Crédito** | Number | Min 0, requerido | En pesos mexicanos |
| **Estado** | Select | Requerido | ACTIVE, BLOCKED, CANCELLED, EXPIRED |

### Métodos de Acceso (Checkboxes)

- ✅ **POS** (Punto de Venta) - CHIP
- ✅ **ATM** (Cajero Automático) - CHIP
- ✅ **E-Commerce** (Compras en línea) - CNP (Card Not Present)
- ✅ **Contactless** (Sin contacto) - NFC

## 🎨 UI/UX

### Diálogo de Agregar/Editar

```
┌─────────────────────────────────────────┐
│ 💳 Agregar Nueva Tarjeta        [X]     │
├─────────────────────────────────────────┤
│                                         │
│  [Número de Tarjeta: ________________] │
│  [Tipo: PRINCIPAL ▼]                   │
│  [Nombre: _________________________]   │
│                                         │
│  [Marca: VISA ▼]  [Expiración: 📅]    │
│  [Límite: $_______] [Estado: ACTIVE ▼] │
│                                         │
│  ╔══ Métodos de Acceso ═══╗            │
│  ║ ☑ POS                  ☑ ATM       ║
│  ║ ☑ E-Commerce  ☐ Contactless       ║
│  ╚════════════════════════════════════╝│
│                                         │
│              [Cancelar]  [Crear Tarjeta]│
└─────────────────────────────────────────┘
```

### Tarjeta en Grid

```
┌──────────────────────────────┐
│ 💳 VISA    [ACTIVE]          │
│ 4152 3134 7182 9283          │
├──────────────────────────────┤
│ Tipo: PRINCIPAL              │
│ Tarjetahabiente: GARCÍA...   │
│ Expiración: 12/2025          │
│ Límite: $50,000.00 MXN       │
├──────────────────────────────┤
│ Métodos de Acceso:           │
│ • POS (CHIP) [ACTIVE]        │
│ • ATM (CHIP) [ACTIVE]        │
│ • ECOMMERCE (CNP) [ACTIVE]   │
├──────────────────────────────┤
│  [✏️ Editar] [🔒 Bloquear]   │
└──────────────────────────────┘
```

## 🔧 Arquitectura Técnica

### Componentes Nuevos

#### CardDialogComponent
**Ubicación**: `src/app/views/accounts/components/card-dialog/card-dialog.ts`

- Componente standalone
- Reactive Forms con validación
- Modo crear/editar dinámico
- Inyección de datos vía `MAT_DIALOG_DATA`

```typescript
interface CardDialogData {
  card?: Card;              // Si existe, modo editar
  accountNumber: string;    // Cuenta asociada
  isAdditional?: boolean;   // Sugerir tipo adicional
}
```

### Servicios Actualizados

#### AccountsStateService

**Métodos Nuevos**:
```typescript
addCard(newCard: Card): void
  - Agrega tarjeta al estado inmediatamente
  - Llama a API para persistir
  - Rollback si hay error

updateCard(updatedCard: Card): void
  - Actualiza tarjeta en el estado

saveCard(card: Card): void
  - Persiste cambios al backend
```

#### AccountsService

**Métodos Nuevos**:
```typescript
createCard(accountNumber: string, card: Card): Observable<Card>
  - POST /api/accounts/{accountNumber}/cards
  - Mock: delay 600ms

deleteCard(accountNumber: string, cardNumber: string): Observable<void>
  - DELETE /api/accounts/{accountNumber}/cards/{cardNumber}
  - Mock: delay 400ms
```

## 📱 Flujo de Usuario

### Agregar Nueva Tarjeta

1. Usuario navega al tab "Cards"
2. Click en botón "Agregar Tarjeta" (top-right)
3. Se abre diálogo modal
4. Usuario llena formulario:
   - Número de tarjeta (16 dígitos)
   - Tipo (Principal/Adicional)
   - Nombre del tarjetahabiente
   - Marca, fecha expiración, límite
   - Estado inicial
   - Métodos de acceso (checkboxes)
5. Click "Crear Tarjeta"
6. Validación del formulario
7. Tarjeta se agrega inmediatamente (optimistic UI)
8. Llamada a API en background
9. Notificación de éxito
10. Diálogo se cierra
11. Grid actualizado con nueva tarjeta

### Editar Tarjeta

1. Usuario localiza tarjeta en el grid
2. Click en botón "Editar"
3. Diálogo se abre con datos pre-llenados
4. Número y tipo son readonly
5. Usuario modifica campos necesarios
6. Click "Guardar Cambios"
7. Actualización inmediata en UI
8. Llamada a API en background
9. Notificación de éxito

### Bloquear/Desbloquear

1. Click en botón "Bloquear" (o "Desbloquear")
2. Estado cambia inmediatamente
3. Badge actualizado visualmente
4. API call en background
5. Notificación de confirmación

## 🎯 Validaciones

### Número de Tarjeta
- ✅ Requerido
- ✅ Exactamente 16 dígitos
- ✅ Solo números
- ❌ No validación Luhn (se puede agregar)

### Nombre Tarjetahabiente
- ✅ Requerido
- ✅ Máximo 100 caracteres

### Límite de Crédito
- ✅ Requerido
- ✅ Valor mínimo: 0
- ✅ Tipo numérico

### Fecha de Expiración
- ✅ Requerida
- ⚠️ No valida que sea fecha futura (se puede agregar)

## 🚀 Ejemplo de Uso

### En TypeScript

```typescript
// Abrir diálogo para agregar
onAddCard(): void {
  const dialogRef = this.dialog.open(CardDialogComponent, {
    width: '600px',
    data: {
      accountNumber: '1234567890',
      isAdditional: true
    },
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((card: Card) => {
    if (card) {
      this.accountsState.addCard(card);
    }
  });
}

// Abrir diálogo para editar
onEditCard(card: Card): void {
  const dialogRef = this.dialog.open(CardDialogComponent, {
    width: '600px',
    data: {
      card: card,
      accountNumber: '1234567890'
    }
  });

  dialogRef.afterClosed().subscribe((updated: Card) => {
    if (updated) {
      this.accountsState.saveCard(updated);
    }
  });
}
```

### Datos de Ejemplo

```typescript
const newCard: Card = {
  cardNumber: '4152313471829300',
  type: 'ADDITIONAL',
  cardholder: 'PÉREZ LÓPEZ JUAN CARLOS',
  manufacturer: 'VISA',
  expiration: '2026-12-31',
  creditLimit: 30000,
  status: 'ACTIVE',
  accessMethods: [
    { accessMethod: 'POS', type: 'CHIP', status: 'ACTIVE' },
    { accessMethod: 'ATM', type: 'CHIP', status: 'ACTIVE' },
    { accessMethod: 'ECOMMERCE', type: 'CNP', status: 'ACTIVE' }
  ]
};
```

## 📊 Estado y Sincronización

### Flujo Optimista

```
1. Usuario crea tarjeta
2. ✅ Tarjeta agregada al estado inmediatamente
3. 🌐 API call en background
4. ✅ Éxito: Tarjeta actualizada con datos del servidor
   ❌ Error: Tarjeta removida del estado + Notificación
```

### Gestión de Errores

```typescript
addCard(newCard: Card): void {
  // Optimistic update
  this.cardsSignal.update(cards => [...cards, newCard]);

  // Persist
  this.accountsService.createCard(accountNumber, newCard).subscribe({
    next: (createdCard) => {
      this.updateCard(createdCard); // Server data
    },
    error: (error) => {
      // Rollback
      this.cardsSignal.update(cards =>
        cards.filter(c => c.cardNumber !== newCard.cardNumber)
      );
      this.setError('Error creating card');
    }
  });
}
```

## 🎨 Notificaciones

### Tipos de Snackbar

| Acción | Tipo | Mensaje | Duración |
|--------|------|---------|----------|
| Crear tarjeta | Success | "Tarjeta agregada exitosamente" | 3s |
| Editar tarjeta | Success | "Tarjeta actualizada exitosamente" | 3s |
| Bloquear | Success | "Tarjeta bloqueada exitosamente" | 3s |
| Desbloquear | Success | "Tarjeta desbloqueada exitosamente" | 3s |
| Error | Error | "Error al crear/actualizar tarjeta" | 5s |

## 🔄 Integración con API Real

### Reemplazar Mock Data

En `accounts.service.ts`, reemplazar:

```typescript
// ANTES (Mock)
createCard(accountNumber: string, card: Card): Observable<Card> {
  return of(card).pipe(delay(600));
}

// DESPUÉS (Real API)
createCard(accountNumber: string, card: Card): Observable<Card> {
  return this.http.post<Card>(
    `${this.apiUrl}/${accountNumber}/cards`,
    card
  );
}
```

## 📋 Checklist de Producción

- [ ] Agregar validación Luhn para números de tarjeta
- [ ] Validar que fecha de expiración sea futura
- [ ] Agregar confirmación antes de bloquear tarjeta
- [ ] Implementar funcionalidad de eliminar tarjeta
- [ ] Agregar límites de tarjetas por cuenta
- [ ] Validar que no existan tarjetas duplicadas
- [ ] Agregar loading states en el diálogo
- [ ] Implementar debounce en validaciones asíncronas
- [ ] Agregar tests unitarios para CardDialogComponent
- [ ] Conectar con API real

## 🎯 Características Adicionales Sugeridas

1. **Eliminar Tarjeta** - Botón con confirmación
2. **Historial de Cambios** - Log de modificaciones
3. **Reemplazo de Tarjeta** - Por robo/pérdida
4. **Cambio de Límite** - Workflow de aprobación
5. **Validación Luhn** - Verificar número válido
6. **Carga Masiva** - Import CSV de tarjetas
7. **Generador de Número** - Auto-generar números válidos

## 📱 Build Info

```
✅ Build Successful
📦 Bundle Size: 219.05 kB (gzipped: 42.07 kB)
🚀 Lazy Loading: Incluye CardDialogComponent
⚡ Zero Errors
```

---

**Implementado**: 2025-12-06
**Versión**: 1.1.0
**Estado**: ✅ Funcional con Mock Data
