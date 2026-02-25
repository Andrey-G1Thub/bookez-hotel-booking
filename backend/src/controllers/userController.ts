import { Request, Response } from 'express'
import { User } from '../models/User'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email, password }) // Ищем в MongoDB
    if (user) {
      res.json(user) // Возвращаем юзера фронтенду
    } else {
      res.status(401).json({ message: 'Неверный email или пароль' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
