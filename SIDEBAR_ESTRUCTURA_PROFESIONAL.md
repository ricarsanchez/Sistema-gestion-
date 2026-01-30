# 🧭 Estructura Profesional del Sidebar - Sistema de Gestión Web

**Documento versión:** 1.0.0  
**Fecha:** 27 de enero de 2026  
**Estado:** Documentación Técnica - Listo para Implementación

---

## 📑 Tabla de Contenidos

1. [Estructura General](#1-estructura-general-del-sidebar)
2. [Visibilidad por Roles](#2-visibilidad-por-roles)
3. [Tabla de Permisos Detallada](#3-tabla-de-permisos-por-módulo)
4. [Lógica de Control de Acceso](#4-lógica-de-control-de-acceso)
5. [Menú Completo por Rol](#5-menú-completo-por-rol)
6. [Rutas y Permisos](#6-rutas-y-permisos)
7. [Implementación](#7-implementación)

---

## 1. Estructura General del Sidebar

### 1.1 Jerarquía Visual

```
SIDEBAR
├── HEADER
│   ├── Logo
│   ├── Nombre Empresa
│   └── Toggle Collapse
│
├── USER PROFILE SECTION
│   ├── Avatar
│   ├── Nombre Usuario
│   ├── Rol
│   └── Selector de Empresa
│
├── SEARCH BAR
│   ├── Búsqueda global
│   └── Atajos rápidos
│
├── MAIN NAVIGATION (Dinámico según rol)
│   ├── Dashboard
│   ├── Gestión de Catálogos
│   ├── Operaciones
│   ├── Reportes
│   ├── Administración
│   └── Configuración
│
├── NOTIFICATION SECTION
│   ├── Alertas
│   └── Bandeja de pendientes
│
└── FOOTER
    ├── Soporte
    ├── Documentación
    └── Logout
```

### 1.2 Secciones Principales

```
┌─────────────────────────────────────┐
│ 📊 DASHBOARD                        │
│    • Panel Principal                │
│    • Estadísticas Personales        │
│    • Mis Tareas                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🏪 CATÁLOGOS Y REFERENCIAS         │
│    • Productos                      │
│    • Servicios                      │
│    • Categorías                     │
│    • Unidades de Medida             │
│    • Listas de Precios              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💼 OPERACIONES                      │
│    • Ventas                         │
│    • Remitos                        │
│    • Presupuestos                   │
│    • Clientes                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📈 ANÁLISIS Y REPORTES             │
│    • Reportes Generales             │
│    • Reportes de Ventas             │
│    • Reportes de Inventario         │
│    • Reportes Personalizados        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👥 ADMINISTRACIÓN (Solo Admin)      │
│    • Usuarios                       │
│    • Roles y Permisos               │
│    • Auditoría                      │
│    • Historial de Acceso            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ⚙️ CONFIGURACIÓN (Solo Admin)       │
│    • Parámetros del Sistema         │
│    • Respaldos                      │
│    • Integraciones                  │
│    • Seguridad                      │
└─────────────────────────────────────┘
```

### 1.3 Elementos de Interfaz

```
COMPONENTES VISUALES:

Icon + Label (Expandido)
┌─────────────────────┐
│ 📊 Dashboard        │
└─────────────────────┘

Icon Only (Colapsado)
┌───┐
│ 📊│
└───┘

Con Contador
┌──────────────────────┐
│ 🔔 Notificaciones (3)│
└──────────────────────┘

Submenu Expandido
┌──────────────────────┐
│ 💰 Ventas            │
│   • Nueva Venta      │
│   • Mis Ventas       │
│   • Historial        │
└──────────────────────┘

Estados:
✓ Activo/Actual    → Fondo azul, texto blanco
✗ Deshabilitado    → Gris, no clickeable
🔒 Sin permiso      → Gris, oculto
⚡ Con notificación → Rojo badge
```

---

## 2. Visibilidad por Roles

### 2.1 Matriz de Visibilidad General

```
MÓDULO                  │ ADMINISTRADOR │ OPERADOR
─────────────────────────┼───────────────┼──────────
Dashboard               │       ✓       │    ✓
Catálogos               │       ✓       │    ✓*
Operaciones             │       ✓       │    ✓*
Reportes                │       ✓       │    ✓*
Administración (Usuarios)│       ✓       │    ✗
Administración (Roles)  │       ✓       │    ✗
Administración (Auditoría)│      ✓       │    ✗
Configuración           │       ✓       │    ✗

* = Acceso limitado según permisos granulares
✗ = Acceso denegado
```

### 2.2 Vista del Administrador

**Acceso:** COMPLETO a todos los módulos y funciones

```
MÓDULOS DISPONIBLES:
1. Dashboard Principal
2. Catálogos Completo (todos los catálogos)
3. Operaciones (crear, editar, anular)
4. Reportes Avanzados
5. Gestión de Usuarios
6. Gestión de Roles y Permisos
7. Auditoría y Logs
8. Configuración del Sistema
9. Respaldos y Recuperación
```

### 2.3 Vista del Usuario Operador

**Acceso:** LIMITADO según permisos granulares asignados

```
MÓDULOS DISPONIBLES (Si están permitidos):
1. Dashboard Personal
2. Catálogos (consulta)
3. Operaciones (solo crear/editar propios registros)
4. Reportes Básicos
5. Mi Perfil
```

---

## 3. Tabla de Permisos por Módulo

### 3.1 Permisos Granulares Completos

```
╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: USUARIOS                                                        ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ users.view                   │   ✓   │    ✗     │ Ver lista de usuarios ║
║ users.create                 │   ✓   │    ✗     │ Crear usuario         ║
║ users.edit                   │   ✓   │    ✗     │ Editar usuario        ║
║ users.delete                 │   ✓   │    ✗     │ Eliminar usuario      ║
║ users.change_role            │   ✓   │    ✗     │ Cambiar rol           ║
║ users.reset_password         │   ✓   │    ✗     │ Resetear contraseña   ║
║ users.view_profile           │   ✓   │    ✓     │ Ver propio perfil     ║
║ users.edit_profile           │   ✓   │    ✓     │ Editar propio perfil  ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: PRODUCTOS                                                       ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ products.view                │   ✓   │    ✓     │ Ver productos         ║
║ products.create              │   ✓   │    ✓*    │ Crear producto        ║
║ products.edit                │   ✓   │    ✓*    │ Editar producto       ║
║ products.delete              │   ✓   │    ✗     │ Eliminar producto     ║
║ products.edit_prices         │   ✓   │    ✗     │ Modificar precios     ║
║ products.bulk_import         │   ✓   │    ✓     │ Importar masivo       ║
║ products.export              │   ✓   │    ✓     │ Exportar datos        ║
║ products.view_cost           │   ✓   │    ✗     │ Ver costo             ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: SERVICIOS                                                       ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ services.view                │   ✓   │    ✓     │ Ver servicios         ║
║ services.create              │   ✓   │    ✓     │ Crear servicio        ║
║ services.edit                │   ✓   │    ✓*    │ Editar servicio       ║
║ services.delete              │   ✓   │    ✗     │ Eliminar servicio     ║
║ services.edit_prices         │   ✓   │    ✗     │ Modificar precios     ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: CATÁLOGOS (Categorías, UM, Estados, etc)                      ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ catalogs.view                │   ✓   │    ✓     │ Ver catálogos         ║
║ catalogs.categories.manage   │   ✓   │    ✗     │ ABM Categorías        ║
║ catalogs.units.manage        │   ✓   │    ✗     │ ABM Unidades Medida   ║
║ catalogs.status.manage       │   ✓   │    ✗     │ ABM Estados           ║
║ catalogs.prices_lists.manage │   ✓   │    ✗     │ ABM Listas Precios    ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: PRECIOS                                                         ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ prices.view                  │   ✓   │    ✓     │ Ver precios           ║
║ prices.create                │   ✓   │    ✗     │ Crear lista precios   ║
║ prices.edit                  │   ✓   │    ✗     │ Editar precios        ║
║ prices.delete                │   ✓   │    ✗     │ Eliminar lista        ║
║ prices.apply_discounts       │   ✓   │    ✓     │ Aplicar descuentos     ║
║ prices.view_history          │   ✓   │    ✓     │ Ver historial precios ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: VENTAS                                                          ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ sales.view                   │   ✓   │    ✓     │ Ver ventas            ║
║ sales.view_all               │   ✓   │    ✗     │ Ver todas las ventas   ║
║ sales.create                 │   ✓   │    ✓     │ Crear venta           ║
║ sales.edit                   │   ✓   │    ✓*    │ Editar venta propia   ║
║ sales.edit_other             │   ✓   │    ✗     │ Editar ventas otros   ║
║ sales.delete                 │   ✓   │    ✗     │ Anular venta          ║
║ sales.generate_invoice       │   ✓   │    ✓     │ Generar factura       ║
║ sales.apply_credit           │   ✓   │    ✓*    │ Aplicar crédito       ║
║ sales.export                 │   ✓   │    ✓     │ Exportar datos        ║
║ sales.view_customer_history  │   ✓   │    ✓     │ Ver historial cliente ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: REMITOS                                                         ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ shipping_notes.view          │   ✓   │    ✓     │ Ver remitos           ║
║ shipping_notes.view_all      │   ✓   │    ✗     │ Ver todos remitos     ║
║ shipping_notes.create        │   ✓   │    ✓     │ Crear remito          ║
║ shipping_notes.edit          │   ✓   │    ✓*    │ Editar remito propio  ║
║ shipping_notes.edit_other    │   ✓   │    ✗     │ Editar otros remitos  ║
║ shipping_notes.confirm       │   ✓   │    ✓     │ Confirmar entrega     ║
║ shipping_notes.cancel        │   ✓   │    ✗     │ Anular remito         ║
║ shipping_notes.upload_proof  │   ✓   │    ✓     │ Subir prueba entrega  ║
║ shipping_notes.export        │   ✓   │    ✓     │ Exportar datos        ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: PRESUPUESTOS                                                    ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ quotes.view                  │   ✓   │    ✓     │ Ver presupuestos      ║
║ quotes.view_all              │   ✓   │    ✗     │ Ver todos los presupues║
║ quotes.create                │   ✓   │    ✓     │ Crear presupuesto     ║
║ quotes.edit                  │   ✓   │    ✓*    │ Editar presupuesto    ║
║ quotes.edit_other            │   ✓   │    ✗     │ Editar de otros       ║
║ quotes.duplicate             │   ✓   │    ✓     │ Duplicar presupuesto  ║
║ quotes.convert_to_sale       │   ✓   │    ✓     │ Convertir a venta     ║
║ quotes.reject                │   ✓   │    ✓*    │ Rechazar presupuesto  ║
║ quotes.cancel                │   ✓   │    ✗     │ Anular presupuesto    ║
║ quotes.export                │   ✓   │    ✓     │ Exportar PDF          ║
║ quotes.send_email            │   ✓   │    ✓     │ Enviar por email      ║
║ quotes.track                 │   ✓   │    ✓     │ Hacer seguimiento     ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: ESTADÍSTICAS                                                    ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ analytics.view               │   ✓   │    ✓     │ Ver dashboards básicos ║
║ analytics.view_advanced      │   ✓   │    ✗     │ Gráficos avanzados    ║
║ analytics.reports_basic      │   ✓   │    ✓     │ Reportes básicos      ║
║ analytics.reports_advanced   │   ✓   │    ✗     │ Reportes avanzados    ║
║ analytics.export_reports     │   ✓   │    ✓     │ Exportar reportes     ║
║ analytics.scheduled_reports  │   ✓   │    ✗     │ Reportes programados  ║
║ analytics.alerts             │   ✓   │    ✓     │ Ver alertas           ║
╚═════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════╗
║ MÓDULO: CONFIGURACIÓN DEL SISTEMA                                      ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Permiso                      │ ADMIN │ OPERADOR │ Descripción           ║
╟──────────────────────────────┼───────┼──────────┼───────────────────────╢
║ config.system.view           │   ✓   │    ✗     │ Ver configuración     ║
║ config.system.edit           │   ✓   │    ✗     │ Editar configuración  ║
║ config.security.view         │   ✓   │    ✗     │ Ver seguridad         ║
║ config.security.edit         │   ✓   │    ✗     │ Editar seguridad      ║
║ config.backups.create        │   ✓   │    ✗     │ Crear respaldos       ║
║ config.backups.restore       │   ✓   │    ✗     │ Restaurar respaldos   ║
║ config.integrations          │   ✓   │    ✗     │ Gestionar integraciones║
║ config.audit_logs            │   ✓   │    ✗     │ Ver logs de auditoría ║
║ config.user_preferences      │   ✓   │    ✓     │ Preferencias personales║
╚═════════════════════════════════════════════════════════════════════════╝

LEYENDA:
✓  = Acceso permitido
✗  = Acceso denegado
*  = Acceso condicional (solo propios registros o con aprobación)
```

---

## 4. Lógica de Control de Acceso

### 4.1 Reglas de Visibilidad del Menú (Pseudocódigo)

```javascript
// FUNCIÓN: Determinar qué ítems mostrar en el sidebar
function getSidebarItems(user) {
    let items = [];
    
    // SECCIÓN 1: DASHBOARD (todos pueden ver)
    items.push({
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'BarChart3',
        route: '/dashboard',
        visible: true,
        children: []
    });
    
    // SECCIÓN 2: CATÁLOGOS Y REFERENCIAS
    items.push({
        id: 'catalogs_section',
        label: 'Catálogos',
        icon: 'Boxes',
        visible: hasAnyPermission(user, [
            'products.view',
            'services.view',
            'catalogs.view'
        ]),
        children: [
            {
                id: 'products',
                label: 'Productos',
                route: '/dashboard/products',
                visible: hasPermission(user, 'products.view'),
                disabled: !hasPermission(user, 'products.view')
            },
            {
                id: 'services',
                label: 'Servicios',
                route: '/dashboard/services',
                visible: hasPermission(user, 'services.view'),
                disabled: !hasPermission(user, 'services.view')
            },
            {
                id: 'categories',
                label: 'Categorías',
                route: '/dashboard/categories',
                visible: hasPermission(user, 'catalogs.categories.manage'),
                adminOnly: true
            },
            {
                id: 'units',
                label: 'Unidades de Medida',
                route: '/dashboard/units',
                visible: hasPermission(user, 'catalogs.units.manage'),
                adminOnly: true
            },
            {
                id: 'price_lists',
                label: 'Listas de Precios',
                route: '/dashboard/price-lists',
                visible: hasPermission(user, 'prices.view'),
                disabled: !hasPermission(user, 'prices.edit')
            }
        ]
    });
    
    // SECCIÓN 3: OPERACIONES
    items.push({
        id: 'operations_section',
        label: 'Operaciones',
        icon: 'ShoppingCart',
        visible: hasAnyPermission(user, [
            'sales.view',
            'shipping_notes.view',
            'quotes.view'
        ]),
        children: [
            {
                id: 'sales',
                label: 'Ventas',
                route: '/dashboard/sales',
                badge: getPendingSalesCount(user),
                visible: hasPermission(user, 'sales.view'),
                children: [
                    {
                        label: 'Nueva Venta',
                        route: '/dashboard/sales/new',
                        visible: hasPermission(user, 'sales.create')
                    },
                    {
                        label: 'Mis Ventas',
                        route: '/dashboard/sales/my-sales',
                        visible: hasPermission(user, 'sales.view')
                    },
                    {
                        label: 'Todas las Ventas',
                        route: '/dashboard/sales/all',
                        visible: hasPermission(user, 'sales.view_all'),
                        adminOnly: true
                    }
                ]
            },
            {
                id: 'shipping',
                label: 'Remitos',
                route: '/dashboard/shipping-notes',
                visible: hasPermission(user, 'shipping_notes.view'),
                children: [
                    {
                        label: 'Nuevo Remito',
                        route: '/dashboard/shipping-notes/new',
                        visible: hasPermission(user, 'shipping_notes.create')
                    },
                    {
                        label: 'Pendientes de Entrega',
                        route: '/dashboard/shipping-notes/pending',
                        visible: hasPermission(user, 'shipping_notes.view')
                    }
                ]
            },
            {
                id: 'quotes',
                label: 'Presupuestos',
                route: '/dashboard/quotes',
                visible: hasPermission(user, 'quotes.view'),
                children: [
                    {
                        label: 'Nuevo Presupuesto',
                        route: '/dashboard/quotes/new',
                        visible: hasPermission(user, 'quotes.create')
                    },
                    {
                        label: 'Mis Presupuestos',
                        route: '/dashboard/quotes/my-quotes',
                        visible: hasPermission(user, 'quotes.view')
                    }
                ]
            }
        ]
    });
    
    // SECCIÓN 4: REPORTES
    items.push({
        id: 'reports_section',
        label: 'Reportes',
        icon: 'BarChart',
        visible: hasAnyPermission(user, [
            'analytics.view',
            'analytics.reports_basic'
        ]),
        children: [
            {
                id: 'dashboard_analytics',
                label: 'Dashboard Analítico',
                route: '/dashboard/analytics',
                visible: hasPermission(user, 'analytics.view')
            },
            {
                id: 'reports_sales',
                label: 'Reportes de Ventas',
                route: '/dashboard/reports/sales',
                visible: hasPermission(user, 'analytics.reports_basic')
            },
            {
                id: 'reports_inventory',
                label: 'Reportes de Inventario',
                route: '/dashboard/reports/inventory',
                visible: hasPermission(user, 'analytics.reports_basic')
            },
            {
                id: 'reports_advanced',
                label: 'Reportes Avanzados',
                route: '/dashboard/reports/advanced',
                visible: hasPermission(user, 'analytics.reports_advanced'),
                adminOnly: true
            }
        ]
    });
    
    // SECCIÓN 5: ADMINISTRACIÓN (Solo Admin)
    if (user.role === 'ADMIN') {
        items.push({
            id: 'admin_section',
            label: 'Administración',
            icon: 'Users',
            visible: true,
            adminOnly: true,
            children: [
                {
                    id: 'users_management',
                    label: 'Gestión de Usuarios',
                    route: '/dashboard/admin/users',
                    visible: hasPermission(user, 'users.view'),
                    icon: 'Users'
                },
                {
                    id: 'roles_permissions',
                    label: 'Roles y Permisos',
                    route: '/dashboard/admin/roles',
                    visible: hasPermission(user, 'users.view'),
                    icon: 'Lock'
                },
                {
                    id: 'audit_logs',
                    label: 'Auditoría',
                    route: '/dashboard/admin/audit',
                    visible: hasPermission(user, 'config.audit_logs'),
                    icon: 'FileText'
                }
            ]
        });
    }
    
    // SECCIÓN 6: CONFIGURACIÓN (Solo Admin)
    if (user.role === 'ADMIN') {
        items.push({
            id: 'config_section',
            label: 'Configuración',
            icon: 'Settings',
            visible: true,
            adminOnly: true,
            children: [
                {
                    id: 'system_config',
                    label: 'Configuración del Sistema',
                    route: '/dashboard/config/system',
                    visible: hasPermission(user, 'config.system.view')
                },
                {
                    id: 'backups',
                    label: 'Respaldos',
                    route: '/dashboard/config/backups',
                    visible: hasPermission(user, 'config.backups.create')
                },
                {
                    id: 'security',
                    label: 'Seguridad',
                    route: '/dashboard/config/security',
                    visible: hasPermission(user, 'config.security.view')
                },
                {
                    id: 'integrations',
                    label: 'Integraciones',
                    route: '/dashboard/config/integrations',
                    visible: hasPermission(user, 'config.integrations')
                }
            ]
        });
    }
    
    return items.filter(item => item.visible);
}

// FUNCIÓN: Verificar si usuario tiene un permiso
function hasPermission(user, permission) {
    return user.permissions.includes(permission);
}

// FUNCIÓN: Verificar si usuario tiene cualquiera de varios permisos
function hasAnyPermission(user, permissions) {
    return permissions.some(permission => 
        user.permissions.includes(permission)
    );
}
```

### 4.2 Estructura de Datos - Permisos (JSON)

```json
{
  "user": {
    "id": "usr_001",
    "nombre": "Juan Pérez",
    "email": "juan@ferreteria.com",
    "rol": "OPERADOR",
    "permisos": [
      "dashboard.view",
      "products.view",
      "products.create",
      "products.edit",
      "products.export",
      "services.view",
      "services.create",
      "services.edit",
      "catalogs.view",
      "prices.view",
      "prices.apply_discounts",
      "prices.view_history",
      "sales.view",
      "sales.create",
      "sales.edit",
      "sales.generate_invoice",
      "sales.apply_credit",
      "sales.export",
      "sales.view_customer_history",
      "shipping_notes.view",
      "shipping_notes.create",
      "shipping_notes.edit",
      "shipping_notes.confirm",
      "shipping_notes.upload_proof",
      "shipping_notes.export",
      "quotes.view",
      "quotes.create",
      "quotes.edit",
      "quotes.duplicate",
      "quotes.convert_to_sale",
      "quotes.reject",
      "quotes.export",
      "quotes.send_email",
      "quotes.track",
      "analytics.view",
      "analytics.reports_basic",
      "analytics.export_reports",
      "analytics.alerts",
      "users.view_profile",
      "users.edit_profile",
      "config.user_preferences"
    ],
    "permisos_especiales": {
      "productos_permitidos": null,
      "clientes_permitidos": null,
      "territorios": ["BUENOS AIRES", "GRAN BUENOS AIRES"],
      "limite_descuento_porcentaje": 15,
      "requiere_aprobacion_sobre": 5000
    },
    "activo": true,
    "empresa": "FERRETERIA CENTRAL",
    "fecha_creacion": "2025-06-01",
    "ultimo_acceso": "2026-01-27T14:30:00Z"
  }
}
```

### 4.3 Reglas de Control (Pseudocódigo)

```javascript
// Regla 1: Mostrar item solo si usuario tiene permiso
IF user.permissions CONTAINS 'products.view' THEN
  SHOW 'Productos' en sidebar
ELSE
  HIDE 'Productos' en sidebar
END IF

// Regla 2: Deshabilitar acción sin permiso
IF user.permissions DOES NOT CONTAIN 'products.delete' THEN
  DISABLE botón 'Eliminar' para productos
  SHOW tooltip: "No tiene permiso para eliminar productos"
END IF

// Regla 3: Mostrar solo a administrador
IF user.role === 'ADMIN' THEN
  SHOW sección 'Administración'
  SHOW sección 'Configuración'
ELSE
  HIDE sección 'Administración'
  HIDE sección 'Configuración'
END IF

// Regla 4: Badge de notificaciones
IF user.permissions CONTAINS 'sales.view' THEN
  badge_count = COUNT(ventas_pendientes_del_usuario)
  SHOW badge en 'Ventas' con contador
END IF

// Regla 5: Edición condicional
IF registro.usuario_creador === user.id OR user.role === 'ADMIN' THEN
  ENABLE botón 'Editar'
ELSE
  DISABLE botón 'Editar'
  SHOW tooltip: "Solo el creador puede editar"
END IF

// Regla 6: Visibilidad de campos
IF user.permissions CONTAINS 'products.view_cost' THEN
  SHOW columna 'Costo' en tabla productos
ELSE
  HIDE columna 'Costo'
END IF
```

---

## 5. Menú Completo por Rol

### 5.1 MENÚ DEL ADMINISTRADOR

```
┌─────────────────────────────────────────────────────────────────┐
│                    FERRETERIA CENTRAL                           │
│                                                                 │
│  Admin / Administrador │ Cambiar │ ⚙️ │ 🔔(3) │ 👤 │ 🚪        │
└─────────────────────────────────────────────────────────────────┘

MENÚ PRINCIPAL:

📊 DASHBOARD
   └─ Panel Principal                    [/dashboard]

🏪 CATÁLOGOS Y REFERENCIAS
   ├─ 📦 Productos                       [/dashboard/products]
   ├─ 🔧 Servicios                       [/dashboard/services]
   ├─ 🏷️ Categorías                      [/dashboard/categories] 🔒
   ├─ 📏 Unidades de Medida              [/dashboard/units] 🔒
   └─ 💰 Listas de Precios               [/dashboard/price-lists]

💼 OPERACIONES
   ├─ 💳 Ventas (5 nuevas)
   │   ├─ Crear Nueva Venta              [/dashboard/sales/new]
   │   ├─ Mis Ventas                     [/dashboard/sales/my]
   │   └─ Todas las Ventas               [/dashboard/sales/all]
   │
   ├─ 📦 Remitos (3 pendientes)
   │   ├─ Crear Remito                   [/dashboard/shipping/new]
   │   ├─ Pendientes de Entrega          [/dashboard/shipping/pending]
   │   └─ Historial                      [/dashboard/shipping/history]
   │
   └─ 📄 Presupuestos (2 nuevos)
       ├─ Crear Presupuesto              [/dashboard/quotes/new]
       ├─ Mis Presupuestos               [/dashboard/quotes/my]
       └─ Seguimiento                    [/dashboard/quotes/tracking]

📈 ANÁLISIS Y REPORTES
   ├─ 📊 Dashboard Analítico             [/dashboard/analytics]
   ├─ 📉 Reportes de Ventas              [/dashboard/reports/sales]
   ├─ 📦 Reportes de Inventario          [/dashboard/reports/inventory]
   ├─ 👥 Reportes de Clientes            [/dashboard/reports/customers]
   └─ 🎯 Reportes Avanzados              [/dashboard/reports/advanced] 🔒

👥 ADMINISTRACIÓN 🔒
   ├─ 👤 Gestión de Usuarios             [/dashboard/admin/users]
   ├─ 🔐 Roles y Permisos                [/dashboard/admin/roles]
   └─ 📋 Auditoría                       [/dashboard/admin/audit]

⚙️ CONFIGURACIÓN 🔒
   ├─ 🎛️ Parámetros del Sistema          [/dashboard/config/system]
   ├─ 💾 Respaldos                       [/dashboard/config/backups]
   ├─ 🔒 Seguridad                       [/dashboard/config/security]
   └─ 🔗 Integraciones                   [/dashboard/config/integrations]

ℹ️ SOPORTE
   ├─ ❓ Ayuda                           [/help]
   ├─ 📚 Documentación                   [/docs]
   ├─ 💬 Contacto                        [/contact]
   └─ ℹ️ Acerca de                       [/about]

🔒 = Acceso solo Administrador
(X) = Contador de items nuevos
```

### 5.2 MENÚ DEL USUARIO OPERADOR

```
┌─────────────────────────────────────────────────────────────────┐
│                    FERRETERIA CENTRAL                           │
│                                                                 │
│  Juan Pérez / Operador │ Cambiar │ ⚙️ │ 🔔(1) │ 👤 │ 🚪        │
└─────────────────────────────────────────────────────────────────┘

MENÚ PRINCIPAL:

📊 DASHBOARD
   └─ Panel Personal                     [/dashboard]

🏪 CATÁLOGOS Y REFERENCIAS
   ├─ 📦 Productos                       [/dashboard/products]
   ├─ 🔧 Servicios                       [/dashboard/services]
   └─ 💰 Listas de Precios               [/dashboard/price-lists]

💼 OPERACIONES
   ├─ 💳 Ventas (2 nuevas)
   │   ├─ Crear Nueva Venta              [/dashboard/sales/new]
   │   ├─ Mis Ventas                     [/dashboard/sales/my]
   │   └─ Historial                      [/dashboard/sales/history]
   │
   ├─ 📦 Remitos (1 pendiente)
   │   ├─ Crear Remito                   [/dashboard/shipping/new]
   │   └─ Pendientes de Entrega          [/dashboard/shipping/pending]
   │
   └─ 📄 Presupuestos
       ├─ Crear Presupuesto              [/dashboard/quotes/new]
       ├─ Mis Presupuestos               [/dashboard/quotes/my]
       └─ Seguimiento                    [/dashboard/quotes/tracking]

📈 ANÁLISIS Y REPORTES
   ├─ 📊 Dashboard Analítico             [/dashboard/analytics]
   └─ 📉 Reportes Básicos                [/dashboard/reports/basic]

👤 MI CUENTA
   ├─ 👤 Mi Perfil                       [/dashboard/profile]
   ├─ 🔐 Cambiar Contraseña              [/dashboard/change-password]
   └─ ⚙️ Preferencias                    [/dashboard/preferences]

ℹ️ SOPORTE
   ├─ ❓ Ayuda                           [/help]
   ├─ 📚 Documentación                   [/docs]
   └─ 💬 Contacto                        [/contact]

(X) = Contador de items nuevos
Items administrativos: NO VISIBLES
```

---

## 6. Rutas y Permisos

### 6.1 Mapeo de Rutas y Permisos Requeridos

```
╔════════════════════════════════════════════════════════════════════════╗
║ RUTA                          │ PERMISOS REQUERIDOS                    ║
╟────────────────────────────────┼────────────────────────────────────────╢
║                                                                        ║
║ /dashboard                     │ (acceso general)                      ║
║ /dashboard/analytics           │ analytics.view                        ║
║                                                                        ║
║ CATÁLOGOS                                                              ║
║ ─────────────────────────────────────────────────────────────────────║
║ /dashboard/products            │ products.view                         ║
║ /dashboard/products/new        │ products.view + products.create       ║
║ /dashboard/products/:id        │ products.view                         ║
║ /dashboard/products/:id/edit   │ products.view + products.edit         ║
║ /dashboard/products/:id/delete │ products.view + products.delete       ║
║                                │ (Admin only)                          ║
║ /dashboard/services            │ services.view                         ║
║ /dashboard/services/new        │ services.view + services.create       ║
║ /dashboard/categories          │ catalogs.categories.manage            ║
║ /dashboard/units               │ catalogs.units.manage                 ║
║ /dashboard/price-lists         │ prices.view                           ║
║                                │ prices.edit (para crear/modificar)    ║
║                                                                        ║
║ VENTAS                                                                 ║
║ ─────────────────────────────────────────────────────────────────────║
║ /dashboard/sales               │ sales.view                            ║
║ /dashboard/sales/new           │ sales.view + sales.create             ║
║ /dashboard/sales/my            │ sales.view                            ║
║ /dashboard/sales/all           │ sales.view + sales.view_all           ║
║                                │ (Admin only)                          ║
║ /dashboard/sales/:id           │ sales.view                            ║
║ /dashboard/sales/:id/edit      │ sales.view + sales.edit               ║
║                                │ (solo creador o admin)                ║
║ /dashboard/sales/:id/invoice   │ sales.view + sales.generate_invoice   ║
║                                                                        ║
║ REMITOS                                                                ║
║ ─────────────────────────────────────────────────────────────────────║
║ /dashboard/shipping-notes      │ shipping_notes.view                   ║
║ /dashboard/shipping-notes/new  │ shipping_notes.create                 ║
║ /dashboard/shipping-notes/:id  │ shipping_notes.view                   ║
║ /dashboard/shipping-notes/:id  │ shipping_notes.confirm                ║
║ /confirm                       │ (para confirmar entrega)              ║
║                                                                        ║
║ PRESUPUESTOS                                                           ║
║ ─────────────────────────────────────────────────────────────────────║
║ /dashboard/quotes              │ quotes.view                           ║
║ /dashboard/quotes/new          │ quotes.view + quotes.create           ║
║ /dashboard/quotes/:id          │ quotes.view                           ║
║ /dashboard/quotes/:id/edit     │ quotes.view + quotes.edit             ║
║ /dashboard/quotes/:id/duplicate│ quotes.view + quotes.duplicate        ║
║ /dashboard/quotes/:id/convert  │ quotes.convert_to_sale                ║
║ /dashboard/quotes/:id/export   │ quotes.view + quotes.export           ║
║                                                                        ║
║ REPORTES                                                               ║
║ ─────────────────────────────────────────────────────────────────────║
║ /dashboard/reports/sales       │ analytics.reports_basic               ║
║ /dashboard/reports/inventory   │ analytics.reports_basic               ║
║ /dashboard/reports/customers   │ analytics.reports_basic               ║
║ /dashboard/reports/advanced    │ analytics.reports_advanced            ║
║                                │ (Admin only)                          ║
║                                                                        ║
║ ADMINISTRACIÓN                                                         ║
║ ─────────────────────────────────────────────────────────────────────║
║ /dashboard/admin/users         │ users.view (Admin only)               ║
║ /dashboard/admin/users/new     │ users.create (Admin only)             ║
║ /dashboard/admin/roles         │ users.view (Admin only)               ║
║ /dashboard/admin/audit         │ config.audit_logs (Admin only)        ║
║                                                                        ║
║ CONFIGURACIÓN                                                          ║
║ ─────────────────────────────────────────────────────────────────────║
║ /dashboard/config/system       │ config.system.view (Admin only)       ║
║ /dashboard/config/backups      │ config.backups.create (Admin only)    ║
║ /dashboard/config/security     │ config.security.view (Admin only)     ║
║ /dashboard/config/integrations │ config.integrations (Admin only)      ║
║                                                                        ║
║ PERFIL DE USUARIO                                                      ║
║ ─────────────────────────────────────────────────────────────────────║
║ /dashboard/profile             │ users.view_profile                    ║
║ /dashboard/profile/edit        │ users.edit_profile                    ║
║ /dashboard/change-password     │ users.edit_profile                    ║
║ /dashboard/preferences         │ config.user_preferences               ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 7. Implementación

### 7.1 Hook de React para Control de Acceso

```typescript
// hooks/useAccess.ts
import { useSession } from 'next-auth/react';

interface AccessCheckOptions {
  permission?: string | string[];
  adminOnly?: boolean;
  redirectTo?: string;
}

export function useAccess() {
  const { data: session } = useSession();
  const user = session?.user;

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(p => user.permissions?.includes(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(p => user.permissions?.includes(p));
  };

  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN';
  };

  const canAccess = (options: AccessCheckOptions): boolean => {
    if (!user) return false;

    if (options.adminOnly && !isAdmin()) {
      return false;
    }

    if (options.permission) {
      if (Array.isArray(options.permission)) {
        return hasAnyPermission(options.permission);
      } else {
        return hasPermission(options.permission);
      }
    }

    return true;
  };

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    canAccess
  };
}
```

### 7.2 Componente de Elemento del Menú

```typescript
// components/SidebarItem.tsx
import { useAccess } from '@/hooks/useAccess';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  route?: string;
  permission?: string | string[];
  adminOnly?: boolean;
  badge?: number;
  children?: SidebarItemProps[];
  disabled?: boolean;
}

export function SidebarItem({
  id,
  label,
  icon,
  route,
  permission,
  adminOnly,
  badge,
  children,
  disabled
}: SidebarItemProps) {
  const { canAccess, hasPermission } = useAccess();
  const pathname = usePathname();
  const isActive = route && pathname.startsWith(route);

  // Verificar si el usuario tiene acceso
  if (!canAccess({ permission, adminOnly })) {
    return null;
  }

  const itemClass = `
    flex items-center px-4 py-2 rounded-lg transition-colors
    ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  return (
    <div>
      {route ? (
        <Link href={route} className={itemClass}>
          <span className="mr-3">{icon}</span>
          <span className="flex-1">{label}</span>
          {badge && badge > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2">
              {badge}
            </span>
          )}
        </Link>
      ) : (
        <button disabled={disabled} className={itemClass}>
          <span className="mr-3">{icon}</span>
          <span className="flex-1">{label}</span>
        </button>
      )}

      {children && (
        <div className="pl-4 space-y-1">
          {children
            .filter(child => canAccess({ 
              permission: child.permission, 
              adminOnly: child.adminOnly 
            }))
            .map(child => (
              <SidebarItem key={child.id} {...child} />
            ))}
        </div>
      )}
    </div>
  );
}
```

### 7.3 Hook para Generar Items del Sidebar

```typescript
// hooks/useSidebarItems.ts
import { useAccess } from './useAccess';

export function useSidebarItems() {
  const { hasPermission, isAdmin } = useAccess();

  const getSidebarItems = () => {
    const items: any[] = [];

    // Dashboard
    items.push({
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      route: '/dashboard'
    });

    // Catálogos
    if (hasPermission('products.view') || 
        hasPermission('services.view') || 
        hasPermission('catalogs.view')) {
      items.push({
        id: 'catalogs',
        label: 'Catálogos',
        icon: '🏪',
        children: [
          {
            id: 'products',
            label: 'Productos',
            route: '/dashboard/products',
            permission: 'products.view'
          },
          {
            id: 'services',
            label: 'Servicios',
            route: '/dashboard/services',
            permission: 'services.view'
          },
          {
            id: 'categories',
            label: 'Categorías',
            route: '/dashboard/categories',
            adminOnly: true
          },
          {
            id: 'units',
            label: 'Unidades de Medida',
            route: '/dashboard/units',
            adminOnly: true
          },
          {
            id: 'prices',
            label: 'Listas de Precios',
            route: '/dashboard/price-lists',
            permission: 'prices.view'
          }
        ]
      });
    }

    // Operaciones
    if (hasPermission('sales.view') || 
        hasPermission('shipping_notes.view') || 
        hasPermission('quotes.view')) {
      items.push({
        id: 'operations',
        label: 'Operaciones',
        icon: '💼',
        children: [
          {
            id: 'sales',
            label: 'Ventas',
            route: '/dashboard/sales',
            permission: 'sales.view'
          },
          {
            id: 'shipping',
            label: 'Remitos',
            route: '/dashboard/shipping-notes',
            permission: 'shipping_notes.view'
          },
          {
            id: 'quotes',
            label: 'Presupuestos',
            route: '/dashboard/quotes',
            permission: 'quotes.view'
          }
        ]
      });
    }

    // Reportes
    if (hasPermission('analytics.view') || 
        hasPermission('analytics.reports_basic')) {
      items.push({
        id: 'reports',
        label: 'Reportes',
        icon: '📈',
        route: '/dashboard/reports'
      });
    }

    // Administración (Solo Admin)
    if (isAdmin()) {
      items.push({
        id: 'admin',
        label: 'Administración',
        icon: '👥',
        children: [
          {
            id: 'users',
            label: 'Gestión de Usuarios',
            route: '/dashboard/admin/users',
            adminOnly: true
          },
          {
            id: 'roles',
            label: 'Roles y Permisos',
            route: '/dashboard/admin/roles',
            adminOnly: true
          },
          {
            id: 'audit',
            label: 'Auditoría',
            route: '/dashboard/admin/audit',
            adminOnly: true
          }
        ]
      });
    }

    // Configuración (Solo Admin)
    if (isAdmin()) {
      items.push({
        id: 'config',
        label: 'Configuración',
        icon: '⚙️',
        children: [
          {
            id: 'system',
            label: 'Sistema',
            route: '/dashboard/config/system',
            adminOnly: true
          },
          {
            id: 'backups',
            label: 'Respaldos',
            route: '/dashboard/config/backups',
            adminOnly: true
          },
          {
            id: 'security',
            label: 'Seguridad',
            route: '/dashboard/config/security',
            adminOnly: true
          }
        ]
      });
    }

    return items;
  };

  return { getSidebarItems };
}
```

### 7.4 Middleware de Protección de Rutas

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = {
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/config': ['ADMIN'],
  '/dashboard/users': ['users.view'],
  '/dashboard/products': ['products.view'],
  '/dashboard/sales': ['sales.view'],
  '/dashboard/quotes': ['quotes.view'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // Redirigir a login si no hay token
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar acceso a rutas protegidas
  for (const [route, requiredRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      // Verificar rol o permiso
      const hasAccess = requiredRoles.some(role => {
        if (role === 'ADMIN') {
          return token?.user?.role === 'ADMIN';
        } else {
          return token?.user?.permissions?.includes(role);
        }
      });

      if (!hasAccess) {
        return NextResponse.redirect(new URL('/403', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
```

---

## 8. Checklist de Implementación

### Tareas Técnicas

```
☐ Crear hook useAccess.ts
☐ Crear hook useSidebarItems.ts
☐ Crear componente SidebarItem.tsx
☐ Crear componente Sidebar.tsx (principal)
☐ Integrar NextAuth.js con permisos
☐ Crear esquema de base de datos para usuarios y permisos
☐ Crear API endpoint para obtener permisos del usuario
☐ Implementar middleware de protección de rutas
☐ Crear componente ProtectedRoute
☐ Implementar badge de notificaciones dinámico
☐ Crear sistema de breadcrumb integrado
☐ Implementar búsqueda global en sidebar
☐ Agregar atajos de teclado
☐ Implementar guardado de estado (expandido/colapsado)
☐ Crear responsive design para mobile
☐ Integrar tema oscuro/claro
☐ Agregar animaciones suaves
☐ Implementar fallback si permisos no cargan
☐ Crear tests unitarios
☐ Crear documentación de uso
```

---

## 📌 Resumen Ejecutivo

Se ha proporcionado una **estructura profesional y completa del sidebar** con:

✅ **Jerarquía clara** de módulos y submódulos  
✅ **Dos roles** (Administrador y Usuario Operador)  
✅ **Tabla de permisos granulares** por módulo  
✅ **Lógica de control de acceso** en código (pseudocódigo y TypeScript)  
✅ **Menú visual** para cada rol  
✅ **Mapeo de rutas y permisos** requeridos  
✅ **Implementación práctica** con hooks y componentes  
✅ **Middleware de protección** de rutas  

**Estado:** 🟢 LISTO PARA IMPLEMENTAR EN PRODUCCIÓN

---

**Versión:** 1.0.0  
**Última actualización:** 27 de enero de 2026  
**Autor:** Equipo de Desarrollo  
**Clasificación:** Documentación Técnica - Interna
