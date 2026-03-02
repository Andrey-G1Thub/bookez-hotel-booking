import { apiFetch } from '../../utils/api';
import { checkPermission } from '../../utils/permissions';
import type { RootState } from '..';

// export const ADD_CITY = 'ADD_CITY' as const;

export const addCityThunk =
	(cityData: { name: string; description: string }) =>
	async (dispatch: any, getState: () => RootState) => {
		const user = getState().users.currentUser;

		if (!checkPermission(user, 'ADD_CITY')) {
			alert('Только администратор может добавлять города');
			return false;
		}

		try {
			// const token = localStorage.getItem('bookez_token');
			const response = await apiFetch('http://localhost:5000/api/cities', {
				method: 'POST',
				headers: {
					// Authorization: `Bearer ${token}`, // Обязательно для authenticated
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(cityData),
			});
			if (response.ok) {
				const newCity = await response.json();
				dispatch({ type: 'ADD_CITY_SUCCESS', payload: newCity });
				return true;
			}
		} catch (e) {
			console.error(e);
			return false;
		}
	};
