# Guía de Migración

Esta guía te ayudará a migrar del sistema anterior al nuevo sistema de diseño modular.

## 🔄 Cambios Principales

### 1. Estructura de Archivos

**ANTES:**
```
src/
├── styles.css          # Monolítico (600+ líneas)
├── theme.css           # Material tokens
└── tailwinds.css       # Tailwind config
```

**DESPUÉS:**
```
src/styles/
├── 0-foundations/      # Tokens base
├── 1-theme/            # Material + Tailwind theme
├── 2-components/       # Componentes
├── 3-utilities/        # Utilidades
├── tailwind.config.css # Config Tailwind
└── main.css            # Entrada con CSS Layers
```

### 2. Importaciones en angular.json

**ANTES:**
```json
"styles": [
  "src/styles.css",
  "src/theme.css",
  "src/tailwinds.css"
]
```

**DESPUÉS:**
```json
"styles": [
  "src/styles/main.css",
  "src/theme.css",
  "src/tailwinds.css"
]
```

### 3. Variables CSS - Renombrado

#### Espaciado

**ANTES:**
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

**DESPUÉS:**
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

**Migración:**
```css
/* ❌ Viejo */
margin: var(--spacing-md);

/* ✅ Nuevo */
margin: var(--space-4);
```

#### Duraciones

**ANTES:**
```css
--transition-fast: 150ms var(--ease-standard);
--transition-base: 200ms var(--ease-standard);
--transition-slow: 300ms var(--ease-standard);
```

**DESPUÉS:**
```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
```

**Migración:**
```css
/* ❌ Viejo */
transition: all var(--transition-base);

/* ✅ Nuevo */
transition: all var(--duration-base) var(--ease-out);
```

### 4. Componentes Híbridos (Nuevo)

Ahora puedes usar componentes que combinan Tailwind + Material:

```html
<!-- ANTES: Solo Material -->
<mat-card>
  <mat-card-content>Content</mat-card-content>
</mat-card>

<!-- DESPUÉS: Opción híbrida disponible -->
<div class="card">
  <p>Content</p>
</div>

<!-- O seguir usando Material -->
<mat-card>
  <mat-card-content>Content</mat-card-content>
</mat-card>
```

### 5. Utilidades de Surface (Nuevo)

**NUEVO: Clases de utilidad Material**
```html
<div class="surface">Default surface</div>
<div class="surface-container">Container</div>
<div class="surface-container-high">High elevation</div>
<div class="bg-primary">Primary background</div>
```

### 6. Elevation (Nuevo)

**ANTES: Solo box-shadow manual**
```css
box-shadow: var(--shadow-md);
```

**DESPUÉS: Clases de elevation**
```html
<div class="elevation-1">Level 1</div>
<div class="elevation-2">Level 2</div>
<div class="elevation-3">Level 3</div>
```

### 7. Animaciones

**ANTES:**
```css
.animate-fade-in-up {
  animation: fadeInUp 0.4s var(--ease-decelerate);
}
```

**DESPUÉS: Más opciones**
```html
<div class="animate-fade-in-up">Fade in up</div>
<div class="animate-fade-in">Fade in</div>
<div class="animate-slide-in-right">Slide from right</div>
<div class="animate-slide-in-left">Slide from left</div>
```

## 🎯 Tareas de Migración

### Paso 1: Actualizar angular.json

```json
{
  "styles": [
    "src/styles/main.css",  // ✅ Nuevo
    "src/theme.css",
    "src/tailwinds.css"
  ]
}
```

### Paso 2: Buscar y Reemplazar Variables

Ejecuta estos comandos en tu proyecto:

```bash
# Espaciado
find src -name "*.css" -exec sed -i 's/--spacing-xs/--space-1/g' {} +
find src -name "*.css" -exec sed -i 's/--spacing-sm/--space-2/g' {} +
find src -name "*.css" -exec sed -i 's/--spacing-md/--space-4/g' {} +
find src -name "*.css" -exec sed -i 's/--spacing-lg/--space-6/g' {} +
find src -name "*.css" -exec sed -i 's/--spacing-xl/--space-8/g' {} +

# Transiciones
find src -name "*.css" -exec sed -i 's/var(--transition-fast)/var(--duration-fast) var(--ease-out)/g' {} +
find src -name "*.css" -exec sed -i 's/var(--transition-base)/var(--duration-base) var(--ease-out)/g' {} +
find src -name "*.css" -exec sed -i 's/var(--transition-slow)/var(--duration-slow) var(--ease-out)/g' {} +
```

### Paso 3: Revisar Componentes Personalizados

Si tienes estilos custom en componentes:

