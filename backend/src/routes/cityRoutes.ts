import { Router } from 'express'
import { addCity, getCities } from '../controllers/cityController'
import { authenticated } from '../middleware/authMiddleware'
import { hasRole } from '../middleware/hasRole'
import { ROLES } from '../constats/roles'
import { City } from '../models/City'

const router = Router()

router.get('/', getCities)
router.post('/', authenticated, async (req: any, res) => {
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Доступ только для админа' })
    }
    const newCity = new City(req.body)
    await newCity.save()
    res.status(201).json(newCity)
  } catch (e) {
    res.status(400).json({ message: 'Ошибка при создании города' })
  }
})

export default router
