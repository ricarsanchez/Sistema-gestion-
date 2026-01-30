/**
 * Hook personalizado para validar permisos en componentes
 */

'use client';

import { useAuth } from '@/components/auth-context';
import {
  canAccess,
  canAccessByRole,
  canAccessByPermission,
  hasRole,
  isAdmin,
  hasAnyPermission,
  hasAllPermissions,
} from '@/lib/permissions';
import type { SidebarItem, User } from '@/lib/types';

/**
 * Hook para validar acceso a funcionalidades
 *
 * @example
 * const { canAccessMenuItem, hasPermission, isUserAdmin } = usePermissions();
 *
 * if (hasPermission('productos.crear')) {
 *   return <CreateProductButton />;
 * }
 */
export function usePermissions() {
  const { user } = useAuth();

  return {
    user,
    isLoading: !user,

    // Validación de items del menú
    canAccessMenuItem: (item: SidebarItem): boolean => canAccess(user, item),

    // Validaciones de roles
    canAccessByRole: (roles: string[]): boolean =>
      canAccessByRole(user, roles),
    hasRole: (role: string): boolean => hasRole(user, role),
    isAdmin: (): boolean => isAdmin(user),

    // Validaciones de permisos
    canAccessByPermission: (permissions: string[]): boolean =>
      canAccessByPermission(user, permissions),
    hasPermission: (permission: string): boolean =>
      canAccessByPermission(user, [permission]),
    hasAnyPermission: (permissions: string[]): boolean =>
      hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: string[]): boolean =>
      hasAllPermissions(user, permissions),

    // Método combinado
    canAccess: (item: SidebarItem): boolean => canAccess(user, item),
  };
}

/**
 * Hook para obtener el usuario actual
 */
export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook para validar si el usuario está autenticado
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
