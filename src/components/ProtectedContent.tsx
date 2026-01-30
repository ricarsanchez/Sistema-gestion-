/**
 * Componentes de protección para rutas
 * Usa estos para asegurar que solo usuarios autenticados con los permisos correctos puedan acceder
 */

'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/components/auth-context';
import { usePermissions } from '@/lib/usePermissions';
import { Lock } from 'lucide-react';
import type { SidebarItem, User } from '@/lib/types';

interface ProtectedContentProps {
  children: ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

/**
 * Componente para proteger contenido por rol
 *
 * @example
 * <ProtectedByRole requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedByRole>
 */
export function ProtectedByRole({
  children,
  requiredRole,
  fallback,
}: ProtectedContentProps) {
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  if (!requiredRole) return <>{children}</>;

  if (!hasRole(requiredRole)) {
    return fallback || <UnauthorizedFallback role={requiredRole} />;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger contenido por permisos
 *
 * @example
 * <ProtectedByPermission requiredPermissions={['productos.crear']}>
 *   <CreateProductButton />
 * </ProtectedByPermission>
 */
export function ProtectedByPermission({
  children,
  requiredPermissions = [],
  fallback,
}: ProtectedContentProps) {
  const { hasAllPermissions } = usePermissions();

  if (requiredPermissions.length === 0) return <>{children}</>;

  if (!hasAllPermissions(requiredPermissions)) {
    return fallback || <UnauthorizedFallback permission={requiredPermissions.join(', ')} />;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger contenido por rol O permisos
 *
 * @example
 * <ProtectedContent requiredRole="admin" requiredPermissions={['configuracion.acceder']}>
 *   <SettingsPanel />
 * </ProtectedContent>
 */
export function ProtectedContent({
  children,
  requiredRole,
  requiredPermissions = [],
  fallback,
}: ProtectedContentProps) {
  const { hasRole, hasAllPermissions } = usePermissions();

  const hasAccess =
    (!requiredRole || hasRole(requiredRole)) &&
    (requiredPermissions.length === 0 || hasAllPermissions(requiredPermissions));

  if (!hasAccess) {
    return fallback || <UnauthorizedFallback />;
  }

  return <>{children}</>;
}

/**
 * Componente para mostrar contenido si el usuario es admin
 */
export function AdminOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isAdmin } = usePermissions();

  if (!isAdmin()) {
    return fallback || null;
  }

  return <>{children}</>;
}

/**
 * Componente de pantalla no autorizada por defecto
 */
function UnauthorizedFallback({
  role,
  permission,
}: {
  role?: string;
  permission?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Lock className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Acceso Denegado
      </h3>
      <p className="text-gray-600 text-center max-w-sm">
        {role
          ? `Necesitas el rol "${role}" para acceder a esta sección.`
          : permission
            ? `Necesitas el permiso "${permission}" para acceder a esta sección.`
            : 'No tienes permisos suficientes para ver este contenido.'}
      </p>
    </div>
  );
}

/**
 * Componente para mostrar un botón solo si el usuario tiene permiso
 *
 * @example
 * <ConditionalButton permission="productos.crear">
 *   Crear Producto
 * </ConditionalButton>
 */
export function ConditionalButton({
  children,
  permission,
  role,
  className = '',
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  permission?: string;
  role?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { hasPermission, hasRole } = usePermissions();

  const hasAccess =
    (!role || hasRole(role)) && (!permission || hasPermission(permission));

  if (!hasAccess) {
    return null;
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
