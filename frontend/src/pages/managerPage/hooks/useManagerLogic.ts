import { useState, useMemo, useEffect } from 'react';

import { selectBookingList } from '../../../selectors/bookingSelectors';
import { selectCurrentUser, selectUsersList } from '../../../selectors';
import {
	deleteBookingThunk,
	fetchBookingsThunk,
} from '../../../store/actions/bookingActions';
import { fetchAllUsersThunk } from '../../../store/actions/userActions';
import type { Hotel, Room } from '../../../store/reducers/hotelReducer';
import type { AppDispatch } from '../../../store';
import { useDispatch } from 'react-redux';
import { selectAllHotels, selectCities } from '../../../selectors/hotelSelectors';
import { useAppSelector } from '../../../store/hooks';
import { ROLES } from '../../../utils/permissions';
import {
	addHotelThunk,
	deleteHotelThunk,
	fetchCitiesThunk,
	fetchHotelsThunk,
	updateHotelRoomsThunk,
	updateHotelThunk,
} from '../../../store/actions/hotelActions';
import type { HotelFormFields } from '../../../types/forms';

type RoomFormState = Omit<Room, '_id' | 'hotelId'>;

const initialHotelState: HotelFormFields = {
	name: '',
	cityId: '',
	description: '',
	priceFrom: '',
	images: [],
	comments: [],
};
const initialRoomState: RoomFormState = {
	type: '',
	capacity: 2,
	price: 0,
	amenities: '',
	images: [],
};

