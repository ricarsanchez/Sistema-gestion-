# 🔐 Diseño Completo - Base de Datos de Roles y Permisos

**Documento:** Especificación de Base de Datos  
**Versión:** 1.0.0  
**Fecha:** 27 de enero de 2026  
**Estado:** Listo para Implementación  

---

## 📑 Tabla de Contenidos

1. [Tablas Principales](#1-tablas-principales)
2. [Relaciones entre Tablas](#2-relaciones-entre-tablas)
3. [Permisos Granulares](#3-permisos-granulares)
4. [Ejemplos de Registros Iniciales](#4-ejemplos-de-registros-iniciales)
5. [Modelo de Autorización](#5-modelo-de-autorización)

---

## 1. Tablas Principales

### 1.1 Tabla: `users`

Almacena información de los usuarios del sistema.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
  empresa_id INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_ultimo_acceso DATETIME,
  intentos_fallidos INT DEFAULT 0,
  bloqueado_hasta DATETIME,
  requiere_cambio_password BOOLEAN DEFAULT FALSE,
  
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_empresa_id (empresa_id),
  INDEX idx_estado (estado),
  INDEX idx_uuid (uuid)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| uuid | VARCHAR(36) | Identificador único universal para APIs |
| nombre | VARCHAR(100) | Nombre del usuario |
| apellido | VARCHAR(100) | Apellido del usuario |
| email | VARCHAR(255) | Email único del usuario |
| password_hash | VARCHAR(255) | Contraseña hasheada (bcrypt/argon2) |
| estado | ENUM | ACTIVO, INACTIVO, SUSPENDIDO |
| empresa_id | INT | Referencia a la empresa (FK) |
| fecha_creacion | TIMESTAMP | Fecha de creación del usuario |
| fecha_modificacion | TIMESTAMP | Última modificación |
| fecha_ultimo_acceso | DATETIME | Último acceso del usuario |
| intentos_fallidos | INT | Contador de intentos de login fallidos |
| bloqueado_hasta | DATETIME | Fecha hasta la cual el usuario está bloqueado |
| requiere_cambio_password | BOOLEAN | Flag para obligar cambio de contraseña |

---

### 1.2 Tabla: `roles`

Define los roles disponibles en el sistema.

```sql
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  es_predefinido BOOLEAN DEFAULT FALSE,
  empresa_id INT,
  estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  INDEX idx_slug (slug),
  INDEX idx_empresa_id (empresa_id),
  INDEX idx_estado (estado)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| nombre | VARCHAR(100) | Nombre del rol (ej: "Administrador") |
| slug | VARCHAR(100) | Slug único (ej: "admin") |
| descripcion | TEXT | Descripción del rol |
| es_predefinido | BOOLEAN | TRUE si es rol del sistema (no se puede eliminar) |
| empresa_id | INT | NULL para roles globales, INT para roles por empresa |
| estado | ENUM | ACTIVO o INACTIVO |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_modificacion | TIMESTAMP | Última modificación |

---

### 1.3 Tabla: `permissions`

Define los permisos disponibles en el sistema.

```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nombre VARCHAR(150) UNIQUE NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  modulo VARCHAR(50) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  categoria VARCHAR(50),
  es_predefinido BOOLEAN DEFAULT TRUE,
  estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_modulo (modulo),
  INDEX idx_accion (accion),
  INDEX idx_categoria (categoria),
  UNIQUE KEY unique_modulo_accion (modulo, accion)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| nombre | VARCHAR(150) | Nombre completo del permiso |
| slug | VARCHAR(150) | Slug único (ej: "products.view") |
| descripcion | TEXT | Descripción del permiso |
| modulo | VARCHAR(50) | Módulo (ej: "products") |
| accion | VARCHAR(50) | Acción (ej: "view", "create", "edit") |
| categoria | VARCHAR(50) | Categoría (ej: "lectura", "escritura") |
| es_predefinido | BOOLEAN | TRUE si es permiso del sistema |
| estado | ENUM | ACTIVO o INACTIVO |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_modificacion | TIMESTAMP | Última modificación |

---

### 1.4 Tabla: `role_permissions` (Pivot)

Relación muchos a muchos: Roles ↔ Permisos.

```sql
CREATE TABLE role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_role_permission (role_id, permission_id),
  INDEX idx_role_id (role_id),
  INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| role_id | INT | Referencia al rol (FK) |
| permission_id | INT | Referencia al permiso (FK) |
| fecha_asignacion | TIMESTAMP | Fecha de asignación del permiso al rol |

---

### 1.5 Tabla: `user_roles` (Pivot)

Relación muchos a muchos: Usuarios ↔ Roles.

```sql
CREATE TABLE user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion DATETIME,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_role (user_id, role_id),
  INDEX idx_user_id (user_id),
  INDEX idx_role_id (role_id),
  INDEX idx_fecha_expiracion (fecha_expiracion)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| user_id | INT | Referencia al usuario (FK) |
| role_id | INT | Referencia al rol (FK) |
| fecha_asignacion | TIMESTAMP | Fecha de asignación del rol al usuario |
| fecha_expiracion | DATETIME | Fecha de expiración del rol (opcional) |

---

### 1.6 Tabla: `user_permissions`

Permisos individuales directos para usuarios (opcional, para excepciones).

```sql
CREATE TABLE user_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT NOT NULL,
  permission_id INT NOT NULL,
  tipo ENUM('PERMITIR', 'DENEGAR') DEFAULT 'PERMITIR',
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion DATETIME,
  razon TEXT,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_permission (user_id, permission_id),
  INDEX idx_user_id (user_id),
  INDEX idx_permission_id (permission_id),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| user_id | INT | Referencia al usuario (FK) |
| permission_id | INT | Referencia al permiso (FK) |
| tipo | ENUM | PERMITIR (otorga permiso) o DENEGAR (niega permiso) |
| fecha_asignacion | TIMESTAMP | Fecha de asignación |
| fecha_expiracion | DATETIME | Fecha de expiración |
| razon | TEXT | Motivo de la asignación |

---

### 1.7 Tabla: `audit_logs`

Registro de auditoría de cambios en roles y permisos.

```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  usuario_id INT,
  tabla_afectada VARCHAR(100) NOT NULL,
  tipo_operacion ENUM('INSERT', 'UPDATE', 'DELETE', 'ASIGNACION') NOT NULL,
  registro_id INT,
  datos_anteriores JSON,
  datos_nuevos JSON,
  ip_direccion VARCHAR(45),
  user_agent TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tabla_afectada (tabla_afectada),
  INDEX idx_tipo_operacion (tipo_operacion),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_fecha_creacion (fecha_creacion)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| usuario_id | INT | Usuario que realizó la operación |
| tabla_afectada | VARCHAR(100) | Tabla que fue modificada |
| tipo_operacion | ENUM | INSERT, UPDATE, DELETE, ASIGNACION |
| registro_id | INT | ID del registro afectado |
| datos_anteriores | JSON | Datos anteriores (para UPDATE/DELETE) |
| datos_nuevos | JSON | Datos nuevos (para INSERT/UPDATE) |
| ip_direccion | VARCHAR(45) | IP del usuario |
| user_agent | TEXT | User-Agent del navegador |
| fecha_creacion | TIMESTAMP | Fecha de la operación |

---

### 1.8 Tabla: `empresas` (Referencia)

Tabla de empresas (necesaria como FK para multi-empresa).

```sql
CREATE TABLE empresas (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  razon_social VARCHAR(255),
  cuit VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  telefono VARCHAR(20),
  estado ENUM('ACTIVA', 'INACTIVA', 'SUSPENDIDA') DEFAULT 'ACTIVA',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_nombre (nombre),
  INDEX idx_estado (estado)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 2. Relaciones entre Tablas

### 2.1 Diagrama Entidad-Relación

```
┌─────────────┐
│   EMPRESAS  │
│   (1)       │
└──────┬──────┘
       │
       │ 1:N
       │
   ┌───┴─────────────────────┐
   │                         │
┌──▼──────────┐      ┌──────▼──────┐
│   USERS     │      │    ROLES    │
│   (N)       │      │    (N)      │
└──┬──────────┘      └──────┬──────┘
   │                        │
   │ N:M                    │ N:M
   │                        │
   │  ┌───────────────────┐ │
   │  │  USER_ROLES       │ │
   │  │   (Pivot)         │ │
   │  └───────────────────┘ │
   │                        │
   │                    ┌───▼────────────────┐
   │                    │ ROLE_PERMISSIONS  │
   │                    │    (Pivot)        │
   │                    └───┬────────────────┘
   │                        │
   │                    ┌───▼──────────────┐
   │                    │  PERMISSIONS    │
   │                    │    (M)          │
   │                    └─────────────────┘
   │
   └──────────────────────┐
                          │
              ┌───────────▼─────────────┐
              │ USER_PERMISSIONS       │
              │  (Permisos directos)   │
              │    (Opcional)          │
              └───────────────────────┘
```

### 2.2 Relaciones Detalladas

#### **Relación 1: Usuarios ↔ Roles (N:M)**

```
users (1) ──→ user_roles (N) ←─ roles (1)

Descripción:
- Un usuario puede tener múltiples roles
- Un rol puede ser asignado a múltiples usuarios
- La tabla pivot es "user_roles"
- Permite fecha de expiración (roles temporales)

Ejemplo:
  Usuario "Juan Pérez" puede tener roles:
  - Administrador
  - Vendedor (con expiracion)
```

#### **Relación 2: Roles ↔ Permisos (N:M)**

```
roles (1) ──→ role_permissions (N) ←─ permissions (1)

Descripción:
- Un rol puede tener múltiples permisos
- Un permiso puede pertenecer a múltiples roles
- La tabla pivot es "role_permissions"
- Define permisos por defecto de cada rol

Ejemplo:
  Rol "Administrador" tiene permisos:
  - users.view
  - users.create
  - users.edit
  - users.delete
  - (todos los permisos)
```

#### **Relación 3: Usuarios ↔ Permisos (N:M, Opcional)**

```
users (1) ──→ user_permissions (N) ←─ permissions (1)

Descripción:
- Un usuario puede tener permisos directos (excepciones)
- Permite otorgar/negar permisos individuales
- Tipo: PERMITIR o DENEGAR (supera permisos del rol)
- Uso: Excepciones y permisos especiales

Ejemplo:
  Usuario "Ana García" tiene:
  - Rol: Operador
  - Permiso especial: reports.view_all (PERMITIR)
  - Permiso especial: config.edit (DENEGAR)
```

### 2.3 Cómo se Combinan Roles y Permisos

```javascript
ALGORITMO: Obtener permisos de un usuario

FUNCTION getPermissionsForUser(userId) {
  LET permissions = []
  
  // PASO 1: Obtener roles del usuario
  LET roles = SELECT role_id FROM user_roles
              WHERE user_id = userId 
              AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())
  
  // PASO 2: Obtener permisos de cada rol
  FOR EACH role IN roles DO
    LET rolePermissions = SELECT permission_id FROM role_permissions
                          WHERE role_id = role
    permissions.addAll(rolePermissions)
  END FOR
  
  // PASO 3: Aplicar permisos individuales del usuario
  LET userPermissions = SELECT permission_id, tipo FROM user_permissions
                        WHERE user_id = userId
                        AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())
  
  FOR EACH userPerm IN userPermissions DO
    IF userPerm.tipo = 'PERMITIR' THEN
      permissions.add(userPerm.permission_id)
    ELSE IF userPerm.tipo = 'DENEGAR' THEN
      permissions.remove(userPerm.permission_id)
    END IF
  END FOR
  
  // PASO 4: Retornar lista única de permisos
  RETURN permissions.unique()
}

ALGORITMO: Verificar si usuario tiene permiso

FUNCTION hasPermission(userId, permissionSlug) {
  LET permissions = getPermissionsForUser(userId)
  LET permission = SELECT id FROM permissions WHERE slug = permissionSlug
  
  RETURN permissions.contains(permission.id)
}
```

---

## 3. Permisos Granulares

### 3.1 Tabla Completa de Permisos por Módulo

```sql
-- MÓDULO: USUARIOS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Usuarios', 'users.view', 'Ver lista de usuarios', 'usuarios', 'ver', 'lectura'),
('Crear Usuario', 'users.create', 'Crear nuevo usuario', 'usuarios', 'crear', 'escritura'),
('Editar Usuario', 'users.edit', 'Editar datos de usuario', 'usuarios', 'editar', 'escritura'),
('Eliminar Usuario', 'users.delete', 'Eliminar usuario', 'usuarios', 'eliminar', 'escritura'),
('Cambiar Rol', 'users.change_role', 'Cambiar rol de usuario', 'usuarios', 'cambiar_rol', 'escritura'),
('Resetear Contraseña', 'users.reset_password', 'Resetear contraseña de usuario', 'usuarios', 'resetear_password', 'escritura'),
('Ver Perfil Propio', 'users.view_profile', 'Ver perfil del usuario actual', 'usuarios', 'ver_perfil', 'lectura'),
('Editar Perfil Propio', 'users.edit_profile', 'Editar perfil del usuario actual', 'usuarios', 'editar_perfil', 'escritura'),
('Ver Historial de Acceso', 'users.view_login_history', 'Ver historial de login', 'usuarios', 'ver_historial', 'lectura'),
('Habilitar/Deshabilitar Usuario', 'users.toggle_active', 'Activar o desactivar usuario', 'usuarios', 'toggle', 'escritura'),
('Ver Permisos de Usuario', 'users.view_permissions', 'Ver permisos asignados a usuario', 'usuarios', 'ver_permisos', 'lectura');

-- MÓDULO: PRODUCTOS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Productos', 'products.view', 'Ver lista de productos', 'productos', 'ver', 'lectura'),
('Crear Producto', 'products.create', 'Crear nuevo producto', 'productos', 'crear', 'escritura'),
('Editar Producto', 'products.edit', 'Editar datos del producto', 'productos', 'editar', 'escritura'),
('Eliminar Producto', 'products.delete', 'Eliminar producto', 'productos', 'eliminar', 'escritura'),
('Ver Costo del Producto', 'products.view_cost', 'Ver costo/precio de compra', 'productos', 'ver_costo', 'lectura'),
('Editar Precio del Producto', 'products.edit_prices', 'Modificar precios', 'productos', 'editar_precios', 'escritura'),
('Importar Masivo', 'products.bulk_import', 'Importar productos en lote', 'productos', 'importar', 'escritura'),
('Exportar Productos', 'products.export', 'Exportar productos a archivo', 'productos', 'exportar', 'lectura'),
('Ver Historial de Cambios', 'products.view_history', 'Ver historial de modificaciones', 'productos', 'ver_historial', 'lectura'),
('Gestionar Proveedores', 'products.manage_vendors', 'Crear/editar proveedores', 'productos', 'gestionar_proveedores', 'escritura'),
('Ver Alertas de Stock', 'products.stock_alerts', 'Ver alertas de stock bajo', 'productos', 'alertas', 'lectura'),
('Marcar Producto como Descontinuado', 'products.discontinue', 'Marcar producto como discontinuado', 'productos', 'descontinuar', 'escritura');

-- MÓDULO: SERVICIOS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Servicios', 'services.view', 'Ver lista de servicios', 'servicios', 'ver', 'lectura'),
('Crear Servicio', 'services.create', 'Crear nuevo servicio', 'servicios', 'crear', 'escritura'),
('Editar Servicio', 'services.edit', 'Editar datos del servicio', 'servicios', 'editar', 'escritura'),
('Eliminar Servicio', 'services.delete', 'Eliminar servicio', 'servicios', 'eliminar', 'escritura'),
('Editar Precio de Servicio', 'services.edit_prices', 'Modificar precios de servicios', 'servicios', 'editar_precios', 'escritura'),
('Ver Historial de Tarifas', 'services.price_history', 'Ver historial de precios', 'servicios', 'ver_historial', 'lectura');

-- MÓDULO: CATÁLOGOS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Catálogos', 'catalogs.view', 'Ver catálogos disponibles', 'catalogos', 'ver', 'lectura'),
('Crear Categoría', 'catalogs.categories.create', 'Crear nueva categoría', 'catalogos', 'crear_categoria', 'escritura'),
('Editar Categoría', 'catalogs.categories.edit', 'Editar categoría', 'catalogos', 'editar_categoria', 'escritura'),
('Eliminar Categoría', 'catalogs.categories.delete', 'Eliminar categoría', 'catalogos', 'eliminar_categoria', 'escritura'),
('Crear Unidad de Medida', 'catalogs.units.create', 'Crear unidad de medida', 'catalogos', 'crear_unidad', 'escritura'),
('Editar Unidad de Medida', 'catalogs.units.edit', 'Editar unidad de medida', 'catalogos', 'editar_unidad', 'escritura'),
('Eliminar Unidad de Medida', 'catalogs.units.delete', 'Eliminar unidad de medida', 'catalogos', 'eliminar_unidad', 'escritura'),
('Crear Estado', 'catalogs.status.create', 'Crear estado de documento', 'catalogos', 'crear_estado', 'escritura'),
('Editar Estado', 'catalogs.status.edit', 'Editar estado', 'catalogos', 'editar_estado', 'escritura'),
('Eliminar Estado', 'catalogs.status.delete', 'Eliminar estado', 'catalogos', 'eliminar_estado', 'escritura');

-- MÓDULO: PRECIOS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Precios', 'prices.view', 'Ver listas de precios', 'precios', 'ver', 'lectura'),
('Crear Lista de Precios', 'prices.create', 'Crear lista de precios', 'precios', 'crear', 'escritura'),
('Editar Precios', 'prices.edit', 'Editar precios en lista', 'precios', 'editar', 'escritura'),
('Eliminar Lista de Precios', 'prices.delete', 'Eliminar lista de precios', 'precios', 'eliminar', 'escritura'),
('Aplicar Descuentos', 'prices.apply_discounts', 'Aplicar descuentos a precios', 'precios', 'descuentos', 'escritura'),
('Ver Historial de Precios', 'prices.view_history', 'Ver cambios históricos', 'precios', 'ver_historial', 'lectura'),
('Exportar Lista de Precios', 'prices.export', 'Exportar a archivo', 'precios', 'exportar', 'lectura'),
('Actualizar Precios en Lote', 'prices.bulk_update', 'Actualizar múltiples precios', 'precios', 'actualizar_masivo', 'escritura');

-- MÓDULO: VENTAS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Ventas Propias', 'sales.view', 'Ver propias ventas', 'ventas', 'ver', 'lectura'),
('Ver Todas las Ventas', 'sales.view_all', 'Ver todas las ventas del sistema', 'ventas', 'ver_todas', 'lectura'),
('Ver Costo de Venta', 'sales.view_cost', 'Ver costo de las ventas', 'ventas', 'ver_costo', 'lectura'),
('Crear Venta', 'sales.create', 'Crear nueva venta', 'ventas', 'crear', 'escritura'),
('Editar Venta Propia', 'sales.edit', 'Editar propia venta', 'ventas', 'editar', 'escritura'),
('Editar Venta de Otro', 'sales.edit_other', 'Editar venta de otro usuario', 'ventas', 'editar_otra', 'escritura'),
('Anular Venta', 'sales.cancel', 'Cancelar/anular venta', 'ventas', 'anular', 'escritura'),
('Generar Factura', 'sales.generate_invoice', 'Generar factura de venta', 'ventas', 'factura', 'escritura'),
('Aplicar Crédito', 'sales.apply_credit', 'Aplicar crédito a venta', 'ventas', 'credito', 'escritura'),
('Procesar Devolución', 'sales.process_return', 'Procesar devolución', 'ventas', 'devolucion', 'escritura'),
('Exportar Venta', 'sales.export', 'Exportar venta a PDF/Excel', 'ventas', 'exportar', 'lectura'),
('Ver Historial de Cliente', 'sales.view_customer_history', 'Ver historial de compras', 'ventas', 'ver_historial', 'lectura'),
('Cambiar Cliente de Venta', 'sales.change_customer', 'Cambiar cliente de venta', 'ventas', 'cambiar_cliente', 'escritura'),
('Aplicar Descuento Especial', 'sales.special_discount', 'Aplicar descuento no estándar', 'ventas', 'descuento_especial', 'escritura');

-- MÓDULO: REMITOS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Remitos Propios', 'shipping.view', 'Ver propios remitos', 'remitos', 'ver', 'lectura'),
('Ver Todos los Remitos', 'shipping.view_all', 'Ver todos los remitos', 'remitos', 'ver_todos', 'lectura'),
('Crear Remito', 'shipping.create', 'Crear nuevo remito', 'remitos', 'crear', 'escritura'),
('Editar Remito Propio', 'shipping.edit', 'Editar propio remito', 'remitos', 'editar', 'escritura'),
('Editar Remito de Otro', 'shipping.edit_other', 'Editar remito de otro usuario', 'remitos', 'editar_otro', 'escritura'),
('Confirmar Entrega', 'shipping.confirm', 'Confirmar entrega de remito', 'remitos', 'confirmar', 'escritura'),
('Anular Remito', 'shipping.cancel', 'Cancelar remito', 'remitos', 'anular', 'escritura'),
('Registrar Firma', 'shipping.sign', 'Registrar firma del cliente', 'remitos', 'firma', 'escritura'),
('Subir Prueba de Entrega', 'shipping.upload_proof', 'Subir fotos/documentos de entrega', 'remitos', 'prueba', 'escritura'),
('Exportar Remito', 'shipping.export', 'Exportar remito a PDF', 'remitos', 'exportar', 'lectura'),
('Generar Código QR', 'shipping.generate_qr', 'Generar código QR', 'remitos', 'qr', 'lectura'),
('Ver Historial de Entregas', 'shipping.view_history', 'Ver historial de entregas', 'remitos', 'ver_historial', 'lectura');

-- MÓDULO: PRESUPUESTOS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Presupuestos Propios', 'quotes.view', 'Ver propios presupuestos', 'presupuestos', 'ver', 'lectura'),
('Ver Todos los Presupuestos', 'quotes.view_all', 'Ver todos los presupuestos', 'presupuestos', 'ver_todos', 'lectura'),
('Crear Presupuesto', 'quotes.create', 'Crear nuevo presupuesto', 'presupuestos', 'crear', 'escritura'),
('Editar Presupuesto Propio', 'quotes.edit', 'Editar propio presupuesto', 'presupuestos', 'editar', 'escritura'),
('Editar Presupuesto de Otro', 'quotes.edit_other', 'Editar presupuesto de otro', 'presupuestos', 'editar_otro', 'escritura'),
('Duplicar Presupuesto', 'quotes.duplicate', 'Crear copia de presupuesto', 'presupuestos', 'duplicar', 'escritura'),
('Convertir a Venta', 'quotes.convert_to_sale', 'Convertir presupuesto a venta', 'presupuestos', 'convertir', 'escritura'),
('Rechazar Presupuesto', 'quotes.reject', 'Rechazar presupuesto', 'presupuestos', 'rechazar', 'escritura'),
('Anular Presupuesto', 'quotes.cancel', 'Anular presupuesto', 'presupuestos', 'anular', 'escritura'),
('Exportar Presupuesto', 'quotes.export', 'Exportar presupuesto a PDF', 'presupuestos', 'exportar', 'lectura'),
('Enviar por Email', 'quotes.send_email', 'Enviar presupuesto por email', 'presupuestos', 'email', 'escritura'),
('Hacer Seguimiento', 'quotes.track', 'Registrar seguimiento', 'presupuestos', 'seguimiento', 'escritura'),
('Cambiar Fecha de Vigencia', 'quotes.change_expiry', 'Cambiar fecha de vencimiento', 'presupuestos', 'cambiar_fecha', 'escritura'),
('Aplicar Descuentos', 'quotes.apply_discounts', 'Aplicar descuentos a presupuesto', 'presupuestos', 'descuentos', 'escritura');

-- MÓDULO: ESTADÍSTICAS
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Dashboard Básico', 'analytics.view', 'Acceder a dashboard', 'estadisticas', 'ver', 'lectura'),
('Ver Gráficos Avanzados', 'analytics.advanced_charts', 'Ver gráficos avanzados', 'estadisticas', 'graficos', 'lectura'),
('Generar Reportes Básicos', 'analytics.reports_basic', 'Generar reportes básicos', 'estadisticas', 'reportes_basicos', 'lectura'),
('Generar Reportes Avanzados', 'analytics.reports_advanced', 'Generar reportes avanzados', 'estadisticas', 'reportes_avanzados', 'lectura'),
('Exportar Reportes', 'analytics.export_reports', 'Exportar reportes a archivo', 'estadisticas', 'exportar', 'lectura'),
('Crear Reportes Personalizados', 'analytics.custom_reports', 'Crear reportes personalizados', 'estadisticas', 'reportes_custom', 'escritura'),
('Programar Reportes', 'analytics.scheduled_reports', 'Agendar envío de reportes', 'estadisticas', 'programar', 'escritura'),
('Ver Alertas', 'analytics.alerts', 'Ver alertas del sistema', 'estadisticas', 'alertas', 'lectura'),
('Crear Alertas', 'analytics.create_alerts', 'Crear alertas personalizadas', 'estadisticas', 'crear_alertas', 'escritura'),
('Comparar Períodos', 'analytics.compare_periods', 'Comparar períodos', 'estadisticas', 'comparar', 'lectura'),
('Descargar Datos Raw', 'analytics.download_raw', 'Descargar datos sin procesar', 'estadisticas', 'descargar', 'lectura');

-- MÓDULO: CONFIGURACIÓN DEL SISTEMA
INSERT INTO permissions (nombre, slug, descripcion, modulo, accion, categoria) VALUES
('Ver Parámetros del Sistema', 'config.system.view', 'Ver configuración del sistema', 'configuracion', 'ver', 'lectura'),
('Editar Parámetros del Sistema', 'config.system.edit', 'Editar configuración', 'configuracion', 'editar', 'escritura'),
('Ver Configuración de Seguridad', 'config.security.view', 'Ver seguridad', 'configuracion', 'ver_seguridad', 'lectura'),
('Editar Configuración de Seguridad', 'config.security.edit', 'Editar seguridad', 'configuracion', 'editar_seguridad', 'escritura'),
('Ver Logs de Auditoría', 'config.audit_logs', 'Ver auditoría completa', 'configuracion', 'ver_auditoria', 'lectura'),
('Exportar Logs de Auditoría', 'config.export_logs', 'Exportar logs a archivo', 'configuracion', 'exportar_logs', 'lectura'),
('Crear Respaldo', 'config.backups.create', 'Crear respaldo de BD', 'configuracion', 'crear_respaldo', 'escritura'),
('Ver Respaldos', 'config.backups.view', 'Ver lista de respaldos', 'configuracion', 'ver_respaldos', 'lectura'),
('Restaurar Respaldo', 'config.backups.restore', 'Restaurar desde respaldo', 'configuracion', 'restaurar', 'escritura'),
('Eliminar Respaldo', 'config.backups.delete', 'Eliminar respaldo', 'configuracion', 'eliminar_respaldo', 'escritura'),
('Configurar Integraciones', 'config.integrations', 'Gestionar integraciones', 'configuracion', 'integraciones', 'escritura'),
('Ver Historial de Cambios', 'config.view_changelog', 'Ver changelog del sistema', 'configuracion', 'ver_changelog', 'lectura'),
('Preferencias Personales', 'config.user_preferences', 'Editar preferencias personales', 'configuracion', 'preferencias', 'escritura');
```

### 3.2 Tabla Resumen de Permisos

```
┌─────────────────┬────────┬────────────┬──────────┐
│ MÓDULO          │ TOTAL  │ LECTURA    │ ESCRITURA│
├─────────────────┼────────┼────────────┼──────────┤
│ Usuarios        │   11   │     3      │    8     │
│ Productos       │   12   │     5      │    7     │
│ Servicios       │    6   │     2      │    4     │
│ Catálogos       │   10   │     1      │    9     │
│ Precios         │    8   │     3      │    5     │
│ Ventas          │   14   │     3      │   11     │
│ Remitos         │   12   │     3      │    9     │
│ Presupuestos    │   14   │     1      │   13     │
│ Estadísticas    │   11   │     6      │    5     │
│ Configuración   │   13   │     4      │    9     │
├─────────────────┼────────┼────────────┼──────────┤
│ TOTAL GENERAL   │  111   │    31      │   80     │
└─────────────────┴────────┴────────────┴──────────┘
```

---

## 4. Ejemplos de Registros Iniciales

### 4.1 Insertar Empresa

```sql
INSERT INTO empresas (nombre, razon_social, cuit, email, telefono, estado)
VALUES 
('Ferretería Central', 'Ferretería Central S.A.', '20-12345678-5', 'info@ferreteria.com', '011-4000-0000', 'ACTIVA');

-- Obtener ID de la empresa
SET @empresa_id = LAST_INSERT_ID();
```

### 4.2 Crear Roles Base

```sql
INSERT INTO roles (nombre, slug, descripcion, es_predefinido, empresa_id, estado) VALUES
('Administrador', 'admin', 'Acceso total al sistema', TRUE, NULL, 'ACTIVO'),
('Usuario Operador', 'operador', 'Acceso limitado según permisos', TRUE, NULL, 'ACTIVO'),
('Vendedor', 'vendedor', 'Acceso a ventas y consulta de catálogos', FALSE, @empresa_id, 'ACTIVO'),
('Reportero', 'reportero', 'Solo acceso a reportes y estadísticas', FALSE, @empresa_id, 'ACTIVO');

-- Obtener IDs de roles
SET @rol_admin = (SELECT id FROM roles WHERE slug = 'admin');
SET @rol_operador = (SELECT id FROM roles WHERE slug = 'operador');
SET @rol_vendedor = (SELECT id FROM roles WHERE slug = 'vendedor');
```

### 4.3 Asignar Permisos al Rol Admin (TODOS)

```sql
-- El rol Admin obtiene TODOS los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT @rol_admin, id FROM permissions WHERE estado = 'ACTIVO';
```

### 4.4 Asignar Permisos al Rol Operador (MÍNIMOS)

```sql
INSERT INTO role_permissions (role_id, permission_id)
SELECT @rol_operador, id FROM permissions 
WHERE slug IN (
  -- Dashboard
  'dashboard.view',
  
  -- Catálogos (consulta)
  'products.view',
  'services.view',
  'catalogs.view',
  'prices.view',
  
  -- Ventas (crear/editar propios)
  'sales.view',
  'sales.create',
  'sales.edit',
  'sales.generate_invoice',
  'sales.export',
  'sales.view_customer_history',
  
  -- Remitos (crear/editar propios)
  'shipping.view',
  'shipping.create',
  'shipping.edit',
  'shipping.confirm',
  'shipping.export',
  
  -- Presupuestos
  'quotes.view',
  'quotes.create',
  'quotes.edit',
  'quotes.duplicate',
  'quotes.convert_to_sale',
  'quotes.export',
  'quotes.send_email',
  'quotes.track',
  
  -- Estadísticas (básico)
  'analytics.view',
  'analytics.reports_basic',
  'analytics.export_reports',
  'analytics.alerts',
  
  -- Perfil
  'users.view_profile',
  'users.edit_profile',
  'config.user_preferences'
);
```

### 4.5 Asignar Permisos al Rol Vendedor

```sql
INSERT INTO role_permissions (role_id, permission_id)
SELECT @rol_vendedor, id FROM permissions 
WHERE slug IN (
  'products.view',
  'services.view',
  'sales.view',
  'sales.create',
  'sales.edit',
  'sales.generate_invoice',
  'sales.export',
  'sales.view_customer_history',
  'quotes.view',
  'quotes.create',
  'quotes.edit',
  'analytics.view',
  'users.view_profile',
  'users.edit_profile',
  'config.user_preferences'
);
```

### 4.6 Crear Usuarios de Prueba

```sql
INSERT INTO users (uuid, nombre, apellido, email, password_hash, estado, empresa_id)
VALUES
(
  UUID(),
  'Juan',
  'Pérez',
  'juan.perez@ferreteria.com',
  '$2y$10$N9qo8uLOickgx2ZMRZoMyeCsxcx7IUUVo7FVMv59pLXO.uHVPOXZW', -- password: 123456789
  'ACTIVO',
  @empresa_id
),
(
  UUID(),
  'María',
  'García',
  'maria.garcia@ferreteria.com',
  '$2y$10$N9qo8uLOickgx2ZMRZoMyeCsxcx7IUUVo7FVMv59pLXO.uHVPOXZW',
  'ACTIVO',
  @empresa_id
),
(
  UUID(),
  'Carlos',
  'López',
  'carlos.lopez@ferreteria.com',
  '$2y$10$N9qo8uLOickgx2ZMRZoMyeCsxcx7IUUVo7FVMv59pLXO.uHVPOXZW',
  'ACTIVO',
  @empresa_id
);

-- Obtener IDs de usuarios
SET @user_juan = (SELECT id FROM users WHERE email = 'juan.perez@ferreteria.com');
SET @user_maria = (SELECT id FROM users WHERE email = 'maria.garcia@ferreteria.com');
SET @user_carlos = (SELECT id FROM users WHERE email = 'carlos.lopez@ferreteria.com');
```

### 4.7 Asignar Roles a Usuarios

```sql
-- Juan es Administrador
INSERT INTO user_roles (user_id, role_id) VALUES (@user_juan, @rol_admin);

-- María es Operadora
INSERT INTO user_roles (user_id, role_id) VALUES (@user_maria, @rol_operador);

-- Carlos es Vendedor
INSERT INTO user_roles (user_id, role_id) VALUES (@user_carlos, @rol_vendedor);
```

### 4.8 Asignar Permisos Directos (Excepciones)

```sql
-- María obtiene permiso especial para ver reportes avanzados
INSERT INTO user_permissions (user_id, permission_id, tipo, razon)
SELECT @user_maria, id, 'PERMITIR', 'Análisis especial solicitado por gerencia'
FROM permissions WHERE slug = 'analytics.reports_advanced';

-- Carlos NO puede ver costos de productos
INSERT INTO user_permissions (user_id, permission_id, tipo, razon)
SELECT @user_carlos, id, 'DENEGAR', 'Por políticas de confidencialidad'
FROM permissions WHERE slug = 'products.view_cost';
```

### 4.9 Query para Obtener Permisos de un Usuario

```sql
-- QUERY: Obtener todos los permisos de un usuario
SELECT DISTINCT p.id, p.nombre, p.slug, p.modulo, p.accion
FROM permissions p
WHERE (
  -- Permisos del rol del usuario
  p.id IN (
    SELECT rp.permission_id
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = @user_id
    AND (ur.fecha_expiracion IS NULL OR ur.fecha_expiracion > NOW())
  )
  -- UNIÓN con permisos directos PERMITIR
  OR (
    p.id IN (
      SELECT up.permission_id
      FROM user_permissions up
      WHERE up.user_id = @user_id
      AND up.tipo = 'PERMITIR'
      AND (up.fecha_expiracion IS NULL OR up.fecha_expiracion > NOW())
    )
  )
)
-- EXCEPTO permisos directos DENEGAR
AND p.id NOT IN (
  SELECT up.permission_id
  FROM user_permissions up
  WHERE up.user_id = @user_id
  AND up.tipo = 'DENEGAR'
  AND (up.fecha_expiracion IS NULL OR up.fecha_expiracion > NOW())
)
ORDER BY p.modulo, p.accion;
```

---

## 5. Modelo de Autorización

### 5.1 Cómo se Valida un Permiso

#### **Paso 1: Obtener Usuario Autenticado**

```sql
-- En cada solicitud HTTP
SELECT u.* FROM users u
WHERE u.id = ? AND u.estado = 'ACTIVO'
LIMIT 1;
```

#### **Paso 2: Cargar Permisos del Usuario**

```sql
-- En middleware o al login
SELECT DISTINCT p.slug, p.id, p.modulo, p.accion
FROM permissions p
WHERE (
  -- Permisos del rol
  p.id IN (
    SELECT rp.permission_id
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = ?
    AND (ur.fecha_expiracion IS NULL OR ur.fecha_expiracion > NOW())
    AND ur.role_id IN (
      SELECT r.id FROM roles r WHERE r.estado = 'ACTIVO'
    )
  )
  -- UNION permisos directos PERMITIR
  OR (
    p.id IN (
      SELECT up.permission_id
      FROM user_permissions up
      WHERE up.user_id = ?
      AND up.tipo = 'PERMITIR'
      AND (up.fecha_expiracion IS NULL OR up.fecha_expiracion > NOW())
      AND p.estado = 'ACTIVO'
    )
  )
)
-- EXCEPT permisos directos DENEGAR
AND p.id NOT IN (
  SELECT up.permission_id
  FROM user_permissions up
  WHERE up.user_id = ?
  AND up.tipo = 'DENEGAR'
  AND (up.fecha_expiracion IS NULL OR up.fecha_expiracion > NOW())
);
```

#### **Paso 3: Verificar Permiso Específico**

```javascript
FUNCTION checkPermission(user, permissionSlug) {
  // Verificar en sesión o cache
  IF user.permissions CONTAINS permissionSlug THEN
    RETURN true
  END IF
  
  // Si no está en cache, buscar en BD
  LET hasPermission = queryDatabase(
    "SELECT COUNT(*) FROM permissions p
     WHERE p.slug = ? AND (
       -- Rol
       p.id IN (SELECT ... user_roles ... ) OR
       -- Permiso directo PERMITIR
       p.id IN (SELECT ... user_permissions tipo=PERMITIR ...)
     )
     AND p.id NOT IN (SELECT ... user_permissions tipo=DENEGAR ...)",
    [permissionSlug]
  ) > 0
  
  // Guardar en cache con TTL
  cache.set("user_" + user.id + "_permission_" + permissionSlug, hasPermission, TTL=3600)
  
  RETURN hasPermission
}
```

#### **Paso 4: Denegar Acceso si No Tiene Permiso**

```javascript
FUNCTION middleware_checkPermission(requiredPermission) {
  RETURN FUNCTION(request, response, next) {
    LET user = request.user
    
    IF NOT user THEN
      RETURN response.status(401).json({error: "Unauthorized"})
    END IF
    
    IF NOT checkPermission(user, requiredPermission) THEN
      // Log del intento de acceso no autorizado
      logAudit({
        usuario_id: user.id,
        tabla_afectada: 'routes',
        tipo_operacion: 'ACCESO_DENEGADO',
        ip_direccion: request.ip,
        user_agent: request.headers['user-agent']
      })
      
      RETURN response.status(403).json({
        error: "Forbidden",
        message: "No tiene permisos para acceder a este recurso"
      })
    END IF
    
    next()
  }
}
```

### 5.2 Cómo se Combinan Roles + Permisos Individuales

```
ESCENARIO 1: Usuario con Rol
┌─────────────────────────────────────────┐
│ Usuario: Juan Pérez                     │
│ Rol: Administrador                      │
├─────────────────────────────────────────┤
│ Permisos obtenidos:                     │
│  • (Todos del rol Administrador)        │
│  • 111 permisos totales                 │
│                                         │
│ Resultado: Acceso total ✓               │
└─────────────────────────────────────────┘

ESCENARIO 2: Usuario Operador + Excepción
┌─────────────────────────────────────────┐
│ Usuario: María García                   │
│ Rol: Operador (30 permisos)             │
│ + Permiso directo: reports.advanced     │
│ - Permiso directo: products.view_cost   │
├─────────────────────────────────────────┤
│ Permisos finales:                       │
│  • 30 (del rol) + 1 (PERMITIR)          │
│  • - 1 (DENEGAR)                        │
│  • = 30 permisos                        │
│                                         │
│ Resultado: 30 permisos específicos ✓    │
└─────────────────────────────────────────┘

ESCENARIO 3: Usuario Vendedor con Limitaciones
┌─────────────────────────────────────────┐
│ Usuario: Carlos López                   │
│ Rol: Vendedor (15 permisos)             │
│ - Permiso directo: products.view_cost   │
├─────────────────────────────────────────┤
│ Permisos finales:                       │
│  • 15 (del rol) - 1 (DENEGAR)           │
│  • = 14 permisos                        │
│                                         │
│ Resultado: 14 permisos, sin ver costos ✓│
└─────────────────────────────────────────┘
```

### 5.3 Prioridad de Resolución

```
ORDEN DE EVALUACIÓN:

1º) Verificar si usuario tiene DENEGAR explícito
    └─ Si existe, DENEGAR acceso (máxima prioridad)

2º) Verificar si usuario tiene PERMITIR explícito
    └─ Si existe, PERMITIR acceso

3º) Verificar permisos del rol del usuario
    └─ Si existe en rol, PERMITIR acceso
    └─ Si no existe, DENEGAR acceso

