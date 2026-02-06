import { MOCK_DATA } from '../../data/mockData';
export const CANCEL_BOOKING = 'CANCEL_BOOKING';
export const SET_BOOKINGS = 'SET_BOOKINGS';

// GET - получение данных
export const fetchBookings = () => async (dispatch) => {
	const response = await fetch('http://localhost:3001/bookings');
	const data = await response.json();
	dispatch({ type: 'SET_BOOKINGS', payload: data });
};

// POST - добавление новой брони
export const addBookingThunk = (newBooking) => async (dispatch) => {
	const response = await fetch('http://localhost:3001/bookings', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newBooking),
	});
	const savedBooking = await response.json();
	dispatch(addBookingThunk(newBooking));
};

// DELETE или PATCH - отмена брони
export const cancelBookingThunk = (id) => async (dispatch) => {
	// В JSON-server для изменения статуса используем PATCH
	await fetch(`http://localhost:3001/bookings/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status: 'Отменено' }),
	});
	dispatch({ type: 'CANCEL_BOOKING', payload: id });
};
