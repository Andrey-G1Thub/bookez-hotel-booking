// hooks/useHotelActions.ts

import {
	deleteHotelThunk,
	updateHotelThunk,
	addHotelThunk,
} from '../../../../store/actions/hotelActions';

export const useHotelActions = (
	dispatch,
	{
		newHotel,
		isEditMode,
		editingHotelId,
		currentUser,
		allHotels,
		setIsModalOpen,
		filteredBookings,
	},
) => {
	const handleDeleteHotel = async (_id: string) => {
		const hasBookings = filteredBookings.some((b) => b.hotelId === _id);
		if (hasBookings) return alert('Есть активные бронирования!');
		if (window.confirm('Удалить отель?')) {
			await dispatch(deleteHotelThunk(_id));
		}
	};

	const handleSaveHotel = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentUser?._id) return;

		const formData = new FormData();
		formData.append('name', newHotel.name || '');
		formData.append('description', newHotel.description || '');
		formData.append('cityId', newHotel.cityId);
		formData.append('priceFrom', String(newHotel.priceFrom));
		if (newHotel.images?.length > 0)
			formData.append('images', JSON.stringify(newHotel.images));

		const currentOwnerId =
			isEditMode && editingHotelId
				? allHotels.find((h) => h._id === editingHotelId)?.ownerId
				: currentUser._id;
		formData.append('ownerId', currentOwnerId || '');

		if (newHotel.imageFile) formData.append('image', newHotel.imageFile);

		const rooms =
			isEditMode && editingHotelId
				? allHotels.find((h) => h._id === editingHotelId)?.rooms || []
				: [];
		formData.append('rooms', JSON.stringify(rooms));

		if (isEditMode && editingHotelId) {
			await dispatch(updateHotelThunk(editingHotelId, formData));
		} else {
			await dispatch(addHotelThunk(formData));
		}
		setIsModalOpen(false);
	};

	return { handleDeleteHotel, handleSaveHotel };
};
