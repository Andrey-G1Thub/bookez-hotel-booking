import type { Dispatch } from 'redux';
import { checkPermission, ROLES } from '../../utils/permissions';
import type { RootState } from '..';
import { apiFetch } from '../../utils/api';
import type { UserLimits } from '../../types/models';
import type { Credentials, RegisterData } from '../../types/forms';
import type { UserActions } from '../../types/store';

export const SET_USER = 'SET_USER' as const;
export const LOGOUT_USER = 'LOGOUT_USER' as const;
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS' as const;
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS' as const;

export const registerThunk =
	(userData: RegisterData) => async (dispatch: Dispatch<UserActions>) => {
		try {
			const { confirmPassword, ...dataToInscribe } = userData;

			const response = await apiFetch('http://localhost:5000/api/users/register', {
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
			const res = await apiFetch(`http://localhost:5000/api/users/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
			});

			const data = await res.json(); //  user и token

			if (res.ok) {
				localStorage.setItem('bookez_token', data.token);
				localStorage.setItem('bookez_user', JSON.stringify(data.user));

				dispatch({ type: SET_USER, payload: data.user });
				return true;
			} else {
				alert(data.message);
				return false;
			}
		} catch (error) {
			console.error('Login Error:', error);
			return false;
		}
	};

export const logoutThunk = () => (dispatch: Dispatch<UserActions>) => {
	localStorage.removeItem('bookez_user');
	localStorage.removeItem('bookez_token');
	dispatch({ type: LOGOUT_USER });
};

// userActions.js
export const updateUserRoleThunk =
	(userId: string, newRole: string, limits: UserLimits | null = null) =>
	async (dispatch: any, getState: () => RootState) => {
		const user = getState().users.currentUser;
		if (!checkPermission(user, 'ADMIN_USERS')) {
			alert('У вас нет прав на управление пользователями');
			return;
		}

		try {
			const response = await apiFetch(`http://localhost:5000/api/users/${userId}`, {
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

export const fetchAllUsersThunk =
	() => async (dispatch: Dispatch<UserActions>, getState: () => RootState) => {
		const user = getState().users.currentUser;

		if (!checkPermission(user, 'VIEW_USERS_LIST')) {
			console.error('Доступ запрещен: требуется роль администратора');
			return;
		}
		try {
			const res = await apiFetch('http://localhost:5000/api/users');
			const data = await res.json();
			dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
		} catch (e) {
			console.error('Ошибка при загрузке пользователей:', e);
		}
	};

export const deleteUserThunk =
	(userId: string) =>
	async (dispatch: Dispatch<UserActions>, getState: () => RootState) => {
		const user = getState().users.currentUser;

		if (!checkPermission(user, 'ADMIN_USERS')) {
			alert('Нет прав на удаление пользователя');
			return;
		}

		try {
			// 1. Запрос к API
			const res = await apiFetch(`http://localhost:5000/api/users/${userId}`, {
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
