import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/token'
import { User } from '../models/User'
import { JwtPayload } from 'jsonwebtoken'

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).send({ error: 'Authenticated user required' })
    }

    // Приводим к JwtPayload, чтобы достать id
    const tokenData = verifyToken(token) as JwtPayload

    if (!tokenData || typeof tokenData === 'string' || !tokenData.id) {
      return res.status(401).send({ error: 'Invalid token' })
    }

    //
    const user = await User.findById(tokenData.id)

    if (!user) {
      return res.status(401).send({ error: 'Authenticated user not found' })
    }

    // Чтобы TS не ругался на отсутствие .user в Request
    ;(req as any).user = user
    next()
  } catch (e) {
    res.status(401).send({ error: 'Authentication failed' })
  }
}
