import { hasRole } from './../middleware/hasRole'
import { Router } from 'express'
import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  addComment,
  deleteComment,
} from '../controllers/hotelController'
import { authenticated } from '../middleware/authMiddleware'

import { ROLES } from '../constats/roles'

const router = Router()

router.get('/', getHotels) // GET http://localhost:5000/api/hotels
router.post(
  '/',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER]),
  createHotel,
) // POST http://localhost:5000/api/hotels
router.patch(
  '/:id',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER]),
  updateHotel,
)
router.delete(
  '/:id',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER]),
  deleteHotel,
)
router.post(
  '/:hotelId/comments',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  addComment,
)
router.delete(
  '/:hotelId/comments/:commentId',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  deleteComment,
)

export default router
