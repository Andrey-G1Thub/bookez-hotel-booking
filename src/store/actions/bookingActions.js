import { MOCK_DATA } from '../../data/mockData';
export const CANCEL_BOOKING = 'CANCEL_BOOKING';
export const SET_BOOKINGS = 'SET_BOOKINGS';
export const SET_HOTELS = 'SET_HOTELS';
// store/actions/bookingActions.js (продолжение)
export const cancelBookingThunk = (bookingId) => {
	return (dispatch) => {
		// Здесь обычно идет fetch() к API
		setTimeout(() => {
			dispatch({
				type: CANCEL_BOOKING,
				payload: bookingId,
			});
		}, 500); // Имитация задержки сети
	};
};
// store/actions/bookingActions.js

export const fetchBookings = () => {
	return (dispatch) => {
		// Имитируем запрос к серверу
		setTimeout(() => {
			// В реальной жизни тут был бы fetch, но мы берем из MOCK_DATA
			// Предположим, там есть массив BOOKINGS
			dispatch({
				type: SET_BOOKINGS,
				payload: MOCK_DATA.BOOKINGS || [],
			});
		}, 300);
	};
};
export const setHotels = (hotels) => ({
	type: SET_HOTELS,
	payload: hotels,
});
