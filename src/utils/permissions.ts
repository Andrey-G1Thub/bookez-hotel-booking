export const ROLES = {
	ADMIN: 'admin',
	MANAGER: 'manager',
	USER: 'user',
	GUEST: 'guest', // Неавторизованный
};

export const checkPermission = (user, action) => {
	if (!user) return action === 'VIEW'; // Гость может только смотреть

	if (user.role === ROLES.ADMIN) return true;

	if (user.role === ROLES.MANAGER) {
		const managerActions = ['VIEW', 'CREATE_HOTEL', 'REPLY_COMMENT'];
		if (managerActions.includes(action)) return true;

		// Специальная проверка для управления СВОИМ отелем
		if (action === 'MANAGE_OWN_HOTEL') {
			return data?.ownerId === user.id;
		}
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
