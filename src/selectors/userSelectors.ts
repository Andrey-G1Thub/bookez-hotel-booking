import type { RootState } from '../store';

export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUsersList = (state: RootState) => state.users.usersList;
export const selectIsAdmin = (state: RootState) =>
	state.users.currentUser?.role === 'admin';