4º) Si no hay nada anterior
    └─ Por defecto DENEGAR acceso (fail-safe)
```

### 5.4 Integración con Sidebar Dinámico

```javascript
FUNCTION generateSidebarForUser(userId) {
  // Obtener usuario y permisos
  LET user = getUser(userId)
  LET permissions = getUserPermissions(userId)
  
  // Array de ítems base del sidebar
  LET baseItems = getSidebarStructure()
  
  // Filtrar ítems según permisos
  LET filteredItems = []
  
  FOR EACH item IN baseItems DO
    // Verificar visibilidad
    IF item.permissions.length === 0 THEN
      // Sin restricciones, mostrar siempre
      SHOW item
    ELSE
      // Verificar si usuario tiene algún permiso requerido
      IF hasAnyPermission(user, item.permissions) THEN
        SHOW item
      ELSE
        HIDE item
      END IF
    END IF
    
    // Procesar submódulos
    IF item.children THEN
      item.children = filterChildren(item.children, permissions)
    END IF
    
    // Agregar a lista filtrada
    filteredItems.push(item)
  END FOR
  
  RETURN filteredItems
}

FUNCTION filterChildren(children, userPermissions) {
  LET filtered = []
  
  FOR EACH child IN children DO
    IF child.permissions.length === 0 OR 
       hasAnyPermission(child.permissions, userPermissions) THEN
      filtered.push(child)
    END IF
  END FOR
  
  RETURN filtered
}
```

### 5.5 Caché de Permisos

```javascript
// Evitar queries repetidas a la BD
FUNCTION getUserPermissionsWithCache(userId, cacheKey) {
  // Intentar obtener del cache
  LET cached = cache.get(cacheKey)
  IF cached THEN
    RETURN cached
  END IF
  
  // Si no está en cache, consultar BD
  LET permissions = queryDatabase(
    "SELECT p.slug FROM permissions p WHERE ...",
    [userId]
  )
  
  // Guardar en cache por 1 hora
  cache.set(cacheKey, permissions, TTL=3600)
  
  RETURN permissions
}

