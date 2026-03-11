import { Router } from 'express'
import {
  getBookings,
  createBooking,
  deleteBooking,
  getRoomBookingsPublic,
} from '../controllers/bookingController'
import {
  authenticated,
  optionalAuthenticated,
} from '../middleware/authMiddleware'
import { hasRole } from '../middleware/hasRole'
import { ROLES } from '../constats/roles'

const router = Router()

router.get('/', optionalAuthenticated, getBookings)
router.post(
  '/',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  createBooking,
)
router.delete(
  '/:id',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  deleteBooking,
)
router.get('/room/:roomId', getRoomBookingsPublic)

export default router
