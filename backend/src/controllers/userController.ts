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

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body

    // 1. Проверяем, нет ли уже такого пользователя
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует!' })
    }

    // 2. Создаем нового пользователя
    const newUser = new User({
      name,
      email,
      phone,
      password, //  здесь нужно будет добавить хеширование
      role: role || 'user', // По умолчанию 'user', если не передано иное
      limits: { maxHotels: 0, maxRooms: 0 }, // Начальные лимиты
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации', error })
  }
}
