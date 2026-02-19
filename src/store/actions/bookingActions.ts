import type { Dispatch } from 'redux';
import type { Booking } from '../reducers/bookingReducer';

export const SET_BOOKINGS = 'SET_BOOKINGS' as const;
export const ADD_BOOKING = 'ADD_BOOKING' as const;
export const DELETE_BOOKING = 'DELETE_BOOKING' as const;
export const SET_BOOKINGS_LOADING = 'SET_BOOKINGS_LOADING' as const;
interface SetBookingsAction {
	type: typeof SET_BOOKINGS;
	payload: Booking[];
}
interface AddBookingAction {
	type: typeof ADD_BOOKING;
	payload: Booking;
}
interface DeleteBookingAction {
	type: typeof DELETE_BOOKING;
	payload: number | string;
}
interface SetLoadingAction {
	type: typeof SET_BOOKINGS_LOADING;
	payload: boolean;
}

export type BookingActions =
	| SetBookingsAction
	| AddBookingAction
	| DeleteBookingAction
	| SetLoadingAction;

// GET - получение данных
export const fetchBookingsThunk =
	(userId: number | null) => async (dispatch: Dispatch<BookingActions>) => {
		try {
			dispatch({ type: SET_BOOKINGS_LOADING, payload: true });
			// Если userId не передан, мы можем либо не грузить ничего,
			// либо грузить всё (если это админ). Для обычного юзера фильтруем:
			const url = userId
				? `http://localhost:3001/bookings?userId=${userId}`
				: `http://localhost:3001/bookings`;
			const res = await fetch(url);
			if (!res.ok) throw new Error('Ошибка сети');
			const data: Booking[] = await res.json();

			dispatch({ type: SET_BOOKINGS, payload: data });
		} catch (e) {
			console.error('Ошибка загрузки броней', e);
		} finally {
			dispatch({ type: SET_BOOKINGS_LOADING, payload: false }); // Выключаем спиннер
		}
	};

// POST - добавление новой брони
export const addBookingThunk =
	(newBooking: Booking) => async (dispatch: Dispatch<BookingActions>) => {
		try {
			const response = await fetch('http://localhost:3001/bookings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newBooking),
			});

			if (response.ok) {
				const savedBooking: Booking = await response.json();
				// Обновляем Redux только если сервер ответил "ОК"
				dispatch({ type: ADD_BOOKING, payload: savedBooking });
			}
		} catch (error) {
			console.error('Ошибка при записи в db.json:', error);
		}
	};

export const deleteBookingThunk =
	(id: number | string) => async (dispatch: Dispatch<BookingActions>) => {
		try {
			// Отправляем запрос на удаление конкретного ID
			const response = await fetch(`http://localhost:3001/bookings/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				dispatch({ type: DELETE_BOOKING, payload: id });
			}
		} catch (error) {
			console.error('Ошибка при удалении из db.json:', error);
		}
	};
