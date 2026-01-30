/**
 * Validación de tipos - Archivo de referencia
 * Confirma que toda la integración de tipos es correcta
 */

// ✅ 1. Tipos importados desde lib/types.ts
import type { User, SidebarItem, SidebarConfig } from '@/lib/types';

// ✅ 2. Funciones importadas desde lib/permissions.ts
import {
  canAccess,
  canAccessByPermission,
  canAccessByRole,
  filterMenuByPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  isAdmin,
} from '@/lib/permissions';

// ✅ 3. Config importada desde config/sidebar.config.ts
import { sidebarConfig } from '@/config/sidebar.config';

// ✅ 4. Auth context
import { AuthProvider, useAuth } from '@/components/auth-context';

// =====================================================
// VALIDACIÓN DE TIPOS
// =====================================================

/**
 * Ejemplo 1: Validar usuario
 * Tipo esperado: User | null
 */
function validateUserType(user: User | null): void {
  if (!user) {
    console.log('No user provided');
    return;
  }

  // ✅ El usuario tiene todas estas propiedades
  const id: string = user.id;
  const email: string = user.email;
  const name: string = user.name;
  const role: string = user.role;
  const roles: string[] = user.roles || [];
  const permissions: string[] = user.permissions || [];

  console.log(`User: ${name} (${role})`);
}

/**
 * Ejemplo 2: Validar configuración del sidebar
 * Tipo esperado: SidebarConfig
 */
function validateSidebarConfig(config: SidebarConfig): void {
  // ✅ config tiene estructura correcta
  const header = config.header;
  const sections = config.sections;

  console.log(`Company: ${header.company}`);
  console.log(`Total sections: ${sections.length}`);

  // ✅ Cada sección es un SidebarItem
  sections.forEach((section: SidebarItem) => {
    console.log(`- ${section.label} (${section.roles.join(', ')})`);
  });
}

/**
 * Ejemplo 3: Usar función canAccess
 * Entrada: User | null, SidebarItem
 * Salida: boolean
 */
function canUserAccessDashboard(
  user: User | null,
  dashboardItem: SidebarItem
): boolean {
  // ✅ canAccess devuelve boolean
  return canAccess(user, dashboardItem);
}

/**
 * Ejemplo 4: Filtrar menú por permisos
 * Entrada: SidebarItem[], User | null
 * Salida: SidebarItem[]
 */
function getVisibleMenu(user: User | null): SidebarItem[] {
  // ✅ filterMenuByPermissions devuelve SidebarItem[]
  return filterMenuByPermissions(sidebarConfig.sections, user);
}

/**
 * Ejemplo 5: Validaciones individuales
 */
function demonstratePermissionFunctions(user: User | null): void {
  if (!user) return;

  // ✅ Todos estos métodos devuelven boolean
  const isUserAdmin: boolean = isAdmin(user);
  const hasRoleAdmin: boolean = hasRole(user, 'admin');
  const canAccessByRoles: boolean = canAccessByRole(user, ['admin', 'operador']);

  const hasOnePermission: boolean = hasAnyPermission(user, [
    'products.view',
    'products.create',
  ]);
  const hasAllPerms: boolean = hasAllPermissions(user, ['products.view', 'products.create']);
  const canAccessItem: boolean = canAccessByPermission(user, ['products.view']);

  console.log({
    isUserAdmin,
    hasRoleAdmin,
    canAccessByRoles,
    hasOnePermission,
    hasAllPerms,
    canAccessItem,
  });
}

/**
 * Ejemplo 6: Estructura de SidebarItem
 * Válida para usar en componentes
 */
function demonstrateSidebarItemType(): void {
  const item: SidebarItem = {
    id: 'products',
    label: 'Productos',
    icon: 'Package',
    route: '/dashboard/products',
    roles: ['admin', 'operador'],
    permissions: ['products.view'],
    // Opcional:
    badge: null,
    children: null,
  };

  console.log(`Item: ${item.label}`);
  console.log(`Route: ${item.route}`);
  console.log(`Roles: ${item.roles.join(', ')}`);
  console.log(`Permissions: ${item.permissions.join(', ')}`);
}

/**
 * Ejemplo 7: Estructura de SidebarConfig
 * Correcta para usarse en componentes
 */
function demonstrateSidebarConfigStructure(): void {
  const config: SidebarConfig = sidebarConfig;

  // ✅ Header
  console.log(`Logo: ${config.header.logo}`);
  console.log(`Company: ${config.header.company}`);
  console.log(`Toggle: ${config.header.toggleCollapse}`);

  // ✅ Sections (array de SidebarItem)
  config.sections.forEach((section: SidebarItem) => {
    console.log(`\nSection: ${section.label}`);

    // ✅ Children pueden existir o ser null
    if (section.children && section.children.length > 0) {
      section.children.forEach((child: SidebarItem) => {
        console.log(`  - ${child.label}`);
      });
    }
  });
}

/**
 * RESUMEN DE VALIDACIÓN DE TIPOS
 *
 * ✅ User: { id, email, name, role, roles[], permissions[] }
 * ✅ SidebarItem: { id, label, icon, route|null, roles[], permissions[], children?[] }
 * ✅ SidebarConfig: { header: {...}, sections: SidebarItem[] }
 *
 * ✅ Funciones de validación: () => boolean
 * ✅ Función de filtrado: (SidebarItem[], User | null) => SidebarItem[]
 *
 * ✅ sidebarConfig: SidebarConfig (importado de @/config/sidebar.config)
 * ✅ AuthProvider: React.FC (importado de @/components/auth-context)
 * ✅ useAuth: () => { user, token, login, logout, ... }
 *
 * ✅ TODOS LOS TIPOS ESTÁN CORRECTAMENTE MAPEADOS
 */

// =====================================================
// EXPORT PARA USO EN OTROS ARCHIVOS
// =====================================================

export type {
  User,
  SidebarItem,
  SidebarConfig,
} from '@/lib/types';

export {
  canAccess,
  canAccessByPermission,
  canAccessByRole,
  filterMenuByPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  isAdmin,
} from '@/lib/permissions';

export { sidebarConfig } from '@/config/sidebar.config';
export { AuthProvider, useAuth } from '@/components/auth-context';
