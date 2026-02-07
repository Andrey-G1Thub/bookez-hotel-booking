export const SET_USER = 'SET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const loginThunk = (userData) => (dispatch) => {
	// Имитация запроса к серверу (позже здесь будет fetch)
	const user = {
		id: 'user-123',
		email: userData.email,
		name: userData.name || userData.email.split('@')[0],
		role: 'user', // Здесь потом будем менять роли
	};
	localStorage.setItem('bookez_user', JSON.stringify(user));
	dispatch({ type: SET_USER, payload: user });
};

export const logoutThunk = () => (dispatch) => {
	localStorage.removeItem('bookez_user');
	dispatch({ type: LOGOUT_USER });
};
