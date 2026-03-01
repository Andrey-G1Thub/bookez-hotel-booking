import { Router } from 'express'
import {
  getBookings,
  createBooking,
  deleteBooking,
  getRoomBookingsPublic,
} from '../controllers/bookingController'
import { authenticated } from '../middleware/authMiddleware'
import { hasRole } from '../middleware/hasRole'
import { ROLES } from '../constats/roles'

const router = Router()

router.get(
  '/',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  getBookings,
) // GET http://localhost:5000/api/bookings
router.post(
  '/',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  createBooking,
) // POST http://localhost:5000/api/bookings
router.delete(
  '/:id',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  deleteBooking,
)
router.get('/room/:roomId', authenticated, getRoomBookingsPublic)

export default router
