import { SET_CITIES, SET_HOTELS } from '../actions/hotelActions';

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
		default:
			return state;
	}
};
