# 🔐 Sistema de Roles y Permisos - Guía de Implementación

Este documento explica cómo está integrado el sistema de visibilidad de sidebar en tu proyecto.

## 📁 Archivos Creados/Modificados

### 1. **`src/lib/types.ts`** (NUEVO)
Define todos los tipos TypeScript necesarios:
- `User` - Estructura del usuario con roles y permisos
- `SidebarItem` - Estructura de cada ítem del sidebar
- `SidebarConfig` - Configuración completa del sidebar
- `LoginResponse` - Respuesta del servidor al login
- `AuthContextType` - Tipo del contexto de autenticación

### 2. **`src/lib/permissions.ts`** (NUEVO)
Contiene todas las funciones de validación:

#### Funciones principales:
- `canAccessByRole(user, requiredRoles)` - Valida roles
- `canAccessByPermission(user, requiredPermissions)` - Valida permisos
- `canAccess(user, item)` - Validación combinada (la más importante)
- `filterMenuByPermissions(items, user)` - Filtra todo el menú recursivamente
- `hasAnyPermission(user, permissions)` - Verifica al menos un permiso
- `hasAllPermissions(user, permissions)` - Verifica todos los permisos
- `hasRole(user, role)` - Verifica un rol específico
- `isAdmin(user)` - Verifica si es admin

### 3. **`src/components/auth-context.tsx`** (NUEVO)
Context de React para manejar autenticación:
- Almacena el usuario y token en estado
- Persiste datos en `localStorage`
- Hook `useAuth()` para acceder en cualquier componente
- Métodos: `login()`, `logout()`, `refresh()`

### 4. **`src/components/layout/sidebar.tsx`** (MODIFICADO)
Componente Sidebar actualizado:
- Lee usuarios del `AuthContext`
- Filtra menú con `filterMenuByPermissions()`
- Carga configuración de `sidebar.config.json`
- Renderiza solo ítems permitidos
- Maneja submódulos colapsables
- Muestra rol del usuario en el footer

### 5. **`src/app/layout.tsx`** (MODIFICADO)
Se agregó `AuthProvider` envolviendo la aplicación

---

## 🔧 Cómo Usar

### 1. Obtener el usuario en cualquier componente:

```typescript
'use client';

import { useAuth } from '@/components/auth-context';

export default function MiComponente() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>No autenticado</p>;
  }

  return (
    <div>
      <p>Hola {user?.name}</p>
      <p>Rol: {user?.role}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

### 2. Validar acceso a un elemento:

```typescript
import { canAccess, hasRole, hasAnyPermission } from '@/lib/permissions';
import { useAuth } from '@/components/auth-context';

export default function MiComponente() {
  const { user } = useAuth();

  // Verificar rol
  if (hasRole(user, 'admin')) {
    return <AdminPanel />;
  }

  // Verificar permisos
  if (hasAnyPermission(user, ['productos.crear', 'productos.editar'])) {
    return <ProductosEditor />;
  }

  return <p>Sin permisos</p>;
}
```

### 3. Proteger rutas:

```typescript
// app/dashboard/configuracion/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth'; // o tu método de auth
import { hasRole } from '@/lib/permissions';

