import { useState, useMemo, useEffect } from 'react';

import { selectBookingList } from '../../../selectors/bookingSelectors';
import { selectCurrentUser, selectUsersList } from '../../../selectors';
import {
	deleteBookingThunk,
	fetchBookingsThunk,
} from '../../../store/actions/bookingActions';
import { fetchAllUsersThunk } from '../../../store/actions/userActions';
// import type { Hotel, Room } from '../../../store/reducers/hotelReducer';
import type { AppDispatch } from '../../../store';
import { useDispatch } from 'react-redux';
import { selectAllHotels, selectCities } from '../../../selectors/hotelSelectors';
import { useAppSelector } from '../../../store/hooks';
import { ROLES } from '../../../utils/permissions';
import {
	addHotelThunk,
	deleteHotelThunk,
	deletePhotoThunk,
	fetchCitiesThunk,
	fetchHotelsThunk,
	updateHotelRoomsThunk,
	updateHotelThunk,
} from '../../../store/actions/hotelActions';
import { useManagerModals } from './hooksManagerLogic/useManagerModals';
import { useManagerForms } from './hooksManagerLogic/useManagerForms';
import { useFilteredBookings } from './hooksManagerLogic/useFilteredBookings';
import { useHotelActions } from './hooksManagerLogic/useHotelActions';
import { useBookingActions } from './hooksManagerLogic/useBookingAction';
import { useRoomActions } from './hooksManagerLogic/useRoomActions';
import type { ManagerLogicReturn } from '../../../types/hooks';
import type { HotelFormFields, RoomFormFields } from '../../../types/forms';
import type { Hotel, Room } from '../../../types/models';

export const initialHotelState: HotelFormFields = {
	name: '',
	cityId: '',
	description: '',
	priceFrom: '',
	images: [],
	comments: [],
};

export const initialRoomState: RoomFormFields = {
	type: '',
	capacity: 2,
	price: 0,
	amenities: '',
	images: [],
};

