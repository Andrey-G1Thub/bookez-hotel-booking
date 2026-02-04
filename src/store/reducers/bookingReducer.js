// store/reducers/bookingReducer.js
import { CANCEL_BOOKING, SET_BOOKINGS } from '../actions/bookingActions';

const initialState = {
	// Здесь только то, что относится к бронированиям
	list: [
		// 	{
		// 		id: 1,
		// 		hotelName: 'Москва Гранд Отель',
		// 		roomType: 'Люкс',
		// 		checkIn: '2024-06-01',
		// 		checkOut: '2024-06-07',
		// 		price: 15000,
		// 		status: 'Подтверждено',
		// 		userId: 1,
		// 	},
	],
	loading: false,
};

export const bookingReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_BOOKINGS:
			return { ...state, list: action.payload };

		case CANCEL_BOOKING:
			return {
				...state,
				list: state.list.map((booking) =>
					booking.id === action.payload
						? { ...booking, status: 'Отменено' }
						: booking,
				),
			};
		default:
			return state;
	}
};
