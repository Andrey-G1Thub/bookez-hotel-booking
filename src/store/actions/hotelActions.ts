import type { City, Hotel } from '../reducers/hotelReducer';

export const SET_HOTELS = 'SET_HOTELS';
export const SET_CITIES = 'SET_CITIES';
export const ADD_HOTEL_SUCCESS = 'ADD_HOTEL_SUCCESS';
export const DELETE_HOTEL_SUCCESS = 'DELETE_HOTEL_SUCCESS';
export const UPDATE_HOTEL_SUCCESS = 'UPDATE_HOTEL_SUCCESS';
export const UPDATE_HOTEL_ROOM_SUCCESS = 'UPDATE_HOTEL_ROOM_SUCCESS';

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

export type HotelActions =
	| SetHotelsAction
	| SetCitiesAction
	| AddHotelAction
	| DeleteHotelAction
	| UpdateHotelAction
	| UpdateHotelRoomAction;

// Загрузка данных
export const fetchHotelsThunk = () => async (dispatch) => {
	try {
		const response = await fetch('http://localhost:3001/hotels');
		if (!response.ok) throw new Error('Ошибка при загрузке отелей');

		const data = await response.json();
		dispatch({ type: SET_HOTELS, payload: data });
	} catch (error) {
		console.error('Hotel Fetch Error:', error);
	}
};

export const fetchCitiesThunk = () => async (dispatch) => {
	const response = await fetch('http://localhost:3001/cities');
	const data = await response.json();
	dispatch({ type: SET_CITIES, payload: data });
};

// Работа с отелем и комнатами
export const updateHotelThunk = (hotelId, updatedData) => async (dispatch) => {
	try {
		const response = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedData),
		});
		if (response.ok) {
			const data = await response.json();
			dispatch({ type: UPDATE_HOTEL_SUCCESS, payload: data });
			return true;
		}
	} catch (error) {
		console.error('Ошибка при обновлении отеля:', error);
		return false;
	}
};

// Thunk для обновления комнат (или любых данных отеля)
export const updateHotelRoomsThunk = (hotelId, updatedRooms) => async (dispatch) => {
	try {
		const response = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ rooms: updatedRooms }),
		});

		if (response.ok) {
			const updatedHotel = await response.json();

			// Отправляем обновленный объект отеля в редьюсер
			dispatch({
				type: UPDATE_HOTEL_ROOM_SUCCESS,
				payload: updatedHotel,
			});
			return true;
		}
	} catch (error) {
		console.error('Ошибка при обновлении комнат отеля:', error);
		return false;
	}
};

// Добавление и удаление отелей
export const addHotelThunk = (hotelData) => async (dispatch) => {
	try {
		const response = await fetch('http://localhost:3001/hotels', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(hotelData),
		});

		if (response.ok) {
			const savedHotel = await response.json();
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
export const deleteHotelThunk = (hotelId) => async (dispatch) => {
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
export const addCommentThunk = (hotelId, newComment) => async (dispatch, getState) => {
	try {
		const hotel = getState().hotels.allHotels.find((h) => h.id === hotelId);
		const updatedComments = [...(hotel.comments || []), newComment];

		const res = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ comments: updatedComments }),
		});

		if (res.ok) {
			const updatedHotel = await res.json();
			dispatch({ type: UPDATE_HOTEL_SUCCESS, payload: updatedHotel });
		}
	} catch (error) {
		console.error('Ошибка при добавлении комментария:', error);
	}
};

// Удаление комментария
export const deleteCommentThunk = (hotelId, commentId) => async (dispatch, getState) => {
	try {
		const hotel = getState().hotels.allHotels.find((h) => h.id === hotelId);
		const filteredComments = hotel.comments.filter((c) => c.id !== commentId);

		const res = await fetch(`http://localhost:3001/hotels/${hotelId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ comments: filteredComments }),
		});

		if (res.ok) {
			const updatedHotel = await res.json();
			dispatch({ type: UPDATE_HOTEL_SUCCESS, payload: updatedHotel });
		}
	} catch (error) {
		console.error('Ошибка при удалении комментария:', error);
	}
};
