import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROLES } from '../../utils/permissions';
import { Hotel, PlusCircle, ClipboardList, X, Trash2 } from 'lucide-react';
import {
	addHotelThunk,
	deleteHotelThunk,
	fetchCitiesThunk,
	fetchHotelsThunk,
	updateHotelRoomsThunk,
	updateHotelThunk,
} from '../../store/actions/hotelActions';
import { deleteBookingThunk } from '../../store/actions/bookingActions';
import { DashboardHeader } from './componentsManagerPage/Header';
import { HotelCardInManagerPage } from './componentsManagerPage/HotelCardInManagerPage';
import { ItemInCardManager } from './componentsManagerPage/componentsHotelCardInManagerPage/ItemInCardManager';
import { BookingList } from './componentsManagerPage/BookingList';
import { HotelModal } from './componentsManagerPage/componentModalForm/HotelModal';
import { RoomModal } from './componentsManagerPage/componentModalForm/RoomModal';

export const ManagerPage = () => {
	const { currentUser } = useSelector((state: any) => state.users);
	const dispatch = useDispatch();

	const isAdmin = currentUser?.role === ROLES.ADMIN;

	const { allHotels, cities } = useSelector((state: any) => state.hotels);

	const [myBookings, setMyBookings] = useState([]);
	// const [cities, setCities] = useState([]);

	// Состояние модалки и формы
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newHotel, setNewHotel] = useState({
		name: '',
		cityId: '',
		description: '',
		priceFrom: '',
		images: [],
		comments: '',
	});
	const [selectedHotel, setSelectedHotel] = useState<any>(null); // Для какой комнаты открыта модалка
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
	const [newRoom, setNewRoom] = useState({
		type: '',
		capacity: 2,
		price: '',
		amenities: '',
		images: [],
	});
	const [users, setUsers] = useState([]);
	const [photoUrl, setPhotoUrl] = useState('');

	const myHotels = isAdmin
		? allHotels
		: allHotels.filter((h) => h.ownerId === currentUser?.id);

	// --- ФУНКЦИЯ УДАЛЕНИЯ ОТЕЛЯ ---
	const handleDeleteHotel = async (hotelId: number) => {
		// 1. Проверка на наличие бронирований (Защита от дурака)
		const hasBookings = myBookings.some((b: any) => b.hotelId === hotelId);
		if (hasBookings) {
			alert(
				'Невозможно удалить отель, в котором есть активные бронирования. Сначала отмените бронирования.',
			);
			return;
		}
		if (!window.confirm('Вы уверены, что хотите удалить этот отель?')) return;

		const success = await dispatch(deleteHotelThunk(hotelId));

		if (success) {
			// Мгновенно убираем из списка
			// setMyHotels((prev) => prev.filter((h: any) => h.id !== hotelId));
		}
	};

	// --- ФУНКЦИЯ УДАЛЕНИЯ НОМЕРА ---
	const handleDeleteRoom = async (hotelId: number, roomId: number) => {
		// Добавляем проверку (Optional Chaining или if)
		// if (!selectedHotel || !selectedHotel.id) {
		// 	console.error('Отель не выбран!');
		// 	return;
		// }
		// Проверка: забронирован ли именно этот номер?
		const isRoomBooked = myBookings.some((b: any) => b.roomId === roomId);

		if (isRoomBooked) {
			alert('Нельзя удалить номер, на который есть активные бронирования!');
			return;
		}
		if (!window.confirm('Удалить этот номер?')) return;

		const hotel = myHotels.find((h: any) => h.id === hotelId);
		if (!hotel) return;

		const updatedRooms = hotel.rooms.filter((r: any) => r.id !== roomId);
		const success = await dispatch(updateHotelRoomsThunk(hotelId, updatedRooms));

		if (success) {
			// Синхронизируем Redux, если нужно
			dispatch({
				type: 'hotels/updateHotel',
				payload: { id: hotelId, rooms: updatedRooms },
			});
		}

		dispatch({
			type: 'hotels/updateHotel', //  тип экшена
			payload: { id: selectedHotel.id, rooms: updatedRooms },
		});

		setIsRoomModalOpen(false);
		setNewRoom({ type: '', capacity: 2, price: '', amenities: '', images: [] });
	};

	// --- ФУНКЦИЯ УДАЛЕНИЯ БРОНИ ---
	const handleDeleteBooking = async (bookingId: number) => {
		if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) return;

		// Вызываем ваш санк (убедитесь, что он возвращает true/false или используйте .then)
		await dispatch(deleteBookingThunk(bookingId));

		// Обновляем локальный стейт, чтобы бронь исчезла из списка
		setMyBookings((prev) => prev.filter((b) => b.id !== bookingId));
	};

	const handleDeleteHotelPhoto = async (hotelId: number, urlToDelete: string) => {
		const hotel = myHotels.find((h: any) => h.id === hotelId);
		const updatedImages = hotel.images.filter((img: string) => img !== urlToDelete);

		const success = await dispatch(
			updateHotelThunk(hotelId, { images: updatedImages }),
		);
		if (success) {
			// setMyHotels((prev) =>
			// 	prev.map((h) => (h.id === hotelId ? { ...h, images: updatedImages } : h)),
			// );
		}
	};
	const handleAddHotelPhoto = async (hotelId: number) => {
		if (!photoUrl) return;
		const hotel = myHotels.find((h: any) => h.id === hotelId);
		if (!hotel) return;

		const updatedImages = [...(hotel.images || []), photoUrl];

		const success = await dispatch(
			updateHotelThunk(hotelId, { images: updatedImages }),
		);
		if (success) {
			// setMyHotels((prev) =>
			// 	prev.map((h) => (h.id === hotelId ? { ...h, images: updatedImages } : h)),
			// );
			// Если фото добавлялось в модалке, обновляем и выделенный отель
			if (selectedHotel?.id === hotelId) {
				setSelectedHotel({ ...selectedHotel, images: updatedImages });
			}
			setPhotoUrl('');
		}
	};
	const handleAddRoom = async (e: React.FormEvent) => {
		e.preventDefault();

		// 1. Находим актуальный отель из Redux (allHotels)
		const hotelToUpdate = allHotels.find((h) => h.id === selectedHotel.id);
		if (!hotelToUpdate) return;

		// 2. Проверка лимитов (для менеджеров)
		const maxRooms = currentUser.limits?.maxRooms || 0;
		if (!isAdmin && hotelToUpdate.rooms?.length >= maxRooms) {
			alert(`Превышен лимит номеров! Ваш максимум: ${maxRooms}`);
			return;
		}

		// 3. Формируем объект новой комнаты (фото уже внутри newRoom.images)
		const roomData = {
			...newRoom,
			id: Date.now(),
			hotelId: hotelToUpdate.id,
			price: Number(newRoom.price),
			capacity: Number(newRoom.capacity),
		};

		// 4. Создаем новый массив комнат
		const updatedRooms = [...(hotelToUpdate.rooms || []), roomData];

		// 5. Отправляем в Redux (Санк сам сделает PATCH на сервер и обновит Store)
		const success = await dispatch(
			updateHotelRoomsThunk(hotelToUpdate.id, updatedRooms),
		);

		if (success) {
			setIsRoomModalOpen(false);
			// Сбрасываем форму
			setNewRoom({ type: '', capacity: 2, price: '', amenities: '', images: [] });
		}
	};
	// 2. Для номера (номера лежат внутри массива rooms отеля)
	const handleAddRoomPhoto = async (hotelId: number, roomId: number, specificUrl) => {
		const urlToUse = specificUrl || photoUrl;
		if (!photoUrl) return;

		const hotel = myHotels.find((h: any) => h.id === hotelId);
		if (!hotel) return;

		// Глубокое обновление: ищем нужную комнату и добавляем ей фото
		const updatedRooms = hotel.rooms.map((room: any) => {
			if (room.id === roomId) {
				return {
					...room,
					images: [...(room.images || []), urlToUse],
				};
			}
			return room;
		});

		// Отправляем на сервер обновленный массив комнат
		const success = await dispatch(
			updateHotelThunk(hotelId, { rooms: updatedRooms }),
		);

		if (success) {
			// Обновляем локальный стейт только после успеха
			// setMyHotels((prev) =>
			// 	prev.map((h) => (h.id === hotelId ? { ...h, rooms: updatedRooms } : h)),
			// );
			setPhotoUrl('');
		}
	};
	// --- ИЗМЕНЕННЫЙ FETCH DATA ---
	useEffect(() => {
		// 1. Просто просим Redux загрузить данные
		dispatch(fetchHotelsThunk());
		dispatch(fetchCitiesThunk());

		// 2. Бронирования и Юзеров можно оставить локально, если их нет в Redux
		const fetchSupportData = async () => {
			const [bRes, uRes] = await Promise.all([
				fetch(`http://localhost:3001/bookings`),
				fetch(`http://localhost:3001/users`),
			]);
			const allBookings = await bRes.json();
			const allUsers = await uRes.json();

			// Фильтруем бронирования (Админ видит все, менеджер — только свои)
			const enrichedBookings = allBookings
				.filter((b: any) => {
					if (isAdmin) return true;
					// Ищем, принадлежит ли отель из брони текущему менеджеру
					return allHotels.some(
						(h: any) => h.id === b.hotelId && h.ownerId === currentUser.id,
					);
				})
				.map((book: any) => ({
					...book,
					client: allUsers.find((u: any) => u.id === book.userId) || null,
				}));

			setMyBookings(enrichedBookings);
		};

		if (currentUser?.id) fetchSupportData();
	}, [dispatch, allHotels.length, currentUser?.id]); //
	// ЛОГИКА: Админ может всегда, Менеджер - по лимиту
	// const isAdmin = currentUser?.role === ROLES.ADMIN;
	const canAddHotel =
		isAdmin || myHotels.length < (currentUser?.limits?.maxHotels || 0);

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
			comments: newHotel.comments || '',
			rooms: [],
			images: newHotel.images.length > 0 ? newHotel.images : [],
		};

		const success = await dispatch(addHotelThunk(hotelToSave));

		if (success) {
			// setMyHotels((myHotels) => [...myHotels, hotelToSave]);
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

	// Функция для удаления фото из еще НЕ созданного номера (локально)
	const handleRemovePhotoFromNewRoom = (urlToRemove) => {
		setNewRoom((prev) => ({
			...prev,
			images: prev.images.filter((img) => img !== urlToRemove),
		}));
	};

	return (
		<div className="p-6 max-w-7xl mx-auto mt-10">
			{/* HEADER */}
			<DashboardHeader
				isAdmin={isAdmin}
				currentUser={currentUser}
				myHotels={myHotels}
				canAddHotel={canAddHotel}
				setIsModalOpen={setIsModalOpen}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-4">
					<h2 className="text-xl font-semibold flex items-center gap-2 ml-2">
						<Hotel className="text-teal-600" /> Мои объекты
					</h2>

					{myHotels.map((hotel: any) => (
						<div
							key={hotel.id}
							className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4"
						>
							{/* Мои обьекты */}
							<HotelCardInManagerPage
								hotel={hotel}
								cities={cities}
								setIsRoomModalOpen={setIsRoomModalOpen}
								setSelectedHotel={setSelectedHotel}
								handleDeleteHotel={handleDeleteHotel}
							/>
							{/* СПИСОК НОМЕРОВ ВНУТРИ КАРТОЧКИ */}
							<ItemInCardManager
								hotel={hotel}
								handleDeleteRoom={handleDeleteRoom}
								handleAddRoomPhoto={handleAddRoomPhoto}
							/>
						</div>
					))}
				</div>

				{/* ПРАВАЯ КОЛОНКА: БРОНИРОВАНИЯ */}

				<BookingList
					myBookings={myBookings}
					isAdmin={isAdmin}
					handleDeleteBooking={handleDeleteBooking}
				/>
			</div>

			{/* MODAL FORM добавления отеля*/}

			<HotelModal
				selectedHotel={selectedHotel}
				newHotel={newHotel}
				setNewHotel={setNewHotel}
				cities={cities}
				photoUrl={photoUrl}
				setPhotoUrl={setPhotoUrl}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				handleDeleteHotelPhoto={handleDeleteHotelPhoto}
				handleAddHotelPhoto={handleAddHotelPhoto}
				handleAddHotel={handleAddHotel}
			/>
			{/* Модалка добавления номера */}

			<RoomModal
				isRoomModalOpen={isRoomModalOpen}
				setIsRoomModalOpen={setIsRoomModalOpen}
				selectedHotel={selectedHotel}
				handleAddRoom={handleAddRoom}
				newRoom={newRoom}
				setNewRoom={setNewRoom}
				photoUrl={photoUrl}
				setPhotoUrl={setPhotoUrl}
				handleRemovePhotoFromNewRoom={handleRemovePhotoFromNewRoom}
			/>
		</div>
	);
};
