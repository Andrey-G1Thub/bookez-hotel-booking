import { ShieldAlert, Hotel } from 'lucide-react';
import { ROLES } from '../../utils/permissions';
import type { NavItem } from '../../types/models';
import { ROUTES } from './route';

export const NAVIGATION_CONFIG: NavItem[] = [
	{
		id: 'home',
		title: 'Главная',
		path: ROUTES.HOME,
	},
	{
		id: 'my_bookings',
		title: 'Мои Брони',
		path: ROUTES.BOOKINGS,
		onlyAuth: true,
	},
	{
		id: 'admin',
		title: 'Админ',
		path: ROUTES.ADMIN,
		icon: <ShieldAlert size={16} />,
		className: 'text-red-600 hover:bg-red-50',
		roles: [ROLES.ADMIN],
	},
	{
		id: 'manager',
		title: 'Менеджер',
		path: ROUTES.MANAGER,
		icon: <Hotel size={16} />,
		className: 'text-amber-600 hover:bg-amber-50',
		roles: [ROLES.ADMIN, ROLES.MANAGER],
	},
];
