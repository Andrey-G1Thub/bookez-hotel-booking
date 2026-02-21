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

type HotelFormState = Omit<Hotel, 'id' | 'ownerId' | 'rating' | 'reviewCount' | 'rooms'>;
type RoomFormState = Omit<Room, 'id' | 'hotelId'>;

const initialHotelState: HotelFormState = {
	name: '',
	cityId: 0,
	description: '',
	priceFrom: 0,
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
	const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
	const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
	const [photoUrl, setPhotoUrl] = useState('');
	const [hotelPhotoUrl, setHotelPhotoUrl] = useState('');

	const [newHotel, setNewHotel] = useState<HotelFormState>(initialHotelState);
	const [newRoom, setNewRoom] = useState<RoomFormState>(initialRoomState);

	// Данные для фильтрации
	const isAdmin = currentUser?.role === ROLES.ADMIN;

	const myHotels = useMemo(() => {
		if (!currentUser) return [];
		return isAdmin
			? allHotels
			: allHotels.filter((h) => h.ownerId === currentUser?.id);
	}, [allHotels, currentUser, isAdmin]);

	// Вместо локального стейта myBookings — вычисляемое значение
	const enrichedBookings = useMemo(() => {
		if (!allBookings) return [];
		const filtered = allBookings.filter((b) => {
			if (isAdmin) return true;

			// Менеджер видит только брони своих отелей
			const hotel = allHotels.find((h) => h.id === b.hotelId);
			return hotel?.ownerId === currentUser?.id;
		});
		return filtered.map((b) => ({
			...b,
			client: allUsers.find((u) => u.id === b.userId) || null,
		}));
	}, [allBookings, allHotels, allUsers, isAdmin, currentUser]);

	const canAddHotel = useMemo(() => {
		const maxHotels = currentUser?.limits?.maxHotels || 0;
		return isAdmin || myHotels.length < maxHotels;
	}, [myHotels, currentUser, isAdmin]);
	// Методы

	const handleEditHotelClick = (hotel: Hotel) => {
		setIsEditMode(true);
		setEditingHotelId(hotel.id);
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
		setEditingRoomId(room.id);

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
		if (currentUser?.id) {
			dispatch(fetchBookingsThunk());
			dispatch(fetchAllUsersThunk());
		}
	}, [dispatch, currentUser?.id]);

	const handleAddHotelPhoto = async (hotelId: number) => {
		if (!photoUrl) return;
		const hotel = myHotels.find((h: Hotel) => h.id === hotelId);
		if (!hotel) return;

		const updatedImages = [...(hotel.images || []), photoUrl];

		const success = await dispatch(
			updateHotelThunk(hotelId, { images: updatedImages }),
		);
		if (success) {
			// Если фото добавлялось в модалке, обновляем и выделенный отель
			if (selectedHotel?.id === hotelId) {
				setSelectedHotel({ ...selectedHotel, images: updatedImages });
			}
			setPhotoUrl('');
		}
	};

	const handleDeleteHotel = async (id: number) => {
		const hasBookings = enrichedBookings.some((b) => b.hotelId === id);
		if (hasBookings) return alert('Есть активные бронирования!');
		if (window.confirm('Удалить отель?')) {
			await dispatch(deleteHotelThunk(id));
		}
	};

	const handleDeleteRoom = async (hotelId: number, roomId: number) => {
		// Проверка: забронирован ли именно этот номер?
		const isRoomBooked = enrichedBookings.some((b) => b.roomId === roomId);

		if (isRoomBooked) {
			alert('Нельзя удалить номер, на который есть активные бронирования!');
			return;
		}
		if (!window.confirm('Удалить этот номер?')) return;

		const hotel = allHotels.find((h) => h.id === hotelId);
		if (!hotel) return;

		const updatedRooms = hotel.rooms.filter((r) => r.id !== roomId);

		await dispatch(updateHotelRoomsThunk(hotelId, updatedRooms));
		setIsRoomModalOpen(false);
	};

	const handleAddRoom = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedHotel?.id) return;
		const hotelToUpdate = allHotels.find((h) => h.id === selectedHotel.id);
		if (!hotelToUpdate) return;

		const currentRooms = Array.isArray(hotelToUpdate.rooms)
			? hotelToUpdate.rooms
			: [];

		let updatedRooms;

		if (isEditMode && editingRoomId) {
			// РЕЖИМ РЕДАКТИРОВАНИЯ
			updatedRooms = currentRooms.map((room) =>
				room.id === editingRoomId
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
				id: Date.now(),
				hotelId: hotelToUpdate.id,
			};
			updatedRooms = [...currentRooms, roomData];
		}

		const success = await dispatch(
			updateHotelRoomsThunk(hotelToUpdate.id, updatedRooms),
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

		if (isEditMode && editingHotelId) {
			// Логика ОБНОВЛЕНИЯ
			const success = await dispatch(updateHotelThunk(editingHotelId, newHotel));
			if (success) {
				setIsModalOpen(false);
				setIsEditMode(false);
			}
		} else {
			if (!currentUser?.id) return;
			const hotelToSave = {
				...newHotel,
				id: Date.now(),
				ownerId: currentUser.id,
				cityId: Number(newHotel.cityId),
				priceFrom: Number(newHotel.priceFrom),
				rating: 5,
				reviewCount: 0,
				comments: newHotel.comments || [],
				rooms: [],
				images: newHotel.images ? newHotel.images : [],
			};

			const success = await dispatch(addHotelThunk(hotelToSave));

			if (success) {
				setIsModalOpen(false);
				setNewHotel({
					name: '',
					cityId: 0,
					description: '',
					priceFrom: 0,
					images: [],
					comments: [],
				});
			}
		}
	};

	const handleDeleteBooking = async (bookingId: number) => {
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
			hotelPhotoUrl,
			setHotelPhotoUrl,
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
