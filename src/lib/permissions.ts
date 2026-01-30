/**
 * Funciones de validación de acceso basadas en roles y permisos
 */

import type { User, SidebarItem } from './types';

/**
 * Verifica si un usuario tiene un rol específico
 * @param user - Objeto del usuario
 * @param role - Rol a verificar
 * @returns true si el usuario tiene el rol
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  return user.role === role || user.roles?.includes(role) || false;
};

/**
 * Verifica si un usuario es admin
 * @param user - Objeto del usuario
 * @returns true si es admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

/**
 * Verifica si el usuario tiene al menos uno de los roles requeridos
 * @param user - Objeto del usuario autenticado
 * @param requiredRoles - Array de roles permitidos
 * @returns true si el usuario tiene acceso
 */
export const canAccessByRole = (
  user: User | null,
  requiredRoles: string[]
): boolean => {
  // Si no hay usuario, denegar acceso
  if (!user) return false;

  // Si no hay roles requeridos, permitir acceso
  if (requiredRoles.length === 0) return true;

  // Verificar si el usuario tiene al menos un rol requerido
  return requiredRoles.some((role) =>
    user.roles?.includes(role) || user.role === role
  );
};

/**
 * Verifica si un usuario tiene al menos un permiso de una lista
 * @param user - Objeto del usuario
 * @param permissions - Array de permisos
 * @returns true si el usuario tiene al menos uno
 */
export const hasAnyPermission = (
  user: User | null,
  permissions: string[]
): boolean => {
  if (!user) return false;
  if (permissions.length === 0) return true;
  if (user.permissions?.includes('*')) return true;

  return permissions.some((permission) =>
    user.permissions?.includes(permission)
  );
};

/**
 * Verifica si el usuario tiene los permisos requeridos
 * @param user - Objeto del usuario autenticado
 * @param requiredPermissions - Array de permisos necesarios
 * @returns true si el usuario tiene todos los permisos
 */
export const canAccessByPermission = (
  user: User | null,
  requiredPermissions: string[]
): boolean => {
  // Si no hay usuario, denegar acceso
  if (!user) return false;

  // Si no hay permisos requeridos, permitir acceso
  if (requiredPermissions.length === 0) return true;

  // Si el usuario tiene el wildcard "*", permitir todo
  if (user.permissions?.includes('*')) return true;

  // Verificar si el usuario tiene TODOS los permisos requeridos
  return requiredPermissions.every((permission) =>
    user.permissions?.includes(permission)
  );
};

/**
 * Verifica si un usuario tiene todos los permisos de una lista
 * @param user - Objeto del usuario
 * @param permissions - Array de permisos
 * @returns true si el usuario tiene todos
 */
export const hasAllPermissions = (
  user: User | null,
  permissions: string[]
): boolean => {
  if (!user) return false;
  if (permissions.length === 0) return true;
  if (user.permissions?.includes('*')) return true;

  return permissions.every((permission) =>
    user.permissions?.includes(permission)
  );
};

/**
 * Valida acceso combinando roles Y permisos
 * Lógica:
 * - Primero verifica roles (requisito)
 * - Luego verifica permisos (requisito)
 * - Si ambos se cumplen, retorna true
 *
 * @param user - Objeto del usuario
 * @param item - Ítem del sidebar a validar
 * @returns true si el usuario puede acceder
 */
export const canAccess = (
  user: User | null,
  item: SidebarItem
): boolean => {
  // Validar existencia del usuario
  if (!user) return false;

  // Validar roles (AND lógico)
  const hasRequiredRole = canAccessByRole(user, item.roles);
  if (!hasRequiredRole) return false;

  // Validar permisos (AND lógico)
  const hasRequiredPermissions = canAccessByPermission(
    user,
    item.permissions
  );
  if (!hasRequiredPermissions) return false;

  // Ambas condiciones se cumplen
  return true;
};

/**
 * Filtra recursivamente el array de menú según permisos del usuario
 * Elimina ítems sin acceso y secciones vacías
 *
 * @param items - Array de ítems del sidebar
 * @param user - Usuario autenticado
 * @returns Array filtrado de ítems accesibles
 */
export const filterMenuByPermissions = (
  items: SidebarItem[],
  user: User | null
): SidebarItem[] => {
  return items
    .filter((item) => canAccess(user, item))
    .map((item) => ({
      ...item,
      // Filtrar recursivamente los hijos
      children: item.children
        ? filterMenuByPermissions(item.children, user)
        : null,
    }))
    .filter(
      // Eliminar secciones vacías (que tenían children pero quedaron sin ellos)
      (item) => !item.children || item.children.length > 0
    );
};