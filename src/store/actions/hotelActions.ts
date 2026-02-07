export const SET_HOTELS = 'SET_HOTELS';

export const fetchHotels = () => async (dispatch) => {
	try {
		const response = await fetch('http://localhost:3001/hotels');
		if (!response.ok) throw new Error('Ошибка при загрузке отелей');

		const data = await response.json();
		dispatch({ type: SET_HOTELS, payload: data });
	} catch (error) {
		console.error('Hotel Fetch Error:', error);
	}
};
export const SET_CITIES = 'SET_CITIES';

export const fetchCities = () => async (dispatch) => {
	const response = await fetch('http://localhost:3001/cities');
	const data = await response.json();
	dispatch({ type: SET_CITIES, payload: data });
};
