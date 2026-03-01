import {
	ADD_BOOKING,
	DELETE_BOOKING,
	SET_BOOKINGS,
	SET_BOOKINGS_LOADING,
	type BookingActions,
} from '../actions/bookingActions';

export interface Booking {
	hotelOwnerId: string;
	_id?: string;
	userId: string;
	hotelId: string;
	roomId: string;
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

export const bookingReducer = (
	state = initialState,
	action: BookingActions,
): BookingState => {
	switch (action.type) {
		case SET_BOOKINGS_LOADING:
			return { ...state, loading: action.payload };

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
				list: state.list.filter((b) => String(b._id) !== String(action.payload)),
			};
		default:
			return state;
	}
};