// Invalidar cache cuando cambia algo
FUNCTION invalidateUserPermissionsCache(userId) {
  cache.delete("user_" + userId + "_permissions")
  cache.delete("user_" + userId + "_sidebar")
}
```

### 5.6 Auditoría de Intentos de Acceso

```sql
-- Registrar intento fallido de acceso
INSERT INTO audit_logs (usuario_id, tabla_afectada, tipo_operacion, ip_direccion, user_agent)
VALUES 
(?, 'access_control', 'ACCESO_DENEGADO', ?, ?);

-- Registrar cambio de permiso
INSERT INTO audit_logs (
  usuario_id, 
  tabla_afectada, 
  tipo_operacion, 
  registro_id,
  datos_anteriores,
  datos_nuevos,
  ip_direccion
) VALUES (
  ?,
  'role_permissions',
  'UPDATE',
  ?,
  JSON_OBJECT('permission_id', ?, 'estado', 'anterior'),
  JSON_OBJECT('permission_id', ?, 'estado', 'nuevo'),
  ?
);
```

---

## 📊 Diagrama Completo de Flujo

```
┌──────────────────────────────────────────────────────────┐
│                  USUARIO HACE LOGIN                      │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
            ┌────────────────────────────┐
            │  Validar Credenciales     │
            │  (usuario + password)     │
            └────────┬───────────────────┘
                     │
            ┌────────▼───────────────────┐
            │  Obtener Roles del Usuario │
            │  (desde user_roles)        │
            └────────┬───────────────────┘
                     │
            ┌────────▼──────────────────────┐
            │ Obtener Permisos del Rol      │
            │ (desde role_permissions)      │
            └────────┬──────────────────────┘
                     │
            ┌────────▼──────────────────────┐
            │ Obtener Permisos Directos     │
            │ (desde user_permissions)      │
            └────────┬──────────────────────┘
                     │
            ┌────────▼──────────────────────┐
            │ Combinar Permisos:            │
            │ • Del Rol                     │
            │ + Directos PERMITIR           │
            │ - Directos DENEGAR            │
            └────────┬──────────────────────┘
                     │
            ┌────────▼──────────────────────┐
            │ Guardar en Cache              │
            │ (TTL: 1 hora)                 │
            └────────┬──────────────────────┘
                     │
            ┌────────▼──────────────────────┐
            │ Generar Sidebar Dinámico      │
            │ (filtrar según permisos)      │
            └────────┬──────────────────────┘
                     │
            ┌────────▼──────────────────────┐
            │ Enviar al Frontend            │
            │ (usuario + permisos + sidebar)│
            └────────┬──────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  Usuario Autenticado ✓      │
        │  Permisos Cargados ✓        │
        │  Sidebar Generado ✓         │
        └─────────────────────────────┘
                     │
                     │ Cada solicitud
                     ▼
        ┌─────────────────────────────┐
        │ Verificar Permiso Requerido │
        │ (middleware)                │
        └────────┬────────────────────┘
                 │
        ┌────────▼──────────────────┐
        │ ¿Tiene Permiso?           │
        │ (verificar en cache)      │
        └────┬───────────────┬──────┘
             │               │
           SÍ              NO
             │               │
        ┌────▼──┐      ┌─────▼──────┐
        │ PERMITIR│      │ DENEGAR    │
        │ acceso  │      │ (403)      │
        │ (200)   │      │ Log audit  │
        └─────────┘      └────────────┘
