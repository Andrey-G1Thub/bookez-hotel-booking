import { Request, Response } from 'express'
import { Hotel } from '../models/Hotel'

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

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // console.log('Updating hotel with ID:', id)
    // console.log('Data received:', req.body)

    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true },
    )

    if (!updatedHotel) {
      return res.status(404).json({ message: 'Отель не найден' })
    }

    res.json(updatedHotel)
  } catch (error) {
    console.error('Update Error:', error)
    res.status(400).json({ message: 'Ошибка при обновлении', error })
  }
}
export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedHotel = await Hotel.findByIdAndDelete(id)

    if (!deletedHotel) {
      return res.status(404).json({ message: 'Отель не найден' })
    }

    res.json({ message: 'Отель успешно удален' })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении отеля', error })
  }
}
