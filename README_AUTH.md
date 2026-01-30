# Autorización (RBAC + Permisos) - Guía rápida

Archivos añadidos:

- `src/server/auth/middleware.ts` - middleware `authorize(options)` utilizable en Express y adaptado a Next.js API routes (supone `req.user` cargado por la capa de autenticación).
- `src/server/auth/utils.ts` - utilitarios: `hasRole`, `hasPermission`, `hasAnyPermission`, `hasAllPermissions`, `buildUserCtx`.
- `src/server/services/permissions-service.ts` - carga y cache simple de `UserCtx` (in-memory). Reemplazar por Redis en producción.
- `src/server/services/audit-service.ts` - registro de decisiones de autorización.

Uso básico (Express):

```ts
import express from 'express'
import authorize from './src/server/auth/middleware'

app.get('/api/productos', authorize({ permissions: ['productos.ver'] }), productosHandler)
app.post('/admin/usuarios', authorize({ roles: ['admin'] }), crearUsuarioHandler)
```

Next.js API (ejemplo): asegurarse de que `req.user` exista (middleware de autenticación JWT/session) y luego:

```ts
import { authorize } from 'src/server/auth/middleware'

export default async function handler(req, res) {
  // req.user debe existir
  return authorize({ permissions: ['ventas.crear'] })(req, res)
}
```

Notas importantes:
- El paquete implementa un cache en memoria para demostración. En producción configure Redis y sustituya la lógica en `permissions-service.ts`.
- `buildUserCtxFromDb` es un stub: debe implementar la carga real desde su esquema (Prisma/SQL).
- El middleware asume que la autenticación (JWT/session) ya dejó `req.user` disponible. Puede extender `authorize` para decodificar JWT si lo desea.

Pruebas rápidas (manual):
- Puede crear un pequeño script de Node o integrar pruebas unitarias para `src/server/auth/utils.ts`.

Si querés, puedo:
- Implementar Redis en `permissions-service.ts`.
- Añadir tests automáticos con `vitest` o `jest` y scripts en `package.json`.
- Integrar decodificación JWT en el middleware.