```

---

## ✅ Checklist de Implementación

```
BASE DE DATOS
☐ Crear tabla: users
☐ Crear tabla: roles
☐ Crear tabla: permissions
☐ Crear tabla: role_permissions
☐ Crear tabla: user_roles
☐ Crear tabla: user_permissions
☐ Crear tabla: audit_logs
☐ Crear tabla: empresas
☐ Agregar índices
☐ Agregar foreign keys

DATOS INICIALES
☐ Insertar empresa base
☐ Insertar rol Admin
☐ Insertar rol Operador
☐ Insertar todos los permisos (111)
☐ Asignar permisos a rol Admin
☐ Asignar permisos a rol Operador
☐ Crear usuarios de prueba
☐ Asignar roles a usuarios

BACKEND
☐ Función: checkPermission()
☐ Función: getUserPermissions()
☐ Función: generateSidebarForUser()
☐ Middleware: verifyPermission()
☐ Servicio: RoleService
☐ Servicio: PermissionService
☐ Servicio: UserService
☐ API endpoints CRUD para roles
☐ API endpoints CRUD para permisos
☐ API endpoint: GET /api/user/permissions
☐ API endpoint: GET /api/user/sidebar
☐ Sistema de caché

SEGURIDAD
☐ Hash de contraseñas (bcrypt/argon2)
☐ Rate limiting en login
☐ Bloqueo de usuario por intentos fallidos
☐ Auditoría de accesos
☐ Auditoría de cambios de permisos
☐ Invalidación de cache al cambiar permisos
☐ Validación de expiración de roles

TESTING
☐ Test: Usuario Admin tiene todos los permisos
☐ Test: Usuario Operador tiene permisos limitados
☐ Test: Permiso DENEGAR supera permiso PERMITIR
☐ Test: Roles temporales expiran
☐ Test: Caché funciona correctamente
☐ Test: Sidebar se genera correctamente
☐ Test: Auditoría registra cambios
```

---

## 🎯 Conclusión

Se ha proporcionado un **diseño robusto y profesional** de base de datos para un sistema de roles y permisos que incluye:

✅ **7 tablas principales** con diseño normalizado  
✅ **111 permisos granulares** en 10 módulos  
✅ **Relaciones N:M** para flexibilidad máxima  
✅ **Permisos directos** para excepciones  
✅ **Auditoría completa** de cambios  
✅ **Ejemplos SQL** funcionales  
✅ **Algoritmos de autorización** detallados  
✅ **Integración con sidebar dinámico**  

**Estado:** 🟢 LISTO PARA IMPLEMENTAR EN PRODUCCIÓN

---

**Versión:** 1.0.0  
**Última actualización:** 27 de enero de 2026  
**Autor:** Equipo de Desarrollo  
**Clasificación:** Especificación Técnica - Interna
