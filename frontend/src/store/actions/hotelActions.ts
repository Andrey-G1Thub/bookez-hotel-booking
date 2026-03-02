import { addCityThunk } from './cityActions';
import type { Dispatch } from 'redux';
import type { City, Comments, Hotel, Room } from '../reducers/hotelReducer';
import type { RootState } from '..';
import { apiFetch } from '../../utils/api';
import type { text } from 'node:stream/consumers';
import { checkPermission } from '../../utils/permissions';

export const SET_HOTELS = 'SET_HOTELS';
export const SET_CITIES = 'SET_CITIES';
export const ADD_HOTEL_SUCCESS = 'ADD_HOTEL_SUCCESS';
export const DELETE_HOTEL_SUCCESS = 'DELETE_HOTEL_SUCCESS';
export const UPDATE_HOTEL_SUCCESS = 'UPDATE_HOTEL_SUCCESS';
export const UPDATE_HOTEL_ROOM_SUCCESS = 'UPDATE_HOTEL_ROOM_SUCCESS';
export const FETCH_HOTELS_START = 'FETCH_HOTELS_START';
export const ADD_CITY_SUCCESS = 'ADD_CITY_SUCCESS';

interface SetHotelsAction {
	type: typeof SET_HOTELS;
	payload: Hotel[];
}
interface SetCitiesAction {
	type: typeof SET_CITIES;
	payload: City[];
}
interface AddHotelAction {
	type: typeof ADD_HOTEL_SUCCESS;
	payload: Hotel;
}
interface DeleteHotelAction {
	type: typeof DELETE_HOTEL_SUCCESS;
	payload: string;
}
interface UpdateHotelAction {
	type: typeof UPDATE_HOTEL_SUCCESS;
	payload: Hotel;
}
interface UpdateHotelRoomAction {
	type: typeof UPDATE_HOTEL_ROOM_SUCCESS;
	payload: Hotel;
}
interface FetchHotelsStartAction {
	type: typeof FETCH_HOTELS_START;
}

export type HotelActions =
	| FetchHotelsStartAction
	| SetHotelsAction
	| SetCitiesAction
	| AddHotelAction
	| DeleteHotelAction
	| UpdateHotelAction
	| UpdateHotelRoomAction;
// addCityThunk;/

// Загрузка данных
export const fetchHotelsThunk = () => async (dispatch: Dispatch<HotelActions>) => {
	try {
		// ШАГ 1: Включаем спиннер
		dispatch({ type: FETCH_HOTELS_START });

		const response = await fetch('http://localhost:5000/api/hotels');
		if (!response.ok) throw new Error('Ошибка при загрузке отелей');

		const data: Hotel[] = await response.json();

		dispatch({ type: SET_HOTELS, payload: data });
	} catch (error) {
		console.error('Hotel Fetch Error:', error);
	}
};

export const fetchCitiesThunk = () => async (dispatch: Dispatch<HotelActions>) => {
	try {
		const response = await apiFetch('http://localhost:5000/api/cities');

		if (!response.ok) {
			throw new Error(`Ошибка сервера: ${response.status}`);
		}

		const data: City[] = await response.json();

		// console.log('Загруженные города:', data);
		dispatch({ type: SET_CITIES, payload: data });
	} catch (error) {
		console.error('Ошибка при загрузке городов:', error);
	}
};

// Работа с отелем и комнатами
export const updateHotelThunk =
	(hotelId: string, updatedData: Partial<Hotel>) =>
	async (dispatch: Dispatch<HotelActions>, getState: () => RootState) => {
		const state = getState();
		const user = state.users.currentUser;
		const hotel = state.hotels.allHotels.find((h) => h._id === hotelId);

		if (!checkPermission(user, 'EDIT_HOTEL', hotel)) {
			alert('Нет прав на редактирование');
			return false;
		}

		try {
			const response = await apiFetch(
				`http://localhost:5000/api/hotels/${hotelId}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updatedData),
				},
			);
			if (response.ok) {
				const updatedHotel: Hotel = await response.json();
				dispatch({ type: UPDATE_HOTEL_SUCCESS, payload: updatedHotel });
				return true;
			}
		} catch (error) {
			console.error('Ошибка при обновлении отеля:', error);
			return false;
		}
	};

// Thunk для обновления комнат (или любых данных отеля)
export const updateHotelRoomsThunk =
	(hotelId: string, roomsArray: Room[]) =>
	async (dispatch: Dispatch<HotelActions>, getState: () => RootState) => {
		const state = getState();
		const user = state.users.currentUser;
		const hotel = state.hotels.allHotels.find((h) => h._id === hotelId);

		if (!checkPermission(user, 'EDIT_ROOM_HOTEL', hotel)) {
			alert('У вас нет прав на редактирование комнат этого отеля');
			return false;
		}
		try {
			const response = await apiFetch(
				`http://localhost:5000/api/hotels/${hotelId}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ rooms: roomsArray }),
				},
			);

			if (response.ok) {
				const updatedRoomHotel: Hotel = await response.json();

				// Отправляем обновленный объект отеля в редьюсер
				dispatch({
					type: UPDATE_HOTEL_ROOM_SUCCESS,
					payload: updatedRoomHotel,
				});
				return true;
			}
		} catch (error) {
			console.error('Ошибка при обновлении комнат отеля:', error);
			return false;
		}
	};

