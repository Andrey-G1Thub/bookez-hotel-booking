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
// store/actions/userActions.js

export const registerThunk = (userData) => async (dispatch) => {
	try {
		// Проверяем, существует ли пользователь
		const checkRes = await fetch(
			`http://localhost:3001/users?email=${userData.email}`,
		);
		const existing = await checkRes.json();

		if (existing.length > 0) {
			alert('Пользователь с таким email уже существует!');
			return false;
		}
		// Убираем confirmPassword перед отправкой и добавляем роль
		const { confirmPassword, ...dataToInscribe } = userData;
		const newUser = {
			...dataToInscribe,
			role: 'user', // Роль по умолчанию
			id: Date.now(), // Если json-server не настроен на авто-id
		};

		const response = await fetch('http://localhost:3001/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newUser),
		});

		if (response.ok) {
			return true;
		}
		return false;
	} catch (error) {
		console.error('Register Error:', error);
		return false;
	}
};
