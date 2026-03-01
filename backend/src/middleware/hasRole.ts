import { RequestHandler } from 'express'

export const hasRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    // Берем user через any, чтобы TS не ругался на отсутствие свойства
    const user = (req as any).user

    if (!user || !roles.includes(user.role)) {
      res.status(403).send({ error: 'Access denied: insufficient permissions' })
      return // Важно: просто выходим, ничего не возвращая
    }
    next()
  }
}
