import { Router } from 'express'
import { addCity, getCities } from '../controllers/cityController'
import { authenticated } from '../middleware/authMiddleware'
import { hasRole } from '../middleware/hasRole'
import { ROLES } from '../constats/roles'

const router = Router()

router.get('/', getCities)
router.post('/', authenticated, hasRole([ROLES.ADMIN]), addCity)

export default router
