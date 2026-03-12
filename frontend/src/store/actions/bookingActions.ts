import type { Dispatch } from 'redux';
import { apiFetch } from '../../utils/api';
import { checkPermission } from '../../utils/permissions';
import type { RootState } from '..';
import type { Booking } from '../../types/models';
import type { BookingActions } from '../../types/typesStore';
import {
	ADD_BOOKING,
	DELETE_BOOKING,
	SET_BOOKINGS,
	SET_BOOKINGS_LOADING,
} from '../../components/constants/actionConstants';

// GET - получение данных
export const fetchBookingsThunk =
	() => async (dispatch: Dispatch<BookingActions>, getState: () => RootState) => {
		try {
			dispatch({ type: SET_BOOKINGS_LOADING, payload: true });
			const res = await apiFetch('/bookings');
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
			const response = await apiFetch('/bookings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newBooking),
			});

			if (response.ok) {
				const savedBooking: Booking = await response.json();
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
			const response = await apiFetch(`/bookings/${_id}`, {
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
			const res = await apiFetch(`/bookings/room/${roomId}`);
			if (!res.ok) throw new Error('Ошибка загрузки занятых дат');
			const data: Booking[] = await res.json();

			dispatch({ type: SET_BOOKINGS, payload: data });
		} catch (e) {
			console.error(e);
		}
	};
