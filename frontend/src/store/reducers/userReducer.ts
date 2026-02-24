import {
	SET_USER,
	LOGOUT_USER,
	FETCH_USERS_SUCCESS,
	DELETE_USER_SUCCESS,
	type UserActions,
} from '../actions/userActions';

export interface UserLimits {
	maxHotels: number;
	maxRooms: number;
}
export interface User {
	_id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	limits?: UserLimits;
}

interface UserState {
	currentUser: User | null;
	usersList: User[];
}

const savedUser = localStorage.getItem('bookez_user');

const initialState: UserState = {
	currentUser: savedUser ? JSON.parse(savedUser) : null,
	usersList: [],
};

export const userReducer = (state = initialState, action: UserActions): UserState => {
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
					(user: User) => user._id !== action.payload,
				),
			};

		default:
			return state;
	}
};
