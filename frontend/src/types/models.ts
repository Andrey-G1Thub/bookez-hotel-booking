// Сущности БД

import type { ROLES } from '../utils/permissions';

export interface User {
	_id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	limits?: {
		maxHotels: number;
		maxRooms: number;
	};
}
export interface UserLimits {
	maxHotels: number;
	maxRooms: number;
}

export interface Room {
	_id: string;
	hotelId: string;
	type: string;
	capacity: number;
	price: number;
	amenities: string;
	images: string[];
}

export interface Hotel {
	_id: string;
	name: string;
	cityId: string;
	description: string;
	image?: string;
	priceFrom: number;
	images?: string[];
	ownerId: string;
	rating: number;
	reviewCount: number;
	comments: Comments[];
	rooms: Room[];
}
export interface Booking {
	hotelOwnerId: string;
	_id?: string;
	userId: string;
	hotelId: string;
	roomId: string;
	hotelName: string;
	roomType: string;
	checkIn: string;
	checkOut: string;
	price: number;
	status: 'Подтверждено' | 'Ожидание' | 'Отменено';
}
export interface Comments {
	_id?: string;
	userId: string;
	userName: string;
	text: string;
	date: string;
}
export interface City {
	_id?: string;
	name: string;
	description: string;
}

export interface NavItem {
	id: string;
	title: string;
	path: string;
	icon?: React.ReactNode;
	// roles?: string[];
	roles?: (typeof ROLES)[keyof typeof ROLES][];
	className?: string;
	onlyAuth?: boolean; // Флаг: показывать только залогиненным
	hasSeparator?: boolean;
}
