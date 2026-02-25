import type { Dispatch } from 'redux';
import { ROLES } from '../../utils/permissions';
import type { User } from '../reducers/userReducer';
import type { RootState } from '..';

export const SET_USER = 'SET_USER' as const;
export const LOGOUT_USER = 'LOGOUT_USER' as const;
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS' as const;
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS' as const;

interface RegisterData extends Credentials {
	name: string;
	confirmPassword?: string;
}
interface SetUserAction {
	type: typeof SET_USER;
	payload: User;
}
interface LogoutUserAction {
	type: typeof LOGOUT_USER;
}
interface FetchUsersAction {
	type: typeof FETCH_USERS_SUCCESS;
	payload: User[];
}
interface DeleteUserAction {
	type: typeof DELETE_USER_SUCCESS;
	payload: string;
}
interface Credentials {
	email: string;
	password?: string;
}
interface UserLimits {
	maxHotels: number;
	maxRooms: number;
}

export type UserActions =
	| SetUserAction
	| LogoutUserAction
	| FetchUsersAction
	| DeleteUserAction;

export const registerThunk =
	(userData: RegisterData) => async (dispatch: Dispatch<UserActions>) => {
		try {
			const { confirmPassword, ...dataToInscribe } = userData;

			const response = await fetch('http://localhost:5000/api/users/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(dataToInscribe),
			});

			const result = await response.json();

			if (response.ok) {
				return true;
			} else {
				alert(result.message || 'Ошибка регистрации');
				return false;
			}
		} catch (error) {
			console.error('Register Error:', error);
			return false;
		}
	};

export const loginThunk =
	(credentials: Credentials) => async (dispatch: Dispatch<UserActions>) => {
		try {
			const email = encodeURIComponent(credentials.email);
			const password = encodeURIComponent(credentials.password || '');
			const res = await fetch(
				`http://localhost:5000/api/users?email=${email}&password=${password}`,
			);
			const users: User[] = await res.json();
			if (users.length === 0) {
				alert('Неверный email или пароль.');
				return false;
			}

			const user = users[0]; // Нашли пользователя

			// 3. Сохраняем "сессию"
			if (user) {
				localStorage.setItem('bookez_user', JSON.stringify(user));
				// 4. Обновляем Redux
				dispatch({ type: SET_USER, payload: user });
				return true;
			} else {
				alert('Пользователь не найден.');
				return false;
			}
		} catch (error) {
			console.error('Login Error:', error);
			alert('Произошла ошибка при входе. Проверьте соединение с сервером.');
			return false;
		}
	};

export const logoutThunk = () => (dispatch: Dispatch<UserActions>) => {
	localStorage.removeItem('bookez_user');
	dispatch({ type: LOGOUT_USER });
};
// store/actions/userActions.js

// userActions.js
export const updateUserRoleThunk =
	(userId: string, newRole: string, limits: UserLimits | null = null) =>
	async (dispatch: any, getState: () => RootState) => {
		try {
			const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					role: newRole,
					...(limits && { limits }),
				}),
			});

			if (response.ok) {
				// 1. Обновляем список всех юзеров для админа
				dispatch(fetchAllUsersThunk());

				// 2. Если админ изменил роль самому себе
				const currentUser = getState().users.currentUser;
				if (currentUser && currentUser._id === userId) {
					const updatedUser = await response.json();
					dispatch({ type: SET_USER, payload: updatedUser });
					localStorage.setItem('bookez_user', JSON.stringify(updatedUser));
				}
				return true;
			}
		} catch (e) {
			console.error(e);
		}
	};
export const fetchAllUsersThunk = () => async (dispatch: Dispatch<UserActions>) => {
	try {
		const res = await fetch('http://localhost:5000/api/users');
		const data = await res.json();
		dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
	} catch (e) {
		console.error('Ошибка при загрузке пользователей:', e);
	}
};
export const deleteUserThunk =
	(userId: string) => async (dispatch: Dispatch<UserActions>) => {
		try {
			// 1. Запрос к API
			const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
				method: 'DELETE',
			});
			if (res.ok) {
				// 2. Если запрос успешен, обновляем стор
				dispatch({ type: DELETE_USER_SUCCESS, payload: userId });
			}
		} catch (error) {
			console.error('Ошибка при удалении пользователя:', error);
		}
	};
