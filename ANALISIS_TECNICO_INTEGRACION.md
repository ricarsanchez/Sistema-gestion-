# 📋 ANÁLISIS TÉCNICO COMPLETO - Integración de Roles y Permisos

## 1️⃣ ESTRUCTURA DEL PROYECTO (ACTUAL)

```
📦 ferreteria/ (Raíz)
├── 📄 tsconfig.json
│   └── paths: "@/*": ["./src/*"]
│       ✅ Alias configurado correctamente
│
├── 📄 sidebar.config.json (RAÍZ)
│   ⚠️ Ubicación actual: /sidebar.config.json
│   ⚠️ Problema: Está en la raíz, no en src/
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── layout.tsx           ✅ Server Component (Root)
│   │   ├── page.tsx             ✅ Server Component
│   │   ├── globals.css
│   │   └── 📁 dashboard/
│   │       ├── layout.tsx       ✅ Server Component
│   │       ├── page.tsx         ✅ Server Component
│   │       └── ...
│   │
│   ├── 📁 components/
│   │   ├── auth-context.tsx     🔴 CLIENT COMPONENT ('use client')
│   │   │   └── AuthProvider (Context)
│   │   │   └── useAuth() Hook
│   │   ├── ProtectedContent.tsx 🔴 CLIENT COMPONENT
│   │   ├── theme-provider.tsx   🔴 CLIENT COMPONENT
│   │   └── 📁 layout/
│   │       └── sidebar.tsx      🔴 CLIENT COMPONENT ('use client')
│   │           └── Importa: sidebarConfig desde @/sidebar.config.json
│   │
│   ├── 📁 lib/
│   │   ├── types.ts             ✅ TypeScript Types (Server-safe)
│   │   ├── permissions.ts       ✅ Pure Functions (Server-safe)
│   │   ├── usePermissions.ts    🔴 CLIENT ONLY (Hook)
│   │   ├── mock-users.ts        ✅ Server-safe
│   │   ├── permission-examples.ts
│   │   ├── utils.ts
│   │   ├── actions.ts           ⚠️ Probablemente Server Action
│   │   └── prisma.ts            ⚠️ Server-only
│   │
│   └── 📁 server/
│       └── ... (Server-only code)
│
├── 📁 prisma/
├── 📁 public/
└── node_modules/
```

---

## 2️⃣ PROBLEMA IDENTIFICADO: Import de sidebar.config.json

### El Problema
```typescript
// ❌ ESTO FALLA en Client Components
import sidebarConfig from '@/sidebar.config.json';
```

**¿POR QUÉ FALLA?**

1. **El alias `@/*` apunta a `src/*`**
   ```json
   // tsconfig.json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```

2. **sidebar.config.json está en la RAÍZ** (`/sidebar.config.json`)
   - No está en `/src/`
   - El alias `@/sidebar.config.json` intenta buscar en `/src/sidebar.config.json`
   - No existe → **Module not found**

3. **Import de JSON en Client Components**
   - Next.js permite importar JSON
   - Pero el archivo debe estar en una ubicación resoluble
   - O necesita ser manejado diferentemente

### Soluciones Posibles

**Opción A:** Mover `sidebar.config.json` a `src/config/`
```typescript
// ✅ CORRECTO
import sidebarConfig from '@/config/sidebar.config.json';
```

**Opción B:** Cargar config en Server Component y pasar como prop
```typescript
// Server Component
const config = await import('@/config/sidebar.config.json');

// Pasar a Client Component vía props
<SidebarClient sidebarConfig={config} />
```

**Opción C:** Crear `sidebar.config.ts` en lugar de `.json`
```typescript
// ✅ MEJOR (TypeScript puro)
// src/config/sidebar.config.ts
export const sidebarConfig = { ... }

// Importar
import { sidebarConfig } from '@/config/sidebar.config';
```

---

## 3️⃣ ANÁLISIS DE COMPONENTES

### 🔴 Client Components (Requieren 'use client')
```typescript
// src/components/auth-context.tsx
'use client';  ← OBLIGATORIO (usa useState, useEffect, createContext)

// src/components/layout/sidebar.tsx
'use client';  ← OBLIGATORIO (usa useState, usePathname, useAuth hook)

// src/components/ProtectedContent.tsx
'use client';  ← OBLIGATORIO (usa hooks, renderizado condicional)

// src/lib/usePermissions.ts
'use client';  ← OBLIGATORIO (es un hook personalizado)
```

