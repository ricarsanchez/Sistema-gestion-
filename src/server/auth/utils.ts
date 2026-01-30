// Utilitarios de autorización (TypeScript)
import type { PrismaClient } from '@prisma/client'

export type UserCtx = {
  userId: string
  roles: string[]
  permissionsSet: Set<string>
  userOverrides: Map<string, 'allow' | 'deny'>
  isAdmin?: boolean
}

export function hasRole(ctx: UserCtx, roleOrRoles: string | string[]): boolean {
  if (!ctx) return false
  if (Array.isArray(roleOrRoles)) return roleOrRoles.some(r => ctx.roles.includes(r))
  return ctx.roles.includes(roleOrRoles)
}

export function hasPermission(ctx: UserCtx, permission: string): boolean {
  if (!ctx) return false
  const override = ctx.userOverrides.get(permission)
  if (override === 'deny') return false
  if (override === 'allow') return true
  if (ctx.permissionsSet.has(permission)) return true
  return false
}

export function hasAnyPermission(ctx: UserCtx, perms: string[]): boolean {
  if (!ctx) return false
  return perms.some(p => hasPermission(ctx, p))
}

export function hasAllPermissions(ctx: UserCtx, perms: string[]): boolean {
  if (!ctx) return false
  return perms.every(p => hasPermission(ctx, p))
}

export function buildUserCtx(payload: {
  userId: string
  roles?: string[]
  permissions?: string[]
  userOverrides?: { [perm: string]: 'allow' | 'deny' }
  isAdmin?: boolean
}): UserCtx {
  return {
    userId: payload.userId,
    roles: payload.roles ?? [],
    permissionsSet: new Set(payload.permissions ?? []),
    userOverrides: new Map(Object.entries(payload.userOverrides ?? {})),
    isAdmin: !!payload.isAdmin,
  }
}

// Placeholder: helper to merge role-permissions + user overrides
export async function buildUserCtxFromDb(prisma: PrismaClient, userId: string): Promise<UserCtx> {
  // Implement integration with your DB/Prisma schema here.
  // This is a stub: query roles and permissions, then compose UserCtx.
  // Example (pseudo):
  // const roles = await prisma.user.findUnique({ where: { id: userId } }).roles()
  // const perms = await prisma.rolePermission.findMany({ where: { roleId: { in: rolesIds } } })
  return buildUserCtx({ userId, roles: [], permissions: [], userOverrides: {} })
}

export default {
  hasRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  buildUserCtx,
}
