import { SET_ROOMS } from '../actions/roomActions';

const initialState = {
	roomsList: [],
};

export const roomReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ROOMS:
			return { ...state, roomsList: action.payload };

		default:
			return state;
	}
};
