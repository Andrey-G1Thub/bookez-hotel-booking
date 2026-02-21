import type { Dispatch } from 'redux';
import type { City, Comments, Hotel, Room } from '../reducers/hotelReducer';
import type { RootState } from '..';

export const SET_HOTELS = 'SET_HOTELS';
export const SET_CITIES = 'SET_CITIES';
export const ADD_HOTEL_SUCCESS = 'ADD_HOTEL_SUCCESS';
export const DELETE_HOTEL_SUCCESS = 'DELETE_HOTEL_SUCCESS';
export const UPDATE_HOTEL_SUCCESS = 'UPDATE_HOTEL_SUCCESS';
export const UPDATE_HOTEL_ROOM_SUCCESS = 'UPDATE_HOTEL_ROOM_SUCCESS';
export const FETCH_HOTELS_START = 'FETCH_HOTELS_START';

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
	payload: number;
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

// Загрузка данных
export const fetchHotelsThunk = () => async (dispatch: Dispatch<HotelActions>) => {
	try {
		// ШАГ 1: Включаем спиннер
		dispatch({ type: FETCH_HOTELS_START });

		const response = await fetch('http://localhost:3001/hotels');
		if (!response.ok) throw new Error('Ошибка при загрузке отелей');

		const data: Hotel[] = await response.json();

		dispatch({ type: SET_HOTELS, payload: data });
	} catch (error) {
		console.error('Hotel Fetch Error:', error);
	}
};

export const fetchCitiesThunk = () => async (dispatch: Dispatch<HotelActions>) => {
	const response = await fetch('http://localhost:3001/cities');
	const data: City[] = await response.json();
	dispatch({ type: SET_CITIES, payload: data });
};

// Работа с отелем и комнатами
export const updateHotelThunk =
	(hotelId: number, updatedRooms: Partial<Hotel>) =>
	async (dispatch: Dispatch<HotelActions>) => {
		try {
			const response = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedRooms),
			});
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
	(hotelId: number, roomsArray: Room[]) => async (dispatch: Dispatch<HotelActions>) => {
		try {
			const response = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ rooms: roomsArray }),
			});

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
	(hotelData: Partial<Hotel>) => async (dispatch: Dispatch<HotelActions>) => {
		try {
			const response = await fetch('http://localhost:3001/hotels', {
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
	(hotelId: number) => async (dispatch: Dispatch<HotelActions>) => {
		try {
			const response = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
				method: 'DELETE',
			});

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
	(hotelId: number, newComment: Comments) =>
	async (dispatch: Dispatch<HotelActions>, getState: () => RootState) => {
		try {
			const state = getState();
			const hotel = state.hotels.allHotels.find((h) => h.id === hotelId);
			if (!hotel) return;

			const updatedComments = [...(hotel.comments || []), newComment];

			const res = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ comments: updatedComments }),
			});

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
	(hotelId: number, commentId: number) =>
	async (dispatch: Dispatch<HotelActions>, getState: () => RootState) => {
		try {
			const hotel = getState().hotels.allHotels.find((h) => h.id === hotelId);
			if (!hotel) return;
			const filteredComments = hotel.comments.filter((c) => c.id !== commentId);

			const res = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ comments: filteredComments }),
			});

			if (res.ok) {
				const updatedHotel: Hotel = await res.json();
				dispatch({ type: UPDATE_HOTEL_SUCCESS, payload: updatedHotel });
			}
		} catch (error) {
			console.error('Ошибка при удалении комментария:', error);
		}
	};
