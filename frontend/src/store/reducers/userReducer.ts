import {
	DELETE_USER_SUCCESS,
	FETCH_USERS_SUCCESS,
	LOGOUT_USER,
	SET_USER,
} from '../../components/constants/actionConstants';
import type { User } from '../../types/models';
import type { UserActions, UserState } from '../../types/typesStore';
import { getInitialUser } from '../../utils/localStorageHelper';

const initialState: UserState = {
	currentUser: getInitialUser(),
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
