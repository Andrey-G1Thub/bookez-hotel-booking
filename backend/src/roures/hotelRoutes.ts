import { Router } from 'express'
import { getHotels, createHotel } from '../controllers/hotelController'

const router = Router()

router.get('/', getHotels) // GET http://localhost:5000/api/hotels
router.post('/', createHotel) // POST http://localhost:5000/api/hotels

export default router
