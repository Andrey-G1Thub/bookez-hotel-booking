// hooks/useBookingEnrichment.ts
import { useMemo } from 'react';
import { ROLES } from '../../../../utils/permissions';

export const useFilteredBookings = (allBookings, allHotels, allUsers, currentUser) => {
	const isAdmin = currentUser?.role === ROLES.ADMIN;

	return useMemo(() => {
		if (!allBookings) return [];

		const filtered = allBookings.filter((b) => {
			if (isAdmin) return true;
			const hotel = allHotels.find((h) => h._id === b.hotelId);
			return hotel?.ownerId === currentUser?._id;
		});

		return filtered.map((b) => ({
			...b,
			client: allUsers.find((u) => u._id === b.userId) || null,
		}));
	}, [allBookings, allHotels, allUsers, isAdmin, currentUser]);
};
