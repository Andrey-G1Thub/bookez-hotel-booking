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
	deletePhotoThunk,
	fetchCitiesThunk,
	fetchHotelsThunk,
	updateHotelRoomsThunk,
	updateHotelThunk,
} from '../../../store/actions/hotelActions';
import type { HotelFormFields } from '../../../types/forms';

const initialHotelState: HotelFormFields = {
	name: '',
	cityId: '',
	description: '',
	priceFrom: '',
	images: [],
	comments: [],
};
export interface RoomFormFields extends Omit<Room, '_id' | 'hotelId'> {
	imageFile?: File;
}

const initialRoomState: RoomFormFields = {
	type: '',
	capacity: 2,
	price: 0,
	amenities: '',
	images: [],
	// imageFile: undefined,
};

export const useManagerLogic = () => {
	const dispatch = useDispatch<AppDispatch>();
	const currentUser = useAppSelector(selectCurrentUser);
	// console.log('Текущий пользователь из Redux:', currentUser);
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
	const [newRoom, setNewRoom] = useState<RoomFormFields>(initialRoomState);

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
		if (isAdmin) return true;
		const maxHotels = currentUser?.limits?.maxHotels || 0;
		return myHotels.length < maxHotels;
	}, [myHotels, currentUser, isAdmin]);

	const canAddRoom = useMemo(() => {
		if (isAdmin) return true;
		if (!selectedHotel) return false;

		// Берем лимит из данных пользователя
		const maxRooms = currentUser?.limits?.maxRooms || 0;

		// Считаем текущее кол-во комнат в выбранном отеле
		const currentRoomsCount = selectedHotel.rooms?.length || 0;

		return currentRoomsCount < maxRooms;
	}, [selectedHotel, currentUser, isAdmin]);

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

		const maxRooms = currentUser?.limits?.maxRooms || 0;
		if (!isAdmin && (hotel.rooms?.length || 0) >= maxRooms) {
			alert(`Превышен лимит комнат! Максимум для вашего тарифа: ${maxRooms}`);
			return;
		}

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
		// 2. Если это существующий отель (есть ID) и фото не временное (не blob)
		const isServerPhoto = urlToRemove.startsWith('/backend/uploads/');

		if (isServerPhoto) {
			if (type === 'hotel' && editingHotelId) {
				// Удаляем фото отеля
				await dispatch(deletePhotoThunk(editingHotelId, urlToRemove, 'hotel'));
			} else if (type === 'room' && selectedHotel?._id && editingRoomId) {
				// Удаляем фото конкретной комнаты
				await dispatch(
					deletePhotoThunk(
						selectedHotel._id,
						urlToRemove,
						'room',
						editingRoomId,
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

	// const handleAddRoom = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	if (!selectedHotel?._id) return;

	// 	const hotelToUpdate = allHotels.find((h) => h._id === selectedHotel._id);
	// 	if (!hotelToUpdate) return;

	// 	const currentRooms = hotelToUpdate.rooms || [];
	// 	const { imageFile, ...restRoom } = newRoom;
	// 	let updatedRooms;

	// 	if (isEditMode && editingRoomId) {
	// 		updatedRooms = currentRooms.map((room) =>
	// 			room._id === editingRoomId
	// 				? {
	// 						...room,
	// 						...newRoom,
	// 						price: Number(newRoom.price),
	// 						capacity: Number(newRoom.capacity),
	// 					}
	// 				: room,
	// 		);
	// 	} else {
	// 		updatedRooms = [
	// 			...currentRooms,
	// 			{
	// 				...newRoom,
	// 				price: Number(newRoom.price),
	// 				capacity: Number(newRoom.capacity),
	// 				hotelId: hotelToUpdate._id,
	// 			},
	// 		];
	// 	}

	// 	const formData = new FormData();
	// 	formData.append('rooms', JSON.stringify(updatedRooms));

	// 	// ВАЖНО: передаем ID редактируемой комнаты
	// 	if (editingRoomId) {
	// 		formData.append('editingRoomId', editingRoomId);
	// 	}

	// 	if (newRoom.imageFile) {
	// 		formData.append('roomImage', newRoom.imageFile); // 'roomImage' должен совпадать с именем в multer на бэкенде
	// 	}

	// 	const success = await dispatch(
	// 		updateHotelRoomsThunk(hotelToUpdate._id, formData),
	// 	);

	// 	if (success) {
	// 		setIsRoomModalOpen(false);
	// 		setNewRoom(initialRoomState);
	// 		setEditingRoomId(null);
	// 	}
	// };

	const handleAddRoom = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedHotel?._id) return;

		const hotelToUpdate = allHotels.find((h) => h._id === selectedHotel._id);
		if (!hotelToUpdate) return;

		const currentRooms = hotelToUpdate.rooms || [];

		// 1. Создаем объект комнаты для отправки (БЕЗ imageFile)
		// Деструктуризация вытащит imageFile, а в restRoom останется всё остальное
		const { imageFile, ...restRoom } = newRoom;

		let updatedRooms;

		if (isEditMode && editingRoomId) {
			updatedRooms = currentRooms.map((room) =>
				room._id === editingRoomId
					? {
							...room,
							...restRoom,
							price: Number(restRoom.price),
							capacity: Number(restRoom.capacity),
						}
					: room,
			);
		} else {
			const roomData = {
				...restRoom,
				price: Number(restRoom.price),
				capacity: Number(restRoom.capacity),
				hotelId: hotelToUpdate._id,
			};
			updatedRooms = [...currentRooms, roomData];
		}

		const formData = new FormData();
		// На сервер уходят только чистые данные (тип, цена, удобства)
		formData.append('rooms', JSON.stringify(updatedRooms));

		if (editingRoomId) {
			formData.append('editingRoomId', editingRoomId);
		}

		// 2. А сам файл отправляем отдельным полем Multipart
		if (newRoom.imageFile) {
			formData.append('roomImage', newRoom.imageFile);
		}

		const success = await dispatch(
			updateHotelRoomsThunk(hotelToUpdate._id, formData),
		);

		if (success) {
			setIsRoomModalOpen(false);
			setNewRoom(initialRoomState);
			setEditingRoomId(null);
		}
	};

	const handleSaveHotel = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentUser?._id) return;

		// Создаем FormData
		const formData = new FormData();

		// Добавляем простые поля
		formData.append('name', newHotel.name || '');
		formData.append('description', newHotel.description || '');
		formData.append('cityId', newHotel.cityId);
		formData.append('priceFrom', String(newHotel.priceFrom));

		if (newHotel.images && newHotel.images.length > 0) {
			formData.append('images', JSON.stringify(newHotel.images));
		}

		const currentOwnerId =
			isEditMode && editingHotelId
				? allHotels.find((h) => h._id === editingHotelId)?.ownerId
				: currentUser._id;
		formData.append('ownerId', currentOwnerId || '');

		// ВАЖНО: Добавляем файл, если он есть
		//  HotelFormFields есть поле imageFile?
		if (newHotel.imageFile) {
			formData.append('image', newHotel.imageFile);
		}

		// Если нужно передать массив (например, комнаты) как строку JSON
		// Бэкенд на Express должен будет сделать JSON.parse(req.body.rooms)
		const rooms =
			isEditMode && editingHotelId
				? allHotels.find((h) => h._id === editingHotelId)?.rooms || []
				: [];
		formData.append('rooms', JSON.stringify(rooms));

		if (isEditMode && editingHotelId) {
			// Для PATCH тоже используем FormData
			await dispatch(updateHotelThunk(editingHotelId, formData));
		} else {
			await dispatch(addHotelThunk(formData));
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
