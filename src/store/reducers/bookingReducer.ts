import {
	ADD_BOOKING,
	DELETE_BOOKING,
	SET_BOOKINGS,
	type BookingActions,
} from '../actions/bookingActions';

export interface Booking {
	id: number;
	userId: number;
	hotelId: number;
	roomId: number;
	hotelName: string;
	roomType: string;
	checkIn: string;
	checkOut: string;
	price: number;
	status: 'Подтверждено' | 'Ожидание' | 'Отменено';
}

interface BookingState {
	list: Booking[];
	loading: boolean;
}

const initialState: BookingState = {
	list: [],
	loading: false,
};

export const bookingReducer = (state = initialState, action: BookingActions) => {
	switch (action.type) {
		case SET_BOOKINGS:
			return { ...state, list: action.payload };

		case ADD_BOOKING:
			return {
				...state,
				list: [...state.list, action.payload],
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
