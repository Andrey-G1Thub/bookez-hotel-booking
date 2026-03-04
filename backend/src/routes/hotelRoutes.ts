import { hasRole } from './../middleware/hasRole'
import { Router } from 'express'
import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  addComment,
  deleteComment,
  updateHotelRooms,
  removePhoto,
} from '../controllers/hotelController'
import { authenticated } from '../middleware/authMiddleware'

import { ROLES } from '../constats/roles'
import { upload } from '../middleware/uploads'

const router = Router()

router.get('/', getHotels) // GET http://localhost:5000/api/hotels
router.post(
  '/',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER]),
  upload.single('image'),
  createHotel,
) // POST http://localhost:5000/api/hotels

// ж+для добавления фото
router.patch(
  '/:hotelId/rooms',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER]),
  upload.single('roomImage'), // <--- Добавляем здесь (ключ из фронтенда)
  updateHotelRooms,
)

router.patch(
  '/:id',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MANAGER]),
  upload.single('image'),
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
router.post('/:hotelId/remove-photo', authenticated, removePhoto)

export default router