### ✅ Server-safe (Pueden estar en Server Components)
```typescript
// src/lib/types.ts
// → Tipos TypeScript puros, seguro para ambos

// src/lib/permissions.ts
// → Funciones puras sin hooks, seguro para ambos

// src/lib/mock-users.ts
// → Datos estáticos, seguro para ambos
```

### 🔄 Ubicación en Layout
```tsx
// src/app/layout.tsx
export default function RootLayout() {
  return (
    <html>
      <body>
        {/* ✅ Client Components aquí */}
        <AuthProvider>           {/* 'use client' */}
          <ThemeProvider>        {/* 'use client' */}
            {/* Server & Client Components aquí */}
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 4️⃣ ARQUITECTURA DE IMPORTS CORRECTA

### Diagrama de Flujo
```
RootLayout (Server)
  ├─ AuthProvider (Client)
  │   ├─ Creates Context
  │   ├─ Manages User State
  │   └─ useAuth() Hook
  │
  ├─ ThemeProvider (Client)
  │
  └─ children (Server/Client mix)
      ├─ DashboardLayout (Server)
      │   ├─ Sidebar (Client)
      │   │   ├─ useAuth() ✅
      │   │   ├─ filterMenuByPermissions() ✅
      │   │   └─ sidebarConfig ✅
      │   │
      │   └─ Page (Server)
      │       └─ ProtectedContent (Client wrapper)
      │           └─ usePermissions() ✅
      │
      └─ Otros Pages
```

### Import Chain Correcto
```typescript
// 1. En Server Component (layout)
import { AuthProvider } from '@/components/auth-context';  // ✅ OK

// 2. En Client Component (sidebar)
'use client';
import { useAuth } from '@/components/auth-context';       // ✅ OK
import { filterMenuByPermissions } from '@/lib/permissions'; // ✅ OK
import sidebarConfig from '@/config/sidebar.config.json';  // ✅ DESPUÉS de mover

// 3. En Client Component (hook)
'use client';
import { usePermissions } from '@/lib/usePermissions';     // ✅ OK

