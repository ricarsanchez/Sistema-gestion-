/**
 * Ejemplos de uso de las funciones de permisos
 * Este archivo es solo para referencia y documentación
 */

import {
  canAccess,
  canAccessByRole,
  canAccessByPermission,
  filterMenuByPermissions,
  hasRole,
  isAdmin,
  hasAnyPermission,
  hasAllPermissions,
} from '@/lib/permissions';
import { MOCK_ADMIN, MOCK_OPERADOR, MOCK_VENDEDOR } from '@/lib/mock-users';
import type { SidebarItem } from '@/lib/types';

// ============================================
// 1. VALIDAR ROLES
// ============================================

export function ejemploValidarRoles() {
  console.log('\n=== EJEMPLO 1: Validar Roles ===');

  // Admin tiene acceso
  console.log(
    '¿Admin puede (role: admin)?',
    canAccessByRole(MOCK_ADMIN, ['admin', 'operador'])
  ); // true

  // Operador tiene acceso
  console.log(
    '¿Operador puede (role: admin)?',
    canAccessByRole(MOCK_OPERADOR, ['admin'])
  ); // false

  // Vendedor sin acceso
  console.log(
    '¿Vendedor puede (role: admin)?',
    canAccessByRole(MOCK_VENDEDOR, ['admin'])
  ); // false
}

// ============================================
// 2. VALIDAR PERMISOS
// ============================================

export function ejemploValidarPermisos() {
  console.log('\n=== EJEMPLO 2: Validar Permisos ===');

  // Admin tiene todos (wildcard)
  console.log(
    '¿Admin puede crear productos?',
    canAccessByPermission(MOCK_ADMIN, ['productos.crear'])
  ); // true

  // Operador tiene permiso específico
  console.log(
    '¿Operador puede editar productos?',
    canAccessByPermission(MOCK_OPERADOR, ['productos.editar'])
  ); // true

  // Operador NO tiene este permiso
  console.log(
    '¿Operador puede ver configuración?',
    canAccessByPermission(MOCK_OPERADOR, ['configuracion.acceder'])
  ); // false

  // Vendedor solo puede lo básico
  console.log(
    '¿Vendedor puede crear ventas?',
    canAccessByPermission(MOCK_VENDEDOR, ['ventas.crear'])
  ); // true
}

// ============================================
// 3. VALIDACIÓN COMBINADA (MÁS IMPORTANTE)
// ============================================

export function ejemploValidacionCombinada() {
  console.log('\n=== EJEMPLO 3: Validación Combinada (canAccess) ===');

  const itemProductos: SidebarItem = {
    id: 'productos',
    label: 'Productos',
    icon: 'Package',
    route: '/dashboard/productos',
    roles: ['admin', 'operador'],
    permissions: ['productos.view'],
    children: null,
  };

  const itemConfiguracion: SidebarItem = {
    id: 'config',
    label: 'Configuración',
    icon: 'Settings',
    route: '/dashboard/configuracion',
    roles: ['admin'],
    permissions: ['configuracion.acceder'],
    children: null,
  };

  console.log('Item Productos:');
  console.log('  Admin puede acceder?', canAccess(MOCK_ADMIN, itemProductos)); // true
  console.log(
    '  Operador puede acceder?',
    canAccess(MOCK_OPERADOR, itemProductos)
  ); // true
  console.log('  Vendedor puede acceder?', canAccess(MOCK_VENDEDOR, itemProductos)); // false

  console.log('\nItem Configuración:');
  console.log('  Admin puede acceder?', canAccess(MOCK_ADMIN, itemConfiguracion)); // true
  console.log(
    '  Operador puede acceder?',
    canAccess(MOCK_OPERADOR, itemConfiguracion)
  ); // false
  console.log(
    '  Vendedor puede acceder?',
    canAccess(MOCK_VENDEDOR, itemConfiguracion)
  ); // false
}

// ============================================
// 4. FILTRAR MENÚ COMPLETO
// ============================================