export const useManagerLogic = (): ManagerLogicReturn => {
	const dispatch = useDispatch<AppDispatch>();

	const { modals, setModals, editing } = useManagerModals();
	const {
		newHotel,
		setNewHotel,
		resetHotel,
		newRoom,
		setNewRoom,
		resetRoom,
		photoUrl,
		setPhotoUrl,
	} = useManagerForms(initialHotelState, initialRoomState);
	const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

	const currentUser = useAppSelector(selectCurrentUser);
	const allHotels = useAppSelector(selectAllHotels);
	const cities = useAppSelector(selectCities);
	const allBookings = useAppSelector(selectBookingList);
	const allUsers = useAppSelector(selectUsersList);

	const filteredBookings = useFilteredBookings(
		allBookings,
		allHotels,
		allUsers,
		currentUser,
	);
	const { handleDeleteHotel, handleSaveHotel } = useHotelActions(dispatch, {
		newHotel,
		isEditMode: modals.isEditMode,
		editingHotelId: editing.editingHotelId,
		currentUser,
		allHotels,
		setIsModalOpen: setModals.setIsModalOpen,
		filteredBookings,
	});
	const { handleDeleteBooking } = useBookingActions(dispatch);

	const { handleDeleteRoom, handleAddRoom } = useRoomActions(dispatch, {
		allHotels,
		newRoom,
		resetRoom,
		selectedHotel,
		editing,
		modals,
		setModals,
		filteredBookings,
	});

	const isAdmin = currentUser?.role === ROLES.ADMIN;

	const myHotels = useMemo(() => {
		if (!currentUser) return [];
		return isAdmin
			? allHotels
			: allHotels.filter((h) => h.ownerId === currentUser?._id);
	}, [allHotels, currentUser, isAdmin]);

	const canAddHotel = useMemo(() => {
		if (isAdmin) return true;
		const maxHotels = currentUser?.limits?.maxHotels || 0;
		return myHotels.length < maxHotels;
	}, [myHotels, currentUser, isAdmin]);

	const canAddRoom = useMemo(() => {
		if (isAdmin) return true;
		if (!selectedHotel) return false;
		const maxRooms = currentUser?.limits?.maxRooms || 0;
		const currentRoomsCount = selectedHotel.rooms?.length || 0;
		return currentRoomsCount < maxRooms;
	}, [selectedHotel, currentUser, isAdmin]);

	const handleEditHotelClick = (hotel: Hotel) => {
		setModals.setIsEditMode(true);
		editing.setEditingHotelId(hotel._id);
		setNewHotel({
			name: hotel.name,
			cityId: hotel.cityId,
			description: hotel.description,
			priceFrom: hotel.priceFrom,
			images: hotel.images || [],
			comments: hotel.comments || [],
		});
		setModals.setIsModalOpen(true);
	};

	const handleEditRoomClick = (hotel: Hotel, room: Room) => {
		setSelectedHotel(hotel);
		setModals.setIsEditMode(true);
		editing.setEditingRoomId(room._id);
		setNewRoom({
			type: room.type,
			capacity: room.capacity,
			price: room.price,
			amenities: room.amenities,
			images: room.images || [],
		});
		setModals.setIsRoomModalOpen(true);
	};

	const handleOpenAddRoomModal = (hotel: Hotel) => {
		setSelectedHotel(hotel);
		const maxRooms = currentUser?.limits?.maxRooms || 0;
		if (!isAdmin && (hotel.rooms?.length || 0) >= maxRooms) {
			alert(`Превышен лимит комнат! Максимум для вашего тарифа: ${maxRooms}`);
			return;
		}
		setModals.setIsEditMode(false);
		editing.setEditingRoomId(null);
		resetRoom();
		setModals.setIsRoomModalOpen(true);
	};

	const handleOpenCreateModal = () => {
		setModals.setIsEditMode(false);
		resetHotel();
		setModals.setIsModalOpen(true);
	};

	const handleRemovePhoto = async (type: 'hotel' | 'room', urlToRemove: string) => {
		if (type === 'hotel') {
			setNewHotel((prev) => ({
				...prev,
				images: (prev.images || []).filter((img) => img !== urlToRemove),
			}));
		} else {
			setNewRoom((prev) => ({
				...prev,
				images: (prev.images || []).filter((img) => img !== urlToRemove),
			}));
		}
		// Если это существующий отель (есть ID) и фото не временное (не blob)
		const isServerPhoto = urlToRemove.startsWith('/backend/uploads/');

		if (isServerPhoto) {
			if (type === 'hotel' && editing.editingHotelId) {
				// Удаляем фото отеля
				await dispatch(
					deletePhotoThunk(editing.editingHotelId, urlToRemove, 'hotel'),
				);
			} else if (type === 'room' && selectedHotel?._id && editing.editingRoomId) {
				// Удаляем фото конкретной комнаты
				await dispatch(
					deletePhotoThunk(
						selectedHotel._id,
						urlToRemove,
						'room',
						editing.editingRoomId,
					),
				);
			}
		}
	};

	useEffect(() => {
		//  Redux загружает данные
		dispatch(fetchHotelsThunk());
		dispatch(fetchCitiesThunk());
		if (currentUser?._id) {
			dispatch(fetchBookingsThunk());

			if (currentUser.role === ROLES.ADMIN) {
				dispatch(fetchAllUsersThunk());
			}
		}
	}, [dispatch, currentUser?._id, currentUser?.role]);

	const handleAddHotelPhoto = async (hotelId: string) => {
		if (!photoUrl) return;

		// Создаем FormData, как и при загрузке файла
		const formData = new FormData();
		formData.append('imageUrl', photoUrl); // Добавляем URL картинки

		// Отправляем formData в Thunk
		const success = await dispatch(updateHotelThunk(hotelId, formData));

		if (success) {
			setPhotoUrl('');
		}
	};

	return {
		state: {
			currentUser,
			myHotels,
			cities,
			enrichedBookings: filteredBookings,
			...modals,
			selectedHotel,
			isAdmin,
			canAddHotel,
			canAddRoom,
			newHotel,
			setNewHotel,
			newRoom,
			photoUrl,
			setPhotoUrl,
			setSelectedHotel,
			setNewRoom,
		},
		actions: {
			canAddHotel,
			...setModals,
			handleDeleteHotel,

			handleDeleteRoom,
			handleAddRoom,
			handleSaveHotel,
			handleEditHotelClick,
			handleEditRoomClick,
			handleDeleteBooking,

			handleOpenAddRoomModal,
			handleOpenCreateModal,
			handleAddHotelPhoto,
			handleRemovePhoto,
		},
	};
};
