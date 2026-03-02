import {
	ADD_CITY_SUCCESS,
	ADD_HOTEL_SUCCESS,
	DELETE_HOTEL_SUCCESS,
	FETCH_HOTELS_START,
	SET_CITIES,
	SET_HOTELS,
	UPDATE_HOTEL_ROOM_SUCCESS,
	UPDATE_HOTEL_SUCCESS,
	type HotelActions,
} from '../actions/hotelActions';

export interface Room {
	type: string;
	capacity: number;
	price: number;
	amenities: string;
	images: string[];
	_id: string;
	hotelId: string;
}

export interface Comments {
	_id?: string;
	userId: string;
	userName: string;
	text: string;
	date: string;
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

export interface City {
	_id?: string;
	name: string;
	description: string;
	isLoading: false;
}

// 2. Тип состояния
interface HotelState {
	allHotels: Hotel[];
	cities: City[];
	isLoading: boolean;
	error: string | null;
}

const initialState: HotelState = {
	allHotels: [],
	cities: [],
	isLoading: false,
	error: null,
};

export const hotelReducer = (state = initialState, action: HotelActions): HotelState => {
	switch (action.type) {
		// Если загрузка началась
		case FETCH_HOTELS_START:
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case SET_HOTELS:
			return { ...state, allHotels: action.payload, isLoading: false };
		case SET_CITIES:
			return { ...state, cities: action.payload };

		case ADD_CITY_SUCCESS:
			return {
				...state,
				cities: [...state.cities, action.payload], // Добавляем новый город в массив
			};
		case UPDATE_HOTEL_ROOM_SUCCESS:
		case UPDATE_HOTEL_SUCCESS:
			return {
				...state,
				allHotels: state.allHotels.map((hotel) =>
					hotel._id === action.payload._id ? action.payload : hotel,
				),
			};

		case ADD_HOTEL_SUCCESS:
			return {
				...state,
				allHotels: [...state.allHotels, action.payload],
			};

		case DELETE_HOTEL_SUCCESS:
			return {
				...state,
				allHotels: state.allHotels.filter(
					(hotel) => hotel._id !== action.payload,
				),
			};
		default:
			return state;
	}
};
