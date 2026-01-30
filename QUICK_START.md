/**
 * QUICK START - Configuración Rápida para Empezar
 * Copia y pega este código para comenzar a testear inmediatamente
 */

// ============================================
// 1. EN tu archivo: src/components/auth-context.tsx
// ============================================

// OPCIÓN A: Si quieres usar usuarios mock (sin backend):
// Descomenta esto en el useEffect:

/*
const { MOCK_ADMIN, MOCK_OPERADOR, MOCK_VENDEDOR } = await import('@/lib/mock-users');

if (!user && process.env.NODE_ENV === 'development') {
  // Selecciona cuál usuario usar para testing:
  const mockUser = MOCK_ADMIN;
  // const mockUser = MOCK_OPERADOR;
  // const mockUser = MOCK_VENDEDOR;
  
  setUser(mockUser);
  setToken('mock_token_123');
}
*/

// OPCIÓN B: Si tienes backend listo:
// Mantén el código de login normal

// ============================================
// 2. EN tu archivo: src/app/dashboard/page.tsx
// ============================================

/*
'use client';

import { useAuth } from '@/components/auth-context';
import { usePermissions } from '@/lib/usePermissions';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { isAdmin, hasPermission } = usePermissions();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {user && (
        <div className="mt-6 bg-blue-50 p-4 rounded">
          <p><strong>Usuario:</strong> {user.name}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          <p><strong>Es Admin:</strong> {isAdmin() ? 'Sí' : 'No'}</p>
        </div>
      )}

      {isAdmin() && (
        <div className="mt-6 bg-yellow-50 p-4 rounded">
          <h2 className="font-bold">Panel Administrativo</h2>
          <p>Solo ves esto porque eres admin</p>
        </div>
      )}

      <button 
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
*/

// ============================================
// 3. EJEMPLOS RÁPIDOS EN COMPONENTES
// ============================================

/**
 * Ejemplo 1: Mostrar/Ocultar Botón
 */
/*
import { usePermissions } from '@/lib/usePermissions';

export function CreateProductButton() {
  const { hasPermission } = usePermissions();

  // Si no tiene permiso, no renderiza nada
  if (!hasPermission('productos.crear')) {
    return null;
  }

  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded">
      Crear Producto
    </button>
  );
}
*/

/**
 * Ejemplo 2: Mostrar contenido condicional
 */
/*
import { ProtectedContent } from '@/components/ProtectedContent';

export function AdminPanel() {
  return (
    <ProtectedContent requiredRole="admin">
      <div className="bg-yellow-50 p-4 rounded">
        <h2>Panel Administrativo</h2>
        <p>Esto solo ven los admins</p>
      </div>
    </ProtectedContent>
  );
}
*/

/**
 * Ejemplo 3: Componente con múltiples permisos
 */
/*
import { usePermissions } from '@/lib/usePermissions';

export function ProductManager() {
  const { hasPermission, isAdmin } = usePermissions();

  return (
    <div>
      <h1>Gestión de Productos</h1>

      {hasPermission('productos.ver') && (
        <ProductList />
      )}

      {hasPermission('productos.crear') && (
        <CreateButton />
      )}

      {hasPermission('productos.editar') && (
        <EditFeature />
      )}

      {isAdmin() && (
        <AdminSettings />
      )}
    </div>
  );
}
*/

// ============================================
// 4. PARA TESTEAR EN CONSOLA
// ============================================

/*
// En el navegador, abre la consola (F12) y pega esto:

import { ejecutarTodosLosEjemplos } from '@/lib/permission-examples';
await ejecutarTodosLosEjemplos();

// También puedes verificar el usuario guardado:
console.log(JSON.parse(localStorage.getItem('auth_user')));
console.log(localStorage.getItem('auth_token'));
*/

// ============================================
// 5. USUARIOS MOCK DISPONIBLES
// ============================================

/**
 * MOCK_ADMIN
 * - roles: ['admin']
 * - permissions: ['*'] (todo)
 * - Puede: Crear, editar, eliminar productos, ver configuración, etc.
 */

/**
 * MOCK_OPERADOR
 * - roles: ['operador']
 * - permissions: [
 *     'productos.view',
 *     'productos.editar',
 *     'productos.bulk_import',
 *     'ventas.view',
 *     'ventas.crear',
 *     'clientes.view',
 *     'analytics.view'
 *   ]
 * - Puede: Ver productos, editar, crear ventas, ver clientes
 * - NO puede: Crear productos, ver configuración, eliminar
 */

