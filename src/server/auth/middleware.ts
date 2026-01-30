import type { NextApiRequest, NextApiResponse } from 'next'

import { getUserCtxCached } from '../services/permissions-service'
import { hasRole, hasAnyPermission, hasAllPermissions, hasPermission } from './utils'

type AuthorizeOptions = {
  roles?: string[]
  permissions?: string[] | { any?: string[]; all?: string[] }
  allowAdmin?: boolean
}

// Middleware factory that returns an Express-style middleware or a Next.js API handler wrapper
export function authorize(options: AuthorizeOptions) {
  return async function (req: any, res: any, next?: any) {
    try {
      const user = req.user
      if (!user) {
        // No autenticado
        if (res && typeof res.status === 'function') return res.status(401).json({ error: 'No autenticado' })
        throw new Error('No autenticado')
      }

      const ctx = await getUserCtxCached(user.id)

      if (options.allowAdmin && ctx.isAdmin) {
        if (next) return next()
        return
      }

      if (options.roles && options.roles.length > 0) {
        if (hasRole(ctx, options.roles)) {
          if (next) return next()
          return
        }
        if (res && typeof res.status === 'function') return res.status(403).json({ error: 'Forbidden', message: 'Requiere rol ' + options.roles.join(',') })
        throw new Error('Forbidden')
      }

      if (options.permissions) {
        const permsAny = Array.isArray(options.permissions) ? null : (options.permissions as any).any ?? null
        const permsAll = Array.isArray(options.permissions) ? null : (options.permissions as any).all ?? null

        if (permsAny) {
          if (hasAnyPermission(ctx, permsAny)) {
            if (next) return next()
            return
          }
          if (res && typeof res.status === 'function') return res.status(403).json({ error: 'Forbidden', message: 'Requiere al menos uno de ' + permsAny.join(',') })
          throw new Error('Forbidden')
        }

        if (permsAll) {
          if (hasAllPermissions(ctx, permsAll)) {
            if (next) return next()
            return
          }
          if (res && typeof res.status === 'function') return res.status(403).json({ error: 'Forbidden', message: 'Requiere todos: ' + permsAll.join(',') })
          throw new Error('Forbidden')
        }

        // array plain => require all
        if (Array.isArray(options.permissions)) {
          if (hasAllPermissions(ctx, options.permissions)) {
            if (next) return next()
            return
          }
          if (res && typeof res.status === 'function') return res.status(403).json({ error: 'Forbidden', message: 'Requiere permisos: ' + options.permissions.join(',') })
          throw new Error('Forbidden')
        }
      }

      // Si no se definieron roles ni permisos, permitir por defecto (o cambiar a DENEGAR explícito según política)
      if (next) return next()
      return
    } catch (err: any) {
      if (res && typeof res.status === 'function') return res.status(500).json({ error: 'Server error', message: err.message })
      throw err
    }
  }
}

export default authorize
