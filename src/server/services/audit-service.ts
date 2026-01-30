import {prisma} from '../../lib/prisma'

export async function logAuthorizationDecision(payload: {
  userId?: string
  path: string
  method: string
  required: any
  granted: boolean
  ip?: string
  reason?: string
  metadata?: any
}) {
  try {
    // Console trace for dev
    console.info('[AUTH-AUDIT]', { ...payload, ts: new Date().toISOString() })

    // Intentamos escribir en DB si existe la tabla / modelo `auditLog` o similar.
    // Ajustar según su esquema Prisma.
    if (prisma && typeof (prisma as any).auditLog?.create === 'function') {
      await (prisma as any).auditLog.create({ data: {
        userId: payload.userId ?? null,
        path: payload.path,
        method: payload.method,
        required: JSON.stringify(payload.required),
        granted: payload.granted,
        ip: payload.ip ?? null,
        reason: payload.reason ?? null,
        metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
      } })
    }
  } catch (err) {
    // No fallamos la petición si el log falla
    console.warn('audit log failed', err)
  }
}

export default { logAuthorizationDecision }