/**
 * MOCK_VENDEDOR
 * - roles: ['vendedor']
 * - permissions: [
 *     'productos.view',
 *     'ventas.view',
 *     'ventas.crear',
 *     'clientes.view'
 *   ]
 * - Puede: Ver productos, crear/ver ventas, ver clientes
 * - NO puede: Editar productos, reportes, configuración
 */

// ============================================
// 6. FLUJO DE AUTENTICACIÓN (BACKEND)
// ============================================

/**
 * Tu backend debe tener este endpoint:
 * 
 * POST /api/auth/login
 * Content-Type: application/json
 * 
 * {
 *   "email": "usuario@ferreteria.com",
 *   "password": "password123"
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": "user_123",
 *       "email": "usuario@ferreteria.com",
 *       "name": "Juan García",
 *       "role": "operador",
 *       "roles": ["operador"],
 *       "permissions": ["productos.view", "ventas.crear"]
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   },
 *   "message": "Login exitoso"
 * }
 */

// ============================================
// 7. CHECKLIST MÍNIMO PARA FUNCIONAR
// ============================================

/**
 * ✅ Completado automáticamente:
 * - AuthProvider está en layout.tsx
 * - Sidebar carga permisos automáticamente
 * - Context de autenticación configurado
 * 
 * ⚠️ DEBES HACER:
 * - Implementar endpoint /api/auth/login en tu backend
 * - Asegurar que devuelve { user, token }
 * - Validar token en backend para cada request
 * 
 * 🧪 PARA TESTEAR SIN BACKEND:
 * - Descomenta el código mock en auth-context.tsx
 * - El sidebar se filtrará automáticamente
 */

// ============================================
// 8. ARQUITECTURA GENERAL
// ============================================

/**
 * FLUJO:
 * 
 * 1. Usuario escribe email/password en login
 * 2. POST /api/auth/login
 * 3. Backend devuelve { user, token }
 * 4. AuthContext guarda en state + localStorage
 * 5. Sidebar se renderiza y filtra con filterMenuByPermissions()
 * 6. Componentes usan usePermissions() para mostrar/ocultar
 * 7. ProtectedContent oculta contenido sin permiso
 * 
 * SEGURIDAD:
 * - Frontend: Oculta menús, botones, contenido
 * - Backend: DEBE validar token + permisos en cada request
 */

// ============================================
// 9. COMANDOS ÚTILES
// ============================================

/*
// Ver usuario en localStorage
JSON.parse(localStorage.getItem('auth_user'))

// Ver token
localStorage.getItem('auth_token')

// Simular logout
localStorage.removeItem('auth_user'); 
localStorage.removeItem('auth_token');

// Recargar página con nuevo usuario
window.location.reload();

// Ejecutar ejemplos en consola
import { MOCK_ADMIN } from '@/lib/mock-users';
import { canAccess } from '@/lib/permissions';
console.log(canAccess(MOCK_ADMIN, { roles: ['admin'], permissions: [] }));
*/

// ============================================
// 10. DOCUMENTACIÓN DISPONIBLE
// ============================================

/**
 * Archivos de documentación creados:
 * 
 * 📄 GUIA_PERMISOS_IMPLEMENTACION.md
 *    - Explicación detallada de todo
 *    - Cómo usar cada función
 *    - Ejemplos completos
 * 
 * 📄 INTEGRACION_PERMISOS_RESUMEN.md
 *    - Resumen rápido de la integración
 *    - Casos de uso
 *    - FAQ
 * 
 * 📄 CHECKLIST_IMPLEMENTACION.md
 *    - Estado de implementación
 *    - Troubleshooting
 *    - Seguridad checklist
 * 
 * 📄 Este archivo (QUICK_START.md)
 *    - Configuración rápida
 *    - Ejemplos de copiar-pegar
 *    - Comandos útiles
 */

// ============================================
// LISTO PARA USAR 🚀
// ============================================

/**
 * Próximos pasos:
 * 
 * 1. Copia las funciones de este archivo en tus componentes
 * 2. O descomenta el código mock en auth-context.tsx
 * 3. Abre el navegador y prueba el sidebar
 * 4. Prueba con diferentes usuarios mock
 * 5. Cuando tengas backend, reemplaza el login mock con real
 * 
 * ¡Todo debería funcionar automáticamente!
 */