// Добавление и удаление отелей
export const addHotelThunk =
	(hotelData: Partial<Hotel>) =>
	async (dispatch: Dispatch<HotelActions>, getState: () => RootState) => {
		const user = getState().users.currentUser;
		if (!checkPermission(user, 'CREATE_HOTEL')) {
			alert('У вас нет прав на создание отеля');
			return false;
		}

		try {
			const response = await apiFetch('http://localhost:5000/api/hotels', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(hotelData),
			});

			if (response.ok) {
				const savedHotel: Hotel = await response.json();
				dispatch({
					type: ADD_HOTEL_SUCCESS,
					payload: savedHotel,
				});
				return true;
			}
		} catch (error) {
			console.error('Ошибка при добавлении отеля:', error);
			return false;
		}
	};

// Thunk для удаления отеля
export const deleteHotelThunk =
	(hotelId: string) =>
	async (dispatch: Dispatch<HotelActions>, getState: () => RootState) => {
		const state = getState();
		const user = state.users.currentUser;

		const hotel = state.hotels.allHotels.find((h) => h._id === hotelId);

		if (!checkPermission(user, 'DELETE_HOTEL', hotel)) {
			alert('У вас нет прав на удаление этого отеля');
			return false;
		}

		try {
			const response = await apiFetch(
				`http://localhost:5000/api/hotels/${hotelId}`,
				{
					method: 'DELETE',
				},
			);

			if (response.ok) {
				dispatch({
					type: DELETE_HOTEL_SUCCESS,
					payload: hotelId,
				});
				return true;
			}
		} catch (error) {
			console.error('Ошибка при удалении отеля:', error);
			return false;
		}
	};

// КОММЕНТАРИИ
export const addCommentThunk =
	(hotelId: string, newComment: Comments) =>
	async (dispatch: Dispatch<HotelActions>, getState: () => RootState) => {
		const user = getState().users.currentUser;

		if (!checkPermission(user, 'ADD_COMMENT')) {
			alert('Только авторизованные пользователи могут оставлять комментарии');
			return;
		}

		try {
			const res = await apiFetch(
				`http://localhost:5000/api/hotels/${hotelId}/comments`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },

					body: JSON.stringify({ text: newComment.text }),
				},
			);

			if (res.ok) {
				const updatedHotel: Hotel = await res.json();
				dispatch({ type: UPDATE_HOTEL_SUCCESS, payload: updatedHotel });
			}
		} catch (error) {
			console.error('Ошибка при добавлении комментария:', error);
		}
	};

// Удаление комментария
export const deleteCommentThunk =
	(hotelId: string, commentId: string) =>
	async (dispatch: Dispatch<HotelActions>, getState: () => RootState) => {
		const state = getState();
		const user = state.users.currentUser;
		const hotel = state.hotels.allHotels.find((h) => h._id === hotelId);
		const comment = hotel?.comments.find((c) => c._id === commentId);

		const targetData = {
			userId: comment?.userId, // Кто написал коммент
			hotelOwnerId: hotel?.ownerId, // Владелец отеля (менеджер тоже может удалять)
		};

		if (!checkPermission(user, 'DELETE_COMMENT', targetData)) {
			alert('Нет прав на удаление этого комментария');
			return;
		}

		try {
			const res = await apiFetch(
				`http://localhost:5000/api/hotels/${hotelId}/comments/${commentId}`,
				{
					method: 'DELETE',
				},
			);

			if (res.ok) {
				const updatedHotel: Hotel = await res.json();
				dispatch({ type: UPDATE_HOTEL_SUCCESS, payload: updatedHotel });
			}
		} catch (error) {
			console.error('Ошибка при удалении комментария:', error);
		}
	};
