// store/reducers/bookingReducer.js
import { ADD_BOOKING, DELETE_BOOKING, SET_BOOKINGS } from '../actions/bookingActions';

const initialState = {
	// Здесь только то, что относится к бронированиям
	list: [],
	loading: false,
};

export const bookingReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_BOOKINGS:
			return { ...state, list: action.payload };

		case ADD_BOOKING: // Проверь, чтобы это имя совпадало с тем, что в dispatch
			return {
				...state,
				list: [...state.list, action.payload], // Создаем НОВЫЙ массив с новой бронью
			};

		case DELETE_BOOKING:
			return {
				...state,
				list: state.list.filter((b) => String(b.id) !== String(action.payload)),
			};
		default:
			return state;
	}
};
