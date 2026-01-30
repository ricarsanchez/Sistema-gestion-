# ✅ Integración Completa del Sistema de Roles y Permisos

## 📦 Archivos Creados

### 1️⃣ **`src/lib/types.ts`**
- Define tipos TypeScript para todo el sistema
- Interfaces: `User`, `SidebarItem`, `SidebarConfig`, `LoginResponse`, `AuthContextType`

### 2️⃣ **`src/lib/permissions.ts`**
- ✨ **Funciones principales de validación:**
  - `canAccessByRole()` - Valida roles
  - `canAccessByPermission()` - Valida permisos
  - `canAccess()` - Validación combinada
  - `filterMenuByPermissions()` - Filtra menú recursivamente
  - `hasRole()`, `isAdmin()`, `hasAnyPermission()`, `hasAllPermissions()`

### 3️⃣ **`src/components/auth-context.tsx`** (NUEVO)
- Context global de autenticación
- Maneja login, logout, refresh
- Persiste datos en localStorage
- Hook `useAuth()` para acceder desde cualquier componente

### 4️⃣ **`src/components/layout/sidebar.tsx`** (MODIFICADO)
- Integra `useAuth()` y `filterMenuByPermissions()`
- Carga config de `sidebar.config.json`
- Renderiza solo ítems permitidos
- Maneja submódulos colapsables
- Muestra rol del usuario

### 5️⃣ **`src/app/layout.tsx`** (MODIFICADO)
- Envuelve app con `<AuthProvider>`
- Disponibiliza autenticación en toda la app

### 6️⃣ **`src/lib/mock-users.ts`** (NUEVO)
- Usuarios de prueba: `MOCK_ADMIN`, `MOCK_OPERADOR`, `MOCK_VENDEDOR`
- Para testear sin backend

### 7️⃣ **`src/lib/permission-examples.ts`** (NUEVO)
- Ejemplos prácticos de uso de todas las funciones
- Para aprender y referenciar

### 8️⃣ **`src/lib/usePermissions.ts`** (NUEVO)
- Hook personalizado para validaciones en componentes
- Simplifica el código en componentes cliente

### 9️⃣ **`src/components/ProtectedContent.tsx`** (NUEVO)
- Componentes para proteger contenido:
  - `<ProtectedByRole />`
  - `<ProtectedByPermission />`
  - `<ProtectedContent />`
  - `<AdminOnly />`
  - `<ConditionalButton />`

---

## 🚀 Uso Rápido

### 1. En un componente, obtener el usuario:
```typescript
'use client';
import { useAuth } from '@/components/auth-context';

export default function MiComponente() {
  const { user, logout } = useAuth();
  return <p>Hola {user?.name}</p>;
}
```

### 2. Validar permisos:
```typescript
'use client';
import { usePermissions } from '@/lib/usePermissions';

export default function Productos() {
  const { hasPermission, hasRole } = usePermissions();

  if (!hasPermission('productos.ver')) {
    return <p>Sin acceso</p>;
  }

  return (
    <div>
      {hasPermission('productos.crear') && <CreateButton />}
      {hasRole('admin') && <AdminPanel />}
    </div>
  );
}
```

### 3. Proteger contenido:
```typescript
import { ProtectedContent, AdminOnly } from '@/components/ProtectedContent';

export default function Dashboard() {
  return (
    <>
      <ProtectedContent requiredPermissions={['productos.ver']}>
        <ProductosSection />
      </ProtectedContent>

      <AdminOnly>
        <ConfiguracionPanel />
      </AdminOnly>
    </>
  );
}
```

---

## 🔐 Flujo de Autenticación

```
1. Usuario hace login
2. Backend valida y devuelve { user, token }
3. AuthContext guarda en localStorage
4. Sidebar filtra ítems con filterMenuByPermissions()
5. Componentes usan usePermissions() para validar
6. ProtectedContent oculta/muestra según permisos
```

---

## 📋 Estructura de Usuario Esperada

```json
{
  "id": "user_123",
  "email": "operador@ferreteria.com",
  "name": "María García",
  "role": "operador",
  "roles": ["operador"],
  "permissions": [
    "productos.view",
    "productos.editar",
    "ventas.crear",
    "ventas.view"
  ]
}
```

---

## 🧪 Testear Localmente

