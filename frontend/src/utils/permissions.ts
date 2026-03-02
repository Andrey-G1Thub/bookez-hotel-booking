import type { Hotel } from '../store/reducers/hotelReducer';
import type { User } from '../store/reducers/userReducer';

export const ROLES = {
	ADMIN: 'admin',
	MANAGER: 'manager',
	USER: 'user',
	GUEST: 'guest', // Неавторизованный
} as const;

export type AppAction =
	// Отели и Города
	| 'VIEW' // getHotels, getCities, getRoomBookingsPublic
	| 'CREATE_HOTEL' // createHotel
	| 'EDIT_HOTEL' // updateHotel
	| 'EDIT_ROOM_HOTEL' // updateHotel
	| 'DELETE_HOTEL' // deleteHotel
	| 'DELETE_ROOM_HOTEL' // deleteHotel
	| 'ADD_CITY' // addCity

	// Бронирования
	| 'VIEW_BOOKINGS' // getBookings (у всех разный уровень доступа)
	| 'ADD_BOOKING' // createBooking (бывший BOOK_ROOM)
	| 'DELETE_BOOKING' // deleteBooking (учитываем владельца отеля, админа и клиента)

	// Комментарии
	| 'ADD_COMMENT' // addComment
	| 'DELETE_COMMENT' // deleteComment

	// Пользователи (Админка)
	| 'VIEW_USERS_LIST' // getUsers
	| 'ADMIN_USERS'; // updateUser, deleteUser

export const checkPermission = (
	user: User | null,
	action: AppAction,
	targetData: any | null = null,
): boolean => {
	if (!user) {
		const publicActions: AppAction[] = ['VIEW'];
		return publicActions.includes(action);
	}
	if (user.role === ROLES.ADMIN) return true;

	// 3. Менеджер (Manager)
	if (user.role === ROLES.MANAGER) {
		switch (action) {
			case 'VIEW':
			case 'VIEW_BOOKINGS':
			case 'CREATE_HOTEL':
			case 'ADD_BOOKING':
			case 'ADD_COMMENT':
				return true;
			case 'EDIT_HOTEL':
			case 'EDIT_ROOM_HOTEL':
			case 'DELETE_HOTEL':
			case 'DELETE_ROOM_HOTEL':
				return targetData?.ownerId === user._id;
			case 'DELETE_BOOKING':
				return (
					targetData?.userId === user._id ||
					targetData?.hotelOwnerId === user._id
				);
			case 'DELETE_COMMENT':
				// Свой комментарий или комментарий в своем отеле
				return (
					targetData?.userId === user._id ||
					targetData?.hotelOwnerId === user._id
				);
			default:
				return false;
		}
	}

	if (user.role === ROLES.USER) {
		switch (action) {
			case 'VIEW':
			case 'ADD_BOOKING':
			case 'ADD_COMMENT':
			case 'VIEW_BOOKINGS': // Видит только свои (фильтрация на бэкенде)
				return true;
			case 'DELETE_BOOKING':
			case 'DELETE_COMMENT':
				return targetData?.userId === user._id; // Только своё
			default:
				return false;
		}
	}
	return action === 'VIEW';
};
