import {
	SET_USER,
	LOGOUT_USER,
	FETCH_USERS_SUCCESS,
	DELETE_USER_SUCCESS,
} from '../actions/userActions';

const savedUser = localStorage.getItem('bookez_user');

const initialState = {
	currentUser: savedUser ? JSON.parse(savedUser) : null,
	usersList: [],
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
		case FETCH_USERS_SUCCESS:
			return { ...state, usersList: action.payload };

		case DELETE_USER_SUCCESS:
			return {
				...state,
				usersList: state.usersList.filter(
					(user: any) => user.id !== action.payload,
				),
			};

		default:
			return state;
	}
};