export const useManagerLogic = () => {
	const dispatch = useDispatch<AppDispatch>();
	const currentUser = useAppSelector(selectCurrentUser);
	const allHotels = useAppSelector(selectAllHotels);
	const cities = useAppSelector(selectCities);
	const allBookings = useAppSelector(selectBookingList);
	const allUsers = useAppSelector(selectUsersList);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
	const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
	const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
	const [photoUrl, setPhotoUrl] = useState('');

	const [newHotel, setNewHotel] = useState<HotelFormFields>(initialHotelState);
	const [newRoom, setNewRoom] = useState<RoomFormState>(initialRoomState);

	const isAdmin = currentUser?.role === ROLES.ADMIN;

	const myHotels = useMemo(() => {
		if (!currentUser) return [];
		return isAdmin
			? allHotels
			: allHotels.filter((h) => h.ownerId === currentUser?._id);
	}, [allHotels, currentUser, isAdmin]);

	// Вместо локального стейта myBookings — вычисляемое значение
	const enrichedBookings = useMemo(() => {
		if (!allBookings) return [];
		const filtered = allBookings.filter((b) => {
			if (isAdmin) return true;

			// Менеджер видит только брони своих отелей
			const hotel = allHotels.find((h) => h._id === b.hotelId);
			return hotel?.ownerId === currentUser?._id;
		});
		return filtered.map((b) => ({
			...b,
			client: allUsers.find((u) => u._id === b.userId) || null,
		}));
	}, [allBookings, allHotels, allUsers, isAdmin, currentUser]);

	const canAddHotel = useMemo(() => {
		const maxHotels = currentUser?.limits?.maxHotels || 0;
		return isAdmin || myHotels.length < maxHotels;
	}, [myHotels, currentUser, isAdmin]);

	const handleEditHotelClick = (hotel: Hotel) => {
		setIsEditMode(true);
		setEditingHotelId(hotel._id);
		setNewHotel({
			name: hotel.name,
			cityId: hotel.cityId,
			description: hotel.description,
			priceFrom: hotel.priceFrom,
			images: hotel.images || [],
			comments: hotel.comments || [],
		});
		setIsModalOpen(true);
	};

	const handleEditRoomClick = (hotel: Hotel, room: Room) => {
		setSelectedHotel(hotel); // Запоминаем, в каком отеле номер
		setIsEditMode(true);
		setEditingRoomId(room._id);

		setNewRoom({
			type: room.type,
			capacity: room.capacity,
			price: room.price,
			amenities: room.amenities,
			images: room.images || [],
		});

		setIsRoomModalOpen(true);
	};

	const handleOpenAddRoomModal = (hotel: Hotel) => {
		setSelectedHotel(hotel);
		setIsEditMode(false);
		setEditingRoomId(null);
		setNewRoom(initialRoomState);
		setIsRoomModalOpen(true);
	};

	const handleOpenCreateModal = () => {
		setIsEditMode(false);
		setNewHotel(initialHotelState);
		setIsModalOpen(true);
	};

	const handleRemovePhoto = (type: 'hotel' | 'room', urlToRemove: string) => {
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
	};

	useEffect(() => {
		//  Redux загружает данные
		dispatch(fetchHotelsThunk());
		dispatch(fetchCitiesThunk());
		if (currentUser?._id) {
			dispatch(fetchBookingsThunk());
			dispatch(fetchAllUsersThunk());
		}
	}, [dispatch, currentUser?._id]);

	const handleAddHotelPhoto = async (hotelId: string) => {
		if (!photoUrl) return;
		const hotel = myHotels.find((h: Hotel) => h._id === hotelId);
		if (!hotel) return;

		const updatedImages = [...(hotel.images || []), photoUrl];

		const success = await dispatch(
			updateHotelThunk(hotelId, { images: updatedImages }),
		);
		if (success) {
			// Если фото добавлялось в модалке, обновляем и выделенный отель
			if (selectedHotel?._id === hotelId) {
				setSelectedHotel({ ...selectedHotel, images: updatedImages });
			}
			setPhotoUrl('');
		}
	};

	const handleDeleteHotel = async (_id: string) => {
		const hasBookings = enrichedBookings.some((b) => b.hotelId === _id);
		if (hasBookings) return alert('Есть активные бронирования!');
		if (window.confirm('Удалить отель?')) {
			await dispatch(deleteHotelThunk(_id));
		}
	};

	const handleDeleteRoom = async (hotelId: string, roomId: string) => {
		// Проверка: забронирован ли именно этот номер?
		const isRoomBooked = enrichedBookings.some((b) => b.roomId === roomId);

		if (isRoomBooked) {
			alert('Нельзя удалить номер, на который есть активные бронирования!');
			return;
		}
		if (!window.confirm('Удалить этот номер?')) return;

		const hotel = allHotels.find((h) => h._id === hotelId);
		if (!hotel) return;

		const updatedRooms = hotel.rooms.filter((r) => r._id !== roomId);

		await dispatch(updateHotelRoomsThunk(hotelId, updatedRooms));
		setIsRoomModalOpen(false);
	};

	const handleAddRoom = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedHotel?._id) return;
		const hotelToUpdate = allHotels.find((h) => h._id === selectedHotel._id);
		if (!hotelToUpdate) return;

		const currentRooms = Array.isArray(hotelToUpdate.rooms)
			? hotelToUpdate.rooms
			: [];

		let updatedRooms;

		if (isEditMode && editingRoomId) {
			// РЕЖИМ РЕДАКТИРОВАНИЯ
			updatedRooms = currentRooms.map((room) =>
				room._id === editingRoomId
					? {
							...room,
							...newRoom,

							type: newRoom.type || room.type,
							price: Number(newRoom.price),
							capacity: Number(newRoom.capacity),
							images: newRoom.images || room.images || [],
						}
					: room,
			);
		} else {
			// РЕЖИМ СОЗДАНИЯ
			const maxRooms = currentUser?.limits?.maxRooms || 0;
			if (!isAdmin && currentRooms.length >= maxRooms) {
				alert(`Превышен лимит номеров! Ваш максимум: ${maxRooms}`);
				return;
			}

			const roomData = {
				...newRoom,
				type: newRoom.type || 'Стандарт',
				capacity: Number(newRoom.capacity),
				price: Number(newRoom.price),
				amenities: newRoom.amenities || '',
				images: newRoom.images || [],
				_id: String(Date.now()),
				hotelId: hotelToUpdate._id,
			};
			updatedRooms = [...currentRooms, roomData];
		}

		const success = await dispatch(
			updateHotelRoomsThunk(hotelToUpdate._id, updatedRooms),
		);

		if (success) {
			setIsRoomModalOpen(false);
			setIsEditMode(false);
			setEditingRoomId(null);
			setNewRoom({ type: '', capacity: 2, price: 0, amenities: '', images: [] });
		}
	};

	const handleSaveHotel = async (e: React.FormEvent) => {
		e.preventDefault();

		// Создаем объект, который СТРОГО соответствует интерфейсу Hotel из редюсера
		const hotelToSave: Hotel = {
			...newHotel,
			_id: isEditMode && editingHotelId ? editingHotelId : String(Date.now()),
			ownerId: currentUser?._id || 0,
			// Явное преобразование к числу для Reducer/API
			cityId: newHotel.cityId,
			priceFrom: Number(newHotel.priceFrom),
			name: newHotel.name || '',
			description: newHotel.description || '',
			rating: newHotel.rating ?? 5,
			reviewCount: newHotel.reviewCount ?? 0,
			comments: newHotel.comments || [],
			rooms:
				isEditMode && editingHotelId
					? allHotels.find((h) => h._id === editingHotelId)?.rooms || []
					: [],
			images: newHotel.images || [],
		} as Hotel;

		if (isEditMode && editingHotelId) {
			await dispatch(updateHotelThunk(editingHotelId, hotelToSave));
		} else {
			await dispatch(addHotelThunk(hotelToSave));
		}

		setIsModalOpen(false);
	};

	const handleDeleteBooking = async (bookingId: string) => {
		if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) return;
		await dispatch(deleteBookingThunk(bookingId));
	};

	return {
		state: {
			currentUser,
			myHotels,
			cities,
			enrichedBookings,
			isModalOpen,
			isRoomModalOpen,
			isEditMode,
			selectedHotel,
			isAdmin,
			canAddHotel,
			newHotel,
			setNewHotel,
			newRoom,
			photoUrl,
			setPhotoUrl,
			// hotelPhotoUrl,
			// setHotelPhotoUrl,
			setSelectedHotel,
			setNewRoom,
		},
		actions: {
			canAddHotel,
			setIsModalOpen,
			setIsRoomModalOpen,
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
