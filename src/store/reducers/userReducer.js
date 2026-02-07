import { SET_USER, LOGOUT_USER } from '../actions/userActions';

const initialState = {
	currentUser: null,
};

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_USER:
			return { ...state, currentUser: action.payload };

		case LOGOUT_USER:
			return {
				...state,
				currentUser: null,
			};
		default:
			return state;
	}
};
