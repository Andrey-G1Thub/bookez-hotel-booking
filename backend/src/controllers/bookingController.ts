import { Request, Response } from 'express'
import { Booking } from '../models/Booking'
import { ROLES } from '../constats/roles'

export const getBookings = async (req: any, res: Response) => {
  try {
    const user = req.user

    if (user?.role === ROLES.ADMIN) {
      const allBookings = await Booking.find()
      return res.json(allBookings)
    }

    const publicData = await Booking.find({}, 'roomId checkIn checkOut status')

    res.json(publicData)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении броней', error })
  }
}

export const createBooking = async (req: any, res: Response) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      hotelId,
      hotelOwnerId,
      hotelName,
      roomType,
      price,
    } = req.body

    //  Проверяем пересечение ТОЛЬКО для подтвержденных броней
    const overlappingBooking = await Booking.findOne({
      roomId: roomId,
      status: 'Подтверждено',
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      ],
    })

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'Этот номер уже забронирован на выбранные даты',
      })
    }

    const newBooking = new Booking({
      userId: req.user._id, //  ID того, кто делает запрос
      hotelId,
      hotelOwnerId,
      roomId,
      hotelName,
      roomType,
      checkIn,
      checkOut,
      price,
      status: 'Подтверждено',
    })

    const savedBooking = await newBooking.save()
    res.status(201).json(savedBooking)
  } catch (error: any) {
    console.error('SERVER CREATE BOOKING ERROR:', error)
    res
      .status(400)
      .json({ message: 'Ошибка при бронировании', error: error.message })
  }
}

export const deleteBooking = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const user = req.user
    const booking = await Booking.findById(id)

    if (!booking) {
      return res.status(404).json({ message: 'Бронь не найдена' })
    }

    const isClient = booking.userId.toString() === user._id.toString()

    const isAdmin = user.role === ROLES.ADMIN

    const isHotelOwner =
      user.role === ROLES.MANAGER &&
      booking.hotelOwnerId?.toString() === user._id.toString()

    if (!isClient && !isAdmin && !isHotelOwner) {
      return res
        .status(403)
        .json({ message: 'У вас нет прав на отмену этой брони' })
    }

    await Booking.findByIdAndDelete(id)
    res.json({ message: 'Бронь успешно удалена' })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении', error })
  }
}

export const getRoomBookingsPublic = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params

    const bookings = await Booking.find({ roomId, status: 'Подтверждено' })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения дат' })
  }
}