```typescript
// component.scss
@import '../styles/0-foundations/tokens';

.my-component {
  // ❌ Viejo
  padding: var(--spacing-md);
  transition: all var(--transition-base);

  // ✅ Nuevo
  padding: var(--space-4);
  transition: all var(--duration-base) var(--ease-out);
}
```

### Paso 4: Adoptar Nuevas Utilidades (Opcional)

Reemplaza estilos inline con clases de utilidad:

```html
<!-- ANTES -->
<div style="background: var(--mat-sys-surface); padding: 16px;">
  Content
</div>

<!-- DESPUÉS -->
<div class="surface p-4">
  Content
</div>
```

### Paso 5: Probar Temas

Verifica que los temas funcionen correctamente:

```typescript
// En tu servicio de tema
export class ThemeService {
  setTheme(theme: 'default' | 'green' | 'rose' | 'orange') {
    document.documentElement.className = theme === 'default'
      ? ''
      : `theme-${theme}`;
  }

  toggleDarkMode(enabled: boolean) {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
```

## 🐛 Problemas Comunes

### Problema 1: Estilos no se aplican

**Causa:** CSS Layers cambian la especificidad

**Solución:** Usa utilidades en lugar de estilos inline
```html
<!-- ❌ No funciona bien con layers -->
<div style="margin: 16px;">

<!-- ✅ Funciona correctamente -->
<div class="m-4">
```

### Problema 2: Variables no definidas

**Causa:** Importación incorrecta

**Solución:** Asegúrate que `main.css` está primero en `angular.json`

### Problema 3: Tailwind no funciona

**Causa:** Orden de importación incorrecto

**Solución:** Verifica que `tailwind.config.css` se importa después de los tokens:
```css
@layer foundations { ... }  // Primero
@layer theme { ... }        // Segundo
@layer tailwind { ... }     // Tercero
```

### Problema 4: Dark mode no funciona

**Causa:** Clase `.dark` no se aplica al `<html>`

**Solución:**
```typescript
// ❌ MAL
document.body.classList.add('dark');

// ✅ BIEN
document.documentElement.classList.add('dark');
```

## 📋 Checklist de Migración

- [ ] Actualizar `angular.json`
- [ ] Reemplazar variables de espaciado
- [ ] Reemplazar variables de transición
- [ ] Revisar componentes personalizados
- [ ] Probar todos los temas (default, green, rose, orange)
- [ ] Probar dark mode
- [ ] Verificar responsive en mobile
- [ ] Probar accesibilidad (motion, contrast)
- [ ] Ejecutar tests
- [ ] Build de producción

## 🎓 Recursos de Aprendizaje

### CSS Layers
```css
/* Controlar la cascada explícitamente */
@layer reset, base, components, utilities;

/* Los estilos sin layer tienen mayor prioridad */
.override {
  color: red; /* Gana sobre layers */
}
```

### Color-mix (Nuevo en navegadores modernos)
```css
/* Crear variantes de color */
.button:hover {
  background: color-mix(
    in srgb,
    var(--mat-sys-primary) 90%,
    black
  );
}
```

### Container Queries (Para futuro)
```css
/* Responsive basado en contenedor, no viewport */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## 💡 Tips de Performance

### 1. Usar will-change solo en hover
```css
/* ❌ MAL */
.card {
  will-change: transform;
}

/* ✅ BIEN */
.card:hover {
  will-change: transform;
}
```

### 2. Usar contain para optimizar
```css
.isolated-component {
  contain: layout style paint;
}
```

### 3. Prefer GPU acceleration selectivamente
```css
/* Solo cuando mejore el rendimiento medible */
.animated-element {
  transform: translateZ(0);
}
```

## 🚀 Siguientes Pasos

Después de la migración:

1. **Auditar bundle size**
   ```bash
   ng build --stats-json
   ```

2. **Lighthouse audit**
   - Performance
   - Accessibility
   - Best Practices

3. **Linting CSS**
   ```bash
   npm install -D stylelint stylelint-config-standard
   ```

4. **Documentar componentes custom**
   - Agregar a README.md
   - Crear ejemplos en Storybook

## 📞 Soporte

Si encuentras problemas:

1. Revisa el [README.md](./README.md) principal
2. Verifica los ejemplos en cada archivo
3. Compara con el código de referencia en `src/styles/`

## 🎉 Beneficios Post-Migración

- ✅ **Modular**: Fácil encontrar y editar estilos
- ✅ **Performante**: Optimizaciones aplicadas
- ✅ **Escalable**: Estructura clara para crecer
- ✅ **Mantenible**: Sin duplicación de código
- ✅ **Documentado**: README completo
- ✅ **Moderno**: CSS Layers, color-mix, light-dark()
