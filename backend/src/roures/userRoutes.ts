import { Router } from 'express'
import { login } from '../controllers/userController'
import { User } from '../models/User'

const router = Router()

// Маршрут для логина (лучше использовать POST)
router.post('/login', login)

// Маршрут для получения всех пользователей (нужен для fetchAllUsersThunk)
router.get('/', async (req, res) => {
  try {
    const { email, password } = req.query

    if (email && password) {
      const user = await User.findOne({ email, password })
      return res.json(user ? [user] : [])
    }
    // Иначе просто отдаем всех
    const users = await User.find()
    res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

export default router
