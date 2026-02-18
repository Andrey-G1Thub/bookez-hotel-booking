import type { RootState } from '../store';

export const selectBooking = (state: RootState) => state.bookings.list;
