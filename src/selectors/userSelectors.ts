// import type { RootState } from '../store/index';

import type { RootState } from '../store';

export const selectCurrentUser = (state: RootState) => state.users.currentUser;
