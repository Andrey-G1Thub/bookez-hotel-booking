import { Router } from 'express'
import {
  deleteUser,
  getUsers,
  login,
  register,
  updateUser,
} from '../controllers/userController'
import { authenticated } from '../middleware/authMiddleware'
import { hasRole } from '../middleware/hasRole'
import { ROLES } from '../constats/roles'

const router = Router()

// Маршрут для логина
router.post('/login', login)
router.post('/register', register)
// Маршрут для получения всех пользователей
router.get('/', authenticated, hasRole([ROLES.ADMIN, ROLES.MANAGER]), getUsers)
router.patch('/:id', authenticated, hasRole([ROLES.ADMIN]), updateUser) // Для изменения роли
router.delete('/:id', authenticated, hasRole([ROLES.ADMIN]), deleteUser) // Для удаления

export default router
