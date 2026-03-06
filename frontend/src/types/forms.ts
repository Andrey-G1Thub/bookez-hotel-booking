// Поля форм (HotelFormFields, RoomFormFields, RsterData)egi forms.ts

import type { Hotel, Room } from './models';

type HotelBase = Omit<
	Hotel,
	'id' | '_id' | 'ownerId' | 'rating' | 'reviewCount' | 'rooms' | 'cityId' | 'priceFrom'
>;
export interface HotelFormFields extends HotelBase {
	_id?: string;
	cityId: string;
	priceFrom: string | number;
	rating?: number;
	reviewCount?: number;
	imageFile?: File;
}
export interface RoomFormFields extends Omit<Room, '_id' | 'hotelId'> {
	imageFile?: File;
}
export interface Credentials {
	email: string;
	password?: string;
}
export interface RegisterData extends Credentials {
	name: string;
	confirmPassword?: string;
}
export interface SearchFilters {
	cityId: string | null;
	checkIn: string;
	checkOut: string;
}
