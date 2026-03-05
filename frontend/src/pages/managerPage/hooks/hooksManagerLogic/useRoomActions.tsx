import { updateHotelRoomsThunk } from '../../../../store/actions/hotelActions';
import type { AppDispatch } from '../../../../store';
import type { Hotel } from '../../../../types/models';

export const useRoomActions = (
	dispatch: AppDispatch,
	{
		allHotels,
		newRoom,
		resetRoom,
		selectedHotel,
		editing,
		modals,
		setModals,
		filteredBookings,
	}: any,
) => {
	const handleDeleteRoom = async (hotelId: string, roomId: string) => {
		const isRoomBooked = filteredBookings.some((b: any) => b.roomId === roomId);
		if (isRoomBooked) {
			alert('Нельзя удалить номер, на который есть активные бронирования!');
			return;
		}
		if (!window.confirm('Удалить этот номер?')) return;

		const hotel = allHotels.find((h: Hotel) => h._id === hotelId);
		if (!hotel) return;

		const updatedRooms = hotel.rooms.filter((r) => r._id !== roomId);
		await dispatch(updateHotelRoomsThunk(hotelId, updatedRooms));
		setModals.setIsRoomModalOpen(false);
	};

	const handleAddRoom = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedHotel?._id) return;

		const hotelToUpdate = allHotels.find((h: Hotel) => h._id === selectedHotel._id);
		if (!hotelToUpdate) return;

		const currentRooms = hotelToUpdate.rooms || [];
		const { imageFile, ...restRoom } = newRoom;

		let updatedRooms;
		if (modals.isEditMode && editing.editingRoomId) {
			updatedRooms = currentRooms.map((room) =>
				room._id === editing.editingRoomId
					? {
							...room,
							...restRoom,
							price: Number(restRoom.price),
							capacity: Number(restRoom.capacity),
						}
					: room,
			);
		} else {
			updatedRooms = [
				...currentRooms,
				{
					...restRoom,
					price: Number(restRoom.price),
					capacity: Number(restRoom.capacity),
					hotelId: hotelToUpdate._id,
				},
			];
		}

		const formData = new FormData();
		formData.append('rooms', JSON.stringify(updatedRooms));
		if (editing.editingRoomId)
			formData.append('editingRoomId', editing.editingRoomId);
		if (newRoom.imageFile) formData.append('roomImage', newRoom.imageFile);

		const success = await dispatch(
			updateHotelRoomsThunk(hotelToUpdate._id, formData),
		);
		if (success) {
			setModals.setIsRoomModalOpen(false);
			resetRoom();
			editing.setEditingRoomId(null);
		}
	};

	return { handleDeleteRoom, handleAddRoom };
};
