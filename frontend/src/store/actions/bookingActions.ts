import type { Dispatch } from 'redux';
import type { Booking } from '../reducers/bookingReducer';
import { apiFetch } from '../../utils/api';
import { checkPermission } from '../../utils/permissions';
import type { RootState } from '..';

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
	payload: string;
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
	(userId?: string | null) =>
	async (dispatch: Dispatch<BookingActions>, getState: () => RootState) => {
		const user = getState().users.currentUser;

		if (!userId && !checkPermission(user, 'VIEW_BOOKINGS')) {
			console.error('Нет прав для просмотра всех бронирований');
			return;
		}

		try {
			dispatch({ type: SET_BOOKINGS_LOADING, payload: true });

			const url = userId
				? `http://localhost:5000/api/bookings?userId=${userId}`
				: `http://localhost:5000/api/bookings`;
			const res = await apiFetch(url);
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
	(newBooking: Booking) =>
	async (dispatch: Dispatch<BookingActions>, getState: () => RootState) => {
		const user = getState().users.currentUser;

		if (!checkPermission(user, 'ADD_BOOKING')) {
			alert('Необходимо войти в систему, чтобы забронировать номер');
			return;
		}

		try {
			const response = await apiFetch('http://localhost:5000/api/bookings', {
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
	(_id: string) =>
	async (dispatch: Dispatch<BookingActions>, getState: () => RootState) => {
		const state = getState();
		const user = state.users.currentUser;

		const booking = state.bookings.list.find((b) => b._id === _id);

		if (!booking) {
			console.error('Бронирование не найдено в сторе');
			return;
		}

		const targetData = {
			userId: booking.userId,
			hotelOwnerId: booking.hotelOwnerId,
		};

		if (!checkPermission(user, 'DELETE_BOOKING', targetData)) {
			alert('У вас нет прав на отмену этого бронирования');
			return;
		}

		try {
			const response = await apiFetch(`http://localhost:5000/api/bookings/${_id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				dispatch({ type: DELETE_BOOKING, payload: _id });
			}
		} catch (error) {
			console.error('Ошибка при удалении из db.json:', error);
		}
	};

export const fetchRoomBookingsThunk =
	(roomId: string) => async (dispatch: Dispatch<BookingActions>) => {
		try {
			const res = await apiFetch(
				`http://localhost:5000/api/bookings/room/${roomId}`,
			);
			if (!res.ok) throw new Error('Ошибка загрузки занятых дат');
			const data: Booking[] = await res.json();

			dispatch({ type: SET_BOOKINGS, payload: data });
		} catch (e) {
			console.error(e);
		}
	};
