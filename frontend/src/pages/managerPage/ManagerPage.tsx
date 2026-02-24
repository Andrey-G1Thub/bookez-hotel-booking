import { Hotel as HotelIcon } from 'lucide-react';
import { DashboardHeader } from './componentsManagerPage/Header';
import { HotelCardInManagerPage } from './componentsManagerPage/HotelCardInManagerPage';
import { ItemInCardManager } from './componentsManagerPage/componentsHotelCardInManagerPage/ItemInCardManager';
import { HotelModal } from './componentsManagerPage/componentModalForm/HotelModal';
import { RoomModal } from './componentsManagerPage/componentModalForm/RoomModal';
import type { Hotel, Room } from '../../store/reducers/hotelReducer';

import { useManagerLogic } from './hooks/useManagerLogic';

export const ManagerPage = () => {
	const { state, actions } = useManagerLogic();

	// const currentUser = useAppSelector(selectCurrentUser);
	// const allBookings = useSelector((state) => state.bookings.list);
	// // const dispatch = useDispatch();
	// const dispatch = useDispatch<AppDispatch>();
	// // const { allHotels, cities } = useSelector((state: any) => state.hotels);
	// const allHotels = useAppSelector(selectAllHotels);
	// const cities = useAppSelector(selectCities);
	// const [isModalOpen, setIsModalOpen] = useState(false);

	// const isAdmin = currentUser?.role === ROLES.ADMIN;

	// const [myBookings, setMyBookings] = useState<(Booking & { client?: User | null })[]>(
	// 	[],
	// );
	// const [cities, setCities] = useState([]);

	// Состояние модалки и формы

	// const [newHotel, setNewHotel] = useState<Partial<HotelFormState>>({
	// 	name: '',
	// 	cityId: 0,
	// 	description: '',
	// 	priceFrom: '',
	// 	images: [],
	// 	comments: [],
	// });
	// const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null); // Для какой комнаты открыта модалка
	// const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
	// const [newRoom, setNewRoom] = useState<Partial<RoomFormState>>({
	// 	type: '',
	// 	capacity: 2,
	// 	price: 0,
	// 	amenities: '',
	// 	images: [],
	// });

	// const [photoUrl, setPhotoUrl] = useState('');
	// const [hotelPhotoUrl, setHotelPhotoUrl] = useState('');

	// const [isEditMode, setIsEditMode] = useState(false); // Режим редактирования или создания
	// const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
	// const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
	// const [isOpen, setIsOpen] = useState(false);

	// const myHotels = useMemo(() => {
	// 	const isAdmin = currentUser?.role === ROLES.ADMIN;
	// 	return isAdmin
	// 		? allHotels
	// 		: allHotels.filter((h) => h.ownerId === currentUser?.id);
	// }, [allHotels, currentUser]);

	// --- ФУНКЦИЯ УДАЛЕНИЯ ОТЕЛЯ ---
	// const handleDeleteHotel = async (hotelId: number) => {
	// 	// 1. Проверка на наличие бронирований (Защита от дурака)
	// 	const hasBookings = myBookings.some((b: any) => b.hotelId === hotelId);
	// 	if (hasBookings) {
	// 		alert(
	// 			'Невозможно удалить отель, в котором есть активные бронирования. Сначала отмените бронирования.',
	// 		);
	// 		return;
	// 	}
	// 	if (!window.confirm('Вы уверены, что хотите удалить этот отель?')) return;

	// 	const success = await dispatch(deleteHotelThunk(hotelId));
	// };

	// --- ФУНКЦИЯ УДАЛЕНИЯ НОМЕРА ---
	// const handleDeleteRoom = async (hotelId: number, roomId: number) => {
	// 	// Проверка: забронирован ли именно этот номер?
	// 	const isRoomBooked = myBookings.some((b: any) => b.roomId === roomId);

	// 	if (isRoomBooked) {
	// 		alert('Нельзя удалить номер, на который есть активные бронирования!');
	// 		return;
	// 	}
	// 	if (!window.confirm('Удалить этот номер?')) return;

	// 	const hotel = allHotels.find((h: any) => h.id === hotelId);
	// 	if (!hotel) return;

	// 	const updatedRooms = hotel.rooms.filter((r) => r.id !== roomId);
	// 	// const success = await dispatch(updateHotelRoomsThunk(hotelId, updatedRooms));

	// 	// if (success) {
	// 	// 	// Синхронизируем Redux, если нужно
	// 	// 	dispatch({
	// 	// 		type: 'hotels/updateHotel',
	// 	// 		payload: { id: hotelId, rooms: updatedRooms },
	// 	// 	});
	// 	// }

	// 	// dispatch({
	// 	// 	type: 'hotels/updateHotel', //  тип экшена
	// 	// 	payload: { id: hotelId, rooms: updatedRooms },
	// 	// });

	// 	// setNewRoom({ type: '', capacity: 2, price: '', amenities: '', images: [] });
	// 	await dispatch(updateHotelRoomsThunk(hotelId, { rooms: updatedRooms }));
	// 	setIsRoomModalOpen(false);
	// };

	// --- ФУНКЦИЯ УДАЛЕНИЯ БРОНИ ---
	// const handleDeleteBooking = async (bookingId: number) => {
	// 	if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) return;

	// 	// Вызываем ваш санк (убедитесь, что он возвращает true/false или используйте .then)
	// 	await dispatch(deleteBookingThunk(bookingId));

	// 	// Обновляем локальный стейт, чтобы бронь исчезла из списка
	// 	setMyBookings((prev) => prev.filter((b) => b.id !== bookingId));
	// };

	// const handleAddHotelPhoto = async (hotelId: number) => {
	// 	if (!photoUrl) return;
	// 	const hotel = myHotels.find((h: any) => h.id === hotelId);
	// 	if (!hotel) return;

	// 	const updatedImages = [...(hotel.images || []), photoUrl];

	// 	const success = await dispatch(
	// 		updateHotelThunk(hotelId, { images: updatedImages }),
	// 	);
	// 	if (success) {
	// 		// Если фото добавлялось в модалке, обновляем и выделенный отель
	// 		if (selectedHotel?.id === hotelId) {
	// 			setSelectedHotel({ ...selectedHotel, images: updatedImages });
	// 		}
	// 		setPhotoUrl('');
	// 	}
	// };
	// 1. Функция для открытия модалки редактирования номера
	// const handleEditRoomClick = (hotel, room) => {
	// 	setSelectedHotel(hotel); // Запоминаем, в каком отеле номер
	// 	setIsEditMode(true);
	// 	setEditingRoomId(room.id);

	// 	setNewRoom({
	// 		type: room.type,
	// 		capacity: room.capacity,
	// 		price: room.price,
	// 		amenities: room.amenities,
	// 		images: room.images || [],
	// 	});

	// 	setIsRoomModalOpen(true);
	// };

	// 2. Обновленная функция сохранения номера
	// const handleAddRoom = async (e: React.FormEvent) => {
	// 	e.preventDefault();

	// 	const hotelToUpdate = allHotels.find((h) => h.id === selectedHotel.id);
	// 	if (!hotelToUpdate) return;

	// 	let updatedRooms;

	// 	if (isEditMode && editingRoomId) {
	// 		// РЕЖИМ РЕДАКТИРОВАНИЯ
	// 		updatedRooms = hotelToUpdate.rooms.map((room) =>
	// 			room.id === editingRoomId
	// 				? {
	// 						...room,
	// 						...newRoom,
	// 						price: Number(newRoom.price),
	// 						capacity: Number(newRoom.capacity),
	// 					}
	// 				: room,
	// 		);
	// 	} else {
	// 		// РЕЖИМ СОЗДАНИЯ
	// 		const maxRooms = currentUser.limits?.maxRooms || 0;
	// 		if (!isAdmin && (hotelToUpdate.rooms?.length || 0) >= maxRooms) {
	// 			alert(`Превышен лимит номеров! Ваш максимум: ${maxRooms}`);
	// 			return;
	// 		}

	// 		const roomData = {
	// 			...newRoom,
	// 			id: Date.now(),
	// 			hotelId: hotelToUpdate.id,
	// 			price: Number(newRoom.price),
	// 			capacity: Number(newRoom.capacity),
	// 		};
	// 		updatedRooms = [...(hotelToUpdate.rooms || []), roomData];
	// 	}

	// 	const success = await dispatch(
	// 		updateHotelRoomsThunk(hotelToUpdate.id, updatedRooms),
	// 	);

	// 	if (success) {
	// 		setIsRoomModalOpen(false);
	// 		setIsEditMode(false);
	// 		setEditingRoomId(null);
	// 		setNewRoom({ type: '', capacity: 2, price: 0, amenities: '', images: [] });
	// 	}
	// };

	// --- ИЗМЕНЕННЫЙ FETCH DATA ---
	// useEffect(() => {
	// 	// 1. Просто просим Redux загрузить данные
	// 	dispatch(fetchHotelsThunk());
	// 	dispatch(fetchCitiesThunk());

	// 	// 2. Бронирования и Юзеров можно оставить локально, если их нет в Redux
	// 	const fetchSupportData = async () => {
	// 		const [bRes, uRes] = await Promise.all([
	// 			fetch(`http://localhost:3001/bookings`),
	// 			fetch(`http://localhost:3001/users`),
	// 		]);
	// 		const allBookings = await bRes.json();
	// 		const allUsers = await uRes.json();

	// 		// Фильтруем бронирования (Админ видит все, менеджер — только свои)
	// 		const enrichedBookings = allBookings
	// 			.filter((b: any) => {
	// 				if (isAdmin) return true;
	// 				// Ищем, принадлежит ли отель из брони текущему менеджеру
	// 				return allHotels.some(
	// 					(h: any) => h.id === b.hotelId && h.ownerId === currentUser.id,
	// 				);
	// 			})
	// 			.map((book: any) => ({
	// 				...book,
	// 				client: allUsers.find((u: any) => u.id === book.userId) || null,
	// 			}));

	// 		setMyBookings(enrichedBookings);
	// 	};

	// 	if (currentUser?.id) fetchSupportData();
	// }, [dispatch, allHotels.length, currentUser?.id]); //
	// // ЛОГИКА: Админ может всегда, Менеджер - по лимиту
	// // const isAdmin = currentUser?.role === ROLES.ADMIN;
	// const canAddHotel = useMemo(() => {
	// 	const isAdmin = currentUser?.role === ROLES.ADMIN;
	// 	const maxHotels = currentUser?.limits?.maxHotels || 0;
	// 	return isAdmin || myHotels.length < maxHotels;
	// }, [myHotels, currentUser]);

	// const handleSaveHotel = async (e: React.FormEvent) => {
	// 	e.preventDefault();

	// 	if (isEditMode && editingHotelId) {
	// 		// Логика ОБНОВЛЕНИЯ
	// 		const success = await dispatch(updateHotelThunk(editingHotelId, newHotel));
	// 		if (success) {
	// 			setIsModalOpen(false);
	// 			setIsEditMode(false);
	// 		}
	// 	} else {
	// 		const hotelToSave = {
	// 			...newHotel,
	// 			id: Date.now(),
	// 			ownerId: currentUser.id,
	// 			cityId: Number(newHotel.cityId),
	// 			priceFrom: Number(newHotel.priceFrom),
	// 			rating: 5,
	// 			reviewCount: 0,
	// 			comments: newHotel.comments || [],
	// 			rooms: [],
	// 			images: newHotel.images.length > 0 ? newHotel.images : [],
	// 		};

	// 		const success = await dispatch(addHotelThunk(hotelToSave));

	// 		if (success) {
	// 			// setMyHotels((myHotels) => [...myHotels, hotelToSave]);
	// 			setIsModalOpen(false);
	// 			setNewHotel({
	// 				name: '',
	// 				cityId: '',
	// 				description: '',
	// 				priceFrom: '',
	// 				images: [],
	// 				comments: [],
	// 			});
	// 		}
	// 	}
	// };

	// Функция для удаления фото из еще НЕ созданного номера (локально)
	// const handleRemovePhotoFromNewRoom = (urlToRemove) => {
	// 	setNewRoom((prev) => ({
	// 		...prev,
	// 		images: prev.images.filter((img) => img !== urlToRemove),
	// 	}));
	// };

	// const handleEditHotelClick = (hotel: any) => {
	// 	setIsEditMode(true);
	// 	setEditingHotelId(hotel.id);
	// 	setNewHotel({
	// 		name: hotel.name,
	// 		cityId: hotel.cityId,
	// 		description: hotel.description,
	// 		priceFrom: hotel.priceFrom,
	// 		images: hotel.images || [],
	// 		comments: hotel.comments || [],
	// 	});
	// 	setIsModalOpen(true);
	// };

	// const handleOpenCreateModal = () => {
	// 	setIsEditMode(false);
	// 	setNewHotel({
	// 		/* пустой объект */
	// 	});
	// 	setIsModalOpen(true);
	// };
	// Функция для открытия модалки создания НОМЕРА
	// const handleOpenAddRoomModal = (hotel) => {
	// 	setSelectedHotel(hotel); // Устанавливаем отель, в который добавляем
	// 	setIsEditMode(false); // СБРАСЫВАЕМ режим редактирования
	// 	setEditingRoomId(null); // Очищаем ID редактируемого номера
	// 	setNewRoom({
	// 		// Очищаем поля формы
	// 		type: '',
	// 		capacity: 2,
	// 		price: '',
	// 		amenities: '',
	// 		images: [],
	// 	});
	// 	setIsRoomModalOpen(true);
	// };

	// const handleRemovePhotoFromNewHotel = (urlToRemove) => {
	// 	setNewHotel((prev) => ({
	// 		...prev,
	// 		images: prev.images.filter((img) => img !== urlToRemove),
	// 	}));
	// };

	return (
		<div className="p-6 max-w-7xl mx-auto mt-10">
			{/* HEADER */}
			<DashboardHeader
				isAdmin={state.isAdmin}
				currentUser={state.currentUser}
				myHotels={state.myHotels}
				canAddHotel={state.canAddHotel}
				setIsModalOpen={actions.setIsModalOpen}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-4">
					<h2 className="text-xl font-semibold flex items-center gap-2 ml-2">
						<HotelIcon className="text-teal-600" /> Мои объекты
					</h2>

					{state.myHotels.map((hotel: Hotel) => (
						<div
							key={hotel.id}
							className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4"
						>
							{/* Мои обьекты */}
							<HotelCardInManagerPage
								hotel={hotel}
								cities={state.cities}
								handleOpenAddRoomModal={actions.handleOpenAddRoomModal}
								setSelectedHotel={state.setSelectedHotel}
								handleDeleteHotel={actions.handleDeleteHotel}
								handleEditHotelClick={actions.handleEditHotelClick}
							/>
							{/* СПИСОК НОМЕРОВ ВНУТРИ КАРТОЧКИ */}
							<ItemInCardManager
								hotel={hotel}
								handleDeleteRoom={actions.handleDeleteRoom}
								allBookings={state.enrichedBookings}
								handleEditRoomClick={actions.handleEditRoomClick}
								handleDeleteBooking={actions.handleDeleteBooking}
							/>
						</div>
					))}
				</div>
			</div>

			{/* MODAL FORM добавления отеля*/}

			<HotelModal
				newHotel={state.newHotel}
				setNewHotel={state.setNewHotel}
				cities={state.cities}
				isModalOpen={state.isModalOpen}
				setIsModalOpen={actions.setIsModalOpen}
				handleSaveHotel={actions.handleSaveHotel}
				isEditMode={state.isEditMode}
				handleRemovePhoto={(url) => actions.handleRemovePhoto('hotel', url)}
				// setHotelPhotoUrl={state.setHotelPhotoUrl}
				// hotelPhotoUrl={state.hotelPhotoUrl}
			/>
			{/* Модалка добавления номера */}

			<RoomModal
				isRoomModalOpen={state.isRoomModalOpen}
				setIsRoomModalOpen={actions.setIsRoomModalOpen}
				selectedHotel={state.selectedHotel}
				handleAddRoom={actions.handleAddRoom}
				newRoom={state.newRoom}
				setNewRoom={state.setNewRoom}
				photoUrl={state.photoUrl}
				setPhotoUrl={state.setPhotoUrl}
				handleRemovePhoto={actions.handleRemovePhoto}
				isEditMode={state.isEditMode}
				// handleOpenCreateModal={actions.handleOpenCreateModal}
			/>
		</div>
	);
};
