import type {
	ADD_BOOKING,
	ADD_CITY_SUCCESS,
	ADD_HOTEL_SUCCESS,
	DELETE_BOOKING,
	DELETE_HOTEL_SUCCESS,
	DELETE_USER_SUCCESS,
	FETCH_HOTELS_START,
	FETCH_USERS_SUCCESS,
	LOGOUT_USER,
	SET_BOOKINGS,
	SET_BOOKINGS_LOADING,
	SET_CITIES,
	SET_HOTELS,
	SET_USER,
	UPDATE_HOTEL_ROOM_SUCCESS,
	UPDATE_HOTEL_SUCCESS,
} from '../components/constants/actionConstants';
import type { Booking, City, Hotel, User } from './models';

// Action types и интерфейсы Redux

export interface AddCitySuccessAction {
	type: typeof ADD_CITY_SUCCESS;
	payload: City;
}
export interface HotelState {
	allHotels: Hotel[];
	cities: City[];
	isLoading: boolean;
	error: string | null;
}

export interface BookingState {
	list: Booking[];
	loading: boolean;
}

export interface UserState {
	currentUser: User | null;
	usersList: User[];
}

export interface SetHotelsAction {
	type: typeof SET_HOTELS;
	payload: Hotel[];
}
export interface SetCitiesAction {
	type: typeof SET_CITIES;
	payload: City[];
}
export interface AddHotelAction {
	type: typeof ADD_HOTEL_SUCCESS;
	payload: Hotel;
}
export interface DeleteHotelAction {
	type: typeof DELETE_HOTEL_SUCCESS;
	payload: string;
}
export interface UpdateHotelAction {
	type: typeof UPDATE_HOTEL_SUCCESS;
	payload: Hotel;
}
export interface UpdateHotelRoomAction {
	type: typeof UPDATE_HOTEL_ROOM_SUCCESS;
	payload: Hotel;
}
export interface FetchHotelsStartAction {
	type: typeof FETCH_HOTELS_START;
}
export interface AddBookingAction {
	type: typeof ADD_BOOKING;
	payload: Booking;
}
export interface DeleteBookingAction {
	type: typeof DELETE_BOOKING;
	payload: string;
}
export interface SetLoadingAction {
	type: typeof SET_BOOKINGS_LOADING;
	payload: boolean;
}
export interface SetBookingsAction {
	type: typeof SET_BOOKINGS;
	payload: Booking[];
}
export interface SetUserAction {
	type: typeof SET_USER;
	payload: User;
}
export interface LogoutUserAction {
	type: typeof LOGOUT_USER;
}
export interface FetchUsersAction {
	type: typeof FETCH_USERS_SUCCESS;
	payload: User[];
}
export interface DeleteUserAction {
	type: typeof DELETE_USER_SUCCESS;
	payload: string;
}

export interface UserLimits {
	maxHotels: number;
	maxRooms: number;
}
export type HotelActions =
	| FetchHotelsStartAction
	| SetHotelsAction
	| SetCitiesAction
	| AddHotelAction
	| DeleteHotelAction
	| UpdateHotelAction
	| UpdateHotelRoomAction
	| AddCitySuccessAction;

export type BookingActions =
	| SetBookingsAction
	| AddBookingAction
	| DeleteBookingAction
	| SetLoadingAction;

export type UserActions =
	| SetUserAction
	| LogoutUserAction
	| FetchUsersAction
	| DeleteUserAction;
