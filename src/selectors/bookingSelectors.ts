import type { RootState } from '../store';

export const selectBookingList = (state: RootState) => state.bookings.list;
export const selectBookingIsLoading = (state: RootState) => state.bookings.loading;
