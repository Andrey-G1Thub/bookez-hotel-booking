import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROLES } from '../../utils/permissions';
import {
	addHotelThunk,
	deleteHotelThunk,
	updateHotelRoomsThunk,
	updateHotelThunk,
} from '../../store/actions/hotelActions';
import { deleteBookingThunk } from '../../store/actions/bookingActions';

export const useManagerLogic = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state: any) => state.users);
	const { allHotels, cities } = useSelector((state) => state.hotels.allHotels);

	const isAdmin = currentUser?.role === ROLES.ADMIN;

	const myHotels = allHotels.filter((h) => isAdmin || h.ownerId === currentUser.id);

	const [myBookings, setMyBookings] = useState<any[]>([]);
	const [photoUrl, setPhotoUrl] = useState('');

	// Состояния модалок
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
	const [selectedHotel, setSelectedHotel] = useState<any>(null);

	// Состояния форм
	const [newHotel, setNewHotel] = useState({
		name: '',
		cityId: '',
		description: '',
		priceFrom: '',
		images: [],
	});
	const [newRoom, setNewRoom] = useState({
		type: '',
		capacity: 2,
		price: '',
		amenities: '',
	});

	// --- ЗАГРУЗКА ДАННЫХ ---
	useEffect(() => {
		const fetchData = async () => {
			const hotelsUrl = isAdmin
				? `http://localhost:3001/hotels`
				: `http://localhost:3001/hotels?ownerId=${currentUser.id}`;

			const [hRes, cRes, bRes, uRes] = await Promise.all([
				fetch(hotelsUrl),
				fetch(`http://localhost:3001/cities`),
				fetch(`http://localhost:3001/bookings`),
				fetch(`http://localhost:3001/users`),
			]);

			const [hotelsData, citiesData, allBookings, allUsers] = await Promise.all([
				hRes.json(),
				cRes.json(),
				bRes.json(),
				uRes.json(),
			]);

			setCities(citiesData);

			const enrichedBookings = allBookings
				.filter(
					(b: any) =>
						isAdmin || hotelsData.some((h: any) => h.id === b.hotelId),
				)
				.map((book: any) => ({
					...book,
					client: allUsers.find((u: any) => u.id === book.userId) || null,
				}));

			setMyBookings(enrichedBookings);
		};

		if (currentUser?.id) fetchData();
	}, [currentUser, isAdmin]);

	// --- ОБРАБОТЧИКИ (ОТЕЛИ) ---
	const handleDeleteHotel = async (hotelId: number) => {
		const hasBookings = myBookings.some((b: any) => b.hotelId === hotelId);
		if (hasBookings) {
			alert('Невозможно удалить отель с активными бронированиями.');
			return;
		}
		if (!window.confirm('Удалить этот отель?')) return;

		if (await dispatch(deleteHotelThunk(hotelId) as any)) {
			setMyHotels((prev) => prev.filter((h) => h.id !== hotelId));
		}
	};

	const handleAddHotel = async (e: React.FormEvent) => {
		e.preventDefault();
		const hotelToSave = {
			...newHotel,
			id: Date.now(),
			ownerId: currentUser.id,
			cityId: Number(newHotel.cityId),
			priceFrom: Number(newHotel.priceFrom),
			rating: 5,
			reviewCount: 0,
			rooms: [],
			images: [],
		};

		if (await dispatch(addHotelThunk(hotelToSave) as any)) {
			setIsModalOpen(false);
			setNewHotel({
				name: '',
				cityId: '',
				description: '',
				priceFrom: '',
				images: [],
			});
		}
	};

	// --- ОБРАБОТЧИКИ (НОМЕРА) ---
	const handleAddRoom = async (e: React.FormEvent) => {
		e.preventDefault();

		// 1. Всегда берем актуальный отель из списка по ID
		const hotelToUpdate = allHotels.find((h) => h.id === selectedHotel.id);
		if (!hotelToUpdate) return;

		const currentRoomsCount = selectedHotel.rooms?.length || 0;
		const maxRooms = currentUser.limits?.maxRooms || 0;

		if (!isAdmin && currentRoomsCount >= maxRooms) {
			alert(`Превышен лимит номеров! Ваш максимум: ${maxRooms}`);
			return;
		}

		const roomData = {
			...newRoom,
			id: Date.now(),
			hotelId: hotelToUpdate.id, // Теперь ссылка на отель точно будет!
			price: Number(newRoom.price),
			capacity: Number(newRoom.capacity),
			images: [], // Инициализируем пустой массив для фото
		};
		const updatedRooms = [...(hotelToUpdate.rooms || []), roomData];

		if (
			await dispatch(updateHotelRoomsThunk(hotelToUpdate.id, updatedRooms) as any)
		) {
			setIsRoomModalOpen(false);
			setNewRoom({ type: '', capacity: 2, price: '', amenities: '' });
		}
	};

	const handleDeleteRoom = async (hotelId: number, roomId: number) => {
		if (myBookings.some((b: any) => b.roomId === roomId)) {
			alert('Нельзя удалить забронированный номер!');
			return;
		}
		if (!window.confirm('Удалить этот номер?')) return;

		const hotel = myHotels.find((h) => h.id === hotelId);
		const updatedRooms = hotel.rooms.filter((r: any) => r.id !== roomId);

		if (await dispatch(updateHotelRoomsThunk(hotelId, updatedRooms) as any)) {
			setMyHotels((prev) =>
				prev.map((h) => (h.id === hotelId ? { ...h, rooms: updatedRooms } : h)),
			);
		}
	};

	// --- ФОТОГРАФИИ ---
	const handleAddHotelPhoto = async (hotelId: number) => {
		if (!photoUrl) return;
		const hotel = myHotels.find((h) => h.id === hotelId);
		const updatedImages = [...(hotel.images || []), photoUrl];

		if (await dispatch(updateHotelThunk(hotelId, { images: updatedImages }) as any)) {
			setMyHotels((prev) =>
				prev.map((h) => (h.id === hotelId ? { ...h, images: updatedImages } : h)),
			);
			setPhotoUrl('');
		}
	};

	const handleAddRoomPhoto = async (
		hotelId: number,
		roomId: number,
		specificUrl: string,
	) => {
		const urlToUse = specificUrl || photoUrl;
		if (!urlToUse) return;

		const hotel = myHotels.find((h) => h.id === hotelId);
		const updatedRooms = hotel.rooms.map((r: any) =>
			r.id === roomId ? { ...r, images: [...(r.images || []), urlToUse] } : r,
		);

		if (await dispatch(updateHotelThunk(hotelId, { rooms: updatedRooms }) as any)) {
			// setMyHotels((prev) =>
			// 	prev.map((h) => (h.id === hotelId ? { ...h, rooms: updatedRooms } : h)),
			// );
			setPhotoUrl('');
		}
	};

	const handleDeleteBooking = async (id: number) => {
		if (!window.confirm('Отменить бронь?')) return;
		await dispatch(deleteBookingThunk(id) as any);
		setMyBookings((prev) => prev.filter((b) => b.id !== id));
	};

	const canAddHotel =
		isAdmin || myHotels.length < (currentUser?.limits?.maxHotels || 0);

	return {
		myHotels,
		myBookings,
		cities,
		isAdmin,
		canAddHotel,
		photoUrl,
		setPhotoUrl,
		isModalOpen,
		setIsModalOpen,
		isRoomModalOpen,
		setIsRoomModalOpen,
		newHotel,
		setNewHotel,
		newRoom,
		setNewRoom,
		selectedHotel,
		setSelectedHotel,
		handleDeleteHotel,
		handleAddHotel,
		handleAddRoom,
		handleDeleteRoom,
		handleAddHotelPhoto,
		handleAddRoomPhoto,
		handleDeleteBooking,
	};
};
