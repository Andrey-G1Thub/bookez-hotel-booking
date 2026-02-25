import { Request, Response } from 'express'
import { City } from '../models/City'

// controllers/cityController.ts
export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.find()
    console.log(cities) // Посмотри в консоль сервера, есть ли там _id
    res.json(cities)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка' })
  }
}
