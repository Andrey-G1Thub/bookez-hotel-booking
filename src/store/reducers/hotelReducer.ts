import {
	ADD_HOTEL_SUCCESS,
	DELETE_HOTEL_SUCCESS,
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
	images: any[];
	id: number;
	hotelId: number;
}

export interface Comments {
	id: number;
	userId: number;
	userName: string;
	text: string;
	date: string;
}

export interface Hotel {
	id: number;
	name: string;
	cityId: number;
	description: string;
	image?: string;
	priceFrom: string;
	images?: string[];
	ownerId: number;
	rating: number;
	reviewCount: number;
	comments: Comments[];
	rooms: Room[];
}

export interface City {
	id: number;
	name: string;
	description: string;
}

// 2. Тип состояния
interface HotelState {
	allHotels: Hotel[];
	cities: City[];
}

const initialState: HotelState = {
	allHotels: [],
	cities: [],
};

export const hotelReducer = (state = initialState, action: HotelActions): HotelState => {
	switch (action.type) {
		case SET_HOTELS:
			return { ...state, allHotels: action.payload };
		case SET_CITIES:
			return { ...state, cities: action.payload };
		case UPDATE_HOTEL_ROOM_SUCCESS:
		case UPDATE_HOTEL_SUCCESS:
			return {
				...state,
				allHotels: state.allHotels.map((hotel) =>
					hotel.id === action.payload.id ? action.payload : hotel,
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
				allHotels: state.allHotels.filter((hotel) => hotel.id !== action.payload),
			};
		default:
			return state;
	}
};
