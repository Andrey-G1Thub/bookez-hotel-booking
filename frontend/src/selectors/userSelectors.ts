import type { RootState } from '../store';
import { ROLES } from '../utils/permissions';

export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUsersList = (state: RootState) => state.users.usersList;

export const selectIsAdmin = (state: RootState) =>
	state.users.currentUser?.role === ROLES.ADMIN;

export const selectIsManager = (state: RootState) =>
	state.users.currentUser?.role === ROLES.MANAGER;
export const selectIsUser = (state: RootState) =>
	state.users.currentUser?.role === ROLES.USER;
export const selectIsGuest = (state: RootState) =>
	state.users.currentUser?.role === ROLES.GUEST;
