// import type { Booking } from '../store/reducers/bookingReducer';
import type { Booking } from '../types/models';
import { getMinDate } from './helpers';

interface OverlapResult {
	overlap: boolean;
	message?: string;
}

export const checkDateOverlap = (
	startStr: string,
	endStr: string,
	existingBookings: Booking[],
): OverlapResult => {
	const newStart = new Date(startStr + 'T00:00:00');
	const newEnd = new Date(endStr + 'T00:00:00');
	const today = new Date(getMinDate() + 'T00:00:00');

	if (newStart >= newEnd) {
		return {
			overlap: true,
			message: 'Дата выезда должна быть позже даты заезда.',
		};
	}
	if (newStart < today) {
		return { overlap: true, message: 'Дата заезда не может быть в прошлом.' };
	}

	const isOverlap = existingBookings.some((booking) => {
		const bookedStart = new Date(booking.checkIn + 'T00:00:00');
		const bookedEnd = new Date(booking.checkOut + 'T00:00:00');
		return newStart < bookedEnd && newEnd > bookedStart;
	});

	return isOverlap
		? { overlap: true, message: 'Эти даты уже заняты.' }
		: { overlap: false };
};
