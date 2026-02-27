import { Request, Response } from 'express'
import { User } from '../models/User'
import * as bcrypt from 'bcryptjs'
import { generateToken } from '../utils/token'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    // Ищем пользователя только по email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' })
    }

    // Сравниваем введенный пароль с тем, что в базе (хешем)
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (isPasswordCorrect) {
      const token = generateToken({ id: user._id, role: user.role })

      const { password: userHash, ...userResponse } = user.toObject()

      res.json({ user: userResponse, token: token })
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

    //  Проверяем, нет ли уже такого пользователя
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует!' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    // 2. Создаем нового пользователя
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword, //  здесь нужно будет добавить хеширование
      role: role || 'user', // По умолчанию 'user'
      limits: { maxHotels: 0, maxRooms: 0 }, // Начальные лимиты
    })

    const savedUser = await newUser.save()

    // Убираем пароль из ответа фронтенду для безопасности
    const { password: _, ...userResponse } = savedUser.toObject()

    res.status(201).json(userResponse)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации', error })
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { email } = req.query

    if (email) {
      const user = await User.findOne({ email })
      return res.json(user ? [user] : [])
    }
    // Иначе просто отдаем всех
    // const users = await User.find()
    const users = await User.find().select('-password') // или лучше так?
    res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
