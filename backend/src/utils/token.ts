import * as jwt from 'jsonwebtoken'

// export const secret = process.env.JWT_SECRET
export const secret = process.env.JWT_SECRET || 'default_secret_key'

export const generateToken = (payload: object) => {
  // return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
  return jwt.sign(payload, secret, { expiresIn: '30d' })
}

export const verifyToken = (token: string) => {
  try {
    // return jwt.verify(token, JWT_SECRET)
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}