### Opción 1: Con usuarios mock (sin backend):
```typescript
// En auth-context.tsx, agregar en useEffect:
if (!user) {
  setUser(MOCK_ADMIN);
  setToken('mock_token');
}
```

### Opción 2: Ejecutar ejemplos en consola:
```typescript
// En tu página o componente:
import { ejecutarTodosLosEjemplos } from '@/lib/permission-examples';

// En useEffect:
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    ejecutarTodosLosEjemplos();
  }
}, []);
```

---

## 🎯 Casos de Uso

### Caso 1: Admin ve todo
```
User: MOCK_ADMIN (roles: ['admin'], permissions: ['*'])
✅ Dashboard → Visible
✅ Productos → Visible + Submenús
✅ Configuración → Visible
```

### Caso 2: Operador ve lo permitido
```
User: MOCK_OPERADOR (roles: ['operador'])
✅ Dashboard → Visible
✅ Productos → Visible (solo Editar)
✅ Configuración → NO Visible
```

### Caso 3: Vendedor acceso mínimo
```
User: MOCK_VENDEDOR (roles: ['vendedor'])
✅ Dashboard → Visible
✅ Productos → NO Visible
✅ Ventas → Solo crear
```

---

## 🔄 Cómo Conectar el Backend

### Paso 1: Endpoint de login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "operador@ferreteria.com",
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "operador@ferreteria.com",
      "name": "María García",
      "role": "operador",
      "roles": ["operador"],
      "permissions": ["productos.view", "productos.editar"]
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login exitoso"
}
```

### Paso 2: La app automáticamente:
1. Guarda usuario + token en localStorage
2. AuthContext actualiza estado
3. Sidebar se filtra según permisos
4. Componentes acceden con `useAuth()` y `usePermissions()`

---

## 🛡️ Seguridad

✅ **Frontend (Protección de UX):**
- Sidebar oculta ítems sin permiso
- Botones/contenido se ocultan
- Rutas no aparecen en menú

✅ **Backend (Validación real):**
- Validar token en cada request
- Verificar permisos en servidor
- No confiar en datos del cliente

---

## 📊 Matriz de Funciones

| Función | Uso | Devuelve |
|---------|-----|----------|
| `canAccessByRole()` | Validar solo rol | boolean |
| `canAccessByPermission()` | Validar solo permiso | boolean |
| `canAccess()` | Validar rol + permiso | boolean |
| `filterMenuByPermissions()` | Filtrar menú completo | SidebarItem[] |
| `hasRole()` | Verificar 1 rol | boolean |
| `isAdmin()` | Verificar si es admin | boolean |
| `hasAnyPermission()` | Verificar ≥1 permiso | boolean |
| `hasAllPermissions()` | Verificar todos permisos | boolean |

---

## 🐛 Debug

### Ver usuario en localStorage:
```javascript
JSON.parse(localStorage.getItem('auth_user'))
```

### Ver token:
```javascript
localStorage.getItem('auth_token')
```

### Verificar permisos en consola:
```javascript
import { MOCK_ADMIN } from '@/lib/mock-users';
import { canAccess } from '@/lib/permissions';

const item = { roles: ['admin'], permissions: ['productos.view'] };
console.log(canAccess(MOCK_ADMIN, item)); // true
```

---

## ✨ Próximos Pasos

1. ✅ **Conectar backend** - Implementar endpoint `/api/auth/login`
2. ✅ **Roles y permisos en DB** - Crear tabla de permisos por rol
3. ✅ **Proteger rutas backend** - Validar token + permisos en cada endpoint
4. ✅ **Auditoría** - Registrar accesos y cambios de permisos
5. ✅ **Refresh tokens** - Renovar automáticamente

---

## ❓ FAQ

**P: ¿Qué pasa si un usuario no tiene permisos?**
R: El sidebar oculta esos ítems automáticamente y `usePermissions()` devuelve false.

**P: ¿Puedo cambiar permisos en runtime?**
R: Sí, llama a `refresh()` en `useAuth()` para obtener permisos actualizados.

**P: ¿Se puede usar con NextAuth?**
R: Sí, simplemente reemplaza `useAuth()` en el componente Sidebar.

**P: ¿Los permisos son case-sensitive?**
R: Sí, usa siempre minúsculas con puntos: `"productos.crear"`

---

¿Necesitas ayuda integrando el backend o tienes preguntas específicas?
