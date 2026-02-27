import { Router } from 'express'
import {
  deleteUser,
  getUsers,
  login,
  register,
  updateUser,
} from '../controllers/userController'

const router = Router()

// Маршрут для логина
router.post('/login', login)
router.post('/register', register)
// Маршрут для получения всех пользователей
router.get('/', getUsers)
router.patch('/:id', updateUser) // Для изменения роли
router.delete('/:id', deleteUser) // Для удаления

export default router
