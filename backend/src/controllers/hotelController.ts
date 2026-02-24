import { Request, Response } from 'express'
import { Hotel } from '../models/Hotel'
// import { Hotel } from '../models/Hotel'

export const getHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find() // Достаем все документы из коллекции
    res.json(hotels)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении отелей', error })
  }
}

export const createHotel = async (req: Request, res: Response) => {
  try {
    const newHotel = new Hotel(req.body)
    const savedHotel = await newHotel.save()
    res.status(201).json(savedHotel)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании отеля', error })
  }
}
