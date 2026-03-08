import type { Dispatch } from 'redux';
import { checkPermission, ROLES } from '../../utils/permissions';
import type { RootState } from '..';
import { apiFetch } from '../../utils/api';
import type { UserLimits } from '../../types/models';
import type { Credentials, RegisterData } from '../../types/forms';
import type { UserActions } from '../../types/typesStore';
import {
	DELETE_USER_SUCCESS,
	FETCH_USERS_SUCCESS,
	LOGOUT_USER,
	SET_USER,
} from '../../components/constants/actionConstants';

export const registerThunk =
	(userData: RegisterData) => async (dispatch: Dispatch<UserActions>) => {
		try {
			const { confirmPassword, ...dataToInscribe } = userData;

			const response = await apiFetch('/users/register', {
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
			const res = await apiFetch(`/users/login`, {
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
			const response = await apiFetch(`/users/${userId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					role: newRole,
					...(limits && { limits }),
				}),
			});

			if (response.ok) {
				const updatedUserData = await response.json();
				//  Обновляем список всех юзеров для админа
				dispatch(fetchAllUsersThunk());

				// Если админ изменил роль самому себе
				const currentUser = getState().users.currentUser;
				if (currentUser && currentUser._id === userId) {
					dispatch({ type: SET_USER, payload: updatedUserData });
					localStorage.setItem('bookez_user', JSON.stringify(updatedUserData));
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
			const res = await apiFetch('/users');
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
			const res = await apiFetch(`/users/${userId}`, {
				method: 'DELETE',
			});
			if (res.ok) {
				dispatch({ type: DELETE_USER_SUCCESS, payload: userId });
			}
		} catch (error) {
			console.error('Ошибка при удалении пользователя:', error);
		}
	};
