export const SET_ROOMS = 'SET_ROOMS';

export const fetchRooms = () => async (dispatch) => {
	const response = await fetch('http://localhost:3001/rooms');
	const data = await response.json();
	dispatch({ type: SET_ROOMS, payload: data });
};