export default async function ConfiguracionPage() {
  const session = await getServerSession();
  
  if (!hasRole(session?.user, 'admin')) {
    redirect('/dashboard');
  }

  return <ConfiguracionContent />;
}
```

---

## 📋 Estructura del Usuario Esperada

El backend debe devolver un usuario con esta estructura:

```json
{
  "id": "user_123",
  "email": "admin@ferreteria.com",
  "name": "Juan Pérez",
  "role": "admin",
  "roles": ["admin"],
  "permissions": [
    "productos.crear",
    "productos.editar",
    "productos.eliminar",
    "ventas.crear",
    "ventas.ver",
    "clientes.ver",
    "configuracion.acceder"
  ]
}
```

---

## 🔐 Configuración del Login

Tu endpoint `/api/auth/login` debe devolver:

```json
{
  "success": true,
  "data": {
    "user": { /* ... */ },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login exitoso"
}
```

---

## 🎯 Ejemplos de Permisos Comunes

```typescript
// Productos
"productos.ver"
"productos.crear"
"productos.editar"
"productos.eliminar"
"productos.importar"

// Ventas
"ventas.crear"
"ventas.editar"
"ventas.ver"
"ventas.reportes"

// Clientes
"clientes.crear"
"clientes.editar"
"clientes.ver"
"clientes.eliminar"

// Configuración
"configuracion.acceder"
"usuarios.gestionar"
"roles.gestionar"
"auditoria.ver"
```

---

## 🧪 Ejemplos de Uso

### Ejemplo 1: Admin con acceso total

```typescript
const admin = {
  id: "1",
  email: "admin@ferreteria.com",
  name: "Admin User",
  role: "admin",
  roles: ["admin"],
  permissions: ["*"], // Wildcard = todos los permisos
};

// ✅ Puede ver todo
canAccess(admin, cualquierItem); // true
hasAnyPermission(admin, ["productos.crear"]); // true
```

### Ejemplo 2: Operador con permisos limitados

```typescript
const operador = {
  id: "2",
  email: "operador@ferreteria.com",
  name: "Operador",
  role: "operador",
  roles: ["operador"],
  permissions: [
    "productos.ver",
    "productos.editar",
    "ventas.crear",
    "ventas.ver",
    "clientes.ver"
  ],
};

// ✅ Puede ver productos
canAccessByPermission(operador, ["productos.ver"]); // true

// ❌ NO puede crear productos
canAccessByPermission(operador, ["productos.crear"]); // false

// ❌ NO puede acceder a configuración (no está en roles)
canAccessByRole(operador, ["admin"]); // false
```

### Ejemplo 3: Vendedor básico

```typescript
const vendedor = {
  id: "3",
  email: "vendedor@ferreteria.com",
  name: "Vendedor",
  role: "vendedor",
  roles: ["vendedor"],
  permissions: [
    "ventas.crear",
    "ventas.ver_mias",
    "productos.ver"
  ],
};

// ✅ Puede crear ventas
hasRole(vendedor, "vendedor"); // true

// ❌ No puede ver reportes
canAccessByPermission(vendedor, ["ventas.reportes"]); // false
```

---

## 🔄 Flujo de Autenticación

```
1. Usuario escribe email/password en página de login
2. POST /api/auth/login
3. Backend valida y devuelve { user, token }
4. Frontend guarda en localStorage via AuthContext
5. AuthProvider actualiza estado global
6. Sidebar se renderiza con permisos del usuario
7. Todos los componentes pueden acceder via useAuth()
```

---

## ⚙️ Variables de Entorno Necesarias

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🚀 Cómo Testear Localmente

### 1. Crear un usuario mock en desarrollo:

```typescript
// lib/mock-user.ts
export const MOCK_ADMIN = {
  id: "mock_1",
  email: "admin@test.com",
  name: "Admin Test",
  role: "admin",
  roles: ["admin"],
  permissions: ["*"],
};

export const MOCK_OPERADOR = {
  id: "mock_2",
  email: "operador@test.com",
  name: "Operador Test",
  role: "operador",
  roles: ["operador"],
  permissions: [
    "productos.ver",
    "ventas.crear",
    "ventas.ver"
  ],
};
```

### 2. Usar en context para desarrollo:

```typescript
// components/auth-context.tsx (desarrollo)
useEffect(() => {
  if (process.env.NODE_ENV === 'development' && !user) {
    // Cargar usuario mock
    const mockUser = MOCK_ADMIN;
    setUser(mockUser);
    setToken('mock_token_123');
  }
}, []);
```

---

## 📊 Matriz de Permisos por Rol

| Permiso | Admin | Operador | Vendedor |
|---------|-------|----------|----------|
| productos.ver | ✅ | ✅ | ✅ |
| productos.crear | ✅ | ❌ | ❌ |
| productos.editar | ✅ | ✅ | ❌ |
| ventas.crear | ✅ | ✅ | ✅ |
| ventas.ver | ✅ | ✅ | ✅ |
| ventas.reportes | ✅ | ✅ | ❌ |
| clientes.ver | ✅ | ✅ | ❌ |
| configuracion.acceder | ✅ | ❌ | ❌ |

---

## 🔍 Debug

### Ver usuarios en localStorage:
```javascript
// En console del navegador
JSON.parse(localStorage.getItem('auth_user'))
localStorage.getItem('auth_token')
```

### Ver permisos de un usuario:
```typescript
import { useAuth } from '@/components/auth-context';

export default function DebugPermisos() {
  const { user } = useAuth();
  
  return (
    <pre>
      {JSON.stringify({
        name: user?.name,
        role: user?.role,
        roles: user?.roles,
        permissions: user?.permissions,
      }, null, 2)}
    </pre>
  );
}
```

---

## ✅ Checklist de Seguridad

- [ ] **Backend valida token JWT** en cada petición
- [ ] **Token con expiración corta** (15-30 minutos)
- [ ] **Refresh token** para renovar sin re-autenticar
- [ ] **HTTPS en producción**
- [ ] **CORS correctamente configurado**
- [ ] **No guardar datos sensibles** en localStorage
- [ ] **Rate limiting** en endpoint de login
- [ ] **Validar permisos en backend** (no confiar solo en frontend)

---

¿Necesitas ayuda configurando el backend o tienes preguntas?
