import { Router } from 'express'
import {
  getBookings,
  createBooking,
  deleteBooking,
} from '../controllers/bookingController'

const router = Router()

router.get('/', getBookings) // GET http://localhost:5000/api/bookings
router.post('/', createBooking) // POST http://localhost:5000/api/bookings
router.delete('/:id', deleteBooking)

export default router
