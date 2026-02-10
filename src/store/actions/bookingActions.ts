export const SET_BOOKINGS = 'SET_BOOKINGS';
export const ADD_BOOKING = 'ADD_BOOKING';
export const DELETE_BOOKING = 'DELETE_BOOKING';

// GET - получение данных
export const fetchBookings = (userId) => async (dispatch) => {
	try {
		// Если userId не передан, мы можем либо не грузить ничего,
		// либо грузить всё (если это админ). Для обычного юзера фильтруем:
		const url = userId
			? `http://localhost:3001/bookings?userId=${userId}`
			: `http://localhost:3001/bookings`;
		const res = userId;
		const data = await res.json();

		dispatch({ type: SET_BOOKINGS, payload: data });
	} catch (e) {
		console.error('Ошибка загрузки броней', e);
	}
};

// POST - добавление новой брони
export const addBookingThunk = (newBooking) => async (dispatch) => {
	try {
		const response = await fetch('http://localhost:3001/bookings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newBooking),
		});

		if (response.ok) {
			const savedBooking = await response.json();
			// Обновляем Redux только если сервер ответил "ОК"
			dispatch({ type: ADD_BOOKING, payload: savedBooking });
		}
	} catch (error) {
		console.error('Ошибка при записи в db.json:', error);
	}
};

// store/actions/bookingActions.js

export const deleteBookingThunk = (id) => async (dispatch) => {
	try {
		// Отправляем запрос на удаление конкретного ID
		const response = await fetch(`http://localhost:3001/bookings/${id}`, {
			method: 'DELETE', // Метод DELETE удаляет запись в db.json
		});

		if (response.ok) {
			dispatch({ type: DELETE_BOOKING, payload: id });
		}
	} catch (error) {
		console.error('Ошибка при удалении из db.json:', error);
	}
};
