import { Request, Response } from 'express'
import { City } from '../models/City'

// controllers/cityController.ts
export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.find()

    res.json(cities)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении городов' })
  }
}
export const addCity = async (req: Request, res: Response) => {
  try {
    const newCity = new City(req.body)
    await newCity.save()
    res.status(201).json(newCity)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании города' })
  }
}
