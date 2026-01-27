# 🚀 Guía Rápida - Cómo Usar el Dashboard

## ⚡ Inicio Rápido (30 segundos)

```bash
# 1. Inicia el servidor de desarrollo
npm run dev

# 2. Abre en tu navegador
http://localhost:3000/dashboard

# 3. ¡Listo! El dashboard está funcionando
```

---

## 🧭 Navegación

### Usando el Sidebar

**En Desktop:**
```
1. Verás el sidebar a la izquierda
2. Haz click en cualquier opción
3. La página se carga automáticamente
4. La opción se destaca en azul
```

**En Móvil:**
```
1. Haz click en el icono ≡ (hamburguesa)
2. Se abre el menú lateral
3. Selecciona una opción
4. El menú se cierra automáticamente
```

---

## 📋 Opciones del Menú

```
🏠 Dashboard Inicio
   → /dashboard
   → Resumen de estadísticas
   
💰 Nueva Venta
   → /dashboard/ventas
   → Gestión de ventas
   
📦 Productos
   → /dashboard/productos
   → Inventario y stock
   
👥 Clientes (NUEVO ✨)
   → /dashboard/clientes
   → Búsqueda, listado, estadísticas
   
📄 Presupuestos (NUEVO ✨)
   → /dashboard/presupuestos
   → Tabla, estados, historial
   
⚙️ Configuración (NUEVO ✨)
   → /dashboard/configuracion
   → Configurar cuenta y preferencias
```

---

## 🎯 Explorar Cada Página

### 1. 👥 Página de Clientes

**Qué verás:**
```
┌─────────────────────────────────┐
│ Encabezado azul gradiente       │
│ "Gestiona tu base de clientes"  │
└─────────────────────────────────┘

🔍 Barra de búsqueda
📝 Botón "Nuevo Cliente" (azul)

Estadísticas:
├── Total Clientes: 24
├── Activos Este Mes: 18
└── Contacto Pendiente: 6

Listado:
├── Juan Pérez - juan@example.com - 555-0101 - Madrid
├── María García - maria@example.com - 555-0102 - Barcelona
└── ...
```

**Prueba:**
- Escribe en la barra de búsqueda → Filtra por nombre
- Pasa el ratón sobre un cliente → Se resalta en azul
- Haz click en "Editar" → Botón funcional

### 2. 📄 Página de Presupuestos

**Qué verás:**
```
┌─────────────────────────────────┐
│ Encabezado azul gradiente       │
│ "Crea y gestiona presupuestos"  │
└─────────────────────────────────┘

🔍 Barra de búsqueda
📝 Botón "Nuevo Presupuesto" (azul)

Estadísticas:
├── Total Presupuestos: 12
├── Monto Total: $28.5K
└── Pendientes: 5

Tabla:
┌─────┬──────────────┬────────┬──────────┬─────────────┐
│ ID  │ Cliente      │ Monto  │ Fecha    │ Estado      │
├─────┼──────────────┼────────┼──────────┼─────────────┤
│ #1  │ Juan Pérez   │$1,250  │2026-01-25│ ✓ Aprobado  │
│ #2  │ María García │$3,500  │2026-01-20│ ⏳ Pendiente │
│ #3  │ Carlos López │$890.75 │2026-01-15│ ✗ Rechazado │
└─────┴──────────────┴────────┴──────────┴─────────────┘
```

**Prueba:**
- Busca por nombre de cliente
- Pasa el ratón sobre filas → Se resaltan
- Ve los estados con diferentes colores
- Haz click en "Ver" → Botón funcional

### 3. ⚙️ Página de Configuración

**Qué verás:**
```
Sección 1: CONFIGURACIÓN GENERAL
├── Nombre del Negocio: [input]
├── Email: [input]
├── Teléfono: [input]
└── Botón "Guardar Cambios"

Sección 2: NOTIFICACIONES
├── ☑ Notificaciones por Email
└── ☑ Alertas de Stock Bajo

Sección 3: APARIENCIA
├── ○ Claro
├── ○ Oscuro
└── ○ Automático

Sección 4: SEGURIDAD
├── Cambiar Contraseña
└── Autenticación de Dos Factores

Sección 5: ZONA DE PELIGRO
└── Botón Eliminar Cuenta (Rojo)
```

**Prueba:**
- Cambia valores en los inputs
- Haz click en los toggles (se activan/desactivan)
- Selecciona un tema (botón se destaca en azul)
- Explora todos los botones

---

## 🎨 Elementos Interactivos

### Botones
```
Estado Normal:          Azul con hover más oscuro
Estado Hover:          Cambio de color suave
Estado Active:         Deprimido visualmente
```

### Inputs
```
Normal:                 Borde gris
Focus:                  Anillo azul alrededor
Escribiendo:            Activo y visible
```

### Cards/Tarjetas
```
Normal:                 Blanca con sombra suave
Hover:                  Sombra más pronunciada
Transición:             Suave 300ms
```

### Estados de Presupuestos
```
✓ Aprobado:             Verde claro con texto verde
⏳ Pendiente:             Amarillo claro con texto amarillo
✗ Rechazado:            Rojo claro con texto rojo
```

---

## 📱 Cambiar Tamaño de Pantalla

### Opción 1: Redimensionar navegador
```
1. Abre http://localhost:3000/dashboard
2. Arrastra el borde de la ventana
3. Observa cómo cambian los elementos
```

