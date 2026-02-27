import { Router } from 'express'
import { addCity, getCities } from '../controllers/cityController'

const router = Router()

router.get('/', getCities)
router.post('/', addCity)

export default router
