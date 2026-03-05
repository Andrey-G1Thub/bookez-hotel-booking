import { deleteBookingThunk } from '../../../../store/actions/bookingActions';
import type { AppDispatch } from '../../../../store';

export const useBookingActions = (dispatch: AppDispatch) => {
	const handleDeleteBooking = async (bookingId: string) => {
		if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) return;
		await dispatch(deleteBookingThunk(bookingId));
	};

	return { handleDeleteBooking };
};