### Opción 2: Usar DevTools
```
1. Presiona F12 (abre Developer Tools)
2. Presiona Ctrl+Shift+M (Toggle device)
3. Selecciona diferentes dispositivos:
   - iPhone 12: 390 × 844
   - iPad: 768 × 1024
   - Desktop: 1280 × 720
```

### Cambios que verás:
```
Mobile (<768px):
├── Sidebar oculto
├── Hamburguesa visible
└── Stack vertical

Tablet (768px+):
├── Sidebar visible
├── 2-3 columnas
└── Layout mejorado
```

---

## 🔧 Comandos Útiles

```bash
# Iniciar servidor
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor compilado
npm start

# Linter
npm run lint

# Prisma (si integras backend)
npx prisma studio    # Ver base de datos
npx prisma migrate   # Migrar cambios
```

---

## 🐛 Solucionar Problemas

### El sidebar no aparece
```
✓ Verifica que estés en /dashboard
✓ Actualiza la página (F5 o Ctrl+R)
✓ Abre la consola (F12) para ver errores
✓ Borra caché si es necesario (Ctrl+Shift+R)
```

### Los colores no se ven bien
```
✓ Limpia caché: Ctrl+Shift+R
✓ Reinicia servidor: npm run dev
✓ Verifica conexión a internet
✓ Prueba en otro navegador
```

### El menú móvil no abre
```
✓ Comprueba que estés en pantalla pequeña (F12)
✓ Haz click directamente en el icono ≡
✓ Revisa la consola (F12) para errores
✓ Intenta en otro dispositivo
```

### Página en blanco
```
✓ Revisa la consola del navegador (F12)
✓ Revisa la terminal (npm run dev)
✓ Reinicia el servidor
✓ Limpia el caché del navegador
```

---

## ✨ Características Implementadas

### Sidebar
- [x] Logo personalizado
- [x] 5 opciones de navegación
- [x] Indicador de página activa
- [x] Botón colapsar/expandir
- [x] Menú móvil deslizable

### Páginas
- [x] Encabezados gradiente
- [x] Barras de búsqueda funcionales
- [x] Tarjetas de estadísticas
- [x] Listados/tablas
- [x] Formularios
- [x] Toggles y checkboxes

### Responsividad
- [x] Mobile first
- [x] Breakpoints responsive
- [x] Grid adaptable
- [x] Navegación en móvil

### Diseño
- [x] Colores azul y blanco
- [x] Tipografía profesional
- [x] Espaciado consistente
- [x] Transiciones suaves
- [x] Iconografía clara

---

## 🎯 Casos de Uso

### Workflow Cliente
```
1. Abre /dashboard
2. Ve el resumen
3. Navega a Clientes
4. Busca un cliente
5. Hace click en Editar
   (Funcionalidad lista para backend)
```

### Workflow Presupuesto
```
1. Navega a Presupuestos
2. Ve los estados visuales
3. Busca por cliente
4. Hace click en Ver
   (Funcionalidad lista para backend)
```

### Workflow Configuración
```
1. Navega a Configuración
2. Cambia datos personales
3. Activa/desactiva notificaciones
4. Selecciona tema
5. Haz click en Guardar
   (Funcionalidad lista para backend)
```

---

## 🚀 Próximos Pasos

### Para Desarrolladores
```
1. Estudia la estructura en src/app/dashboard/
2. Revisa los componentes en src/components/
3. Conecta con Prisma en lib/prisma.ts
4. Crea API routes en app/api/
5. Implementa validaciones
```

### Para Usuarios
```
1. Explora todas las páginas
2. Prueba la búsqueda
3. Prueba en dispositivos móviles
4. Proporciona feedback
5. Reporta bugs
```

---

## 📊 Resumen Visual

```
DASHBOARD COMPLETADO ✅

Desktop:
┌──────────────────────────────────────────┐
│ ┌────┐ │ Encabezado       │ Avatar       │
│ │ F  │ ├──────────────────┤              │
│ │Sid │ │                  │              │
│ │ebar│ │ Contenido        │              │
│ │    │ │ Principal        │              │
│ └────┘ │                  │              │
└──────────────────────────────────────────┘

Mobile:
┌──────────────────────┐
│ ≡ Título  │ Avatar   │
├──────────────────────┤
│ Contenido Principal  │
│                      │
│ (Menú oculto)        │
└──────────────────────┘
```

---

## ✅ Checklist de Exploración

- [ ] Visité /dashboard/inicio
- [ ] Visité /dashboard/clientes
- [ ] Busqué un cliente
- [ ] Visité /dashboard/presupuestos
- [ ] Vi los estados con colores
- [ ] Visité /dashboard/configuracion
- [ ] Cambié un input
- [ ] Activé un toggle
- [ ] Probé en móvil
- [ ] Probé en tablet
- [ ] Probé el sidebar colapsable
- [ ] Vi que todo funciona sin errores

---

## 🎉 ¡Disfruta tu Dashboard!

**Tu aplicación está lista para:**
- ✨ Mostrar a clientes/inversores
- ✨ Agregar funcionalidad backend
- ✨ Integrar autenticación
- ✨ Conectar con base de datos
- ✨ Desplegar a producción

**¡Bienvenido a tu ferretería digital! 🚀**

Para más información, consulta:
- DASHBOARD_COMPLETO.md
- PAGINAS_COMPLETADAS.md
- CAMBIOS_REALIZADOS.md