export function ejemploFiltrarMenu() {
  console.log('\n=== EJEMPLO 4: Filtrar Menú Completo ===');

  const menuCompleto: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'BarChart3',
      route: '/dashboard',
      roles: ['admin', 'operador', 'vendedor'],
      permissions: [],
      children: null,
    },
    {
      id: 'productos',
      label: 'Productos',
      icon: 'Package',
      route: '/dashboard/productos',
      roles: ['admin', 'operador'],
      permissions: ['productos.view'],
      children: [
        {
          id: 'productos-crear',
          label: 'Crear',
          icon: 'Plus',
          route: '/dashboard/productos/new',
          roles: ['admin'],
          permissions: ['productos.crear'],
          children: null,
        },
        {
          id: 'productos-editar',
          label: 'Editar',
          icon: 'Edit',
          route: '/dashboard/productos/edit',
          roles: ['admin', 'operador'],
          permissions: ['productos.editar'],
          children: null,
        },
      ],
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: 'Settings',
      route: '/dashboard/configuracion',
      roles: ['admin'],
      permissions: ['configuracion.acceder'],
      children: null,
    },
  ];

  console.log('Menú para ADMIN:');
  const menuAdmin = filterMenuByPermissions(menuCompleto, MOCK_ADMIN);
  console.log('  Items visibles:', menuAdmin.map((m) => m.label));
  // ['Dashboard', 'Productos', 'Configuración']

  console.log('\nMenú para OPERADOR:');
  const menuOperador = filterMenuByPermissions(menuCompleto, MOCK_OPERADOR);
  console.log('  Items visibles:', menuOperador.map((m) => m.label));
  // ['Dashboard', 'Productos']
  // Productos solo tiene el hijo 'Editar'

  console.log('\nMenú para VENDEDOR:');
  const menuVendedor = filterMenuByPermissions(menuCompleto, MOCK_VENDEDOR);
  console.log('  Items visibles:', menuVendedor.map((m) => m.label));
  // ['Dashboard']
}

// ============================================
// 5. HELPERS RÁPIDOS
// ============================================

export function ejemploHelpers() {
  console.log('\n=== EJEMPLO 5: Helpers Rápidos ===');

  // Verificar si es admin
  console.log('¿Admin es admin?', isAdmin(MOCK_ADMIN)); // true
  console.log('¿Operador es admin?', isAdmin(MOCK_OPERADOR)); // false

  // Verificar rol específico
  console.log(
    '¿Operador es operador?',
    hasRole(MOCK_OPERADOR, 'operador')
  ); // true
  console.log('¿Vendedor es admin?', hasRole(MOCK_VENDEDOR, 'admin')); // false

  // Verificar al menos un permiso
  console.log(
    '¿Admin tiene productos.crear O ventas.crear?',
    hasAnyPermission(MOCK_ADMIN, ['productos.crear', 'ventas.crear'])
  ); // true

  console.log(
    '¿Operador tiene productos.crear O productos.editar?',
    hasAnyPermission(MOCK_OPERADOR, ['productos.crear', 'productos.editar'])
  ); // true (tiene editar)

  // Verificar todos los permisos
  console.log(
    '¿Admin tiene productos.crear Y ventas.crear?',
    hasAllPermissions(MOCK_ADMIN, ['productos.crear', 'ventas.crear'])
  ); // true

  console.log(
    '¿Operador tiene productos.crear Y productos.editar?',
    hasAllPermissions(MOCK_OPERADOR, ['productos.crear', 'productos.editar'])
  ); // false (no tiene crear)
}

// ============================================
// 6. EJECUTAR TODOS LOS EJEMPLOS
// ============================================

export function ejecutarTodosLosEjemplos() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  EJEMPLOS DEL SISTEMA DE PERMISOS Y ROLES          ║');
  console.log('╚════════════════════════════════════════════════════╝');

  ejemploValidarRoles();
  ejemploValidarPermisos();
  ejemploValidacionCombinada();
  ejemploFiltrarMenu();
  ejemploHelpers();

  console.log(
    '\n✅ Todos los ejemplos ejecutados. Revisa la consola del navegador.'
  );
}
