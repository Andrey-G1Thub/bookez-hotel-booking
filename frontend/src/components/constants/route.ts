export const ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	BOOKINGS: '/bookings',
	ADMIN: '/admin',
	MANAGER: '/manager',
	CITY: (id: string) => `/city/${id}`,
	HOTEL: (id: string) => `/hotel/${id}`,
	ROOM: (hotelId: string, roomId: string) => `/room/${hotelId}/${roomId}`,
} as const;
