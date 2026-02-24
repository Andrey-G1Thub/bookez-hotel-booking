import { ShieldAlert, Hotel } from 'lucide-react';
import { ROLES } from '../../utils/permissions';
// import { ROLES } from '../utils/permissions';

// Универсальный интерфейс
export interface NavItem {
	title: string;
	path: string;
	icon?: React.ReactNode;
	roles?: string[];
	className?: string;
	onlyAuth?: boolean; // Флаг: показывать только залогиненным
	hasSeparator?: boolean;
}

export const NAVIGATION_CONFIG: NavItem[] = [
	{
		title: 'Главная',
		path: '/',
	},
	{
		title: 'Мои Брони',
		path: '/bookings',
		onlyAuth: true,
	},
	{
		title: 'Админ',
		path: '/admin',
		icon: <ShieldAlert size={16} />,
		className: 'text-red-600 hover:bg-red-50',
		roles: [ROLES.ADMIN],
	},
	{
		title: 'Менеджер',
		path: '/manager',
		icon: <Hotel size={16} />,
		className: 'text-amber-600 hover:bg-amber-50',
		roles: [ROLES.ADMIN, ROLES.MANAGER],
	},
];
