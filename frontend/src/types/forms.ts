import type { Hotel } from '../store/reducers/hotelReducer';

type HotelBase = Omit<
	Hotel,
	'id' | 'ownerId' | 'rating' | 'reviewCount' | 'rooms' | 'cityId' | 'priceFrom'
>;

export interface HotelFormFields extends HotelBase {
	id?: number;
	cityId: string | number;
	priceFrom: string | number;
	rating?: number;
	reviewCount?: number;
}
