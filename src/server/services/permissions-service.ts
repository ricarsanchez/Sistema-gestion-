import { buildUserCtx, buildUserCtxFromDb, type UserCtx } from '../auth/utils'
import {prisma} from '../../lib/prisma'

// Simple cache (en memoria) para demostración. En producción usar Redis.
const cache = new Map<string, { ctx: UserCtx; expiresAt: number }>()
const DEFAULT_TTL_MS = 1000 * 60 * 10 // 10 minutos

export async function getUserCtxFromDb(userId: string): Promise<UserCtx> {
  // Integrar con Prisma / su esquema real.
  // Ejemplo simplificado: obtener roles y permisos desde la DB
  try {
    // Pseudo-queries: adaptar a su schema Prisma
    // const user = await prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { permissions: true } }, userPermissions: true } })
    return await buildUserCtxFromDb(prisma as any, userId)
  } catch (err) {
    return buildUserCtx({ userId, roles: [], permissions: [], userOverrides: {} })
  }
}

export async function getUserCtxCached(userId: string, ttlMs = DEFAULT_TTL_MS): Promise<UserCtx> {
  const key = `user:perms:${userId}`
  const now = Date.now()
  const cached = cache.get(key)
  if (cached && cached.expiresAt > now) return cached.ctx

  const ctx = await getUserCtxFromDb(userId)
  cache.set(key, { ctx, expiresAt: now + ttlMs })
  return ctx
}

export function invalidateUserCtx(userId: string) {
  const key = `user:perms:${userId}`
  cache.delete(key)
}

export default { getUserCtxCached, invalidateUserCtx, getUserCtxFromDb }
