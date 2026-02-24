import type { Hotel } from '../store/reducers/hotelReducer';
import type { User } from '../store/reducers/userReducer';

export const ROLES = {
	ADMIN: 'admin',
	MANAGER: 'manager',
	USER: 'user',
	GUEST: 'guest', // Неавторизованный
};

export type AppAction =
	| 'VIEW'
	| 'CREATE_HOTEL'
	| 'REPLY_COMMENT'
	| 'MANAGE_OWN_HOTEL'
	| 'BOOK_ROOM'
	| 'ADD_COMMENT'
	| 'DELETE_HOTEL';

export const checkPermission = (
	user: User,
	action: AppAction,
	targetData: Hotel | null = null,
) => {
	if (!user) return action === 'VIEW'; // Гость может только смотреть

	if (user.role === ROLES.ADMIN) return true;

	if (user.role === ROLES.MANAGER) {
		const managerActions = ['VIEW', 'CREATE_HOTEL', 'REPLY_COMMENT'];

		if (managerActions.includes(action)) return true;

		// 3. Логика для менеджера
		if (user.role === ROLES.MANAGER) {
			const managerActions: AppAction[] = ['VIEW', 'CREATE_HOTEL', 'REPLY_COMMENT'];

			if (managerActions.includes(action)) return true;

			if (action === 'MANAGE_OWN_HOTEL') {
				// Здесь проверяем, совпадает ли ID менеджера с ownerId отеля
				return targetData?.ownerId === user._id;
			}
		}

		if (user.role === ROLES.USER) {
			const userActions = ['VIEW', 'BOOK_ROOM', 'ADD_COMMENT'];
			return userActions.includes(action);
		}
		return action === 'VIEW';
	}

	switch (user.role) {
		case ROLES.ADMIN:
			return true; // Админ может всё

		case ROLES.MANAGER:
			const managerActions = [
				'VIEW',
				'CREATE_HOTEL',
				'MANAGE_OWN_HOTEL',
				'REPLY_COMMENT',
			];
			return managerActions.includes(action);

		case ROLES.USER:
			const userActions = ['VIEW', 'BOOK_ROOM', 'ADD_COMMENT'];
			return userActions.includes(action);

		default:
			return action === 'VIEW';
	}
};
