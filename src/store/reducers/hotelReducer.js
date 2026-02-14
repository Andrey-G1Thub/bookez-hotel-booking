import {
	ADD_HOTEL_SUCCESS,
	DELETE_HOTEL_SUCCESS,
	SET_CITIES,
	SET_HOTELS,
	UPDATE_HOTEL_ROOM_SUCCESS,
	UPDATE_HOTEL_SUCCESS,
} from '../actions/hotelActions';

const initialState = {
	allHotels: [],
	cities: [],
};

export const hotelReducer = (state = initialState, action) => {
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