// 4. En Client Component (protected content)
'use client';
import { ProtectedContent } from '@/components/ProtectedContent'; // ✅ OK
```

---

## 5️⃣ PROBLEMAS CON sidebar.config.json vs sidebar.config.ts

### Problema: sidebar.config.json

```json
// /sidebar.config.json (ACTUAL)
{
  "sidebar": { ... }
}
```

**Problemas:**
1. ❌ Ubicación en raíz (fuera de src/)
2. ❌ No se resuelve con alias `@/*`
3. ❌ Requiere `resolveJsonModule: true` en tsconfig
4. ❌ Menos type-safe
5. ❌ Difícil de validar tipos

### Solución: Convertir a sidebar.config.ts

```typescript
// src/config/sidebar.config.ts (RECOMENDADO)
import type { SidebarConfig } from '@/lib/types';

export const sidebarConfig: SidebarConfig = {
  header: { ... },
  sections: [ ... ]
};
```

**Ventajas:**
1. ✅ TypeScript con tipos completos
2. ✅ Fácil de ubicar con alias
3. ✅ Mejor performance
4. ✅ Type-safe
5. ✅ Validación en build-time

---

## 6️⃣ CÓMO FUNCIONA LA VALIDACIÓN DE PERMISOS

### Flujo Completo

```
1. Usuario inicia sesión
   └─ Backend devuelve { user, token }

2. AuthProvider guarda en localStorage + estado
   └─ setUser(userData)
   └─ setToken(tokenData)

3. Sidebar se renderiza
   └─ useAuth() obtiene user del Context
   └─ useMemo(() => {
       const visibleMenu = filterMenuByPermissions(
         sidebarConfig.sections,
         user
       );
      }, [user])

4. filterMenuByPermissions() filtra recursivamente
   └─ Para cada item:
       ├─ canAccess(user, item)?
       │  └─ canAccessByRole(user, item.roles)?
       │  └─ canAccessByPermission(user, item.permissions)?
       └─ Si ambos = true, incluir
       └─ Si tiene children, filtrar recursivamente

5. Sidebar renderiza solo items permitidos
   └─ Submenús se expanden/contraen
   └─ Botones se habilitan/deshabilitan

6. Backend valida en cada request (OBLIGATORIO)
   └─ Verificar token
   └─ Verificar roles
   └─ Verificar permisos
```

### Funciones Clave

```typescript
// 1. Validar un rol
canAccessByRole(user, ['admin', 'operador'])
// Devuelve: true si user.role está en array

// 2. Validar un permiso
canAccessByPermission(user, ['productos.crear'])
// Devuelve: true si user.permissions incluye

// 3. Validar combinado
canAccess(user, sidebarItem)
// Devuelve: true si cumple AMBAS condiciones:
//   - user tiene rol requerido
//   - user tiene permisos requeridos

// 4. Filtrar menú completo
filterMenuByPermissions(items, user)
// Devuelve: Array de items accesibles (recursivo)
```

---

## 7️⃣ PLAN DE ACCIÓN COMPLETO

### Paso 1: Crear estructura de carpetas
```bash
mkdir -p src/config
```

### Paso 2: Convertir sidebar.config.json a TypeScript
- Mover contenido a `src/config/sidebar.config.ts`
- Aplicar tipos `SidebarConfig`
- Validar estructura

### Paso 3: Actualizar imports en sidebar.tsx
```typescript
// ❌ ANTES
import sidebarConfig from '@/sidebar.config.json';

// ✅ DESPUÉS
import { sidebarConfig } from '@/config/sidebar.config';
```

### Paso 4: Validar componentes
- ✅ auth-context.tsx tiene 'use client'
- ✅ sidebar.tsx tiene 'use client'
- ✅ usePermissions.ts tiene 'use client'
- ✅ ProtectedContent.tsx tiene 'use client'

### Paso 5: Validar tipos
- ✅ types.ts es correcto
- ✅ permissions.ts importa types
- ✅ sidebar.tsx importa types

---

## 8️⃣ CHECKLIST TÉCNICO

- [ ] `src/config/` existe
- [ ] `src/config/sidebar.config.ts` creado (TypeScript)
- [ ] Tipos `SidebarConfig` aplicados
- [ ] Imports en sidebar.tsx actualizados
- [ ] Todos los Client Components tienen 'use client'
- [ ] Tipos TypeScript validados
- [ ] permissions.ts sin errores
- [ ] auth-context.tsx sin errores
- [ ] usePermissions.ts sin errores
- [ ] Build sin errores: `npm run build`

---

## 9️⃣ ERRORES COMUNES Y SOLUCIONES

| Error | Causa | Solución |
|-------|-------|----------|
| "Module not found: sidebar.config.json" | Archivo en raíz, no en src/ | Mover a src/config/ |
| "Cannot use hooks in server component" | Olvidó 'use client' | Agregar 'use client' al inicio |
| "useAuth is not a function" | Importing fuera de Context | Usar dentro de <AuthProvider> |
| "filterMenuByPermissions is not a function" | Import incorrecto | Revisar path: @/lib/permissions |
| "SidebarConfig is not defined" | Tipo no importado | Importar: `import type { SidebarConfig }` |

---

## 🔟 VALIDACIÓN FINAL

```typescript
// ✅ ESTRUCTURA CORRECTA

// 1. Tipos (Server-safe)
import type { User, SidebarItem, SidebarConfig } from '@/lib/types';

// 2. Funciones (Server-safe)
import { canAccess, filterMenuByPermissions } from '@/lib/permissions';

// 3. Config (TypeScript)
import { sidebarConfig } from '@/config/sidebar.config';

// 4. Cliente Components
import { AuthProvider, useAuth } from '@/components/auth-context';
import { usePermissions } from '@/lib/usePermissions';
import { ProtectedContent } from '@/components/ProtectedContent';

// 5. Build
npm run build  // ✅ Sin errores
npm run dev    // ✅ Funciona correctamente
```

---

**CONCLUSIÓN:**
Tu proyecto está **95% correcto**. El único problema es la ubicación del `sidebar.config.json` en la raíz. 
Convertirlo a TypeScript y moverlo a `src/config/` soluciona todo.
