import type { Hotel } from '../store/reducers/hotelReducer';

type HotelBase = Omit<
	Hotel,
	'id' | '_id' | 'ownerId' | 'rating' | 'reviewCount' | 'rooms' | 'cityId' | 'priceFrom'
>;

export interface HotelFormFields extends HotelBase {
	// id?: number;
	_id?: string;
	cityId: string;
	priceFrom: string | number;
	rating?: number;
	reviewCount?: number;
	imageFile?: File;
}
// interface HotelFormFields { ... imageFile?: File }
