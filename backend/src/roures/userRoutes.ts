import { Router } from 'express'
import { getUsers, login, register } from '../controllers/userController'

const router = Router()

// Маршрут для логина (лучше использовать POST)
router.post('/login', login)
router.post('/register', register)
// Маршрут для получения всех пользователей
router.get('/', getUsers)

export default router
