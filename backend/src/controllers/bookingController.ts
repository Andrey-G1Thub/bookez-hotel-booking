import { Request, Response } from 'express'
import { Booking } from '../models/booking'
// import { Booking } from '../models/Booking'

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query
    const filter = userId ? { userId } : {}
    const bookings = await Booking.find(filter)
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении броней', error })
  }
}

export const createBooking = async (req: Request, res: Response) => {
  try {
    const newBooking = new Booking(req.body)
    // Mongo сама создаст _id, если мы его не пришлем
    const savedBooking = await newBooking.save()
    res.status(201).json(savedBooking)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при бронировании', error })
  }
}

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await Booking.findByIdAndDelete(id)
    res.json({ message: 'Бронь успешно удалена' })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении', error })
  }
}
