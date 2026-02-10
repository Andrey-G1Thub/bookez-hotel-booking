export const SET_USER = 'SET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const loginThunk = (credentials) => async (dispatch) => {
	try {
		const email = encodeURIComponent(credentials.email);
		const password = encodeURIComponent(credentials.password);
		const res = await fetch(
			`http://localhost:3001/users?email=${email}&password=${password}`,
		);
		if (!res.ok) throw new Error('Ошибка сервера');

		const users = await res.json();

		if (users.length === 0) {
			alert('Неверный email или пароль. Попробуйте снова.');
			return false;
		}

		const user = users[0]; // Нашли пользователя

		// 3. Сохраняем "сессию"
		localStorage.setItem('bookez_user', JSON.stringify(user));
		// 4. Обновляем Redux
		dispatch({ type: SET_USER, payload: user });
		return true;
	} catch (error) {
		console.error('Login Error:', error);
		alert('Произошла ошибка при входе. Проверьте соединение с сервером.');
		return false;
	}
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
