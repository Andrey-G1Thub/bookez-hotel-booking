import { Router } from 'express'
import { City } from '../models/City'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const cities = await City.find()
    res.json(cities)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении городов' })
  }
})

// Добавим сразу POST, чтобы можно было добавлять города через Postman или фронт
router.post('/', async (req, res) => {
  try {
    const newCity = new City(req.body)
    await newCity.save()
    res.status(201).json(newCity)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании города' })
  }
})

export default router
