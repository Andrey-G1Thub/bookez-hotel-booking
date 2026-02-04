import { SET_HOTELS } from '../actions/hotelActions';

const initialState = {
	allHotels: [],
};

export const hotelReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_HOTELS:
			return { ...state, allHotels: action.payload };
		default:
			return state;
	}
};
