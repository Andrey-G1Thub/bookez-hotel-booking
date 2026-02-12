import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROLES } from '../../utils/permissions';
import { Hotel, PlusCircle, ClipboardList, X, Trash2 } from 'lucide-react';
import {
	addHotelThunk,
	deleteHotelThunk,
	updateHotelRoomsThunk,
} from '../../store/actions/hotelActions';
import { deleteBookingThunk } from '../../store/actions/bookingActions';

export const ManagerPage = () => {
	const { currentUser } = useSelector((state: any) => state.users);
	const dispatch = useDispatch();

	const isAdmin = currentUser?.role === ROLES.ADMIN;

	const [myHotels, setMyHotels] = useState([]);
	const [myBookings, setMyBookings] = useState([]);
	const [cities, setCities] = useState([]);

	// Состояние модалки и формы
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newHotel, setNewHotel] = useState({
		name: '',
		cityId: '',
		description: '',
		priceFrom: '',
	});
	const [selectedHotel, setSelectedHotel] = useState<any>(null); // Для какой комнаты открыта модалка
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
	const [newRoom, setNewRoom] = useState({
		type: '',
		capacity: 2,
		price: '',
		amenities: '',
	});
	const [users, setUsers] = useState([]);

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
			setMyHotels((prev) => prev.filter((h: any) => h.id !== hotelId));
		}
	};

	// --- ФУНКЦИЯ УДАЛЕНИЯ НОМЕРА ---
	const handleDeleteRoom = async (hotelId: number, roomId: number) => {
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
		setNewRoom({ type: '', capacity: 2, price: '', amenities: '' });
	};

	// --- ФУНКЦИЯ УДАЛЕНИЯ БРОНИ ---
	const handleDeleteBooking = async (bookingId: number) => {
		if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) return;

		// Вызываем ваш санк (убедитесь, что он возвращает true/false или используйте .then)
		await dispatch(deleteBookingThunk(bookingId));

		// Обновляем локальный стейт, чтобы бронь исчезла из списка
		setMyBookings((prev) => prev.filter((b) => b.id !== bookingId));
	};

	// --- ИЗМЕНЕННЫЙ FETCH DATA ---
	useEffect(() => {
		const fetchData = async () => {
			// ЛОГИКА URL: Если админ - берем все отели, если менеджер - только его
			const hotelsUrl = isAdmin
				? `http://localhost:3001/hotels`
				: `http://localhost:3001/hotels?ownerId=${currentUser.id}`;

			const [hRes, cRes, bRes, uRes] = await Promise.all([
				fetch(hotelsUrl),
				fetch(`http://localhost:3001/cities`),
				fetch(`http://localhost:3001/bookings`),
				fetch(`http://localhost:3001/users`),
			]);

			const hotelsData = await hRes.json();
			const citiesData = await cRes.json();
			const allBookings = await bRes.json();
			const allUsers = await uRes.json();

			setMyHotels(hotelsData);
			setCities(citiesData);

			// СКЛЕИВАЕМ ДАННЫЕ:
			const enrichedBookings = allBookings
				.filter((b: any) => {
					// Если админ - видим вообще все брони
					if (isAdmin) return true;
					// Если менеджер - только брони в его отелях
					return hotelsData.some((h: any) => h.id === b.hotelId);
				})
				.map((book: any) => ({
					...book,
					client: allUsers.find((u: any) => u.id === book.userId) || null,
				}));

			setMyBookings(enrichedBookings);
		};

		if (currentUser?.id) fetchData();
	}, [currentUser, isAdmin]); // добавили isAdmin в зависимости

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
			rooms: [],
		};

		const success = await dispatch(addHotelThunk(hotelToSave));

		if (success) {
			setMyHotels((myHotels) => [...myHotels, hotelToSave]);
			setIsModalOpen(false);
			setNewHotel({ name: '', cityId: '', description: '', priceFrom: '' });
		}
	};

	const handleAddRoom = async (e: React.FormEvent) => {
		e.preventDefault();

		// Проверка лимита (Админам можно всё, менеджерам - по лимиту)
		const isAdmin = currentUser.role === ROLES.ADMIN;
		const currentHotelInState = myHotels.find((h) => h.id === selectedHotel.id);
		const currentRoomsCount = selectedHotel.rooms?.length || 0;
		const maxRooms = currentUser.limits?.maxRooms || 0;

		if (!isAdmin && currentRoomsCount >= maxRooms) {
			alert(`Превышен лимит номеров! Ваш максимум: ${maxRooms}`);
			return;
		}

		const roomData = {
			...newRoom,
			id: Date.now(),
			hotelId: selectedHotel.id,
			price: Number(newRoom.price),
			capacity: Number(newRoom.capacity),
		};

		const updatedRooms = [...(selectedHotel.rooms || []), roomData];

		// PATCH запрос для обновления массива rooms в объекте отеля
		const success = await dispatch(
			updateHotelRoomsThunk(selectedHotel.id, updatedRooms),
		);

		if (success) {
			// Обновляем локальный список отелей для отображения на текущей странице
			setMyHotels((prev) =>
				prev.map((h: any) =>
					h.id === selectedHotel.id ? { ...h, rooms: updatedRooms } : h,
				),
			);

			setIsRoomModalOpen(false);
			setNewRoom({ type: '', capacity: 2, price: '', amenities: '' });
		}
	};

	return (
		<div className="p-6 max-w-7xl mx-auto mt-10">
			<header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
				<div>
					<h1 className="text-3xl font-bold text-gray-800">
						Панель управления
					</h1>
					<p className="text-gray-500 font-medium">
						{isAdmin
							? 'Режим Администратора'
							: `Менеджер: ${currentUser?.name}`}
					</p>
				</div>

				{canAddHotel ? (
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
					>
						<PlusCircle size={20} />
						Добавить отель
					</button>
				) : (
					<div className="text-sm bg-amber-50 text-amber-700 p-3 rounded-xl border border-amber-200">
						Лимит отелей исчерпан ({myHotels.length}/
						{currentUser?.limits?.maxHotels})
					</div>
				)}
			</header>

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
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-bold text-xl text-gray-800">
										{hotel.name}
									</h3>
									<p className="text-sm text-gray-500">
										{cities.find((c: any) => c.id === hotel.cityId)
											?.name || 'Город не указан'}
									</p>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => {
											setSelectedHotel(hotel);
											setIsRoomModalOpen(true);
										}}
										className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-lg hover:bg-teal-100 transition"
									>
										+ Номер
									</button>
									<button
										onClick={() => handleDeleteHotel(hotel.id)}
										className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
									>
										<Trash2 size={18} />
									</button>
								</div>
							</div>

							{/* СПИСОК НОМЕРОВ ВНУТРИ КАРТОЧКИ (чтобы видеть изменения) */}
							{hotel.rooms?.length > 0 && (
								<div className="border-t pt-3">
									<p className="text-xs font-semibold text-gray-400 uppercase mb-2">
										Номера:
									</p>
									<div className="grid grid-cols-1 gap-2">
										{hotel.rooms.map((room: any) => (
											<div
												key={room.id}
												className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-sm"
											>
												<span>
													{room.type} ({room.price}₽)
												</span>
												<button
													onClick={() =>
														handleDeleteRoom(
															hotel.id,
															room.id,
														)
													}
													className="text-gray-400 hover:text-red-500"
												>
													<X size={14} />
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* ПРАВАЯ КОЛОНКА: БРОНИРОВАНИЯ */}
				<div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
					<h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
						<ClipboardList className="text-blue-600" />
						{isAdmin ? 'Все бронирования' : 'Последние брони'}
					</h2>

					<div className="space-y-4">
						{myBookings.map((book: any) => (
							<div
								key={book.id}
								className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-sm relative group"
							>
								{/* КНОПКА УДАЛЕНИЯ БРОНИ (Видна всем менеджерам/админам в этой панели) */}
								<button
									onClick={() => handleDeleteBooking(book.id)}
									className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors"
									title="Удалить бронирование"
								>
									<Trash2 size={16} />
								</button>

								<div className="flex justify-between font-bold text-gray-800 mb-1 pr-6">
									<span>{book.hotelName}</span>
									<span className="text-teal-600">{book.price}₽</span>
								</div>

								<div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
									<p className="font-semibold text-gray-700">
										Клиент: {book.client?.name || 'Неизвестный'}
									</p>
									<p className="text-blue-600 text-xs">
										тел: {book.client?.phone || 'не указан'}
									</p>
								</div>

								<div className="text-gray-500 text-xs">
									{book.checkIn} — {book.checkOut}
								</div>

								<div className="mt-2 flex justify-between items-center">
									<div className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] uppercase font-bold">
										{book.status}
									</div>
									<span className="text-[10px] text-gray-400">
										ID: {book.id}
									</span>
								</div>
							</div>
						))}
						{myBookings.length === 0 && (
							<p className="text-center text-gray-400 py-10">
								Бронирований пока нет
							</p>
						)}
					</div>
				</div>
			</div>

			{/* MODAL FORM */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
						>
							<X size={24} />
						</button>
						<h2 className="text-2xl font-bold mb-6 text-gray-800">
							Новый отель
						</h2>
						<form onSubmit={handleAddHotel} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Название
								</label>
								<input
									required
									type="text"
									value={newHotel.name}
									onChange={(e) =>
										setNewHotel({ ...newHotel, name: e.target.value })
									}
									className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
									placeholder="Напр: Морской Бриз"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Город
								</label>
								<select
									required
									value={newHotel.cityId}
									onChange={(e) =>
										setNewHotel({
											...newHotel,
											cityId: e.target.value,
										})
									}
									className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
								>
									<option value="">Выберите город</option>
									{cities.map((city: any) => (
										<option key={city.id} value={city.id}>
											{city.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Минимальная цена (за ночь)
								</label>
								<input
									required
									type="number"
									value={newHotel.priceFrom}
									onChange={(e) =>
										setNewHotel({
											...newHotel,
											priceFrom: e.target.value,
										})
									}
									className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
									placeholder="5000"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Описание
								</label>
								<textarea
									required
									value={newHotel.description}
									onChange={(e) =>
										setNewHotel({
											...newHotel,
											description: e.target.value,
										})
									}
									className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none h-24"
									placeholder="Коротко об отеле..."
								/>
							</div>
							<button
								type="submit"
								className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100"
							>
								Создать объект
							</button>
						</form>
					</div>
				</div>
			)}
			{/* Модалка добавления номера */}
			{isRoomModalOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
						<button
							onClick={() => setIsRoomModalOpen(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
						>
							<X size={24} />
						</button>

						<h2 className="text-2xl font-bold mb-1 text-gray-800">
							Добавить номер
						</h2>
						<p className="text-sm text-gray-500 mb-6">
							Отель: {selectedHotel?.name}
						</p>

						<form onSubmit={handleAddRoom} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Тип номера
								</label>
								<input
									required
									type="text"
									value={newRoom.type}
									onChange={(e) =>
										setNewRoom({ ...newRoom, type: e.target.value })
									}
									className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
									placeholder="Напр: Люкс, Стандарт"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Вместимость
									</label>
									<input
										required
										type="number"
										min="1"
										value={newRoom.capacity}
										onChange={(e) =>
											setNewRoom({
												...newRoom,
												capacity: Number(e.target.value),
											})
										}
										className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Цена за ночь
									</label>
									<input
										required
										type="number"
										value={newRoom.price}
										onChange={(e) =>
											setNewRoom({
												...newRoom,
												price: e.target.value,
											})
										}
										className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
										placeholder="3000"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Удобства (через запятую)
								</label>
								<input
									type="text"
									value={newRoom.amenities}
									onChange={(e) =>
										setNewRoom({
											...newRoom,
											amenities: e.target.value,
										})
									}
									className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
									placeholder="WiFi, Кондиционер, Завтрак"
								/>
							</div>

							<button
								type="submit"
								className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
							>
								Сохранить номер
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};
