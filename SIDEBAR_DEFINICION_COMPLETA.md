# 🧭 Definición Completa del Sidebar - Sistema de Gestión Web

**Documento:** Especificación Técnica del Menú Lateral  
**Versión:** 1.0.0  
**Fecha:** 27 de enero de 2026  
**Estado:** Listo para Implementación  

---

## 📑 Tabla de Contenidos

1. [Sidebar Completo - Estructura Base](#1-sidebar-completo---estructura-base)
2. [Visibilidad por Rol](#2-visibilidad-por-rol)
3. [Permisos Granulares por Módulo](#3-permisos-granulares-por-módulo)
4. [Lógica de Control de Acceso](#4-lógica-de-control-de-acceso)

---

## 1. Sidebar Completo - Estructura Base

### 1.1 Descripción General

El sidebar es el elemento central de navegación del sistema. Contiene 6 secciones principales organizadas jerárquicamente, con submódulos que se expanden/contraen según la necesidad.

**Características generales:**
- Ancho: 260px (expandido) / 80px (colapsado)
- Logo de empresa en encabezado
- Búsqueda global de módulos
- Indicadores de notificaciones
- Perfil de usuario con opciones rápidas
- Footer con enlaces de soporte

### 1.2 Estructura Visual Completa

```
┌─────────────────────────────────────────┐
│ [Logo] FERRETERÍA CENTRAL      [☰ ×]   │
├─────────────────────────────────────────┤
│                                         │
│ 🔍 Buscar módulos...                   │
│                                         │
├─────────────────────────────────────────┤
│ [Avatar] Juan Pérez Pérez     [⌄]      │
│ Administrador | Cambiar empresa         │
├─────────────────────────────────────────┤
│                                         │
│ 📊 DASHBOARD                           │
│   └─ Panel Principal                   │
│   └─ Estadísticas Personales           │
│   └─ Mis Tareas Pendientes             │
│                                         │
│ 🏪 CATÁLOGOS Y REFERENCIAS             │
│   ├─ 📦 Productos                      │
│   ├─ 🔧 Servicios                      │
│   ├─ 🏷️ Categorías                     │
│   ├─ 📏 Unidades de Medida             │
│   └─ 💰 Listas de Precios              │
│                                         │
│ 💼 OPERACIONES                         │
│   ├─ 💳 Ventas           (3 nuevas)   │
│   ├─ 📦 Remitos          (1 pendiente)│
│   └─ 📄 Presupuestos     (2 nuevos)   │
│                                         │
│ 📈 ANÁLISIS Y REPORTES                 │
│   ├─ 📊 Dashboard Analítico            │
│   ├─ 📉 Reportes de Ventas             │
│   ├─ 📦 Reportes de Inventario         │
│   └─ 📋 Reportes Personalizados        │
│                                         │
│ 👥 ADMINISTRACIÓN        [🔒 Admin]    │
│   ├─ 👤 Gestión de Usuarios            │
│   ├─ 🔐 Roles y Permisos               │
│   └─ 📋 Auditoría                      │
│                                         │
│ ⚙️ CONFIGURACIÓN         [🔒 Admin]    │
│   ├─ 🎛️ Parámetros del Sistema         │
│   ├─ 💾 Respaldos                      │
│   ├─ 🔒 Seguridad                      │
│   └─ 🔗 Integraciones                  │
│                                         │
├─────────────────────────────────────────┤
│ ❓ Ayuda  📚 Docs  💬 Contacto         │
│                                         │
│ [🌙] Tema  [🔔] Notif  [🚪] Salir     │
└─────────────────────────────────────────┘
```

### 1.3 Estructura Jerárquica Detallada

```yaml
SIDEBAR_ROOT:
  HEADER:
    - Logo + Nombre Empresa
    - Toggle Expandir/Contraer
    - Botón Cerrar (móvil)

  USER_SECTION:
    - Avatar Usuario
    - Nombre Usuario
    - Rol Actual
    - Selector de Empresa
    - Opciones Rápidas (Perfil, Preferencias, Logout)

  SEARCH_BAR:
    - Input búsqueda global
    - Atajos rápidos a módulos frecuentes
    - Historial de búsquedas

  MAIN_NAVIGATION:
    SECTION_1_DASHBOARD:
      - Panel Principal
        route: /dashboard
        permission: (acceso general)
        icon: BarChart3
      - Estadísticas Personales
        route: /dashboard/stats
        permission: analytics.view
        icon: TrendingUp
      - Mis Tareas Pendientes
        route: /dashboard/tasks
        permission: (acceso general)
        icon: CheckList
        badge: dinámico

    SECTION_2_CATALOGS:
      label: Catálogos y Referencias
      icon: Boxes
      description: Gestión de productos, servicios y catálogos
      children:
        - Productos
          route: /dashboard/products
          permission: products.view
          icon: Package
          submenu:
            - Ver todos
              route: /dashboard/products
            - Crear producto
              route: /dashboard/products/new
              permission: products.create
            - Importar masivo
              route: /dashboard/products/import
              permission: products.bulk_import
        
        - Servicios
          route: /dashboard/services
          permission: services.view
          icon: Wrench
        
        - Categorías
          route: /dashboard/categories
          permission: catalogs.categories.manage
          icon: Tags
          adminOnly: true
        
        - Unidades de Medida
          route: /dashboard/units
          permission: catalogs.units.manage
          icon: Ruler
          adminOnly: true
        
        - Listas de Precios
          route: /dashboard/price-lists
          permission: prices.view
          icon: DollarSign

    SECTION_3_OPERATIONS:
      label: Operaciones
      icon: ShoppingCart
      description: Gestión de ventas, remitos y presupuestos
      children:
        - Ventas
          route: /dashboard/sales
          permission: sales.view
          icon: CreditCard
          badge: dinámico
          submenu:
            - Nueva Venta
              route: /dashboard/sales/new
              permission: sales.create
            - Mis Ventas
              route: /dashboard/sales/my
              permission: sales.view
            - Todas las Ventas
              route: /dashboard/sales/all
              permission: sales.view_all
              adminOnly: true
            - Historial
              route: /dashboard/sales/history
              permission: sales.view
        
        - Remitos
          route: /dashboard/shipping-notes
          permission: shipping_notes.view
          icon: Package
          badge: dinámico
          submenu:
            - Nuevo Remito
              route: /dashboard/shipping-notes/new
              permission: shipping_notes.create
            - Pendientes de Entrega
              route: /dashboard/shipping-notes/pending
              permission: shipping_notes.view
            - Historial
              route: /dashboard/shipping-notes/history
              permission: shipping_notes.view
        
        - Presupuestos
          route: /dashboard/quotes
          permission: quotes.view
          icon: FileText
          badge: dinámico
          submenu:
            - Crear Presupuesto
              route: /dashboard/quotes/new
              permission: quotes.create
            - Mis Presupuestos
              route: /dashboard/quotes/my
              permission: quotes.view
            - Seguimiento
              route: /dashboard/quotes/tracking
              permission: quotes.track

    SECTION_4_REPORTS:
      label: Análisis y Reportes
      icon: BarChart
      description: Dashboard analítico y reportes
      children:
        - Dashboard Analítico
          route: /dashboard/analytics
          permission: analytics.view
          icon: TrendingUp
        
        - Reportes de Ventas
          route: /dashboard/reports/sales
          permission: analytics.reports_basic
          icon: LineChart
        
        - Reportes de Inventario
          route: /dashboard/reports/inventory
          permission: analytics.reports_basic
          icon: Package
        
        - Reportes de Clientes
          route: /dashboard/reports/customers
          permission: analytics.reports_basic
          icon: Users
        
        - Reportes Avanzados
          route: /dashboard/reports/advanced
          permission: analytics.reports_advanced
          icon: Zap
          adminOnly: true
        
        - Reportes Personalizados
          route: /dashboard/reports/custom
          permission: analytics.export_reports
          icon: Settings

    SECTION_5_ADMINISTRATION:
      label: Administración
      icon: Users
      adminOnly: true
      description: Gestión de usuarios, roles y auditoría
      children:
        - Gestión de Usuarios
          route: /dashboard/admin/users
          permission: users.view
          icon: Users
          adminOnly: true
          submenu:
            - Ver todos
              route: /dashboard/admin/users
            - Crear usuario
              route: /dashboard/admin/users/new
              permission: users.create
            - Grupos de usuarios
              route: /dashboard/admin/users/groups
              permission: users.view
        
        - Roles y Permisos
          route: /dashboard/admin/roles
          permission: users.view
          icon: Lock
          adminOnly: true
          submenu:
            - Ver roles
              route: /dashboard/admin/roles
            - Crear rol
              route: /dashboard/admin/roles/new
              permission: users.change_role
        
        - Auditoría
          route: /dashboard/admin/audit
          permission: config.audit_logs
          icon: FileText
          adminOnly: true
          submenu:
            - Logs de actividad
              route: /dashboard/admin/audit/logs
            - Historial de cambios
              route: /dashboard/admin/audit/changes
            - Intentos de acceso
              route: /dashboard/admin/audit/access

    SECTION_6_CONFIGURATION:
      label: Configuración
      icon: Settings
      adminOnly: true
      description: Configuración del sistema y preferencias
      children:
        - Parámetros del Sistema
          route: /dashboard/config/system
          permission: config.system.view
          icon: Sliders
          adminOnly: true
        
        - Respaldos
          route: /dashboard/config/backups
          permission: config.backups.create
          icon: HardDrive
          adminOnly: true
          submenu:
            - Crear respaldo
              route: /dashboard/config/backups/create
              permission: config.backups.create
            - Ver respaldos
              route: /dashboard/config/backups
            - Restaurar
              route: /dashboard/config/backups/restore
              permission: config.backups.restore
        
        - Seguridad
          route: /dashboard/config/security
          permission: config.security.view
          icon: Shield
          adminOnly: true
          submenu:
            - Configuración general
              route: /dashboard/config/security
            - 2FA y MFA
              route: /dashboard/config/security/2fa
        
        - Integraciones
          route: /dashboard/config/integrations
          permission: config.integrations
          icon: Link
          adminOnly: true

  FOOTER:
    - ❓ Ayuda
      route: /help
    - 📚 Documentación
      route: /docs
    - 💬 Contacto
      route: /contact
    - 🌙 Selector de Tema
    - 🔔 Notificaciones
    - 🚪 Logout
```

---

## 2. Visibilidad por Rol

### 2.1 Matriz General de Visibilidad

```
┌──────────────────────────────────┬───────────────┬─────────────┐
│ SECCIÓN / MÓDULO                 │ ADMINISTRADOR │ OPERADOR    │
├──────────────────────────────────┼───────────────┼─────────────┤
│ DASHBOARD                        │      ✓        │      ✓      │
│                                  │               │             │
│ CATÁLOGOS Y REFERENCIAS          │      ✓        │      ✓*     │
│  • Productos                     │      ✓        │      ✓      │
│  • Servicios                     │      ✓        │      ✓      │
│  • Categorías                    │      ✓        │      ✗      │
│  • Unidades de Medida            │      ✓        │      ✗      │
│  • Listas de Precios             │      ✓        │      ✓      │
│                                  │               │             │
│ OPERACIONES                      │      ✓        │      ✓*     │
│  • Ventas                        │      ✓        │      ✓*     │
│  • Remitos                       │      ✓        │      ✓*     │
│  • Presupuestos                  │      ✓        │      ✓*     │
│                                  │               │             │
│ ANÁLISIS Y REPORTES              │      ✓        │      ✓*     │
│  • Dashboard Analítico           │      ✓        │      ✓      │
│  • Reportes Básicos              │      ✓        │      ✓      │
│  • Reportes Avanzados            │      ✓        │      ✗      │
│                                  │               │             │
│ ADMINISTRACIÓN                   │      ✓        │      ✗      │
│  • Gestión de Usuarios           │      ✓        │      ✗      │
│  • Roles y Permisos              │      ✓        │      ✗      │
│  • Auditoría                     │      ✓        │      ✗      │
│                                  │               │             │
│ CONFIGURACIÓN                    │      ✓        │      ✗      │
│  • Parámetros del Sistema        │      ✓        │      ✗      │
│  • Respaldos                     │      ✓        │      ✗      │
│  • Seguridad                     │      ✓        │      ✗      │
│  • Integraciones                 │      ✓        │      ✗      │
│                                  │               │             │
│ PERFIL USUARIO (Mi Cuenta)       │      ✓        │      ✓      │
│                                  │               │             │
└──────────────────────────────────┴───────────────┴─────────────┘

LEYENDA:
✓  = Acceso completo
✓* = Acceso limitado (solo propios registros o permisos granulares)
✗  = Sin acceso (no se muestra)
```

### 2.2 Perfil: Administrador

**Descripción:** Acceso total a todos los módulos y funciones del sistema.

**Módulos visibles:**
- ✅ Dashboard completo
- ✅ Catálogos (todos)
- ✅ Operaciones (crear/editar/anular cualquier registro)
- ✅ Reportes (básicos y avanzados)
- ✅ Administración (usuarios, roles, auditoría)
- ✅ Configuración (sistema, respaldos, seguridad)

**Permisos adicionales:**
- Ver costos de productos
- Anular ventas/presupuestos
- Modificar históricos
- Acceso a logs de auditoría
- Cambiar parámetros del sistema
- Crear/restaurar respaldos

**Menú visible:**
```
📊 DASHBOARD
🏪 CATÁLOGOS Y REFERENCIAS
   ├─ 📦 Productos
   ├─ 🔧 Servicios
   ├─ 🏷️ Categorías
   ├─ 📏 Unidades de Medida
   └─ 💰 Listas de Precios
💼 OPERACIONES
   ├─ 💳 Ventas
   ├─ 📦 Remitos
   └─ 📄 Presupuestos
📈 ANÁLISIS Y REPORTES
   ├─ 📊 Dashboard Analítico
   ├─ 📉 Reportes de Ventas
   ├─ 📦 Reportes de Inventario
   ├─ 👥 Reportes de Clientes
   └─ 🎯 Reportes Avanzados
👥 ADMINISTRACIÓN
   ├─ 👤 Gestión de Usuarios
   ├─ 🔐 Roles y Permisos
   └─ 📋 Auditoría
⚙️ CONFIGURACIÓN
   ├─ 🎛️ Parámetros del Sistema
   ├─ 💾 Respaldos
   ├─ 🔒 Seguridad
   └─ 🔗 Integraciones
```

### 2.3 Perfil: Usuario Operador

**Descripción:** Acceso limitado según permisos granulares. Puede crear/editar registros propios.

**Módulos visibles:**
- ✅ Dashboard personal (solo sus datos)
- ✅ Catálogos (consulta, sin ABM)
- ✅ Operaciones (crear/editar propios registros)
- ✅ Reportes básicos (solo de sus datos)
- ❌ Administración (oculto)
- ❌ Configuración (oculto)

**Permisos limitados:**
- Ver solo productos activos
- No ver costos
- Crear/editar propias ventas
- No anular operaciones
- Reportes básicos solamente
- Mi perfil (editable)

**Menú visible:**
```
📊 DASHBOARD
🏪 CATÁLOGOS Y REFERENCIAS
   ├─ 📦 Productos
   ├─ 🔧 Servicios
   └─ 💰 Listas de Precios (solo consulta)
💼 OPERACIONES
   ├─ 💳 Ventas (solo crear/editar propias)
   ├─ 📦 Remitos (solo crear/editar propios)
   └─ 📄 Presupuestos (solo crear/editar propios)
📈 ANÁLISIS Y REPORTES
   ├─ 📊 Dashboard Analítico (personal)
   └─ 📉 Reportes Básicos (solo sus datos)

👤 MI CUENTA
   ├─ Perfil
   ├─ Cambiar Contraseña
   └─ Preferencias
```

### 2.4 Reglas de Ocultación

```javascript
// Regla 1: Ocultar sección completa si no tiene permisos
IF user.role !== 'ADMIN' THEN
  HIDE 'Administración'
  HIDE 'Configuración'
END IF

// Regla 2: Ocultar ítem dentro de sección
IF user.permissions DOES NOT CONTAIN 'catalogs.categories.manage' THEN
  HIDE 'Categorías'
END IF

// Regla 3: Deshabilitar pero no ocultar
IF user.permissions DOES NOT CONTAIN 'reports.advanced' AND 
   user.role !== 'ADMIN' THEN
  SHOW 'Reportes Avanzados'
  DISABLE 'Reportes Avanzados'
  SHOW TOOLTIP: "Requiere permisos de administrador"
END IF

// Regla 4: Mostrar contador solo si tiene acceso
IF user.permissions CONTAINS 'sales.view' THEN
  badge_count = COUNT(nuevas_ventas)
  SHOW badge EN 'Ventas'
END IF

// Regla 5: Filtrar opciones dentro de módulo
IF user.permissions CONTAINS 'sales.view' BUT NOT 'sales.view_all' THEN
  SHOW 'Mis Ventas'
  HIDE 'Todas las Ventas'
END IF
```

---

## 3. Permisos Granulares por Módulo

### 3.1 Tabla Maestra de Permisos

```
╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: USUARIOS                                                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver lista de usuarios       │ users.view             │  ✓    │     ✗      ║
║ Ver perfil propio           │ users.view_profile     │  ✓    │     ✓      ║
║ Ver perfil de otro          │ users.view_other       │  ✓    │     ✗      ║
║ Crear usuario               │ users.create           │  ✓    │     ✗      ║
║ Editar usuario              │ users.edit             │  ✓    │     ✗      ║
║ Editar perfil propio        │ users.edit_profile     │  ✓    │     ✓      ║
║ Eliminar usuario            │ users.delete           │  ✓    │     ✗      ║
║ Cambiar rol de usuario      │ users.change_role      │  ✓    │     ✗      ║
║ Resetear contraseña         │ users.reset_password   │  ✓    │     ✗      ║
║ Ver historial de acceso     │ users.view_login_hist  │  ✓    │     ✗      ║
║ Habilitar/deshabilitar      │ users.toggle_active    │  ✓    │     ✗      ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: PRODUCTOS                                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver productos               │ products.view          │  ✓    │     ✓      ║
║ Ver costo de producto       │ products.view_cost     │  ✓    │     ✗      ║
║ Ver margen de ganancia      │ products.view_margin   │  ✓    │     ✗      ║
║ Crear producto              │ products.create        │  ✓    │     ✓*     ║
║ Editar producto             │ products.edit          │  ✓    │     ✓*     ║
║ Eliminar producto           │ products.delete        │  ✓    │     ✗      ║
║ Editar precios              │ products.edit_prices   │  ✓    │     ✗      ║
║ Importar masivo             │ products.bulk_import   │  ✓    │     ✓      ║
║ Exportar datos              │ products.export        │  ✓    │     ✓      ║
║ Ver historial de cambios    │ products.view_history  │  ✓    │     ✓      ║
║ Gestionar proveedores       │ products.manage_vendor │  ✓    │     ✗      ║
║ Alertas de stock            │ products.stock_alerts  │  ✓    │     ✓      ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: SERVICIOS                                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver servicios               │ services.view          │  ✓    │     ✓      ║
║ Crear servicio              │ services.create        │  ✓    │     ✓      ║
║ Editar servicio             │ services.edit          │  ✓    │     ✓*     ║
║ Eliminar servicio           │ services.delete        │  ✓    │     ✗      ║
║ Editar precio de servicio   │ services.edit_prices   │  ✓    │     ✗      ║
║ Ver historial de tarifas    │ services.price_history │  ✓    │     ✓      ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: CATÁLOGOS (Categorías, Unidades, Estados, Listas de Precios)    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver catálogos               │ catalogs.view          │  ✓    │     ✓      ║
║ Crear categoría             │ catalogs.categories    │  ✓    │     ✗      ║
║ Editar categoría            │ .create/.edit/.delete  │  ✓    │     ✗      ║
║ Crear unidad medida         │ catalogs.units         │  ✓    │     ✗      ║
║ Editar unidad medida        │ .create/.edit/.delete  │  ✓    │     ✗      ║
║ Crear estado                │ catalogs.status        │  ✓    │     ✗      ║
║ Editar estado               │ .create/.edit/.delete  │  ✓    │     ✗      ║
║ Crear lista de precios      │ catalogs.price_lists   │  ✓    │     ✗      ║
║ Editar lista de precios     │ .create/.edit/.delete  │  ✓    │     ✗      ║
║ Duplicar lista de precios   │ catalogs.duplicate     │  ✓    │     ✗      ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: PRECIOS                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver precios                 │ prices.view            │  ✓    │     ✓      ║
║ Crear lista de precios      │ prices.create          │  ✓    │     ✗      ║
║ Editar precios              │ prices.edit            │  ✓    │     ✗      ║
║ Eliminar lista de precios   │ prices.delete          │  ✓    │     ✗      ║
║ Aplicar descuentos          │ prices.apply_discounts │  ✓    │     ✓      ║
║ Ver historial de precios    │ prices.view_history    │  ✓    │     ✓      ║
║ Exportar lista de precios   │ prices.export          │  ✓    │     ✓      ║
║ Actualizar precios masivo   │ prices.bulk_update     │  ✓    │     ✗      ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: VENTAS                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver ventas propias          │ sales.view             │  ✓    │     ✓      ║
║ Ver todas las ventas        │ sales.view_all         │  ✓    │     ✗      ║
║ Ver costo de venta          │ sales.view_cost        │  ✓    │     ✗      ║
║ Crear venta                 │ sales.create           │  ✓    │     ✓      ║
║ Editar venta propia         │ sales.edit             │  ✓    │     ✓*     ║
║ Editar venta de otro        │ sales.edit_other       │  ✓    │     ✗      ║
║ Anular venta                │ sales.cancel           │  ✓    │     ✗      ║
║ Generar factura             │ sales.generate_invoice │  ✓    │     ✓      ║
║ Aplicar crédito             │ sales.apply_credit     │  ✓    │     ✓*     ║
║ Procesar devolución         │ sales.process_return   │  ✓    │     ✓*     ║
║ Exportar venta PDF          │ sales.export           │  ✓    │     ✓      ║
║ Ver historial del cliente   │ sales.view_cust_hist   │  ✓    │     ✓      ║
║ Cambiar cliente             │ sales.change_customer  │  ✓    │     ✗      ║
║ Aplicar descuento especial  │ sales.special_discount │  ✓    │     ✓*     ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: REMITOS                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver remitos propios         │ shipping.view          │  ✓    │     ✓      ║
║ Ver todos los remitos       │ shipping.view_all      │  ✓    │     ✗      ║
║ Crear remito                │ shipping.create        │  ✓    │     ✓      ║
║ Editar remito propio        │ shipping.edit          │  ✓    │     ✓*     ║
║ Editar remito de otro       │ shipping.edit_other    │  ✓    │     ✗      ║
║ Confirmar entrega           │ shipping.confirm       │  ✓    │     ✓      ║
║ Anular remito               │ shipping.cancel        │  ✓    │     ✗      ║
║ Registrar firma del cliente │ shipping.sign          │  ✓    │     ✓      ║
║ Subir prueba de entrega     │ shipping.upload_proof  │  ✓    │     ✓      ║
║ Exportar remito PDF         │ shipping.export        │  ✓    │     ✓      ║
║ Generar código QR           │ shipping.generate_qr   │  ✓    │     ✓      ║
║ Ver historial de entregas   │ shipping.view_history  │  ✓    │     ✓      ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: PRESUPUESTOS                                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver presupuestos propios    │ quotes.view            │  ✓    │     ✓      ║
║ Ver todos los presupuestos  │ quotes.view_all        │  ✓    │     ✗      ║
║ Crear presupuesto           │ quotes.create          │  ✓    │     ✓      ║
║ Editar presupuesto propio   │ quotes.edit            │  ✓    │     ✓*     ║
║ Editar presupuesto de otro  │ quotes.edit_other      │  ✓    │     ✗      ║
║ Duplicar presupuesto        │ quotes.duplicate       │  ✓    │     ✓      ║
║ Convertir a venta           │ quotes.convert_to_sale │  ✓    │     ✓      ║
║ Rechazar presupuesto        │ quotes.reject          │  ✓    │     ✓*     ║
║ Anular presupuesto          │ quotes.cancel          │  ✓    │     ✗      ║
║ Exportar presupuesto PDF    │ quotes.export          │  ✓    │     ✓      ║
║ Enviar presupuesto email    │ quotes.send_email      │  ✓    │     ✓      ║
║ Ver seguimiento             │ quotes.track           │  ✓    │     ✓      ║
║ Cambiar fecha vigencia      │ quotes.change_expiry   │  ✓    │     ✓*     ║
║ Aplicar descuentos          │ quotes.apply_discounts │  ✓    │     ✓      ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: ESTADÍSTICAS                                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver dashboard básico        │ analytics.view         │  ✓    │     ✓      ║
║ Ver gráficos avanzados      │ analytics.adv_charts   │  ✓    │     ✗      ║
║ Generar reportes básicos    │ analytics.basic_report │  ✓    │     ✓      ║
║ Generar reportes avanzados  │ analytics.adv_report   │  ✓    │     ✗      ║
║ Exportar reportes           │ analytics.export       │  ✓    │     ✓      ║
║ Crear reportes personalizados│analytics.custom       │  ✓    │     ✗      ║
║ Programar reportes          │ analytics.scheduled    │  ✓    │     ✗      ║
║ Ver alertas                 │ analytics.alerts       │  ✓    │     ✓      ║
║ Crear alertas personalizadas│ analytics.create_alert │  ✓    │     ✗      ║
║ Comparar períodos           │ analytics.compare      │  ✓    │     ✓      ║
║ Descargar datos raw         │ analytics.download     │  ✓    │     ✓      ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: CONFIGURACIÓN DEL SISTEMA                                        ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ACCIÓN                      │ PERMISO                │ ADMIN │ OPERADOR   ║
╟─────────────────────────────┼────────────────────────┼───────┼────────────╢
║ Ver parámetros del sistema  │ config.system.view     │  ✓    │     ✗      ║
║ Editar parámetros           │ config.system.edit     │  ✓    │     ✗      ║
║ Ver configuración seguridad │ config.security.view   │  ✓    │     ✗      ║
║ Editar seguridad            │ config.security.edit   │  ✓    │     ✗      ║
║ Ver logs de auditoría       │ config.audit_logs      │  ✓    │     ✗      ║
║ Exportar logs de auditoría  │ config.export_logs     │  ✓    │     ✗      ║
║ Crear respaldo              │ config.backup.create   │  ✓    │     ✗      ║
║ Ver respaldos               │ config.backup.view     │  ✓    │     ✗      ║
║ Restaurar respaldo          │ config.backup.restore  │  ✓    │     ✗      ║
║ Eliminar respaldo           │ config.backup.delete   │  ✓    │     ✗      ║
║ Configurar integraciones    │ config.integrations    │  ✓    │     ✗      ║
║ Ver historial de cambios    │ config.view_changelog  │  ✓    │     ✗      ║
║ Mi perfil (preferencias)    │ config.user_prefs      │  ✓    │     ✓      ║
╚═══════════════════════════════════════════════════════════════════════════╝

LEYENDA:
✓  = Permiso otorgado
✗  = Permiso negado
✓* = Permiso condicional (solo propios registros o con aprobación)
```

### 3.2 Tabla de Dependencias entre Módulos

```
MÓDULO                DEPENDENCIAS
─────────────────────────────────────────────────────────
Ventas              → Productos (debe existir)
                    → Servicios (opcional)
                    → Clientes
                    → Listas de Precios
                    → Remitos (relación posterior)

Remitos             → Ventas (relación)
                    → Productos

Presupuestos        → Productos
                    → Servicios
                    → Clientes
                    → Puede convertirse en Venta

Estadísticas        → Ventas
                    → Remitos
                    → Presupuestos
                    → Productos

Catálogos           → Base de todo (no depende de otros)

Precios             → Productos
                    → Servicios
```

---

## 4. Lógica de Control de Acceso

### 4.1 Reglas Principales

**Regla 1: Visibilidad por Rol**
```javascript
// Si usuario es ADMIN: mostrar TODO
IF user.role === 'ADMIN' THEN
  SHOW todas_secciones()
  ENABLE todas_acciones()
ELSE
  // Si es OPERADOR: mostrar según permisos
  FOR EACH seccion IN sidebar_sections DO
    IF user_has_permission(seccion.permission) THEN
      SHOW seccion
    ELSE
      HIDE seccion
    END IF
  END FOR
END IF
```

**Regla 2: Visibilidad por Permiso**
```javascript
// Verificar permiso explícito
IF user.permissions CONTAINS 'products.view' THEN
  SHOW 'Productos'
  ENABLE todas_acciones_productos()
ELSE
  HIDE 'Productos'
END IF
```

**Regla 3: Acceso Condicional (Solo Propios Registros)**
```javascript
// Para operaciones que dicen "✓*"
IF user.role === 'OPERADOR' AND user.permissions CONTAINS 'sales.edit' THEN
  // Permitir editar solo si es creador
  IF registro.created_by === user.id THEN
    ENABLE 'Editar'
  ELSE
    DISABLE 'Editar'
    SHOW TOOLTIP: "Solo puedes editar tus propias ventas"
  END IF
END IF
```

**Regla 4: Badges Dinámicos**
```javascript
// Mostrar contador solo si tiene permiso
IF user.permissions CONTAINS 'sales.view' THEN
  badge_count = COUNT(nuevas_ventas_del_usuario)
  IF badge_count > 0 THEN
    SHOW badge CON numero badge_count EN 'Ventas'
  END IF
END IF
```

**Regla 5: Deshabilitar Sin Ocultar**
```javascript
// Mostrar ítem pero deshabilitado si permisos insuficientes
IF user.permissions DOES NOT CONTAIN 'reports.advanced' THEN
  SHOW 'Reportes Avanzados'
  DISABLE 'Reportes Avanzados'
  SHOW ICON CANDADO
  SHOW TOOLTIP: "Requiere rol de administrador"
END IF
```

### 4.2 Estructura de Datos - Usuario con Permisos

```json
{
  "user": {
    "id": "usr_12345",
    "nombre": "Juan Pérez",
    "apellido": "García",
    "email": "juan.perez@ferreteria.com",
    "rol": "OPERADOR",
    "estado": "ACTIVO",
    "empresa_id": "emp_001",
    "permissions": [
      "dashboard.view",
      "products.view",
      "products.create",
      "products.edit",
      "products.export",
      "services.view",
      "catalogs.view",
      "prices.view",
      "prices.apply_discounts",
      "sales.view",
      "sales.create",
      "sales.edit",
      "sales.generate_invoice",
      "sales.export",
      "shipping.view",
      "shipping.create",
      "shipping.edit",
      "shipping.confirm",
      "quotes.view",
      "quotes.create",
      "quotes.edit",
      "quotes.duplicate",
      "quotes.convert_to_sale",
      "quotes.export",
      "analytics.view",
      "analytics.basic_report",
      "analytics.export",
      "users.view_profile",
      "users.edit_profile",
      "config.user_prefs"
    ],
    "permisos_especiales": {
      "descuento_maximo": 15,
      "requiere_aprobacion_sobre": 5000,
      "puede_editar_precio": false,
      "territorios_permitidos": ["BUENOS AIRES", "GRAN BUENOS AIRES"],
      "clientes_permitidos": null
    },
    "fecha_creacion": "2025-06-15",
    "ultimo_acceso": "2026-01-27T15:30:00Z",
    "activo": true
  },
  "sidebar_items": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "visible": true,
      "disabled": false
    },
    {
      "id": "catalogs",
      "label": "Catálogos",
      "visible": true,
      "disabled": false,
      "children": [
        {
          "id": "products",
          "visible": true,
          "disabled": false
        },
        {
          "id": "categories",
          "visible": false,
          "disabled": true,
          "reason": "missing_permission:catalogs.categories.manage"
        }
      ]
    },
    {
      "id": "admin",
      "visible": false,
      "disabled": true,
      "reason": "admin_only"
    },
    {
      "id": "config",
      "visible": false,
      "disabled": true,
      "reason": "admin_only"
    }
  ]
}
```

### 4.3 Algoritmo de Generación del Menú

```javascript
FUNCTION generateSidebarForUser(user) {
  LET sidebar = []
  LET baseItems = getBaseMenuStructure()
  
  FOR EACH item IN baseItems DO
    // Evaluar visibilidad del ítem
    LET isVisible = evaluateVisibility(item, user)
    LET isDisabled = evaluateDisabled(item, user)
    LET badge = generateBadge(item, user)
    
    IF isVisible THEN
      sidebar.push({
        id: item.id,
        label: item.label,
        route: item.route,
        icon: item.icon,
        visible: true,
        disabled: isDisabled,
        badge: badge,
        children: []
      })
      
      // Procesar submódulos si existen
      IF item.children THEN
        FOR EACH child IN item.children DO
          LET childVisible = evaluateVisibility(child, user)
          LET childDisabled = evaluateDisabled(child, user)
          
          IF childVisible THEN
            sidebar[-1].children.push({
              id: child.id,
              label: child.label,
              route: child.route,
              visible: true,
              disabled: childDisabled
            })
          END IF
        END FOR
      END IF
    END IF
  END FOR
  
  RETURN sidebar
}

FUNCTION evaluateVisibility(item, user) {
  // Verificaciones en orden
  
  // 1. Si está marcado como admin_only y usuario no es admin
  IF item.adminOnly AND user.role !== 'ADMIN' THEN
    RETURN false
  END IF
  
  // 2. Si requiere permiso específico
  IF item.permission THEN
    IF user.permissions DOES NOT CONTAIN item.permission THEN
      RETURN false
    END IF
  END IF
  
  // 3. Si requiere cualquiera de varios permisos
  IF item.anyPermissions THEN
    IF user DOES NOT HAVE ANY OF item.anyPermissions THEN
      RETURN false
    END IF
  END IF
  
  // 4. Por defecto, mostrar
  RETURN true
}

FUNCTION evaluateDisabled(item, user) {
  // Un ítem se deshabilita si:
  // - No tiene los permisos pero puede mostrarse
  // - Tiene requisitos no cumplidos
  
  IF item.permission AND 
     user.permissions DOES NOT CONTAIN item.permission AND
     NOT item.adminOnly THEN
    RETURN true
  END IF
  
  RETURN false
}

FUNCTION generateBadge(item, user) {
  // Generar contador dinámico si aplica
  
  IF item.id === 'sales' AND user.permissions CONTAINS 'sales.view' THEN
    LET newCount = queryDatabase(
      "SELECT COUNT(*) FROM sales 
       WHERE created_by = ? AND fecha_creacion > ?",
      [user.id, user.ultimo_acceso]
    )
    RETURN newCount > 0 ? newCount : null
  END IF
  
  IF item.id === 'shipping' AND user.permissions CONTAINS 'shipping.view' THEN
    LET pendingCount = queryDatabase(
      "SELECT COUNT(*) FROM shipping_notes 
       WHERE estado = 'PENDING' AND created_by = ?",
      [user.id]
    )
    RETURN pendingCount > 0 ? pendingCount : null
  END IF
  
  RETURN null
}
```

### 4.4 Matriz de Decisión - Mostrar/Ocultar/Deshabilitar

```
┌──────────────────────────────┬───────────────┬─────────┬──────────────┐
│ CONDICIÓN                    │ RESULTADO     │ MOSTRAR │ DESHABILITAR │
├──────────────────────────────┼───────────────┼─────────┼──────────────┤
│ Rol = ADMIN                  │ Ver todo      │   ✓     │      ✗       │
│ Rol ≠ ADMIN + adminOnly=true │ Ocultar       │   ✗     │      ✗       │
│ Sin permiso requerido        │ Ocultar       │   ✗     │      ✗       │
│ Sin permiso + puede verse    │ Deshabilitar  │   ✓     │      ✓       │
│ Con permiso válido           │ Mostrar       │   ✓     │      ✗       │
│ Requiere 1 de N permisos     │ Mostrar si OK │   ✓ o ✗ │   ✓ o ✗      │
│ Editables solo propios       │ Mostrar       │   ✓     │    ✗ o ✓*    │
└──────────────────────────────┴───────────────┴─────────┴──────────────┘

* = Se deshabilita al ver registro de otro usuario
```

### 4.5 Ejemplos Prácticos de Implementación

**Ejemplo 1: Mostrar Productos (todos pueden)**
```javascript
// Estructura base del ítem
{
  id: 'products',
  label: 'Productos',
  route: '/dashboard/products',
  permission: 'products.view'
}

// Resultado para ADMIN
→ VISIBLE, HABILITADO

// Resultado para OPERADOR con permiso
→ VISIBLE, HABILITADO

// Resultado para OPERADOR sin permiso
→ OCULTO
```

**Ejemplo 2: Mostrar Auditoría (solo admin)**
```javascript
// Estructura base del ítem
{
  id: 'audit',
  label: 'Auditoría',
  route: '/dashboard/admin/audit',
  adminOnly: true
}

// Resultado para ADMIN
→ VISIBLE, HABILITADO

// Resultado para OPERADOR
→ OCULTO (no se muestra nunca)
```

**Ejemplo 3: Mostrar Reportes Avanzados (admin principalmente)**
```javascript
// Estructura base del ítem
{
  id: 'adv_reports',
  label: 'Reportes Avanzados',
  route: '/dashboard/reports/advanced',
  permission: 'analytics.adv_report'
}

// Resultado para ADMIN
→ VISIBLE, HABILITADO

// Resultado para OPERADOR sin permiso
→ OCULTO

// Resultado para OPERADOR con permiso especial
→ VISIBLE, HABILITADO
```

**Ejemplo 4: Editar Venta (condicional a creador)**
```javascript
// En la vista de venta
IF venta.created_by === usuario.id OR usuario.role === 'ADMIN' THEN
  SHOW botón "Editar"
  ENABLE botón "Editar"
ELSE
  HIDE botón "Editar"
  OR
  SHOW botón "Editar" DISABLED
  SHOW tooltip: "Solo el vendedor puede editar"
END IF
```

### 4.6 Flujo de Carga del Sidebar

```
1. USUARIO INICIA SESIÓN
   ↓
2. VALIDAR CREDENCIALES
   ↓
3. OBTENER USUARIO DE DB
   ├─ ID, nombre, email
   ├─ ROL (ADMIN, OPERADOR, etc)
   └─ PERMISOS ASOCIADOS
   ↓
4. LLAMAR A generateSidebarForUser(user)
   ├─ Iterar items base
   ├─ Verificar visibilidad de cada uno
   ├─ Verificar permisos requeridos
   ├─ Filtrar submódulos
   └─ Retornar estructura filtrada
   ↓
5. RENDERIZAR SIDEBAR
   ├─ Solo mostrar items visibles
   ├─ Aplicar estilos a deshabilitados
   ├─ Mostrar badges de contador
   └─ Aplicar eventos onclick
   ↓
6. EN CADA NAVEGACIÓN
   ├─ Verificar permisos de ruta
   ├─ Si no tiene acceso → redirigir a 403
   └─ Si sí → cargar página
```

### 4.7 Pseudocódigo Completo de Validación

```javascript
/**
 * Verificar si usuario puede acceder a un ítem del sidebar
 * @param user - Objeto de usuario con rol y permisos
 * @param item - Ítem del sidebar a validar
 * @return boolean - true si tiene acceso, false si no
 */
FUNCTION canAccessSidebarItem(user, item) {
  
  // Paso 1: Verificar si es admin-only
  IF item.adminOnly THEN
    IF user.role === 'ADMIN' THEN
      RETURN true
    ELSE
      RETURN false
    END IF
  END IF
  
  // Paso 2: Verificar permiso individual
  IF item.permission THEN
    IF user.permissions CONTAINS item.permission THEN
      RETURN true
    ELSE
      RETURN false
    END IF
  END IF
  
  // Paso 3: Verificar múltiples permisos (cualquiera de)
  IF item.anyPermissions THEN
    FOR EACH permission IN item.anyPermissions DO
      IF user.permissions CONTAINS permission THEN
        RETURN true
      END IF
    END FOR
    RETURN false
  END IF
  
  // Paso 4: Por defecto, sí puede acceder
  RETURN true
}

/**
 * Filtrar sidebar para un usuario específico
 * @param baseStructure - Estructura base del sidebar
 * @param user - Objeto del usuario
 * @return array - Estructura filtrada
 */
FUNCTION filterSidebarForUser(baseStructure, user) {
  
  LET filteredSidebar = []
  
  FOR EACH section IN baseStructure DO
    IF canAccessSidebarItem(user, section) THEN
      
      LET filteredSection = COPY section
      filteredSection.children = []
      
      // Filtrar submódulos
      IF section.children THEN
        FOR EACH child IN section.children DO
          IF canAccessSidebarItem(user, child) THEN
            filteredSection.children.push(child)
          END IF
        END FOR
      END IF
      
      // Solo agregar sección si tiene al menos un item
      IF filteredSection.children.length > 0 OR NOT section.children THEN
        filteredSidebar.push(filteredSection)
      END IF
      
    END IF
  END FOR
  
  RETURN filteredSidebar
}
```

---

## 📊 Tabla Resumen Comparativa

```
┌──────────────────────────────┬──────────────┬──────────────┐
│ ASPECTO                      │ ADMINISTRADOR│ OPERADOR     │
├──────────────────────────────┼──────────────┼──────────────┤
│ Secciones visibles           │      6       │      4       │
│ Total de ítems               │     32+      │     15-20*   │
│ Permisos requeridos          │   NINGUNO    │  MÚLTIPLES   │
│ Puede eliminar registros     │      ✓       │      ✗       │
│ Ve costos de productos       │      ✓       │      ✗       │
│ Reportes avanzados           │      ✓       │      ✗       │
│ Configuración sistema        │      ✓       │      ✗       │
│ Auditoria                    │      ✓       │      ✗       │
│ Respaldos                    │      ✓       │      ✗       │
│ Edita propios registros      │      ✓       │      ✓       │
│ Edita registros de otros     │      ✓       │      ✗       │
│ Crear nuevos registros       │      ✓       │    Parcial   │
│ Exportar datos               │      ✓       │      ✓       │
│                                                              │
* = Depende de permisos granulares asignados                 │
└──────────────────────────────┴──────────────┴──────────────┘
```

---

## ✅ Checklist de Implementación

```
PREPARACIÓN
☐ Diseñar estructura base del sidebar (HECHO)
☐ Definir roles del sistema (HECHO)
☐ Crear tabla de permisos (HECHO)
☐ Documentar lógica de acceso (HECHO)

BACKEND
☐ Crear modelo de Usuario en BD
☐ Crear modelo de Rol en BD
☐ Crear modelo de Permiso en BD
☐ Crear tabla relacional Usuario-Permiso
☐ API endpoint: GET /api/auth/me (usuario con permisos)
☐ API endpoint: POST /api/auth/login (retornar permisos)
☐ Middleware: verificar permisos en cada ruta

FRONTEND
☐ Hook useAccess() - obtener permisos del usuario
☐ Hook useSidebarItems() - generar estructura filtrada
☐ Componente Sidebar principal
☐ Componente SidebarSection
☐ Componente SidebarItem
☐ Componente SidebarSubmenu
☐ Componente ProtectedRoute (proteger rutas)
☐ Middleware: redirigir sin permisos

TESTING
☐ Test: ADMIN ve todas las secciones
☐ Test: OPERADOR ve solo permitidas
☐ Test: Sin permiso, ítem oculto
☐ Test: Permisos se cargan correctamente
☐ Test: Badges dinámicos se actualizan
☐ Test: Rutas protegidas redirigen

DOCUMENTACIÓN
☐ Documentar estructura del sidebar
☐ Documentar roles y permisos
☐ Documentar lógica de control
☐ Crear guía de mantenimiento
☐ Crear ejemplos de uso
```

---

## 🎯 Conclusión

Este documento proporciona la **definición completa y profesional** para implementar un sidebar de sistema de gestión web con:

✅ **Estructura clara** y jerárquica  
✅ **Roles definidos** (Administrador, Operador)  
✅ **Permisos granulares** por módulo  
✅ **Lógica de control** implementable  
✅ **Ejemplos prácticos** de código  
✅ **Matriz de decisiones** para visibilidad  

**Estado:** 🟢 LISTO PARA DESARROLLO

---

**Versión:** 1.0.0  
**Última actualización:** 27 de enero de 2026  
**Autor:** Equipo de Desarrollo  
**Clasificación:** Especificación Técnica - Interna
